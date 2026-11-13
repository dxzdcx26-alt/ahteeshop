"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import { Ticket, Loader2 } from "lucide-react";

export default function UseCodePage() {
  const [code, setCode] = useState("");
  const [msg, setMsg] = useState("");
  const [ok, setOk] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMsg("");
    setOk(false);
    try {
      const res = await fetch("/api/redeem", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
      });
      const data = await res.json();
      if (!res.ok) {
        setMsg(data.error || "ใช้โค้ดไม่สำเร็จ");
      } else {
        setOk(true);
        setMsg(data.message || "สำเร็จ");
        setCode("");
        router.refresh();
      }
    } catch {
      setMsg("เกิดข้อผิดพลาด");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-950">
      <Navbar />
      <main className="mx-auto max-w-md px-4 py-12">
        <div className="rounded-2xl border border-slate-700/50 bg-slate-900/80 p-8">
          <div className="mb-6 flex items-center gap-3">
            <div className="rounded-xl bg-cyan-500/15 p-3 text-cyan-400">
              <Ticket size={24} />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">ใช้โค้ดรับแต้ม</h1>
              <p className="text-sm text-slate-400">กรอกโค้ดที่ได้รับเพื่อรับแต้ม</p>
            </div>
          </div>
          <form onSubmit={onSubmit} className="space-y-4">
            <input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="ใส่โค้ดที่นี่"
              className="w-full rounded-xl border border-slate-600 bg-slate-800 px-4 py-3 text-white outline-none focus:border-cyan-500"
              required
            />
            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-cyan-600 py-2.5 font-medium text-white hover:bg-cyan-500 disabled:opacity-60"
            >
              {loading ? <Loader2 className="animate-spin" size={18} /> : <Ticket size={18} />}
              ใช้โค้ด
            </button>
          </form>
          {msg && (
            <p className={`mt-4 rounded-lg px-3 py-2 text-sm ${ok ? "bg-emerald-500/10 text-emerald-400" : "bg-red-500/10 text-red-400"}`}>
              {msg}
            </p>
          )}
        </div>
      </main>
    </div>
  );
}
