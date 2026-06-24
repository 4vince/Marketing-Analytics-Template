### Task 16: Quarterly Report Agent + UI

**Files:**
- Modify: `ai-service/agents/quarterly_report.py`
- Modify: `ai-service/main.py` (add report endpoint)
- Modify: `src/app/admin/marketing/page.tsx` (add report section)

**Interfaces:**
- Produces: `/api/report/generate` — generates quarterly report from stored analysis data
- Consumes: Prisma `AnalysisResult` records via Next.js proxy

- [ ] **Step 1: Create quarterly report agent**

```python
from .base import BaseAgent, AnalysisResult
from llm_client import LLMClient


class QuarterlyReportAgent(BaseAgent):
    def __init__(self):
        self.llm = LLMClient()

    def analyze(self, content: dict) -> AnalysisResult:
        analyses = content.get("analyses", [])
        summary = f"""
Analyze these {len(analyses)} product analyses from the last quarter:

{chr(10).join(f"- {a.get('agentType', 'unknown')}: {a.get('score', 0)}/100" for a in analyses[:20])}

Produce a report with:
1. Overall score and trends
2. Most common issues found
3. Top 3 priorities for the next quarter
4. Action plan with effort estimates

Return JSON: {{"score": int, "findings": [{{"issue": str, "severity": str, "detail": str, "count": int}}], "suggestions": [{{"area": str, "suggestion": str, "effort": "low"/"medium"/"high"}}]}}
"""
        result = self.llm.chat("You are an expert e-commerce strategy analyst.", summary)

        import json
        try:
            data = json.loads(result)
            return AnalysisResult(**data)
        except json.JSONDecodeError:
            return AnalysisResult(score=50, findings=[], suggestions=[])
```

- [ ] **Step 2: Add report endpoint to Python service**

Add to `ai-service/main.py`:
```python
from agents.quarterly_report import QuarterlyReportAgent


@app.post("/analyze/report")
async def generate_report(data: dict):
    agent = QuarterlyReportAgent()
    result = agent.analyze(data)
    return result.model_dump()
```

- [ ] **Step 3: Add report section to admin marketing page**

Extend `src/app/admin/marketing/page.tsx` to include a "Generate Report" button and list past reports — add below the product analysis section.

Add, at the top of the component, a fetch for reports:
```tsx
const reports = await prisma.quarterlyReport.findMany({ orderBy: { createdAt: "desc" } });
```

Add before the closing `</div>`:
```tsx
{/* Quarterly Reports */}
<div className="mt-12">
  <div className="flex justify-between items-center mb-4">
    <h2 className="text-xl font-semibold">Quarterly Reports</h2>
    <form action="/api/report/generate" method="POST">
      <button type="submit" className="bg-primary-600 text-white px-4 py-2 rounded">
        Generate Report
      </button>
    </form>
  </div>
  {reports.length === 0 ? (
    <p className="text-gray-500">No reports yet. Click "Generate Report" to create one.</p>
  ) : (
    <div className="space-y-3">
      {reports.map((report) => (
        <div key={report.id} className="bg-white p-4 rounded-lg border">
          <p className="font-semibold">
            {new Date(report.periodStart).toLocaleDateString()} — {new Date(report.periodEnd).toLocaleDateString()}
          </p>
          {report.overallScore !== null && (
            <p className="text-sm text-gray-500">Score: {report.overallScore}/100</p>
          )}
          <p className="text-sm mt-1">{report.summary.slice(0, 200)}...</p>
        </div>
      ))}
    </div>
  )}
</div>
```

- [ ] **Step 4: Add report API route**

Create `src/app/api/report/generate/route.ts`:
```ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const AI_SERVICE = process.env.AI_SERVICE_URL || "http://localhost:8000";

export async function POST() {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const ninetyDaysAgo = new Date();
  ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);

  const analyses = await prisma.analysisResult.findMany({
    where: { createdAt: { gte: ninetyDaysAgo } },
  });

  const aiRes = await fetch(`${AI_SERVICE}/analyze/report`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ analyses }),
  });
  const result = await aiRes.json();

  await prisma.quarterlyReport.create({
    data: {
      periodStart: ninetyDaysAgo,
      periodEnd: new Date(),
      overallScore: result.score,
      summary: result.findings.map((f: { issue: string }) => f.issue).join(". "),
      sections: { findings: result.findings, suggestions: result.suggestions },
    },
  });

  return NextResponse.json({ success: true });
}
```

- [ ] **Step 5: Build and commit**

```bash
cd D:\ecommerce-template && npx next build 2>&1 | findstr /V "Info"
git add . && git commit -m "feat: add quarterly report generation and UI"
```

---


