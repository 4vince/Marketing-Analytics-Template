import { prisma } from "@/lib/prisma";
import AnalyzeButton from "@/components/admin/AnalyzeButton";

export default async function MarketingPage() {
  const [products, results, reports] = await Promise.all([
    prisma.product.findMany({ where: { status: "active" }, orderBy: { createdAt: "desc" } }),
    prisma.analysisResult.findMany({ orderBy: { createdAt: "desc" } }),
    prisma.quarterlyReport.findMany({ orderBy: { createdAt: "desc" } }),
  ]);

  const latestResults = new Map<string, (typeof results)[number]>();
  for (const r of results) {
    if (r.productId) {
      const key = `${r.productId}-${r.agentType}`;
      if (!latestResults.has(key)) latestResults.set(key, r);
    }
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
          const productResults = Array.from(latestResults.values()).filter((r) => r.productId === product.id);
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
    </div>
  );
}
