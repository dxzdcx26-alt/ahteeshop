import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Navbar from "@/components/Navbar";
import Link from "next/link";
import { Package, Gift, Ticket, Users, Settings, FileText } from "lucide-react";

export default async function AdminPage() {
  const session = await auth();
  if (!session) redirect("/login");
  if (session.user.role !== "actor") redirect("/home");

  const [productCount, rewardCount, codeCount, userCount] = await Promise.all([
    prisma.product.count(),
    prisma.reward.count(),
    prisma.redeemCode.count({ where: { used: false } }),
    prisma.user.count(),
  ]);

  const cards = [
    { label: "สินค้า", count: productCount, href: "/admin/products", icon: Package, color: "cyan" },
    { label: "รางวัล", count: rewardCount, href: "/admin/rewards", icon: Gift, color: "emerald" },
    { label: "โค้ดที่ยังไม่ใช้", count: codeCount, href: "/admin/codes", icon: Ticket, color: "amber" },
    { label: "ผู้ใช้", count: userCount, href: "/admin/users", icon: Users, color: "violet" },
  ];

  return (
    <div className="min-h-screen bg-slate-950">
      <Navbar />
      <main className="mx-auto max-w-6xl px-4 py-8">
        <h1 className="mb-2 text-2xl font-bold text-white">แผงควบคุมแอดมิน</h1>
        <p className="mb-8 text-sm text-slate-400">จัดการระบบร้านค้าและผู้ใช้</p>

        <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {cards.map((c) => (
            <Link
              key={c.href}
              href={c.href}
              className="rounded-2xl border border-slate-700/50 bg-slate-800/50 p-5 transition hover:border-cyan-500/40"
            >
              <c.icon className="mb-3 text-cyan-400" size={24} />
              <div className="text-2xl font-bold text-white">{c.count}</div>
              <div className="text-sm text-slate-400">{c.label}</div>
            </Link>
          ))}
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <Link href="/admin/products" className="rounded-xl border border-slate-700 bg-slate-800/40 px-4 py-3 text-slate-200 hover:bg-slate-800">
            จัดการสินค้า
          </Link>
          <Link href="/admin/rewards" className="rounded-xl border border-slate-700 bg-slate-800/40 px-4 py-3 text-slate-200 hover:bg-slate-800">
            จัดการรางวัล
          </Link>
          <Link href="/admin/codes" className="rounded-xl border border-slate-700 bg-slate-800/40 px-4 py-3 text-slate-200 hover:bg-slate-800">
            จัดการโค้ด
          </Link>
          <Link href="/admin/users" className="rounded-xl border border-slate-700 bg-slate-800/40 px-4 py-3 text-slate-200 hover:bg-slate-800">
            จัดการผู้ใช้
          </Link>
          <Link href="/admin/events" className="rounded-xl border border-slate-700 bg-slate-800/40 px-4 py-3 text-slate-200 hover:bg-slate-800">
            กิจกรรม / อัปเดต
          </Link>
          <Link href="/admin/settings" className="rounded-xl border border-slate-700 bg-slate-800/40 px-4 py-3 text-slate-200 hover:bg-slate-800">
            ตั้งค่าเว็บ
          </Link>
        </div>
      </main>
    </div>
  );
}
