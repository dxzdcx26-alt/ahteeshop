import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Navbar from "@/components/Navbar";
import { formatPoints } from "@/lib/utils";

export default async function HomePage() {
  const session = await auth();
  if (!session) redirect("/login");

  const [events, updates, setting] = await Promise.all([
    prisma.eventPost.findMany({ orderBy: { createdAt: "desc" }, take: 5 }),
    prisma.updatePost.findMany({ orderBy: { createdAt: "desc" }, take: 5 }),
    prisma.webSetting.findFirst(),
  ]);

  return (
    <div className="min-h-screen bg-slate-950">
      <Navbar />
      <main className="mx-auto max-w-6xl px-4 py-8">
        <div className="mb-8 rounded-2xl border border-slate-700/50 bg-gradient-to-r from-cyan-900/30 to-slate-800/50 p-6">
          <h1 className="text-2xl font-bold text-white">สวัสดี, {session.user.name}</h1>
          <p className="mt-1 text-slate-400">{setting?.webName || "NAVySHOP"} · {setting?.webStatus || ""}</p>
          <div className="mt-4 flex flex-wrap gap-4">
            <div className="rounded-xl bg-slate-900/80 px-4 py-3">
              <div className="text-xs text-slate-400">แต้มเงิน</div>
              <div className="text-xl font-bold text-cyan-400">{formatPoints(session.user.payPoint)}</div>
            </div>
            <div className="rounded-xl bg-slate-900/80 px-4 py-3">
              <div className="text-xs text-slate-400">แต้มรางวัล</div>
              <div className="text-xl font-bold text-emerald-400">{formatPoints(session.user.rewardPoint)}</div>
            </div>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <section>
            <h2 className="mb-4 text-lg font-semibold text-cyan-300">กิจกรรม</h2>
            <div className="space-y-4">
              {events.length === 0 && <p className="text-sm text-slate-500">ยังไม่มีกิจกรรม</p>}
              {events.map((ev) => (
                <article key={ev.id} className="overflow-hidden rounded-xl border border-slate-700/50 bg-slate-800/40">
                  {ev.image && (
                    <img src={ev.image.startsWith("/") ? ev.image : `/uploads/events/${ev.image}`} alt={ev.title} className="h-40 w-full object-cover" />
                  )}
                  <div className="p-4">
                    <h3 className="font-medium text-white">{ev.title}</h3>
                    <p className="mt-1 whitespace-pre-wrap text-sm text-slate-400">{ev.detail}</p>
                  </div>
                </article>
              ))}
            </div>
          </section>
          <section>
            <h2 className="mb-4 text-lg font-semibold text-cyan-300">อัปเดต</h2>
            <div className="space-y-4">
              {updates.length === 0 && <p className="text-sm text-slate-500">ยังไม่มีอัปเดต</p>}
              {updates.map((up) => (
                <article key={up.id} className="overflow-hidden rounded-xl border border-slate-700/50 bg-slate-800/40">
                  {up.image && (
                    <img src={up.image.startsWith("/") ? up.image : `/uploads/updates/${up.image}`} alt={up.title} className="h-40 w-full object-cover" />
                  )}
                  <div className="p-4">
                    <h3 className="font-medium text-white">{up.title}</h3>
                    <p className="mt-1 whitespace-pre-wrap text-sm text-slate-400">{up.detail}</p>
                  </div>
                </article>
              ))}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
