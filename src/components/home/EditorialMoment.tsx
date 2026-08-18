import Image from "next/image";

export default function EditorialMoment({
  image,
  text,
  align = "left",
}: {
  image: string;
  text: string;
  align?: "left" | "right";
}) {
  return (
    <section className="relative flex h-[70vh] min-h-[420px] items-end overflow-hidden">
      <Image src={image} alt="" fill className="object-cover" sizes="100vw" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
      <div className={`relative z-10 mx-auto w-full max-w-7xl px-6 pb-12 sm:px-8 sm:pb-16 ${align === "right" ? "text-right" : ""}`}>
        <p className="font-display max-w-xl text-[clamp(1.8rem,4vw,3rem)] leading-[1.1] text-white">{text}</p>
      </div>
    </section>
  );
}
