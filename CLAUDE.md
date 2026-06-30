# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with the Marketing-Analytics-Template repository.

## 🛠️ Common Development Commands

### Next.js Frontend
- **Development server**: `npm run dev` (runs at http://localhost:3000)
- **Production build**: `npm run build`
- **Start production**: `npm run start`
- **Linting**: `npm run lint`
- **Database operations**:
  - Push schema: `npx prisma db push`
  - Generate Prisma client: `npx prisma generate`
  - Seed database: `npm run db:seed`
  - Seed with demo data (using dummy products API): `npm run db:seed:demo`
  - Open Prisma Studio: `npx prisma studio`

### Python AI Service
- **Install dependencies**: `cd ai-service && pip install -r requirements.txt`
- **Run development server**: `uvicorn main:app --reload --port 8000`
- **Run tests**: `pytest`
- **Environment setup**: Copy `.env.example` to `.env` and configure variables (see below)

### Docker
- **Start all services**: `docker compose up --build`
  - Starts PostgreSQL (5432), AI service (8000), and Next.js (3000)

## 🔑 Environment Variables

### Frontend (`.env` in root)
| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | PostgreSQL connection string |
| `NEXTAUTH_SECRET` | Random secret for JWT encryption |
| `NEXTAUTH_URL` | `http://localhost:3000` |
| `STRIPE_SECRET_KEY` | Stripe secret key (sk_test_) |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Stripe publishable key (pk_test_) |
| `STRIPE_WEBHOOK_SECRET` | Stripe webhook signing secret (whsec_) |
| `AI_SERVICE_URL` | `http://localhost:8000` |
| `DUMMY_PRODUCTS_API_URL` | URL of dummy products API (default: `http://localhost:5050/api/v1`) |

### AI Service (`ai-service/.env`)
| Variable | Description |
|----------|-------------|
| `OPENCODE_API_KEY` | Opencode API key (if using Opencode) |
| `OPENCODE_BASE_URL` | Opencode API base URL (default: `https://opencode.ai/zen/v1`) |
| `OPENAI_API_KEY` | OpenAI API key (if using OpenAI) |
| `ANTHROPIC_API_KEY` | Anthropic API key (if using Claude) |
| `LLM_PROVIDER` | `opencode`, `openai`, or `anthropic` |
| `LLM_MODEL` | Model identifier (e.g., `big-pickle`, `claude-sonnet-4-6`) |

## 🏗️ Project Structure

### Frontend (`src/`)
- `app/` - Next.js App Router pages and API routes
  - `admin/` - Admin dashboard routes
  - `api/` - Backend API routes (products, orders, chat, analysis, etc.)
  - `products/` - Storefront product pages
  - `cart/` - Shopping cart
  - `checkout/` - Stripe checkout
- `components/` - React components
  - `storefront/` - Header, Footer, ProductCard, ChatWidget
  - `admin/` - Admin-specific components (Sidebar, ProductForm, etc.)
  - `ui/` - Reusable UI components (Button)
- `lib/` - Utility libraries (Prisma client, Stripe, Auth, AI client, Dummy Products service)
- `store/` - Zustand store for cart state

### AI Service (`ai-service/`)
- `main.py` - FastAPI application entry point
- `orchestrator.py` - Runs all analysis agents on product data
- `llm_client.py` - Abstracts LLM provider (OpenAI/Anthropic)
- `agents/` - Individual analysis agents (SEO, ContentQuality, ProductPage, Chat, QuarterlyReport)
- `tests/` - Pytest test suite

### Database (`prisma/`)
- `schema.prisma` - Database models (User, Product, Order, AnalysisResult, etc.)
- `seed.ts` - Seed script with sample products and admin user
- `seed-enhanced.ts` - Enhanced seed script that can fetch data from dummy products API

## 🔌 Dummy Products API Integration

The project includes integration with the [dummy-products-api](https://github.com/rookiemonkey/dummy-products-api) for enhanced product data and seeding capabilities.

### Features
- **Enhanced Seeding**: Use the dummy API to populate your database with realistic product data including images, ratings, reviews, and more
- **Product Service**: A TypeScript service for interacting with the dummy API
- **Flexible Usage**: Can be used for seeding, fallback data, or enriching existing products

### Files
- `src/lib/dummy-products.ts` - Service for communicating with the dummy products API
- `prisma/seed-enhanced.ts` - Enhanced seed script that can fetch from the dummy API
- Environment variable: `DUMMY_PRODUCTS_API_URL` (defaults to `http://localhost:5050/api/v1`)

### Usage

1. **Seed with dummy data**:
   ```bash
   npm run db:seed:demo
   ```
   This will:
   - Fetch products from the dummy products API (running on localhost:5050 by default)
   - Transform and insert them into your local PostgreSQL database
   - Fallback to hardcoded samples if the API is unavailable

2. **Manual usage in code**:
   ```typescript
   import { DummyProductsService } from '@/lib/dummy-products';

   // Get all products
   const products = await DummyProductsService.getAllProducts();

   // Search products
   const shoes = await DummyProductsService.searchProducts('running shoes');

   // Get product by ID
   const product = await DummyProductsService.getProductById('product-id-here');

   // Get products by department
   const electronics = await DummyProductsService.getProductsByDepartment('electronics');
   ```

### Setting up the Dummy Products API
To use the enhanced seeding feature, you need to run the dummy products API:

1. Clone the repository: `git clone https://github.com/rookiemonkey/dummy-products-api.git`
2. Install dependencies: `cd dummy-products-api && yarn install`
3. Set up MongoDB (the API uses MongoDB by default)
4. Configure environment variables (copy `.env.example` to `.env`)
5. Start the API: `yarn server` (runs on port 5050 by default)

### Configuration
Add the following to your frontend `.env` file if you want to customize the dummy API URL:
```
DUMMY_PRODUCTS_API_URL=http://your-dummy-api-host:port/api/v1
```

## 🧪 Testing

### Frontend
- E2E and component tests are not configured by default. Use `next test` if you set up Jest/Vitest.

### Backend
- Run tests: `cd ai-service && pytest`
- Tests cover LLM client, agents, orchestrator, and API endpoints.

## 🔧 Changing the AI Model

The AI service uses either OpenAI or Anthropic LLMs, controlled by environment variables in `ai-service/.env`:

1. **Set the provider**:
   - `LLM_PROVIDER=openai` for OpenAI models
   - `LLM_PROVIDER=anthropic` for Anthropic (Claude) models

2. **Set the model**:
   - For OpenAI: `LLM_MODEL=gpt-4o` (or `gpt-4-turbo`, `gpt-3.5-turbo`, etc.)
   - For Anthropic: `LLM_MODEL=claude-sonnet-4-20250514` (or `claude-3-opus-20240229`, `claude-3-haiku-20240307`, etc.)

3. **Provide the API key**:
   - Set `OPENAI_API_KEY` if using OpenAI
   - Set `ANTHROPIC_API_KEY` if using Anthropic

4. **Restart the AI service** after changing `.env`:
   ```bash
   cd ai-service
   uvicorn main:app --reload --port 8000
   ```

### Supported Models
The LLM client in `llm_client.py` passes the model string directly to the provider's API, so any model supported by the respective provider's SDK should work.

## 📚 Key Files to Understand

- **Routing**: `src/app/layout.tsx` (root layout), `src/app/page.tsx` (homepage)
- **Authentication**: `src/lib/auth.ts` (NextAuth configuration), `src/app/api/auth/[...nextauth]/route.ts`
- **Database**: `prisma/schema.prisma` (models), `src/lib/prisma.ts` (Prisma client singleton)
- **Payments**: `src/lib/stripe.ts` (Stripe client), `src/app/api/checkout/route.ts` (checkout session)
- **AI Integration**: `src/lib/ai-client.ts` (wrapper for AI service), `src/app/api/chat/route.ts` (chat proxy)
- **Dummy Products**: `src/lib/dummy-products.ts` (service for dummy products API)
- **Admin UI**: `src/app/admin/layout.tsx` (admin layout), `src/components/admin/` (admin components)

## 🐳 Docker Notes
- The `docker-compose.yml` defines three services: `db` (PostgreSQL), `ai-service`, and `nextjs`.
- When developing, it's often easier to run services locally for faster iteration (Next.js dev server, AI service with hot reload).
- For Stripe webhooks locally, use: `stripe listen --forward-to localhost:3000/api/webhooks/stripe`

## 📝 Notes
- The admin user is seeded with email `admin@store.com` and password `admin123` (change after first login).
- The AI service requires a valid LLM API key to function; without it, analysis features will fail.
- Prisma Studio provides a GUI for inspecting and modifying the database.
- The dummy products API integration is optional - the application works perfectly without it, but it provides enhanced seeding capabilities and access to richer product data for demo/development purposes.