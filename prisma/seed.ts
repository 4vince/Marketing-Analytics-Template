// Seed script: creates admin user, sample products, orders, and demo analytics data for development.
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

function daysAgo(n: number): Date {
  const d = new Date();
  d.setDate(d.getDate() - n);
  d.setHours(0, 0, 0, 0);
  return d;
}

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

async function main() {
  // ── Admin user ──────────────────────────────────────────────────────────────
  const passwordHash = await bcrypt.hash("admin123", 10);
  await prisma.user.upsert({
    where: { email: "admin@store.com" },
    update: { passwordHash },
    create: { email: "admin@store.com", passwordHash, name: "Admin", role: "admin" },
  });

  // ── Products ────────────────────────────────────────────────────────────────
  const products = [
    { name: "Classic White T-Shirt", slug: "classic-white-tshirt", price: 2999, description: "A comfortable classic white t-shirt made from 100% organic cotton.", category: "clothing", metaTitle: "Classic White T-Shirt | Organic Cotton", metaDescription: "Shop our classic white t-shirt made from 100% organic cotton. Comfortable, sustainable, and affordable." },
    { name: "Wireless Headphones", slug: "wireless-headphones", price: 7999, description: "Premium wireless headphones with noise cancellation and 30-hour battery life.", category: "electronics", metaTitle: "Wireless Headphones | Noise Cancellation", metaDescription: "Premium wireless headphones with active noise cancellation. 30-hour battery life and crystal-clear sound." },
    { name: "Leather Notebook", slug: "leather-notebook", price: 2499, description: "Handcrafted leather-bound notebook with 200 pages of acid-free paper.", category: "stationery", metaTitle: "Leather Notebook | Handcrafted", metaDescription: "Handcrafted leather-bound notebook with 200 acid-free pages. Perfect for journaling and sketching." },
    { name: "Running Shoes", slug: "running-shoes", price: 12999, description: "Lightweight running shoes with responsive cushioning and breathable mesh upper.", category: "footwear", metaTitle: "Running Shoes | Lightweight Cushioning", metaDescription: "Professional running shoes with responsive cushioning and breathable mesh. Perfect for daily runs." },
    { name: "Yoga Mat", slug: "yoga-mat", price: 3999, description: "Non-slip exercise yoga mat with extra thickness for joint protection.", category: "fitness", metaTitle: "Yoga Mat | Non-Slip Extra Thick", metaDescription: "Premium non-slip yoga mat with extra cushioning. Perfect for yoga, pilates, and stretching." },
    { name: "Coffee Maker", slug: "coffee-maker", price: 5999, description: "Programmable drip coffee maker with thermal carafe and auto-shutoff.", category: "electronics", metaTitle: "Coffee Maker | Programmable Thermal", metaDescription: "Programmable drip coffee maker with thermal carafe. Brew up to 12 cups with auto-shutoff." },
    { name: "Desk Lamp", slug: "desk-lamp", price: 3499, description: "LED desk lamp with adjustable brightness, color temperature, and USB charging port.", category: "electronics", metaTitle: "LED Desk Lamp | Adjustable Brightness", metaDescription: "Modern LED desk lamp with adjustable brightness and color temperature. Built-in USB charging port." },
    { name: "Backpack", slug: "backpack", price: 6499, description: "Water-resistant backpack with padded laptop compartment and ergonomic straps.", category: "accessories", metaTitle: "Water-Resistant Backpack | Laptop Compartment", metaDescription: "Durable water-resistant backpack with padded laptop compartment. Ergonomic design for daily comfort." },
  ];

  for (const p of products) {
    await prisma.product.upsert({
      where: { slug: p.slug },
      update: {},
      create: { ...p, images: [], status: "active" },
    });
  }

  const allProducts = await prisma.product.findMany();

  // ── Sample Orders (last 60 days) ───────────────────────────────────────────
  const customerNames = ["Alice Johnson", "Bob Smith", "Carol Davis", "David Wilson", "Eva Martinez",
    "Frank Brown", "Grace Lee", "Henry Taylor", "Iris Anderson", "Jack Thomas"];

  const orderStatuses: string[] = [];
  for (let i = 0; i < 60; i++) {
    // More paid orders recently, some pending, some failed
    if (i < 5) orderStatuses.push("refunded");
    else if (i < 10) orderStatuses.push("failed");
    else if (i < 18) orderStatuses.push("pending");
    else orderStatuses.push("paid");
  }

  for (let i = 0; i < 60; i++) {
    const product = pick(allProducts);
    const qty = randomInt(1, 3);
    const total = product.price * qty;
    const customerName = pick(customerNames);
    const customerEmail = customerName.toLowerCase().replace(" ", ".") + "@example.com";

    await prisma.order.create({
      data: {
        customerName,
        customerEmail,
        items: [{ name: product.name, price: product.price / 100, quantity: qty }],
        total,
        status: orderStatuses[i],
        createdAt: daysAgo(i),
      },
    });
  }

  // ── Traffic Sources (last 90 days) ──────────────────────────────────────────
  const sources = ["organic_search", "social", "email", "direct", "referral"];
  const sourceWeights = [
    { visits: [200, 500], orders: [8, 25], revenue: [400, 2000] },  // organic_search
    { visits: [100, 300], orders: [3, 12], revenue: [150, 900] },   // social
    { visits: [50, 150], orders: [4, 15], revenue: [200, 1200] },   // email
    { visits: [80, 200], orders: [3, 10], revenue: [150, 800] },    // direct
    { visits: [30, 100], orders: [1, 5], revenue: [50, 400] },      // referral
  ];

  for (let day = 0; day < 90; day++) {
    for (let s = 0; s < sources.length; s++) {
      const w = sourceWeights[s];
      const visits = randomInt(w.visits[0], w.visits[1]);
      const orders = randomInt(w.orders[0], w.orders[1]);
      const revenue = randomInt(w.revenue[0], w.revenue[1]);

      await prisma.trafficSource.create({
        data: {
          source: sources[s],
          visits,
          orders,
          revenue,
          date: daysAgo(day),
        },
      });
    }
  }

  // ── Campaign Performance (last 90 days) ────────────────────────────────────
  const campaigns = [
    { name: "Summer Sale - Google Ads", channel: "google_ads" },
    { name: "Facebook Retargeting", channel: "facebook" },
    { name: "Newsletter Promo", channel: "email" },
    { name: "Affiliate Blog Partners", channel: "affiliate" },
  ];

  for (let day = 0; day < 90; day++) {
    for (const campaign of campaigns) {
      const spend = randomInt(5000, 30000);
      const impressions = randomInt(5000, 30000);
      const clicks = Math.round(impressions * (randomInt(15, 45) / 1000)); // 1.5-4.5% CTR
      const conversions = Math.round(clicks * (randomInt(20, 80) / 1000)); // 2-8% conversion
      const revenue = conversions * randomInt(1500, 8000);

      await prisma.campaign.create({
        data: {
          name: campaign.name,
          channel: campaign.channel,
          spend,
          impressions,
          clicks,
          conversions,
          revenue,
          date: daysAgo(day),
        },
      });
    }
  }

  // ── Search Query Data (last 90 days) ───────────────────────────────────────
  const searchQueries = [
    "wireless headphones", "running shoes", "yoga mat", "coffee maker",
    "leather notebook", "desk lamp", "backpack", "white t-shirt",
    "organic cotton t-shirt", "noise cancelling headphones",
    "fitness accessories", "gift ideas", "office supplies", "sports equipment",
  ];

  for (let day = 0; day < 90; day++) {
    for (const query of searchQueries) {
      const impressions = randomInt(50, 400);
      const clicks = Math.round(impressions * (randomInt(20, 120) / 1000)); // 2-12% CTR
      const avgPosition = Math.round((randomInt(15, 80) / 10) * 10) / 10; // 1.5-8.0

      await prisma.searchQueryData.create({
        data: {
          query,
          impressions,
          clicks,
          avgPosition,
          date: daysAgo(day),
        },
      });
    }
  }

  // ── SEO Rankings (last 90 days) ────────────────────────────────────────────
  const keywords = [
    { keyword: "wireless headphones", page: "/products/wireless-headphones" },
    { keyword: "buy headphones online", page: "/products/wireless-headphones" },
    { keyword: "running shoes men", page: "/products/running-shoes" },
    { keyword: "yoga mat for home", page: "/products/yoga-mat" },
    { keyword: "best coffee maker 2026", page: "/products/coffee-maker" },
    { keyword: "leather notebook journal", page: "/products/leather-notebook" },
    { keyword: "organic cotton t-shirt", page: "/products/classic-white-tshirt" },
    { keyword: "desk lamp with usb", page: "/products/desk-lamp" },
    { keyword: "laptop backpack", page: "/products/backpack" },
    { keyword: "fitness gift ideas", page: "/products/yoga-mat" },
  ];

  for (let day = 0; day < 90; day++) {
    for (const kw of keywords) {
      // Simulate improving rankings over time (lower = better)
      const basePosition = Math.max(1, 10 - Math.floor(day / 12));
      const position = Math.max(1, basePosition + randomInt(-2, 2));
      const searchVolume = randomInt(100, 2000);

      await prisma.seoRanking.create({
        data: {
          keyword: kw.keyword,
          page: kw.page,
          position,
          searchVolume,
          date: daysAgo(day),
        },
      });
    }
  }

  console.log("✅ Database seeded with admin user, products, orders, and analytics data.");
}

main().catch(console.error).finally(() => prisma.$disconnect());
