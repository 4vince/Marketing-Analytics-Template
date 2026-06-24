// AI service HTTP client — sends product data to the Python AI service for analysis.
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
