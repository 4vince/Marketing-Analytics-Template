### Task 12: Connect Next.js to AI Service

**Files:**
- Create: `src/lib/ai-client.ts`
- Create: `src/app/api/analysis/route.ts`

**Interfaces:**
- Consumes: Python AI service HTTP endpoints
- Produces: `/api/analysis` — proxies analysis requests to Python service

- [ ] **Step 1: Create AI client src/lib/ai-client.ts**

```ts
const AI_SERVICE_URL = process.env.AI_SERVICE_URL || "http://localhost:8000";

export async function runProductAnalysis(productData: Record<string, unknown>) {
  const res = await fetch(`${AI_SERVICE_URL}/analyze/product`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(productData),
  });
  if (!res.ok) throw new Error("Analysis failed");
  return res.json();
}
```

- [ ] **Step 2: Create analysis API route src/app/api/analysis/route.ts**

```ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const AI_SERVICE = process.env.AI_SERVICE_URL || "http://localhost:8000";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { productId } = await req.json();
  const product = await prisma.product.findUnique({ where: { id: productId } });
  if (!product) return NextResponse.json({ error: "Product not found" }, { status: 404 });

  const aiRes = await fetch(`${AI_SERVICE}/analyze/product`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(product),
  });

  if (!aiRes.ok) return NextResponse.json({ error: "AI service error" }, { status: 502 });

  const results = await aiRes.json();

  for (const [agentType, result] of Object.entries(results)) {
    await prisma.analysisResult.create({
      data: {
        productId: product.id,
        agentType,
        score: (result as { score: number }).score,
        findings: (result as { findings: unknown }).findings,
        suggestions: (result as { suggestions: unknown }).suggestions,
      },
    });
  }

  return NextResponse.json(results);
}

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const productId = searchParams.get("productId");

  const where = productId ? { productId } : {};
  const results = await prisma.analysisResult.findMany({
    where,
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(results);
}
```

- [ ] **Step 3: Add analyze endpoint to Python service**

Add to `ai-service/main.py`:
```python
from orchestrator import Orchestrator
from fastapi import HTTPException

orchestrator = Orchestrator()


@app.post("/analyze/product")
async def analyze_product(data: dict):
    try:
        results = orchestrator.run_all_analyses(data)
        return {name: result.model_dump() for name, result in results.items()}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
```

- [ ] **Step 4: Verify**

```bash
cd D:\ecommerce-template && npx next build 2>&1 | findstr /V "Info"
```

- [ ] **Step 5: Commit**

```bash
git add . && git commit -m "feat: connect next.js to ai service for product analysis"
```

---


