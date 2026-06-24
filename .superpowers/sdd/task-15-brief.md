### Task 15: Marketing Intelligence Dashboard

**Files:**
- Create: `src/app/admin/marketing/page.tsx`
- Create: `src/components/ui/Button.tsx`
- Create: `src/components/ui/Modal.tsx`

**Interfaces:**
- Consumes: `/api/analysis` from Task 12
- Produces: Admin marketing tab with site overview and per-product analysis

- [ ] **Step 1: Create UI Button component src/components/ui/Button.tsx**

```tsx
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary";
}

export default function Button({ variant = "primary", className = "", children, ...props }: ButtonProps) {
  const base = variant === "primary" ? "bg-primary-600 text-white hover:bg-primary-700" : "border hover:bg-gray-50";
  return (
    <button className={`px-4 py-2 rounded ${base} disabled:opacity-50 ${className}`} {...props}>
      {children}
    </button>
  );
}
```

- [ ] **Step 1b: Create AnalyzeButton client component**

Create `src/components/admin/AnalyzeButton.tsx`:
```tsx
"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AnalyzeButton({ productId }: { productId: string }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleClick = async () => {
    setLoading(true);
    await fetch("/api/analysis", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productId }),
    });
    setLoading(false);
    router.refresh();
  };

  return (
    <button onClick={handleClick} disabled={loading}
      className="bg-primary-600 text-white px-4 py-2 rounded text-sm hover:bg-primary-700 disabled:opacity-50">
      {loading ? "Analyzing..." : "Analyze"}
    </button>
  );
}
```

- [ ] **Step 2: Create marketing intelligence page**

```tsx
import { prisma } from "@/lib/prisma";
import AnalyzeButton from "@/components/admin/AnalyzeButton";

export default async function MarketingPage() {
  const [products, results] = await Promise.all([
    prisma.product.findMany({ where: { status: "active" }, orderBy: { createdAt: "desc" } }),
    prisma.analysisResult.findMany({ orderBy: { createdAt: "desc" } }),
  ]);

  const latestResults = new Map<string, typeof results>();
  for (const r of results) {
    if (r.productId && !latestResults.has(r.productId)) {
      latestResults.set(r.productId, []);
    }
    if (r.productId) latestResults.get(r.productId)?.push(r);
  }

  const avgScore = results.length > 0
    ? Math.round(results.reduce((s, r) => s + r.score, 0) / results.length)
    : null;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-8">Marketing Intelligence</h1>

      {avgScore !== null && (
        <div className="bg-white p-6 rounded-lg border mb-8">
          <p className="text-sm text-gray-500">Overall Site Score</p>
          <p className="text-3xl font-bold text-primary-600">{avgScore}/100</p>
        </div>
      )}

      <div className="space-y-6">
        {products.map((product) => {
          const productResults = latestResults.get(product.id) || [];
          const avg = productResults.length > 0
            ? Math.round(productResults.reduce((s, r) => s + r.score, 0) / productResults.length)
            : null;

          return (
            <div key={product.id} className="bg-white p-6 rounded-lg border">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-semibold text-lg">{product.name}</h3>
                  {avg !== null && <p className="text-sm text-gray-500">Score: {avg}/100</p>}
                </div>
                <AnalyzeButton productId={product.id} />
              </div>
              {productResults.length > 0 && (
                <div className="grid grid-cols-3 gap-4">
                  {productResults.slice(0, 3).map((r) => (
                    <div key={r.id} className="bg-gray-50 p-3 rounded">
                      <p className="text-xs text-gray-500 uppercase">{r.agentType}</p>
                      <p className="text-lg font-bold">{r.score}/100</p>
                      <ul className="mt-1">
                        {(r.findings as Array<{ issue: string; severity: string }>).slice(0, 2).map((f, i) => (
                          <li key={i} className="text-xs text-gray-600">• {f.issue}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Build and commit**

```bash
cd D:\ecommerce-template && npx next build 2>&1 | findstr /V "Info"
git add . && git commit -m "feat: add marketing intelligence dashboard"
```

---


