import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

async function requireAdmin() {
  const session = await auth();
  if (!session?.user || session.user.role !== "actor") return null;
  return session;
}

export async function GET() {
  if (!(await requireAdmin())) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const items = await prisma.product.findMany({ orderBy: { createdAt: "desc" } });
  return NextResponse.json(items);
}

export async function POST(req: Request) {
  if (!(await requireAdmin())) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const schema = z.object({
    name: z.string().min(1),
    type: z.string().min(1),
    className: z.string().min(1),
    detail: z.string().min(1),
    price: z.number().int().min(0),
    stock: z.number().int().min(0).default(999),
    image: z.string().optional(),
  });
  try {
    const body = schema.parse(await req.json());
    const item = await prisma.product.create({
      data: {
        name: body.name,
        type: body.type,
        className: body.className,
        detail: body.detail,
        price: body.price,
        stock: body.stock,
        image: body.image || "unproduct.jpg",
      },
    });
    return NextResponse.json(item);
  } catch (e: any) {
    return NextResponse.json({ error: e.message || "Invalid" }, { status: 400 });
  }
}

export async function DELETE(req: Request) {
  if (!(await requireAdmin())) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const { id } = await req.json();
  await prisma.product.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
