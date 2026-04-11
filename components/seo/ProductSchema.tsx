import { StructuredDataScript } from "./StructuredDataScript";
import { generateProductSchema } from "@/lib/schema-generators";

interface ProductSchemaProps {
  name: string;
  description: string;
  images?: string[];
  sku?: string;
  gtin?: string;
  price: number;
  priceCurrency: string;
  availability: "InStock" | "OutOfStock" | "PreOrder";
  url: string;
  brand?: string;
  priceValidUntil?: string;
  rating?: {
    value: number;
    count: number;
  };
}

export function ProductSchema(props: ProductSchemaProps) {
  const schema = generateProductSchema(props);
  return <StructuredDataScript data={schema} />;
}
