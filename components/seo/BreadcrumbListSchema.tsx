import { StructuredDataScript } from "./StructuredDataScript";
import { generateBreadcrumbSchema } from "@/lib/schema-generators";

interface BreadcrumbListSchemaProps {
  breadcrumbs: {
    name: string;
    url?: string;
  }[];
}

export function BreadcrumbListSchema(props: BreadcrumbListSchemaProps) {
  const schema = generateBreadcrumbSchema(props);
  return <StructuredDataScript data={schema} />;
}
