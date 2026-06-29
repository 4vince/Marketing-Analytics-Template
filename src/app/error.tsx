"use client";

// Root error boundary — dark-themed error state with retry and home link.
export default function RootError({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
      <div className="text-6xl mb-6">&#9888;</div>
      <h1 className="text-3xl font-bold text-white mb-4">Something went wrong</h1>
      <p className="text-[#888] mb-8 max-w-md">
        An unexpected error occurred. Please try again or return to the homepage.
      </p>
      <div className="flex gap-4">
        <button
          onClick={reset}
          className="bg-primary-500 text-white px-6 py-3 rounded-xl font-semibold hover:bg-primary-600 transition-colors"
        >
          Try Again
        </button>
        <a
          href="/"
          className="border border-[#333] text-[#e0e0e0] px-6 py-3 rounded-xl font-semibold hover:bg-[#1e1e1e] transition-colors"
        >
          Go Home
        </a>
      </div>
    </div>
  );
}
