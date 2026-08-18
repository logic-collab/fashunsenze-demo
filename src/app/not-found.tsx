import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-lg flex-col items-center justify-center px-6 text-center">
      <p className="font-display text-6xl">404</p>
      <h1 className="mt-4 font-display text-3xl">That piece isn&apos;t here.</h1>
      <p className="mt-2 text-sm text-stone-600">The page you&apos;re looking for may have sold out or moved.</p>
      <div className="mt-8 flex gap-4">
        <Link href="/" className="rounded-full bg-[var(--color-ink)] px-6 py-3 text-sm font-semibold text-white">
          Back to Home
        </Link>
        <Link href="/shop" className="rounded-full border border-stone-300 px-6 py-3 text-sm font-semibold">
          Shop New Arrivals
        </Link>
      </div>
    </div>
  );
}
