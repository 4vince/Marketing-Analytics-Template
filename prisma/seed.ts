import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash("admin123", 10);
  await prisma.user.upsert({
    where: { email: "admin@store.com" },
    update: {},
    create: { email: "admin@store.com", passwordHash, name: "Admin", role: "admin" },
  });

  const products = [
    { name: "Classic White T-Shirt", slug: "classic-white-tshirt", price: 2999, description: "A comfortable classic white t-shirt made from 100% organic cotton.", category: "clothing" },
    { name: "Wireless Headphones", slug: "wireless-headphones", price: 7999, description: "Premium wireless headphones with noise cancellation and 30-hour battery.", category: "electronics" },
    { name: "Leather Notebook", slug: "leather-notebook", price: 2499, description: "Handcrafted leather-bound notebook with 200 pages of acid-free paper.", category: "stationery" },
  ];

  for (const p of products) {
    await prisma.product.upsert({
      where: { slug: p.slug },
      update: {},
      create: { ...p, images: [], status: "active" },
    });
  }
}

main().catch(console.error).finally(() => prisma.$disconnect());
