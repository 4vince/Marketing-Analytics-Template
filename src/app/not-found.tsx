import Link from "next/link";

// Custom 404 page — dark-themed with animated star icon.
export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
      <div className="text-8xl text-primary-500 mb-6 font-black">404</div>
      <h1 className="text-3xl font-bold text-white mb-4">Page Not Found</h1>
      <p className="text-[#888] mb-8 max-w-md">
        The page you&apos;re looking for doesn&apos;t exist or has been moved.
      </p>
      <Link
        href="/"
        className="bg-primary-500 text-white px-8 py-3 rounded-xl font-semibold hover:bg-primary-600 transition-colors no-underline"
      >
        Back to Home
      </Link>
    </div>
  );
}
