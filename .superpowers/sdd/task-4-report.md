# Task 4 Report: Cart + Checkout with Stripe

## Status
✅ Complete

## Commits
9350f15 - feat: add cart store, cart page, and stripe checkout

## Build Verification
- `npx next build` — passed with 0 errors
- All routes compiled: `/cart`, `/checkout`, `/api/checkout`, `/products`

## Files Created/Modified
| File | Action |
|------|--------|
| `src/store/cart-store.ts` | Replaced stub with full zustand+persist store |
| `src/components/storefront/CartItem.tsx` | Created cart item component |
| `src/app/cart/page.tsx` | Created cart page |
| `src/app/checkout/page.tsx` | Created checkout page |
| `src/lib/stripe.ts` | Created Stripe client (lazy init) |
| `src/app/api/checkout/route.ts` | Created checkout API route |
| `.env.example` | Added `STRIPE_WEBHOOK_SECRET` |

## Deviations from Brief
1. **Stripe API version**: Used `"2024-11-20.acacia" as any` type cast because the installed `stripe@22` package's `StripeConfig.apiVersion` type is a literal `"2026-05-27.dahlia"` (LatestApiVersion). The brief's exact value is valid at runtime but wider than the TypeScript union type.
2. **Lazy Stripe initialization**: Wrapped in `getStripe()` function instead of eager `new Stripe()` to avoid build-time crash when `STRIPE_SECRET_KEY` is undefined during `next build`.
3. **Upgraded stripe**: `stripe@15` → `stripe@22` to get the `"2024-11-20.acacia"` API version support.

## Concerns
- Checkout page uses `window.location.href` for Stripe redirect, which generates a harmless `location is not defined` warning during SSR build — works correctly client-side.
