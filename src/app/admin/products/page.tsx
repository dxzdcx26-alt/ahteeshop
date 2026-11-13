"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import { formatPoints } from "@/lib/utils";
import { Loader2, Plus, Trash2 } from "lucide-react";

type Product = {
  id: string;
  name: string;
  type: string;
  className: string;
  detail: string;
  price: number;
  stock: number;
  image: string;
};

export default function AdminProductsPage() {
  const [items, setItems] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    name: "",
    type: "Common",
    className: "Item",
    detail: "",
    price: 10,
    stock: 100,
  });
  const [saving, setSaving] = useState(false);

  async function load() {
    setLoading(true);
    const res = await fetch("/api/admin/products");
    if (res.ok) setItems(await res.json());
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  async function create(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    await fetch("/api/admin/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setForm({ name: "", type: "Common", className: "Item", detail: "", price: 10, stock: 100 });
    setSaving(false);
    load();
  }

  async function remove(id: string) {
    if (!confirm("ลบสินค้านี้?")) return;
    await fetch("/api/admin/products", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    load();
  }

  return (
    <div className="min-h-screen bg-slate-950">
      <Navbar />
      <main className="mx-auto max-w-4xl px-4 py-8">
        <h1 className="mb-6 text-2xl font-bold text-white">จัดการสินค้า</h1>

        <form onSubmit={create} className="mb-8 grid gap-3 rounded-2xl border border-slate-700 bg-slate-900/60 p-5 sm:grid-cols-2">
          <input className="rounded-lg border border-slate-600 bg-slate-800 px-3 py-2 text-white" placeholder="ชื่อสินค้า" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
          <input className="rounded-lg border border-slate-600 bg-slate-800 px-3 py-2 text-white" placeholder="ประเภท" value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} required />
          <input className="rounded-lg border border-slate-600 bg-slate-800 px-3 py-2 text-white" placeholder="คลาส" value={form.className} onChange={(e) => setForm({ ...form, className: e.target.value })} required />
          <input className="rounded-lg border border-slate-600 bg-slate-800 px-3 py-2 text-white" placeholder="รายละเอียด" value={form.detail} onChange={(e) => setForm({ ...form, detail: e.target.value })} required />
          <input type="number" className="rounded-lg border border-slate-600 bg-slate-800 px-3 py-2 text-white" placeholder="ราคา (แต้ม)" value={form.price} onChange={(e) => setForm({ ...form, price: Number(e.target.value) })} required />
          <input type="number" className="rounded-lg border border-slate-600 bg-slate-800 px-3 py-2 text-white" placeholder="สต็อก" value={form.stock} onChange={(e) => setForm({ ...form, stock: Number(e.target.value) })} required />
          <button type="submit" disabled={saving} className="flex items-center justify-center gap-2 rounded-lg bg-cyan-600 py-2 text-white sm:col-span-2 hover:bg-cyan-500 disabled:opacity-60">
            {saving ? <Loader2 className="animate-spin" size={16} /> : <Plus size={16} />}
            เพิ่มสินค้า
          </button>
        </form>

        {loading ? (
          <p className="text-slate-500">กำลังโหลด...</p>
        ) : (
          <div className="space-y-2">
            {items.map((p) => (
              <div key={p.id} className="flex items-center justify-between rounded-xl border border-slate-700 bg-slate-800/40 px-4 py-3">
                <div>
                  <div className="font-medium text-white">{p.name}</div>
                  <div className="text-xs text-slate-400">
                    {p.type} · {formatPoints(p.price)} แต้ม · สต็อก {p.stock}
                  </div>
                </div>
                <button onClick={() => remove(p.id)} className="rounded-lg p-2 text-red-400 hover:bg-red-500/10">
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
