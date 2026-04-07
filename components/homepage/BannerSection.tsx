import Image from "next/image";
import Link from "next/link";

export function BannerSection({
  data,
}: {
  data: {
    image?: string;
    href?: string;
    alt?: string;
    overlayText?: string;
  };
}) {
  if (!data.image) return null;
  const inner = (
    <div className="relative aspect-[21/6] w-full overflow-hidden rounded-xl border border-border bg-muted">
      <Image
        src={data.image}
        alt={data.alt ?? ""}
        fill
        className="object-cover"
        sizes="100vw"
      />
      {data.overlayText ? (
        <div className="absolute inset-0 flex items-center justify-center bg-black/30">
          <p className="text-2xl font-semibold text-white">{data.overlayText}</p>
        </div>
      ) : null}
    </div>
  );
  if (data.href) {
    return (
      <section>
        <Link href={data.href}>{inner}</Link>
      </section>
    );
  }
  return <section>{inner}</section>;
}
