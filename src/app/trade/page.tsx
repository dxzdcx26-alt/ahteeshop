import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Navbar from "@/components/Navbar";
import RewardCard from "@/components/RewardCard";

export default async function TradePage() {
  const session = await auth();
  if (!session) redirect("/login");

  const rewards = await prisma.reward.findMany({
    where: { active: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="min-h-screen bg-slate-950">
      <Navbar />
      <main className="mx-auto max-w-6xl px-4 py-8">
        <h1 className="mb-6 text-2xl font-bold text-white">แลกรางวัล</h1>
        {rewards.length === 0 ? (
          <p className="text-slate-500">ยังไม่มีรางวัล</p>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {rewards.map((r) => (
              <RewardCard key={r.id} reward={r} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
