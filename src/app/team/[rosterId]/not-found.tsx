import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-dynasty-bg flex items-center justify-center px-4">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-dynasty-accent mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-white mb-4">Team Not Found</h2>
        <p className="text-dynasty-silver mb-8">
          The team you&apos;re looking for doesn&apos;t exist or has been removed.
        </p>
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 px-6 py-3 bg-dynasty-accent text-dynasty-bg font-semibold rounded-lg hover:opacity-90 transition-opacity"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Dashboard
        </Link>
      </div>
    </div>
  );
}






