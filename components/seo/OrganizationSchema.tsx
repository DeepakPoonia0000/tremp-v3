import { StructuredDataScript } from "./StructuredDataScript";
import { generateOrganizationSchema } from "@/lib/schema-generators";

interface OrganizationSchemaProps {
  name: string;
  url: string;
  logo?: string;
  description?: string;
  sameAs?: string[];
  contactPoint?: {
    telephone?: string;
    contactType: string;
    availableLanguage?: string;
  };
  address?: {
    streetAddress?: string;
    addressLocality?: string;
    addressRegion?: string;
    postalCode?: string;
    addressCountry?: string;
  };
}

export function OrganizationSchema(props: OrganizationSchemaProps) {
  const schema = generateOrganizationSchema(props);
  return <StructuredDataScript data={schema} />;
}
