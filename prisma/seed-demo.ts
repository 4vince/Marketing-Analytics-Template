// Demo seed script — populates the database with 30+ realistic products across categories.
// Uses real Unsplash images. Run with: npx tsx prisma/seed-demo.ts
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

// Helper to slugify a product name
function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/['']/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

// Helper to pick a random item from an array
function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

interface ProductSeed {
  name: string;
  description: string;
  price: number; // in cents
  category: string;
  images: string[];
  compareAtPrice?: number;
}

const PRODUCTS: ProductSeed[] = [
  // --- Electronics ---
  {
    name: "Wireless Noise-Cancelling Headphones",
    description: "Premium over-ear headphones with active noise cancellation, 40-hour battery life, and ultra-comfortable memory foam ear cushions. Features Bluetooth 5.3 with multipoint connection for seamless switching between devices.",
    price: 29999,
    category: "electronics",
    images: [
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&q=80",
      "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=300&q=80",
    ],
    compareAtPrice: 34999,
  },
  {
    name: "Smart Bluetooth Speaker",
    description: "Portable waterproof speaker with 360-degree sound, deep bass, and 20-hour playtime. Built-in microphone for hands-free calls and voice assistant support.",
    price: 7999,
    category: "electronics",
    images: [
      "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=600&q=80",
      "https://images.unsplash.com/photo-1589003077984-894e133dabab?w=300&q=80",
    ],
  },
  {
    name: "Slim Laptop Stand",
    description: "Adjustable aluminum laptop stand with ergonomic elevation. Improves posture and airflow. Compatible with all laptops 10-17 inches. Foldable for portability.",
    price: 4999,
    category: "electronics",
    images: [
      "https://images.unsplash.com/photo-1611078489935-0cb964de46d6?w=600&q=80",
      "https://images.unsplash.com/photo-1611078489935-0cb964de46d6?w=300&q=80",
    ],
  },
  {
    name: "Mechanical Keyboard",
    description: "Full-size mechanical keyboard with hot-swappable blue switches. Per-key RGB backlighting, aircraft-grade aluminum frame, and detachable USB-C cable. Perfect for work and gaming.",
    price: 12999,
    category: "electronics",
    images: [
      "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=600&q=80",
      "https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?w=300&q=80",
    ],
    compareAtPrice: 15999,
  },
  {
    name: "Wireless Charging Pad",
    description: "Fast wireless charger compatible with all Qi-enabled devices. 15W fast charging, slim design with LED indicator. Includes USB-C cable and adapter.",
    price: 2499,
    category: "electronics",
    images: [
      "https://images.unsplash.com/photo-1623869675781-80aa31012a5a?w=600&q=80",
    ],
  },
  {
    name: "Minimalist Desk Lamp",
    description: "LED desk lamp with adjustable color temperature (3000K-6500K) and brightness. Touch control, USB charging port, and memory function. Sleek matte black design.",
    price: 5999,
    category: "electronics",
    images: [
      "https://images.unsplash.com/photo-1507473885765-e6ed057ab6fe?w=600&q=80",
    ],
  },

  // --- Clothing ---
  {
    name: "Classic White T-Shirt",
    description: "Essential crew-neck t-shirt in premium 180gsm organic cotton. Relaxed fit with reinforced seams. Pre-shrunk and garment-dyed for a lived-in feel from day one.",
    price: 3499,
    category: "clothing",
    images: [
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&q=80",
      "https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=300&q=80",
    ],
  },
  {
    name: "Merino Wool Sweater",
    description: "Lightweight merino wool crew-neck sweater. Temperature-regulating, odor-resistant, and incredibly soft. Perfect for layering or wearing on its own.",
    price: 8999,
    category: "clothing",
    images: [
      "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=600&q=80",
      "https://images.unsplash.com/photo-1614975059405-d2ad81c36a03?w=300&q=80",
    ],
    compareAtPrice: 11000,
  },
  {
    name: "Slim Fit Denim Jacket",
    description: "Classic denim jacket in indigo with a modern slim fit. Features chest pockets, adjustable waist tabs, and brass button closure. A timeless layering piece.",
    price: 7999,
    category: "clothing",
    images: [
      "https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=600&q=80",
      "https://images.unsplash.com/photo-1546258533-0c470503a2bb?w=300&q=80",
    ],
  },
  {
    name: "Athletic Running Shorts",
    description: "Lightweight quick-dry running shorts with built-in compression liner. Zippered pocket for essentials, reflective details for visibility, and moisture-wicking fabric.",
    price: 4499,
    category: "clothing",
    images: [
      "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=600&q=80",
    ],
  },
  {
    name: "Wool Blend Beanie",
    description: "Ribbed knit beanie in a soft wool-acrylic blend. Double-layer construction for warmth. One size fits most. Available in classic earth tones.",
    price: 2499,
    category: "clothing",
    images: [
      "https://images.unsplash.com/photo-1576871337622-98d48d1cf531?w=600&q=80",
    ],
  },

  // --- Home & Living ---
  {
    name: "Ceramic Pour-Over Coffee Set",
    description: "Hand-crafted ceramic pour-over coffee dripper with double-wall glass carafe. Includes stainless steel filter. Makes 4 cups of perfectly extracted coffee.",
    price: 5499,
    category: "home",
    images: [
      "https://images.unsplash.com/photo-1497935586351-b67a49e012bf?w=600&q=80",
      "https://images.unsplash.com/photo-1559496417-e7f25cb247f3?w=300&q=80",
    ],
  },
  {
    name: "Scented Soy Candle Collection",
    description: "Set of 3 hand-poured soy wax candles in amber glass jars. Scents: Vanilla & Sandalwood, Fresh Linen, and Cedar & Sage. 45+ hours burn time each.",
    price: 3999,
    category: "home",
    images: [
      "https://images.unsplash.com/photo-1602866425051-4e25648a1399?w=600&q=80",
      "https://images.unsplash.com/photo-1603006905003-be475563bc59?w=300&q=80",
    ],
    compareAtPrice: 5000,
  },
  {
    name: "Linen Throw Blanket",
    description: "Stonewashed linen throw blanket in oatmeal. Pre-washed for maximum softness. Generous 50x70 size — perfect for the couch or bed. Gets softer with every wash.",
    price: 6999,
    category: "home",
    images: [
      "https://images.unsplash.com/photo-1606787366850-de6330128bfc?w=600&q=80",
    ],
  },
  {
    name: "Plant Pot Trio",
    description: "Set of 3 matte ceramic plant pots with drainage holes and bamboo saucers. Sizes: 4, 5, and 6 inches. Minimalist design in warm terracotta tones.",
    price: 3499,
    category: "home",
    images: [
      "https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=600&q=80",
      "https://images.unsplash.com/photo-1459411552884-841db9b3cc2a?w=300&q=80",
    ],
  },
  {
    name: "Bamboo Cutting Board",
    description: "Large organic bamboo cutting board with juice groove and integrated handle. Naturally antimicrobial, knife-friendly surface. Measures 18x12 inches.",
    price: 2999,
    category: "home",
    images: [
      "https://images.unsplash.com/photo-1594226801341-41427b4e5c22?w=600&q=80",
    ],
  },
  {
    name: "Woven Storage Basket",
    description: "Handwoven seagrass storage basket with leather handles. Perfect for blankets, magazines, or toys. Measures 16x14x12 inches. Each piece is unique.",
    price: 4499,
    category: "home",
    images: [
      "https://images.unsplash.com/photo-1594046243095-5e296230e9c1?w=600&q=80",
    ],
  },

  // --- Accessories ---
  {
    name: "Minimalist Leather Wallet",
    description: "Slim RFID-blocking wallet in full-grain vegetable-tanned leather. Holds up to 8 cards plus cash. Develops a beautiful patina over time. Hand-stitched in Italy.",
    price: 6999,
    category: "accessories",
    images: [
      "https://images.unsplash.com/photo-1627123424574-724758594e93?w=600&q=80",
      "https://images.unsplash.com/photo-1606503825008-909a67e63c3d?w=300&q=80",
    ],
    compareAtPrice: 8500,
  },
  {
    name: "Polarized Aviator Sunglasses",
    description: "Classic aviator sunglasses with polarized brown lenses and lightweight gold-frame construction. 100% UV protection. Includes hard case and microfiber cleaning cloth.",
    price: 14999,
    category: "accessories",
    images: [
      "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=600&q=80",
      "https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=300&q=80",
    ],
  },
  {
    name: "Canvas Tote Bag",
    description: "Heavy-duty canvas tote with vegetable-tanned leather straps and interior zip pocket. Folds flat for travel. Holds 15kg. Natural undyed canvas.",
    price: 4999,
    category: "accessories",
    images: [
      "https://images.unsplash.com/photo-1591561954555-607968c989ab?w=600&q=80",
    ],
  },
  {
    name: "Brass Keychain",
    description: "Solid brass keychain with leather lanyard and split ring. Develops a natural patina over time. Engravable. Minimalist and built to last a lifetime.",
    price: 1999,
    category: "accessories",
    images: [
      "https://images.unsplash.com/photo-1606046604972-77cc76aee94b?w=600&q=80",
    ],
  },
  {
    name: "Silk Twill Scarf",
    description: "100% silk twill scarf with hand-rolled edges. Classic 35-inch square. Features an exclusive abstract pattern in muted earth tones. Dry clean recommended.",
    price: 8999,
    category: "accessories",
    images: [
      "https://images.unsplash.com/photo-1601924994987-69e26d50dc26?w=600&q=80",
    ],
    compareAtPrice: 12000,
  },

  // --- Sports & Outdoors ---
  {
    name: "Insulated Stainless Water Bottle",
    description: "Double-wall vacuum insulated bottle keeps drinks cold 24hrs or hot 12hrs. 32oz capacity, powder-coated finish, leak-proof lid with carry loop. BPA-free.",
    price: 3499,
    category: "sports",
    images: [
      "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=600&q=80",
      "https://images.unsplash.com/photo-1570831739435-6601aa3fa4fb?w=300&q=80",
    ],
  },
  {
    name: "Yoga Mat Premium",
    description: "Extra-thick 6mm yoga mat in natural rubber with microfiber top layer. Non-slip surface, eco-friendly materials. Includes carrying strap. 72x26 inches.",
    price: 7999,
    category: "sports",
    images: [
      "https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=600&q=80",
      "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=300&q=80",
    ],
    compareAtPrice: 9500,
  },
  {
    name: "Resistance Band Set",
    description: "Set of 5 resistance bands with varying tension levels (10-50lbs). Includes door anchor, ankle straps, and carrying bag. Perfect for home workouts and travel.",
    price: 2499,
    category: "sports",
    images: [
      "https://images.unsplash.com/photo-1598289431512-b97b0917affc?w=600&q=80",
    ],
  },
  {
    name: "Hiking Daypack 20L",
    description: "Lightweight 20-liter daypack with ventilated back panel, rain cover, and hydration sleeve. Multiple pockets for organization. Chest and hip straps for stability.",
    price: 6999,
    category: "sports",
    images: [
      "https://images.unsplash.com/photo-1622260614153-03223fb72052?w=600&q=80",
    ],
  },
  {
    name: "Jump Rope Speed",
    description: "Ball-bearing speed jump rope with adjustable 3m steel cable and foam handles. Smooth rotation for double-unders. Suitable for all fitness levels.",
    price: 1499,
    category: "sports",
    images: [
      "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&q=80",
    ],
  },

  // --- Beauty & Wellness ---
  {
    name: "Vitamin C Serum",
    description: "Concentrated 15% vitamin C serum with hyaluronic acid and vitamin E. Brightens skin, reduces dark spots, and boosts collagen. Suitable for all skin types. 30ml.",
    price: 3999,
    category: "beauty",
    images: [
      "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=600&q=80",
    ],
  },
  {
    name: "Bamboo Toothbrush Set",
    description: "Set of 4 biodegradable bamboo toothbrushes with charcoal-infused bristles. Ergonomic handle, compostable packaging. Medium-soft bristles for gentle cleaning.",
    price: 1499,
    category: "beauty",
    images: [
      "https://images.unsplash.com/photo-1559847844-5315695dadae?w=600&q=80",
    ],
  },
  {
    name: "Natural Lip Balm Trio",
    description: "Set of 3 handcrafted lip balms made with beeswax, coconut oil, and shea butter. Flavors: Peppermint, Wild Orange, and Unscented. Plastic-free packaging.",
    price: 1299,
    category: "beauty",
    images: [
      "https://images.unsplash.com/photo-1617897903246-719242758050?w=600&q=80",
    ],
  },
  {
    name: "Essential Oil Diffuser",
    description: "Ultrasonic essential oil diffuser with 200ml capacity. Covers up to 300 sq ft. LED mood lighting, auto shut-off, and whisper-quiet operation. Includes 3 sample oils.",
    price: 3299,
    category: "beauty",
    images: [
      "https://images.unsplash.com/photo-1602928298849-325cec8771c0?w=600&q=80",
    ],
  },

  // --- Stationery ---
  {
    name: "Hardcover Dot Journal",
    description: "192-page dot-grid journal in 100gsm acid-free paper. Lay-flat binding, expandable inner pocket, ribbon bookmark, and elastic closure. Durable hardcover in charcoal.",
    price: 2499,
    category: "stationery",
    images: [
      "https://images.unsplash.com/photo-1531346680769-a4d79b3f5678?w=600&q=80",
      "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=300&q=80",
    ],
  },
  {
    name: "Fountain Pen Starter Set",
    description: "Starter fountain pen set with fine nib, 6 ink cartridges, and converter for bottled ink. Ergonomic grip, lightweight resin body. Perfect for beginners.",
    price: 2999,
    category: "stationery",
    images: [
      "https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?w=600&q=80",
    ],
  },
  {
    name: "Washi Tape Collection",
    description: "Set of 15 decorative washi tape rolls in assorted patterns. 15mm x 10m each. Easy to tear and reposition. Perfect for journaling, gift wrapping, and crafts.",
    price: 1599,
    category: "stationery",
    images: [
      "https://images.unsplash.com/photo-1607021747610-12bb41dbed21?w=600&q=80",
    ],
  },
];

