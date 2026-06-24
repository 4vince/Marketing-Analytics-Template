# Marketing Analytics E-Commerce Template

A full-featured e-commerce storefront with an admin panel and AI-powered marketing intelligence. Built with Next.js 14, Prisma, Stripe, and a Python FastAPI AI service.

## Features

- **Storefront** — Product listing with search/filter, product detail pages, shopping cart, Stripe checkout
- **Admin Panel** — Dashboard with stats, product CRUD, order management, marketing intelligence
- **AI Marketing Agents** — Automated SEO, content quality, and product page analysis for every product
- **AI Chat Widget** — Floating storefront assistant that answers customer questions
- **Quarterly Reports** — Auto-generated marketing performance reports with actionable suggestions
- **Authentication** — Admin login via NextAuth with credentials provider

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 14 (App Router), React 18, TypeScript |
| Styling | Tailwind CSS |
| Database | PostgreSQL via Prisma ORM |
| Payments | Stripe Checkout + Webhooks |
| Auth | NextAuth (credentials, JWT) |
| State | Zustand (cart, localStorage persistence) |
| AI Service | Python FastAPI, OpenAI / Anthropic LLMs |

## Project Structure

```
├── src/
│   ├── app/               # App Router pages & API routes
│   │   ├── admin/         # Admin dashboard, products, orders, marketing
│   │   ├── api/           # API routes (products, checkout, chat, analysis, etc.)
│   │   ├── products/      # Storefront product listing & detail pages
│   │   ├── cart/          # Shopping cart page
│   │   ├── checkout/      # Stripe checkout page
│   │   ├── about/         # About page
│   │   ├── contact/       # Contact page
│   │   └── layout.tsx     # Root layout
│   ├── components/
│   │   ├── storefront/    # Header, Footer, ProductCard, ProductGrid, CartItem, ChatWidget
│   │   ├── admin/         # Sidebar, StatsCard, ProductForm, AnalyzeButton
│   │   └── ui/            # Reusable Button component
│   ├── lib/               # Prisma client, Auth config, Stripe client, AI client
│   └── store/             # Zustand cart store
├── prisma/
│   ├── schema.prisma      # Database models (User, Product, Order, AnalysisResult, etc.)
│   └── seed.ts            # Seed script with sample products + admin user
├── ai-service/
│   ├── main.py            # FastAPI entry point (routes: /health, /chat, /analyze)
│   ├── orchestrator.py    # Runs all analysis agents on product data
│   ├── llm_client.py      # LLM abstraction (OpenAI / Anthropic)
│   ├── agents/            # Analysis agents (SEO, ContentQuality, ProductPage, Chat, QuarterlyReport)
│   └── tests/             # Pytest test suite
├── docker-compose.yml     # Orchestrates all 3 services
├── Dockerfile             # AI service Docker image
└── Dockerfile.nextjs      # Next.js Docker image
```

## Prerequisites

- Node.js 20+
- Python 3.12+ (for AI service)
- PostgreSQL 16 (or Docker for Postgres)
- Stripe account (for payments)
- OpenAI or Anthropic API key (for AI features)

## Getting Started (Local Development)

### 1. Clone and install dependencies

```bash
git clone <repo-url>
cd Marketing-Analytics-Template
npm install
```

### 2. Set up PostgreSQL

Start a Postgres instance (or use Docker):

```bash
docker run -d --name pg -e POSTGRES_USER=user -e POSTGRES_PASSWORD=password -e POSTGRES_DB=ecommerce -p 5432:5432 postgres:16
```

### 3. Configure environment variables

Copy the example env file:

```bash
cp .env.example .env
```

Edit `.env` with your values:

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | PostgreSQL connection string |
| `NEXTAUTH_SECRET` | Random secret for JWT encryption |
| `NEXTAUTH_URL` | `http://localhost:3000` |
| `STRIPE_SECRET_KEY` | Stripe secret key (sk_test_...) |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Stripe publishable key (pk_test_...) |
| `STRIPE_WEBHOOK_SECRET` | Stripe webhook signing secret (whsec_...) |
| `AI_SERVICE_URL` | `http://localhost:8000` |

### 4. Set up the database

```bash
npx prisma generate
npx prisma db push
npm run db:seed
```

This creates the tables and seeds an admin user (`admin@store.com` / `admin123`) plus 3 sample products.

### 5. Start the Next.js dev server

```bash
npm run dev
```

The app runs at `http://localhost:3000`.

### 6. Start the AI service

```bash
cd ai-service
cp .env.example .env
```

Edit `ai-service/.env` with your LLM provider credentials:

| Variable | Description |
|----------|-------------|
| `OPENAI_API_KEY` | OpenAI API key (if using OpenAI) |
| `ANTHROPIC_API_KEY` | Anthropic API key (if using Claude) |
| `LLM_PROVIDER` | `openai` or `anthropic` |
| `LLM_MODEL` | `gpt-4o` or `claude-sonnet-4-20250514` |

Install and run:

```bash
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

The AI service runs at `http://localhost:8000`. Verify with `curl http://localhost:8000/health`.

## Docker Setup (All Services)

```bash
docker compose up --build
```

This starts three containers: PostgreSQL (port 5432), AI service (port 8000), and Next.js (port 3000).

## Stripe Webhook (Local Development)

For Stripe payment events to work locally (order creation on checkout), run the Stripe CLI:

```bash
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```

Copy the signing secret (`whsec_...`) into your `.env` as `STRIPE_WEBHOOK_SECRET`.

## Database Management

| Command | Description |
|---------|-------------|
| `npx prisma db push` | Push schema changes to the database |
| `npx prisma generate` | Regenerate the Prisma client |
| `npm run db:seed` | Seed sample data |
| `npx prisma studio` | Open Prisma Studio (GUI database browser) |

## API Routes

| Route | Method | Description |
|-------|--------|-------------|
| `/api/auth/[...nextauth]` | GET/POST | NextAuth authentication |
| `/api/products` | GET | List all products |
| `/api/products` | POST | Create product (admin) |
| `/api/products` | PUT | Update product (admin) |
| `/api/products` | DELETE | Delete product (admin) |
| `/api/checkout` | POST | Create Stripe checkout session |
| `/api/orders` | GET | List orders |
| `/api/chat` | POST | AI chat proxy |
| `/api/analysis` | GET | Get analysis results |
| `/api/analysis` | POST | Trigger AI analysis (admin) |
| `/api/report/generate` | POST | Generate quarterly report (admin) |
| `/api/webhooks/stripe` | POST | Stripe event webhook |

## AI Agents

The Python AI service runs 4 analysis agents:

- **SEO Agent** — Scores title tag, meta description, URL slug, heading structure (0-100)
- **Content Quality Agent** — Scores readability, grammar, structure, persuasiveness (0-100)
- **Product Page Agent** — Scores description completeness, pricing, CTA, social proof, images (0-100)
- **Chat Agent** — Answers visitor questions using the product catalog as context
- **Quarterly Report Agent** — Aggregates 90 days of analysis into a summary with prioritized suggestions
