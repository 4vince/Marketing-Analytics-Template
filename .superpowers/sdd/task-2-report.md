# Task 2: Storefront Layout + Home Page — Report

## Status: DONE

## Files Created
- `src/app/layout.tsx` — Root layout with Header + Footer
- `src/app/page.tsx` — Home page with hero and featured products (dynamic rendering)
- `src/components/storefront/Header.tsx` — Site header with navigation links
- `src/components/storefront/Footer.tsx` — Site footer with copyright
- `src/components/storefront/ProductCard.tsx` — Product card component
- `src/components/storefront/ProductGrid.tsx` — Responsive product grid

## Build Verification
`npx next build` — **PASSED**
- Compiled successfully, types valid
- Home page marked as `ƒ (Dynamic)` (server-rendered on demand)
- All static pages generated without errors

## Commits
- `e46ce15` — `feat: add storefront layout, home page, product grid`

## Self-Review Findings
1. **Type fix:** Prisma returns `images` as `JsonValue`, not `string[]`. Added explicit mapping in `page.tsx` to cast `images as string[]`.
2. **Dynamic rendering:** Added `export const dynamic = "force-dynamic"` to home page so it renders at request time (prevents build failure when no database is available).

## Concerns
- Requires `DATABASE_URL` environment variable at runtime for Prisma queries to work.
