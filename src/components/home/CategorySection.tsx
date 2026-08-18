import Link from "next/link";
import Image from "next/image";

const CATEGORIES: { name: string; image: string; category: string }[] = [
  {
    name: "Dresses",
    image:
      "https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=1200&q=80",
    category: "Dresses",
  },
  {
    name: "Trousers",
    image:
      "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=1200&q=80",
    category: "Trousers",
  },
  {
    name: "Co-ords",
    image:
      "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=1200&q=80",
    category: "Co-ords",
  },
  {
    name: "Accessories",
    image:
      "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1200&q=80",
    category: "Accessories",
  },
];

export default function CategorySection({ counts }: { counts: Record<string, number> }) {
  return (
    <section className="mx-auto max-w-7xl px-6 py-16 sm:px-8 sm:py-20">
      <div className="mb-8 flex items-end justify-between">
        <div>
          <h2 className="font-display text-3xl sm:text-4xl">Shop by Category</h2>
          <p className="mt-2 text-sm text-stone-600">Find your starting point.</p>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
        {CATEGORIES.map((cat) => (
          <Link key={cat.name} href={`/shop?category=${encodeURIComponent(cat.category)}`} className="group relative block overflow-hidden rounded-xl">
            <div className="relative aspect-[3/4]">
              <Image
                src={cat.image}
                alt={cat.name}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-110"
                sizes="(min-width: 1024px) 22vw, 45vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0" />
            </div>
            <div className="absolute bottom-4 left-4 text-white">
              <p className="font-display text-xl">{cat.name}</p>
              {counts[cat.category] ? (
                <p className="text-xs text-white/80">{counts[cat.category]} pieces</p>
              ) : null}
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
