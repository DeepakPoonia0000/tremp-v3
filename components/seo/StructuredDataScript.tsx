import type { StructuredData } from "@/types/schema";
import { generateStructuredData } from "@/lib/schema-generators";

// React component to render structured data as script tag
export function StructuredDataScript<T extends StructuredData>({ data }: { data: T }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: generateStructuredData(data) }}
    />
  );
}
