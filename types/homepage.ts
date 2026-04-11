export type HomepageSectionType =
  | "hero"
  | "featured-collections"
  | "featured-products"
  | "banner"
  | "announcement"
  | "newsletter"
  | "testimonials"
  | "categories"
  | "stats"
  | "cta"
  | "blog-posts";

export interface HomepageSection {
  id: string;
  type: HomepageSectionType;
  order: number;
  isVisible: boolean;
  data: Record<string, unknown>;
}

export interface HomepageConfigDTO {
  _id: string;
  sections: HomepageSection[];
  updatedAt: string;
}
