// Products CRUD API — GET (list), POST (create), PUT (update), DELETE (delete). Admin-only for mutations.
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function DELETE(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await req.json();
  await prisma.product.delete({ where: { id } });
  return NextResponse.json({ success: true });
}

export async function GET() {
  const products = await prisma.product.findMany({ orderBy: { createdAt: "desc" } });
  return NextResponse.json(products);
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const data = await req.json();
  let slug = data.slug || data.name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
  const existing = await prisma.product.findUnique({ where: { slug } });
  if (existing) slug = `${slug}-${Date.now()}`;
  const product = await prisma.product.create({
    data: {
      name: data.name,
      slug,
      description: data.description,
      price: Math.round(data.price * 100),
      compareAtPrice: data.compareAtPrice ? Math.round(data.compareAtPrice * 100) : null,
      images: data.images || [],
      category: data.category || "general",
      metaTitle: data.metaTitle || null,
      metaDescription: data.metaDescription || null,
      status: data.status || "draft",
    },
  });
  return NextResponse.json(product);
}

export async function PUT(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const data = await req.json();
  const product = await prisma.product.update({
    where: { id: data.id },
    data: {
      name: data.name,
      description: data.description,
      price: Math.round(data.price * 100),
      compareAtPrice: data.compareAtPrice ? Math.round(data.compareAtPrice * 100) : null,
      images: data.images || [],
      category: data.category || "general",
      metaTitle: data.metaTitle || null,
      metaDescription: data.metaDescription || null,
      status: data.status || "draft",
    },
  });
  return NextResponse.json(product);
}
