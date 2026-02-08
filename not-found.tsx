import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#fafafa] flex items-center justify-center p-4">
      <div className="text-center max-w-md">
        <div className="mb-8">
          <h1 className="text-[120px] font-bold text-black leading-none tracking-tight" style={{ fontFamily: 'system-ui' }}>
            404
          </h1>
        </div>
        <h2 className="text-2xl font-semibold text-black mb-3">Page not found</h2>
        <p className="text-neutral-500 mb-8">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <div className="flex items-center justify-center gap-4">
          <Link
            href="/"
            className="px-6 py-3 bg-black text-white text-sm font-medium rounded-full hover:bg-black/80 transition"
          >
            Go Home
          </Link>
          <Link
            href="/portal"
            className="px-6 py-3 border border-neutral-300 text-black text-sm font-medium rounded-full hover:bg-neutral-50 transition"
          >
            My Portal
          </Link>
        </div>
      </div>
    </div>
  );
}
