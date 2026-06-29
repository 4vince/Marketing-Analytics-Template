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
    <button
      onClick={handleClick}
      disabled={loading}
      className="inline-flex items-center gap-2 bg-brand-risen text-brand-muted border border-brand-fence px-3 py-1.5 rounded-lg text-xs font-medium hover:text-primary-500 hover:border-primary-500/30 disabled:opacity-40 transition-all"
    >
      {loading ? (
        <>
          <svg className="animate-spin h-3.5 w-3.5" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          Analyzing...
        </>
      ) : (
        <>
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456z" />
          </svg>
          Analyze
        </>
      )}
    </button>
  );
}
