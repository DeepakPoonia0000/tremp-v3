export type CollectionSeason =
  | "summer"
  | "winter"
  | "spring"
  | "fall"
  | "all-year"
  | "custom";

export interface CollectionDTO {
  _id: string;
  name: string;
  slug: string;
  description: string;
  bannerImage: string;
  season: CollectionSeason;
  products: string[];
  isActive: boolean;
  sortOrder: number;
  metaTitle: string;
  metaDescription: string;
  createdAt: string;
  updatedAt: string;
}