async function main() {
  console.log("🌱 Starting demo database seed...\n");

  // 1. Create admin user
  const passwordHash = await bcrypt.hash("admin123", 10);
  await prisma.user.upsert({
    where: { email: "admin@store.com" },
    update: { passwordHash },
    create: {
      email: "admin@store.com",
      passwordHash,
      name: "Admin",
      role: "admin",
    },
  });
  console.log("✓ Admin user created (admin@store.com / admin123)");

  // 2. Delete existing analysis results (foreign key constraint) & products
  await prisma.analysisResult.deleteMany({});
  await prisma.product.deleteMany({});
  console.log("✓ Cleared existing products and analyses");

  // 3. Seed products
  let created = 0;
  for (const product of PRODUCTS) {
    let slug = slugify(product.name);

    // Ensure unique slug
    let existing = await prisma.product.findUnique({ where: { slug } });
    let suffix = 0;
    while (existing) {
      suffix++;
      slug = `${slugify(product.name)}-${suffix}`;
      existing = await prisma.product.findUnique({ where: { slug } });
    }

    await prisma.product.create({
      data: {
        name: product.name,
        slug,
        description: product.description,
        price: product.price,
        compareAtPrice: product.compareAtPrice ?? null,
        images: product.images,
        category: product.category,
        metaTitle: `${product.name} | Store`,
        metaDescription: product.description.slice(0, 155),
        status: "active",
      },
    });
    created++;
    process.stdout.write(".");
  }
  console.log(`\n✓ Created ${created} products`);

  // 4. Summary
  const total = await prisma.product.count();
  const categories = await prisma.product.findMany({
    select: { category: true },
    distinct: ["category"],
  });

  console.log(`\n📊 Seed Summary:`);
  console.log(`   Total products: ${total}`);
  console.log(`   Categories: ${categories.map((c) => c.category).join(", ")}`);
  console.log(`   Admin login: admin@store.com / admin123\n`);
  console.log("✅ Database seeding completed!");
}

main()
  .catch((e) => {
    console.error("\n❌ Seeding failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
