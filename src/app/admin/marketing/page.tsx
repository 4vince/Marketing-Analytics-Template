// Marketing Intelligence dashboard — site score, per-product analysis results, quarterly reports.
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
      <h1 className="text-2xl font-display font-semibold text-brand-warm-white mb-8">Marketing Intelligence</h1>

      {avgScore !== null && (
        <div className="bg-brand-clay border border-brand-fence rounded-xl p-6 mb-8">
          <p className="text-xs text-brand-muted uppercase tracking-wider font-medium">Overall Site Score</p>
          <p className="text-3xl font-display font-semibold text-primary-500 mt-1">{avgScore}/100</p>
        </div>
      )}

      <div className="space-y-5">
        {products.map((product) => {
          const productResults = Array.from(latestResults.values()).filter((r) => r.productId === product.id);
          const avg = productResults.length > 0
            ? Math.round(productResults.reduce((s, r) => s + r.score, 0) / productResults.length)
            : null;

          return (
            <div key={product.id} className="bg-brand-clay border border-brand-fence rounded-xl p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-display font-semibold text-brand-warm-white text-lg">{product.name}</h3>
                  {avg !== null && <p className="text-sm text-brand-muted mt-0.5">Score: {avg}/100</p>}
                </div>
                <AnalyzeButton productId={product.id} />
              </div>
              {productResults.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {productResults.slice(0, 3).map((r) => (
                    <div key={r.id} className="bg-brand-risen border border-brand-fence rounded-lg p-4">
                      <p className="text-[10px] font-medium text-brand-muted uppercase tracking-wider">{r.agentType}</p>
                      <p className="text-lg font-display font-semibold text-brand-warm-white mt-1">{r.score}/100</p>
                      <ul className="mt-2 space-y-1">
                        {(r.findings as Array<{ issue: string; severity: string }>).slice(0, 2).map((f, i) => (
                          <li key={i} className="text-xs text-brand-muted">• {f.issue}</li>
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
          <h2 className="text-xl font-display font-semibold text-brand-warm-white">Quarterly Reports</h2>
          <form action="/api/report/generate" method="POST">
            <button type="submit"
              className="bg-primary-500 text-brand-warm-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-primary-600 transition-all shadow-lg shadow-primary-500/20">
              Generate Report
            </button>
          </form>
        </div>
        {reports.length === 0 ? (
          <p className="text-brand-muted text-sm">No reports yet. Click &quot;Generate Report&quot; to create one.</p>
        ) : (
          <div className="space-y-3">
            {reports.map((report) => (
              <div key={report.id} className="bg-brand-clay border border-brand-fence rounded-xl p-5">
                <p className="font-display font-semibold text-brand-warm-white">
                  {new Date(report.periodStart).toLocaleDateString()} — {new Date(report.periodEnd).toLocaleDateString()}
                </p>
                {report.overallScore !== null && (
                  <p className="text-sm text-brand-muted mt-0.5">Score: {report.overallScore}/100</p>
                )}
                <p className="text-sm text-brand-muted mt-2 leading-relaxed">{report.summary.slice(0, 200)}...</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
