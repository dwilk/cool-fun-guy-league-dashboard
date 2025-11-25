'use client';

import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

function LoginForm() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });

      if (res.ok) {
        const redirect = searchParams.get('redirect') || '/dashboard';
        router.push(redirect);
        router.refresh();
      } else {
        const data = await res.json();
        setError(data.error || 'Invalid password');
      }
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-dynasty-card border border-dynasty-border rounded-2xl p-8 shadow-xl">
      <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-dynasty-silver mb-2">
                League Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-dynasty-bg border border-dynasty-border rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-dynasty-accent focus:border-transparent transition-all"
                placeholder="Enter password"
                required
                disabled={isLoading}
              />
            </div>

            {error && (
              <div className="text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-3">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 bg-gradient-to-r from-dynasty-accent to-dynasty-gold text-dynasty-bg font-semibold rounded-lg hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-dynasty-accent focus:ring-offset-2 focus:ring-offset-dynasty-card transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Entering...
                </span>
              ) : (
                'Enter League'
              )}
            </button>
          </form>
        </div>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-dynasty-bg via-dynasty-card to-dynasty-bg" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-dynasty-accent/10 via-transparent to-transparent" />
      
      <div className="relative w-full max-w-md">
        {/* Logo/Title */}
        <div className="text-center mb-8">
          <div className="inline-block mb-4">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-dynasty-accent to-dynasty-gold flex items-center justify-center mx-auto shadow-lg shadow-dynasty-accent/20">
              <span className="text-3xl font-bold text-dynasty-bg">CFG</span>
            </div>
          </div>
          <h1 className="text-3xl font-heading font-bold text-white mb-2">
            Cool Fun Guy League
          </h1>
          <p className="text-dynasty-silver">Dynasty Fantasy Football</p>
        </div>

        {/* Login Card wrapped in Suspense */}
        <Suspense fallback={
          <div className="bg-dynasty-card border border-dynasty-border rounded-2xl p-8 shadow-xl">
            <div className="text-center text-dynasty-silver">Loading...</div>
          </div>
        }>
          <LoginForm />
        </Suspense>

        <p className="text-center text-dynasty-silver/60 text-sm mt-6">
          Contact your commissioner for access
        </p>
      </div>
    </div>
  );
}



