import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "กรุณาเข้าสู่ระบบ" }, { status: 401 });
  }

  const { code } = await req.json();
  if (!code || typeof code !== "string") {
    return NextResponse.json({ error: "กรุณาใส่โค้ด" }, { status: 400 });
  }

  const redeem = await prisma.redeemCode.findUnique({
    where: { code: code.trim() },
  });

  if (!redeem) {
    return NextResponse.json({ error: "โค้ดไม่ถูกต้อง" }, { status: 404 });
  }
  if (redeem.used) {
    return NextResponse.json({ error: "โค้ดนี้ถูกใช้แล้ว" }, { status: 400 });
  }

  await prisma.$transaction([
    prisma.redeemCode.update({
      where: { id: redeem.id },
      data: {
        used: true,
        usedBy: session.user.name || session.user.id,
        usedAt: new Date(),
      },
    }),
    prisma.user.update({
      where: { id: session.user.id },
      data: {
        payPoint: { increment: redeem.points },
        rewardPoint: { increment: redeem.points },
      },
    }),
  ]);

  return NextResponse.json({
    ok: true,
    points: redeem.points,
    message: `ได้รับ ${redeem.points} แต้ม`,
  });
}
