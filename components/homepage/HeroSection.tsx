import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface HeroData {
  headline?: string;
  subheadline?: string;
  ctaText?: string;
  ctaHref?: string;
  bgImage?: string;
}

export function HeroSection({ data }: { data: HeroData }) {
  const headline = data.headline ?? "New season";
  const sub = data.subheadline ?? "Elevated essentials for everyday.";
  const cta = data.ctaText ?? "Shop now";
  const href = data.ctaHref ?? "/products";
  return (
    <section className="relative overflow-hidden rounded-2xl border border-border bg-muted">
      {data.bgImage ? (
        <div className="absolute inset-0">
          <Image
            src={data.bgImage}
            alt=""
            fill
            className="object-cover opacity-90"
            priority
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-background/90 to-background/20" />
        </div>
      ) : null}
      <div className="relative px-6 py-24 sm:px-12 sm:py-32 lg:px-16">
        <h1 className="max-w-xl text-4xl font-bold tracking-tight sm:text-5xl">
          {headline}
        </h1>
        <p className="mt-4 max-w-lg text-lg text-muted-foreground">{sub}</p>
        <Button asChild className="mt-8" size="lg">
          <Link href={href}>{cta}</Link>
        </Button>
      </div>
    </section>
  );
}
