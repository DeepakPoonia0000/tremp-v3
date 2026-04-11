import { StructuredDataScript } from "./StructuredDataScript";
import { generateBlogPostingSchema } from "@/lib/schema-generators";

interface BlogPostingSchemaProps {
  headline: string;
  description: string;
  content?: string;
  images?: string[];
  author: string;
  authorUrl?: string;
  publisherName: string;
  publisherLogo?: string;
  datePublished: string;
  dateModified?: string;
  url: string;
  wordCount?: number;
  keywords?: string[];
}

export function BlogPostingSchema(props: BlogPostingSchemaProps) {
  const schema = generateBlogPostingSchema(props);
  return <StructuredDataScript data={schema} />;
}
