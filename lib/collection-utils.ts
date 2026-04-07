import type { CollectionSeason } from "@/types/collection";

const SEASONS: CollectionSeason[] = [
  "summer",
  "winter",
  "spring",
  "fall",
  "all-year",
  "custom",
];

export function parseCollectionSeason(value: unknown): CollectionSeason {
  return typeof value === "string" &&
    (SEASONS as readonly string[]).includes(value)
    ? (value as CollectionSeason)
    : "all-year";
}
