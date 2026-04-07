import { getCachedHomepage } from "@/lib/cache";
import { HeroSection } from "@/components/homepage/HeroSection";
import { FeaturedCollections } from "@/components/homepage/FeaturedCollections";
import { FeaturedProducts } from "@/components/homepage/FeaturedProducts";
import { BannerSection } from "@/components/homepage/BannerSection";
import { NewsletterSection } from "@/components/homepage/NewsletterSection";
import type { HomepageSection } from "@/types/homepage";

async function Section({ section }: { section: HomepageSection }) {
  switch (section.type) {
    case "hero":
      return (
        <HeroSection
          data={(section.data ?? {}) as Record<string, string | undefined>}
        />
      );
    case "featured-collections":
      return <FeaturedCollections section={section} />;
    case "featured-products":
      return <FeaturedProducts section={section} />;
    case "banner":
      return (
        <BannerSection
          data={(section.data ?? {}) as Record<string, string | undefined>}
        />
      );
    case "announcement":
      return null;
    case "newsletter":
      return (
        <NewsletterSection
          data={(section.data ?? {}) as Record<string, string | undefined>}
        />
      );
    default:
      return null;
  }
}

export async function HomepageSections() {
  const config = await getCachedHomepage();
  const sections = [...(config?.sections ?? [])]
    .filter((s) => s.isVisible)
    .sort((a, b) => a.order - b.order);

  if (sections.length === 0) {
    return (
      <div className="space-y-16">
        <HeroSection data={{}} />
        <p className="text-center text-muted-foreground">
          Configure homepage sections in the admin panel.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-16">
      {sections.map((s) => (
        <Section key={s.id} section={s} />
      ))}
    </div>
  );
}
