"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Loader2, LogIn } from "lucide-react";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const res = await signIn("credentials", {
      username,
      password,
      redirect: false,
    });
    setLoading(false);
    if (res?.error) {
      setError("ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง");
    } else {
      router.push("/home");
      router.refresh();
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-cyan-950 px-4">
      <div className="w-full max-w-md rounded-2xl border border-slate-700/60 bg-slate-900/80 p-8 shadow-2xl backdrop-blur">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-cyan-400">
            NAVy<span className="text-white">SHOP</span>
          </h1>
          <p className="mt-2 text-sm text-slate-400">เข้าสู่ระบบเพื่อใช้งาน</p>
        </div>

        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="mb-1.5 block text-sm text-slate-300">ชื่อผู้ใช้</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full rounded-xl border border-slate-600 bg-slate-800 px-4 py-2.5 text-white outline-none transition focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
              placeholder="username"
              required
              autoComplete="username"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm text-slate-300">รหัสผ่าน</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-xl border border-slate-600 bg-slate-800 px-4 py-2.5 text-white outline-none transition focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
              placeholder="••••••••"
              required
              autoComplete="current-password"
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
            {loading ? <Loader2 className="animate-spin" size={18} /> : <LogIn size={18} />}
            เข้าสู่ระบบ
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-400">
          ยังไม่มีบัญชี?{" "}
          <Link href="/register" className="text-cyan-400 hover:underline">
            สมัครสมาชิก
          </Link>
        </p>

        <div className="mt-6 rounded-lg border border-slate-700 bg-slate-800/50 p-3 text-xs text-slate-400">
          <p className="font-medium text-slate-300">บัญชีทดสอบ (แอดมิน)</p>
          <p>username: <code className="text-cyan-300">navydesign</code></p>
          <p>password: <code className="text-cyan-300">navydesignpage</code></p>
        </div>
      </div>
    </div>
  );
}
