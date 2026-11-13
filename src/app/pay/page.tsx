import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import Navbar from "@/components/Navbar";
import { Wallet } from "lucide-react";

export default async function PayPage() {
  const session = await auth();
  if (!session) redirect("/login");

  return (
    <div className="min-h-screen bg-slate-950">
      <Navbar />
      <main className="mx-auto max-w-lg px-4 py-12">
        <div className="rounded-2xl border border-slate-700/50 bg-slate-900/80 p-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-500/15 text-amber-400">
            <Wallet size={32} />
          </div>
          <h1 className="text-xl font-bold text-white">เติมเงิน / เติมแต้ม</h1>
          <p className="mt-2 text-sm text-slate-400">
            หน้านี้เป็นตัวอย่าง UI ตามต้นฉบับเดิม ยังไม่ได้เชื่อมระบบชำระเงินจริง
          </p>
          <div className="mt-6 rounded-xl border border-dashed border-slate-600 bg-slate-800/50 p-6">
            <p className="text-slate-300">TrueMoney / PromptPay</p>
            <p className="mt-2 text-xs text-slate-500">
              สามารถต่อ API ชำระเงินหรือระบบเติมแต้มด้วยมือผ่านแอดมินได้ในภายหลัง
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
