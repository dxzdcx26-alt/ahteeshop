import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { generateOrderId } from "@/lib/utils";

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "กรุณาเข้าสู่ระบบ" }, { status: 401 });
  }

  const { productId } = await req.json();
  if (!productId) {
    return NextResponse.json({ error: "ไม่พบสินค้า" }, { status: 400 });
  }

  const product = await prisma.product.findUnique({ where: { id: productId } });
  if (!product || !product.active) {
    return NextResponse.json({ error: "สินค้าไม่พร้อมขาย" }, { status: 404 });
  }
  if (product.stock <= 0) {
    return NextResponse.json({ error: "สินค้าหมด" }, { status: 400 });
  }

  const user = await prisma.user.findUnique({ where: { id: session.user.id } });
  if (!user || user.payPoint < product.price) {
    return NextResponse.json({ error: "แต้มไม่เพียงพอ" }, { status: 400 });
  }

  const orderId = generateOrderId();

  await prisma.$transaction([
    prisma.user.update({
      where: { id: user.id },
      data: { payPoint: { decrement: product.price } },
    }),
    prisma.product.update({
      where: { id: product.id },
      data: { stock: { decrement: 1 } },
    }),
    prisma.productLog.create({
      data: {
        productName: product.name,
        price: product.price,
        username: user.username,
        buyNumber: orderId,
        userId: user.id,
      },
    }),
  ]);

  return NextResponse.json({ ok: true, orderId, remaining: user.payPoint - product.price });
}
