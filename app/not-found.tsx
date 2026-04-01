import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="min-h-screen flex items-center justify-center p-6">
      <div className="text-center">
        <h1 className="text-6xl font-display font-bold mb-4">404</h1>
        <p className="text-lg text-sm-muted mb-8">Page not found.</p>
        <Link
          href="/"
          className="px-6 py-3 bg-white text-black font-semibold rounded-lg hover:bg-white/90 transition-colors"
        >
          Back to Home
        </Link>
      </div>
    </main>
  );
}
