"use client";

import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import Link from "next/link";

export default function SignInPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const error = searchParams.get("error");
  const callbackUrl = searchParams.get("callbackUrl") || "/admin";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Check if already authenticated — redirect straight to admin
    fetch("/api/auth/session")
      .then((r) => r.json())
      .then((session) => {
        if (session?.user) router.push(callbackUrl);
      })
      .catch(() => {});
  }, [router, callbackUrl]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });
    setLoading(false);
    if (result?.ok) {
      router.push(callbackUrl);
      router.refresh();
    }
  };

  return (
    <div className="min-h-screen bg-brand-pitch flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        {/* Brand mark */}
        <div className="text-center mb-10">
          <div className="w-14 h-14 bg-primary-500 rounded-2xl flex items-center justify-center text-brand-warm-white font-display font-bold text-2xl mx-auto mb-4 shadow-lg shadow-primary-500/25">
            C
          </div>
          <h1 className="text-2xl font-display font-semibold text-brand-warm-white">
            Admin Sign In
          </h1>
          <p className="text-sm text-brand-muted mt-1.5">
            Sign in to manage your store
          </p>
        </div>

        {/* Error state */}
        {error && (
          <div className="bg-primary-500/10 border border-primary-500/30 rounded-xl px-4 py-3 mb-6">
            <p className="text-sm text-primary-500 font-medium">
              {error === "CredentialsSignin"
                ? "Invalid email or password. Try again."
                : "Something went wrong. Please try again."}
            </p>
          </div>
        )}

        {/* Sign-in form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-brand-muted mb-1.5"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@store.com"
              required
              autoFocus
              className="w-full bg-brand-risen border border-brand-fence rounded-xl px-4 py-2.5 text-sm text-brand-warm-white placeholder-brand-muted/50 focus:outline-none focus:border-primary-500/50 focus:ring-1 focus:ring-primary-500/30 transition-all"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-brand-muted mb-1.5"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="w-full bg-brand-risen border border-brand-fence rounded-xl px-4 py-2.5 text-sm text-brand-warm-white placeholder-brand-muted/50 focus:outline-none focus:border-primary-500/50 focus:ring-1 focus:ring-primary-500/30 transition-all"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary-500 text-brand-warm-white px-6 py-2.5 rounded-xl text-sm font-medium hover:bg-primary-600 disabled:opacity-40 transition-all shadow-lg shadow-primary-500/20 mt-2"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Signing in...
              </span>
            ) : (
              "Sign In"
            )}
          </button>
        </form>

        {/* Back link */}
        <div className="text-center mt-8">
          <Link
            href="/"
            className="text-sm text-brand-muted hover:text-brand-warm-white transition-colors"
          >
            ← Back to storefront
          </Link>
        </div>
      </div>
    </div>
  );
}
