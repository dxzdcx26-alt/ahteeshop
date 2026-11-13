"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { formatPoints } from "@/lib/utils";
import { Gift, Loader2 } from "lucide-react";

type Reward = {
  id: string;
  name: string;
  type: string;
  detail: string;
  price: number;
  image: string;
  stock: number;
};

export default function RewardCard({ reward }: { reward: Reward }) {
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");
  const router = useRouter();

  async function handleRedeem() {
    setLoading(true);
    setMsg("");
    try {
      const res = await fetch("/api/buy/reward", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rewardId: reward.id }),
      });
      const data = await res.json();
      if (!res.ok) {
        setMsg(data.error || "แลกไม่สำเร็จ");
      } else {
        setMsg(`แลกสำเร็จ! เลขที่ ${data.orderId}`);
        router.refresh();
      }
    } catch {
      setMsg("เกิดข้อผิดพลาด");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="group overflow-hidden rounded-2xl border border-slate-700/60 bg-slate-800/50 transition hover:border-emerald-500/40 hover:shadow-lg hover:shadow-emerald-500/10">
      <div className="aspect-square overflow-hidden bg-slate-900">
        <img
          src={reward.image.startsWith("http") || reward.image.startsWith("/") ? reward.image : `/uploads/rewards/${reward.image}`}
          alt={reward.name}
          className="h-full w-full object-cover transition group-hover:scale-105"
          onError={(e) => {
            (e.target as HTMLImageElement).src = "/uploads/rewards/unreward.jpg";
          }}
        />
      </div>
      <div className="p-4">
        <div className="mb-1 flex items-center justify-between gap-2">
          <h3 className="font-semibold text-white">{reward.name}</h3>
          <span className="rounded-full bg-emerald-500/15 px-2 py-0.5 text-xs text-emerald-300">
            {reward.type}
          </span>
        </div>
        <p className="mb-3 line-clamp-2 text-sm text-slate-300">{reward.detail}</p>
        <div className="flex items-center justify-between">
          <span className="text-lg font-bold text-emerald-400">
            {formatPoints(reward.price)} <span className="text-sm font-normal text-slate-400">แต้มรางวัล</span>
          </span>
          <button
            onClick={handleRedeem}
            disabled={loading || reward.stock <= 0}
            className="flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3 py-1.5 text-sm font-medium text-white transition hover:bg-emerald-500 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? <Loader2 size={14} className="animate-spin" /> : <Gift size={14} />}
            {reward.stock <= 0 ? "หมด" : "แลก"}
          </button>
        </div>
        {msg && (
          <p className={`mt-2 text-xs ${msg.includes("สำเร็จ") ? "text-emerald-400" : "text-red-400"}`}>
            {msg}
          </p>
        )}
      </div>
    </div>
  );
}
