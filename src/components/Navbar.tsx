"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import { formatPoints, cn } from "@/lib/utils";
import {
  Home,
  ShoppingBag,
  Gift,
  Ticket,
  Wallet,
  Settings,
  LogOut,
  User,
  Menu,
  X,
} from "lucide-react";
import { useState } from "react";

const userLinks = [
  { href: "/home", label: "หน้าหลัก", icon: Home },
  { href: "/shop", label: "ร้านค้า", icon: ShoppingBag },
  { href: "/trade", label: "แลกรางวัล", icon: Gift },
  { href: "/usecode", label: "ใช้โค้ด", icon: Ticket },
  { href: "/pay", label: "เติมเงิน", icon: Wallet },
];

export default function Navbar() {
  const { data: session } = useSession();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const isAdmin = session?.user?.role === "actor";

  return (
    <nav className="sticky top-0 z-50 border-b border-slate-700/50 bg-slate-900/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link href="/home" className="text-xl font-bold text-cyan-400">
          NAVy<span className="text-white">SHOP</span>
        </Link>

        {/* Desktop */}
        <div className="hidden items-center gap-1 md:flex">
          {userLinks.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={cn(
                "flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm transition",
                pathname === l.href
                  ? "bg-cyan-500/20 text-cyan-300"
                  : "text-slate-300 hover:bg-slate-800 hover:text-white"
              )}
            >
              <l.icon size={16} />
              {l.label}
            </Link>
          ))}
          {isAdmin && (
            <Link
              href="/admin"
              className={cn(
                "flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm transition",
                pathname.startsWith("/admin")
                  ? "bg-amber-500/20 text-amber-300"
                  : "text-amber-400/80 hover:bg-slate-800"
              )}
            >
              <Settings size={16} />
              แอดมิน
            </Link>
          )}
        </div>

        <div className="hidden items-center gap-3 md:flex">
          {session?.user && (
            <>
              <div className="text-right text-xs text-slate-400">
                <div className="font-medium text-white">{session.user.name}</div>
                <div>
                  แต้ม: <span className="text-cyan-400">{formatPoints(session.user.payPoint)}</span>
                  {" · "}
                  รางวัล:{" "}
                  <span className="text-emerald-400">
                    {formatPoints(session.user.rewardPoint)}
                  </span>
                </div>
              </div>
              <button
                onClick={() => signOut({ callbackUrl: "/login" })}
                className="rounded-lg p-2 text-slate-400 hover:bg-slate-800 hover:text-red-400"
                title="ออกจากระบบ"
              >
                <LogOut size={18} />
              </button>
            </>
          )}
        </div>

        {/* Mobile toggle */}
        <button
          className="rounded-lg p-2 text-slate-300 md:hidden"
          onClick={() => setOpen(!open)}
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="border-t border-slate-700 bg-slate-900 px-4 py-3 md:hidden">
          {session?.user && (
            <div className="mb-3 flex items-center gap-2 rounded-lg bg-slate-800/80 px-3 py-2">
              <User size={18} className="text-cyan-400" />
              <div className="text-sm">
                <div className="font-medium text-white">{session.user.name}</div>
                <div className="text-xs text-slate-400">
                  แต้ม {formatPoints(session.user.payPoint)} · รางวัล{" "}
                  {formatPoints(session.user.rewardPoint)}
                </div>
              </div>
            </div>
          )}
          {userLinks.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className={cn(
                "flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm",
                pathname === l.href ? "bg-cyan-500/20 text-cyan-300" : "text-slate-300"
              )}
            >
              <l.icon size={16} />
              {l.label}
            </Link>
          ))}
          {isAdmin && (
            <Link
              href="/admin"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm text-amber-400"
            >
              <Settings size={16} />
              แอดมิน
            </Link>
          )}
          <button
            onClick={() => signOut({ callbackUrl: "/login" })}
            className="mt-2 flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-sm text-red-400"
          >
            <LogOut size={16} />
            ออกจากระบบ
          </button>
        </div>
      )}
    </nav>
  );
}
