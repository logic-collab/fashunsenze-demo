import Image from "next/image";

const IMAGES = [
  "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=80",
];

export default function InstagramBridge({ instagramUrl }: { instagramUrl: string }) {
  return (
    <section className="mx-auto max-w-7xl px-6 py-16 sm:px-8 sm:py-20">
      <div className="mb-8 flex flex-col items-center text-center">
        <h2 className="font-display text-3xl sm:text-4xl">Seen us on Instagram?</h2>
        <p className="mt-2 max-w-md text-sm text-stone-600">
          FashunSënze has been sharing pieces on Instagram since 2017. Now you can shop them here directly.
        </p>
        <a
          href={instagramUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-5 rounded-full border border-stone-300 px-6 py-2.5 text-sm font-semibold transition hover:bg-stone-100"
        >
          Follow FashunSënze
        </a>
      </div>
      <div className="grid grid-cols-3 gap-2 sm:grid-cols-6 sm:gap-3">
        {IMAGES.map((src) => (
          <div key={src} className="relative aspect-square overflow-hidden rounded-md">
            <Image src={src} alt="FashunSënze styling" fill className="object-cover" sizes="200px" />
          </div>
        ))}
      </div>
    </section>
  );
}
