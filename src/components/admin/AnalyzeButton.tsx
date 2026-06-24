// AI analysis trigger button — POSTs to /api/analysis for a product and refreshes page.
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
