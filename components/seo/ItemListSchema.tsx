import { StructuredDataScript } from "./StructuredDataScript";
import { generateItemListSchema } from "@/lib/schema-generators";

interface ItemListSchemaProps {
  name: string;
  description?: string;
  items: {
    position: number;
    name: string;
    url: string;
    image?: string;
    price?: number;
    priceCurrency?: string;
    availability?: "InStock" | "OutOfStock" | "PreOrder";
  }[];
}

export function ItemListSchema(props: ItemListSchemaProps) {
  const schema = generateItemListSchema(props);
  return <StructuredDataScript data={schema} />;
}
