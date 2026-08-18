const STEPS = [
  { title: "Browse", desc: "Explore current pieces from the edit." },
  { title: "Choose", desc: "Select your size and colour options." },
  { title: "Pay", desc: "Checkout securely online." },
  { title: "Receive", desc: "Nationwide delivery to your door." },
];

export default function ShopWithUs() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-16 sm:px-8 sm:py-20">
      <div className="mb-10 text-center">
        <h2 className="font-display text-3xl sm:text-4xl">Shop With Us</h2>
        <p className="mt-2 text-sm text-stone-600">From discovery to your doorstep.</p>
      </div>
      <div className="grid grid-cols-2 gap-6 sm:grid-cols-4">
        {STEPS.map((step, i) => (
          <div key={step.title} className="text-center">
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full border border-stone-300 font-display text-lg">
              {i + 1}
            </div>
            <p className="text-sm font-semibold">{step.title}</p>
            <p className="mt-1 text-xs text-stone-500">{step.desc}</p>
          </div>
        ))}
      </div>
      <p className="mt-8 text-center text-xs text-stone-500">
        Need help? <span className="font-medium text-[var(--color-ink)]">WhatsApp the store any time.</span>
      </p>
    </section>
  );
}
