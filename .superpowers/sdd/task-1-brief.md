### Task 1: Scaffold Next.js + Prisma + Database Schema

**Files:**
- Create: `D:\ecommerce-template\package.json`
- Create: `D:\ecommerce-template\tsconfig.json`
- Create: `D:\ecommerce-template\next.config.js`
- Create: `D:\ecommerce-template\tailwind.config.ts`
- Create: `D:\ecommerce-template\.env.example`
- Create: `D:\ecommerce-template\prisma\schema.prisma`
- Create: `D:\ecommerce-template\src\lib\prisma.ts`
- Create: `D:\ecommerce-template\src\app\globals.css`

**Interfaces:**
- Produces: Prisma client singleton `lib/prisma.ts` — `export const prisma: PrismaClient`
- Produces: Database schema with all tables

- [ ] **Step 1: Create project root and package.json**

```bash
mkdir D:\ecommerce-template
cd D:\ecommerce-template
```

```json
{
  "name": "ecommerce-template",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "db:push": "prisma db push",
    "db:generate": "prisma generate",
    "db:seed": "tsx prisma/seed.ts"
  },
  "dependencies": {
    "next": "^14.2.0",
    "react": "^18.3.0",
    "react-dom": "^18.3.0",
    "@prisma/client": "^5.14.0",
    "next-auth": "^4.24.0",
    "@stripe/stripe-js": "^3.0.0",
    "stripe": "^15.0.0",
    "zustand": "^4.5.0",
    "bcryptjs": "^2.4.3"
  },
  "devDependencies": {
    "typescript": "^5.4.0",
    "@types/node": "^20.0.0",
    "@types/react": "^18.3.0",
    "@types/react-dom": "^18.3.0",
    "prisma": "^5.14.0",
    "tailwindcss": "^3.4.0",
    "postcss": "^8.4.0",
    "autoprefixer": "^10.4.0",
    "tsx": "^4.0.0",
    "@types/bcryptjs": "^2.4.0"
  }
}
```

- [ ] **Step 2: Create tsconfig.json**

```json
{
  "compilerOptions": {
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [{ "name": "next" }],
    "paths": { "@/*": ["./src/*"] }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

- [ ] **Step 3: Create next.config.js**

```js
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: { remotePatterns: [{ protocol: "https", hostname: "**" }] },
};
module.exports = nextConfig;
```

- [ ] **Step 4: Create tailwind.config.ts**

```ts
import type { Config } from "tailwindcss";
const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: { "50": "#eff6ff", "100": "#dbeafe", "500": "#3b82f6", "600": "#2563eb", "700": "#1d4ed8" },
      },
    },
  },
  plugins: [],
};
export default config;
```

- [ ] **Step 5: Create .env.example**

```
DATABASE_URL="postgresql://user:password@localhost:5432/ecommerce"
NEXTAUTH_SECRET="your-secret-here"
NEXTAUTH_URL="http://localhost:3000"
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_PUBLISHABLE_KEY="pk_test_..."
AI_SERVICE_URL="http://localhost:8000"
```

- [ ] **Step 6: Create prisma/schema.prisma**

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id           String   @id @default(cuid())
  email        String   @unique
  passwordHash String   @map("password_hash")
  name         String
  role         String   @default("admin")
  createdAt    DateTime @default(now()) @map("created_at")
  updatedAt    DateTime @updatedAt @map("updated_at")

  @@map("users")
}

model Product {
  id             String   @id @default(cuid())
  name           String
  slug           String   @unique
  description    String
  price          Int
  compareAtPrice Int?     @map("compare_at_price")
  images         Json     @default("[]")
  category       String   @default("general")
  metaTitle      String?  @map("meta_title")
  metaDescription String? @map("meta_description")
  status         String   @default("active")
  createdAt      DateTime @default(now()) @map("created_at")
  updatedAt      DateTime @updatedAt @map("updated_at")

  analysisResults AnalysisResult[]

  @@map("products")
}

model Order {
  id            String   @id @default(cuid())
  customerEmail String   @map("customer_email")
  customerName  String   @map("customer_name")
  items         Json
  total         Int
  status        String   @default("pending")
  paymentIntent String?  @unique @map("payment_intent")
  createdAt     DateTime @default(now()) @map("created_at")
  updatedAt     DateTime @updatedAt @map("updated_at")

  @@map("orders")
}

model AnalysisResult {
  id        String   @id @default(cuid())
  productId String?  @map("product_id")
  agentType String   @map("agent_type")
  score     Int
  findings  Json     @default("[]")
  suggestions Json   @default("[]")
  createdAt DateTime @default(now()) @map("created_at")

  product Product? @relation(fields: [productId], references: [id])

  @@map("analysis_results")
}

model QuarterlyReport {
  id           String   @id @default(cuid())
  periodStart  DateTime @map("period_start")
  periodEnd    DateTime @map("period_end")
  overallScore Int?     @map("overall_score")
  summary      String
  sections     Json     @default("[]")
  createdAt    DateTime @default(now()) @map("created_at")

  @@map("quarterly_reports")
}

model PageContent {
  id               String   @id @default(cuid())
  pageType         String   @map("page_type")
  content          Json
  analysisResultId String?  @map("analysis_result_id")
  createdAt        DateTime @default(now()) @map("created_at")

  @@map("page_contents")
}

model ChatConversation {
  id             String   @id @default(cuid())
  sessionId      String   @unique @map("session_id")
  customerEmail  String?  @map("customer_email")
  status         String   @default("active")
  createdAt      DateTime @default(now()) @map("created_at")
  updatedAt      DateTime @updatedAt @map("updated_at")

  messages ChatMessage[]

  @@map("chat_conversations")
}

model ChatMessage {
  id             String   @id @default(cuid())
  conversationId String   @map("conversation_id")
  role           String
  content        String
  metadata       Json     @default("{}")
  createdAt      DateTime @default(now()) @map("created_at")

  conversation ChatConversation @relation(fields: [conversationId], references: [id])

  @@map("chat_messages")
}
```

- [ ] **Step 7: Create src/lib/prisma.ts**

```ts
import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

export const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
```

- [ ] **Step 8: Create src/app/globals.css**

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

- [ ] **Step 9: Create postcss.config.js**

Create `postcss.config.js` at root:
```js
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};
```

- [ ] **Step 10: Install dependencies and generate Prisma client**

```bash
cd D:\ecommerce-template
npm install
npx prisma generate
```

- [ ] **Step 11: Verify build**

```bash
cd D:\ecommerce-template
npx next build 2>&1 | findstr /V "Info"
```
Expected: Build completes without errors.

- [ ] **Step 12: Commit**

```bash
git init
git add .
git commit -m "feat: scaffold next.js with prisma and database schema"
```

---


