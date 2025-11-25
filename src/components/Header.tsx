'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface HeaderProps {
  leagueName?: string;
  season?: string;
}

export function Header({ leagueName = 'Cool Fun Guy League', season }: HeaderProps) {
  const router = useRouter();

  const handleLogout = async () => {
    await fetch('/api/auth', { method: 'DELETE' });
    router.push('/');
    router.refresh();
  };

  return (
    <header className="sticky top-0 z-50 bg-dynasty-bg/80 backdrop-blur-lg border-b border-dynasty-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo/Title */}
          <Link href="/dashboard" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-dynasty-accent to-dynasty-gold flex items-center justify-center">
              <span className="text-sm font-bold text-dynasty-bg">CFG</span>
            </div>
            <div>
              <h1 className="text-lg font-bold text-white">
                {leagueName}
              </h1>
              {season && (
                <p className="text-xs text-dynasty-silver">{season} Season</p>
              )}
            </div>
          </Link>

          {/* Navigation */}
          <nav className="flex items-center gap-6">
            <Link
              href="/dashboard"
              className="text-sm text-dynasty-silver hover:text-white transition-colors"
            >
              Teams
            </Link>
            <button
              onClick={handleLogout}
              className="text-sm text-dynasty-silver hover:text-red-400 transition-colors"
            >
              Logout
            </button>
          </nav>
        </div>
      </div>
    </header>
  );
}





