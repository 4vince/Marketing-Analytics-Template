// Enhanced seed script: populates database with realistic product data from dummy products API
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { getAllProducts } from "@/lib/dummy-products";

const prisma = new PrismaClient();

async function main() {
  console.log('Starting database seeding...');

  // Create admin user
  const passwordHash = await bcrypt.hash("admin123", 10);
  await prisma.user.upsert({
    where: { email: "admin@store.com" },
    update: {},
    create: {
      email: "admin@store.com",
      passwordHash,
      name: "Admin",
      role: "admin"
    },
  });
  console.log('✓ Admin user created/updated');

  // Clear existing products (optional - comment out if you want to preserve existing products)
  console.log('Clearing existing products...');
  await prisma.product.deleteMany({});

  // Fetch products from dummy API
  console.log('Fetching products from dummy products API...');
  let products: any[] = [];
  try {
    products = await getAllProducts({ limit: 50 }); // Limit to 50 products for seeding
    console.log(`Fetched ${products.length} products from dummy API`);
  } catch (error) {
    console.error('Failed to fetch products from dummy API:', (error as Error).message);
    console.log('Falling back to hardcoded sample products...');
  }

  // Use fetched products or fallback to hardcoded samples
  const productsToSeed = products.length > 0 ? products : [
    {
      product_name: "Classic White T-Shirt",
      product_description: "A comfortable classic white t-shirt made from 100% organic cotton.",
      product_price: 29.99,
      product_image_sm: "https://via.placeholder.com/150?text=TSHIRT",
      product_image_md: "https://via.placeholder.com/300?text=TSHIRT",
      product_image_lg: "https://via.placeholder.com/600?text=TSHIRT",
      product_type: "clothing",
      product_stock: 50,
      product_ratings: 4,
      product_sales: 100
    },
    {
      product_name: "Wireless Headphones",
      product_description: "Premium wireless headphones with noise cancellation and 30-hour battery.",
      product_price: 79.99,
      product_image_sm: "https://via.placeholder.com/150?text=HEADPHONES",
      product_image_md: "https://via.placeholder.com/300?text=HEADPHONES",
      product_image_lg: "https://via.placeholder.com/600?text=HEADPHONES",
      product_type: "electronics",
      product_stock: 30,
      product_ratings: 5,
      product_sales: 200
    },
    {
      product_name: "Leather Notebook",
      product_description: "Handcrafted leather-bound notebook with 200 pages of acid-free paper.",
      product_price: 24.99,
      product_image_sm: "https://via.placeholder.com/150?text=NOTEBOOK",
      product_image_md: "https://via.placeholder.com/300?text=NOTEBOOK",
      product_image_lg: "https://via.placeholder.com/600?text=NOTEBOOK",
      product_type: "stationery",
      product_stock: 100,
      product_ratings: 3,
      product_sales: 50
    }
  ];

  // Transform and create products
  console.log(`Creating ${productsToSeed.length} products...`);
  for (const productData of productsToSeed) {
    const product = {
      name: productData.product_name,
      slug: productData.product_name
        .toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^a-z0-9-]/g, ''),
      description: productData.product_description || '',
      price: Math.round(productData.product_price * 100), // Convert to cents
      images: [
        productData.product_image_sm,
        productData.product_image_md,
        productData.product_image_lg
      ].filter(Boolean),
      category: (productData.product_type || 'general').toLowerCase(),
      status: 'active',
    };

    await prisma.product.create({
      data: product,
    });
  }

  console.log(`✓ Created ${productsToSeed.length} products`);

  // Show sample of what was created
  const sampleProducts = await prisma.product.findMany({
    take: 3,
    select: { id: true, name: true, price: true, category: true }
  });

  console.log('Sample products created:');
  sampleProducts.forEach(p => {
    console.log(`  - ${p.name} ($${(p.price / 100).toFixed(2)}) - ${p.category}`);
  });

  console.log('Database seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });