import { StructuredDataScript } from "./StructuredDataScript";
import { generateWebSiteSchema } from "@/lib/schema-generators";

interface WebSiteSchemaProps {
  name: string;
  url: string;
  description?: string;
  searchUrl?: string;
}

export function WebSiteSchema(props: WebSiteSchemaProps) {
  const schema = generateWebSiteSchema(props);
  return <StructuredDataScript data={schema} />;
}
