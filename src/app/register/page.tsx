"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Loader2, UserPlus } from "lucide-react";

export default function RegisterPage() {
  const [form, setForm] = useState({ username: "", email: "", password: "", confirm: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (form.password !== form.confirm) {
      setError("รหัสผ่านไม่ตรงกัน");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: form.username,
          email: form.email,
          password: form.password,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "สมัครไม่สำเร็จ");
      } else {
        router.push("/login");
      }
    } catch {
      setError("เกิดข้อผิดพลาด");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-cyan-950 px-4">
      <div className="w-full max-w-md rounded-2xl border border-slate-700/60 bg-slate-900/80 p-8 shadow-2xl backdrop-blur">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-cyan-400">
            NAVy<span className="text-white">SHOP</span>
          </h1>
          <p className="mt-2 text-sm text-slate-400">สร้างบัญชีใหม่</p>
        </div>

        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="mb-1.5 block text-sm text-slate-300">ชื่อผู้ใช้</label>
            <input
              type="text"
              value={form.username}
              onChange={(e) => setForm({ ...form, username: e.target.value })}
              className="w-full rounded-xl border border-slate-600 bg-slate-800 px-4 py-2.5 text-white outline-none focus:border-cyan-500"
              placeholder="3-16 ตัวอักษร"
              required
              minLength={3}
              maxLength={16}
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm text-slate-300">อีเมล</label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full rounded-xl border border-slate-600 bg-slate-800 px-4 py-2.5 text-white outline-none focus:border-cyan-500"
              required
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm text-slate-300">รหัสผ่าน</label>
            <input
              type="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="w-full rounded-xl border border-slate-600 bg-slate-800 px-4 py-2.5 text-white outline-none focus:border-cyan-500"
              required
              minLength={4}
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm text-slate-300">ยืนยันรหัสผ่าน</label>
            <input
              type="password"
              value={form.confirm}
              onChange={(e) => setForm({ ...form, confirm: e.target.value })}
              className="w-full rounded-xl border border-slate-600 bg-slate-800 px-4 py-2.5 text-white outline-none focus:border-cyan-500"
              required
            />
          </div>

          {error && (
            <p className="rounded-lg bg-red-500/10 px-3 py-2 text-sm text-red-400">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-cyan-600 py-2.5 font-medium text-white transition hover:bg-cyan-500 disabled:opacity-60"
          >
            {loading ? <Loader2 className="animate-spin" size={18} /> : <UserPlus size={18} />}
            สมัครสมาชิก
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-400">
          มีบัญชีแล้ว?{" "}
          <Link href="/login" className="text-cyan-400 hover:underline">
            เข้าสู่ระบบ
          </Link>
        </p>
      </div>
    </div>
  );
}
