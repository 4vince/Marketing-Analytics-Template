import Link from "next/link";

// Custom 404 page — warm-dark themed with red accent.
export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
      <div className="text-8xl text-primary-500 mb-6 font-display font-bold">404</div>
      <h1 className="text-3xl font-display font-semibold text-brand-warm-white mb-4">Page Not Found</h1>
      <p className="text-brand-muted mb-8 max-w-md">
        The page you&apos;re looking for doesn&apos;t exist or has been moved.
      </p>
      <Link
        href="/"
        className="bg-primary-500 text-brand-warm-white px-8 py-3 rounded-xl font-semibold hover:bg-primary-600 transition-colors no-underline shadow-lg shadow-primary-500/20"
      >
        Back to Home
      </Link>
    </div>
  );
}
