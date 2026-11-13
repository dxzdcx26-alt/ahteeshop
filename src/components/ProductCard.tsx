"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { formatPoints } from "@/lib/utils";
import { ShoppingCart, Loader2 } from "lucide-react";

type Product = {
  id: string;
  name: string;
  type: string;
  className: string;
  detail: string;
  price: number;
  image: string;
  stock: number;
};

export default function ProductCard({ product }: { product: Product }) {
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");
  const router = useRouter();

  async function handleBuy() {
    setLoading(true);
    setMsg("");
    try {
      const res = await fetch("/api/buy/product", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId: product.id }),
      });
      const data = await res.json();
      if (!res.ok) {
        setMsg(data.error || "ซื้อไม่สำเร็จ");
      } else {
        setMsg(`ซื้อสำเร็จ! เลขที่ ${data.orderId}`);
        router.refresh();
      }
    } catch {
      setMsg("เกิดข้อผิดพลาด");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="group overflow-hidden rounded-2xl border border-slate-700/60 bg-slate-800/50 transition hover:border-cyan-500/40 hover:shadow-lg hover:shadow-cyan-500/10">
      <div className="aspect-square overflow-hidden bg-slate-900">
        <img
          src={product.image.startsWith("http") || product.image.startsWith("/") ? product.image : `/uploads/products/${product.image}`}
          alt={product.name}
          className="h-full w-full object-cover transition group-hover:scale-105"
          onError={(e) => {
            (e.target as HTMLImageElement).src = "/uploads/products/unproduct.jpg";
          }}
        />
      </div>
      <div className="p-4">
        <div className="mb-1 flex items-center justify-between gap-2">
          <h3 className="font-semibold text-white">{product.name}</h3>
          <span className="rounded-full bg-cyan-500/15 px-2 py-0.5 text-xs text-cyan-300">
            {product.type}
          </span>
        </div>
        <p className="mb-1 text-xs text-slate-400">{product.className}</p>
        <p className="mb-3 line-clamp-2 text-sm text-slate-300">{product.detail}</p>
        <div className="flex items-center justify-between">
          <span className="text-lg font-bold text-cyan-400">
            {formatPoints(product.price)} <span className="text-sm font-normal text-slate-400">แต้ม</span>
          </span>
          <button
            onClick={handleBuy}
            disabled={loading || product.stock <= 0}
            className="flex items-center gap-1.5 rounded-lg bg-cyan-600 px-3 py-1.5 text-sm font-medium text-white transition hover:bg-cyan-500 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? <Loader2 size={14} className="animate-spin" /> : <ShoppingCart size={14} />}
            {product.stock <= 0 ? "หมด" : "ซื้อ"}
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
