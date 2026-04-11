import { StructuredDataScript } from "./StructuredDataScript";
import { generateFAQSchema } from "@/lib/schema-generators";

interface FAQPageSchemaProps {
  questions: {
    question: string;
    answer: string;
  }[];
}

export function FAQPageSchema(props: FAQPageSchemaProps) {
  const schema = generateFAQSchema(props);
  return <StructuredDataScript data={schema} />;
}
