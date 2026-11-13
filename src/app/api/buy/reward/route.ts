import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { generateOrderId } from "@/lib/utils";

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "กรุณาเข้าสู่ระบบ" }, { status: 401 });
  }

  const { rewardId } = await req.json();
  if (!rewardId) {
    return NextResponse.json({ error: "ไม่พบรางวัล" }, { status: 400 });
  }

  const reward = await prisma.reward.findUnique({ where: { id: rewardId } });
  if (!reward || !reward.active) {
    return NextResponse.json({ error: "รางวัลไม่พร้อมแลก" }, { status: 404 });
  }
  if (reward.stock <= 0) {
    return NextResponse.json({ error: "รางวัลหมด" }, { status: 400 });
  }

  const user = await prisma.user.findUnique({ where: { id: session.user.id } });
  if (!user || user.rewardPoint < reward.price) {
    return NextResponse.json({ error: "แต้มรางวัลไม่เพียงพอ" }, { status: 400 });
  }

  const orderId = generateOrderId();

  await prisma.$transaction([
    prisma.user.update({
      where: { id: user.id },
      data: { rewardPoint: { decrement: reward.price } },
    }),
    prisma.reward.update({
      where: { id: reward.id },
      data: { stock: { decrement: 1 } },
    }),
    prisma.rewardLog.create({
      data: {
        rewardName: reward.name,
        price: reward.price,
        username: user.username,
        buyNumber: orderId,
        userId: user.id,
      },
    }),
  ]);

  return NextResponse.json({ ok: true, orderId, remaining: user.rewardPoint - reward.price });
}
