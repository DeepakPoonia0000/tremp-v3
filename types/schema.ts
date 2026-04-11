// Schema.org type definitions for structured data

export interface StructuredData {
  "@context": string;
  "@type": string;
}

// Organization Schema
export interface OrganizationSchema extends StructuredData {
  "@type": "Organization";
  name: string;
  url: string;
  logo?: string;
  description?: string;
  sameAs?: string[];
  contactPoint?: {
    "@type": "ContactPoint";
    telephone?: string;
    contactType: string;
    availableLanguage?: string;
  };
  address?: {
    "@type": "PostalAddress";
    streetAddress?: string;
    addressLocality?: string;
    addressRegion?: string;
    postalCode?: string;
    addressCountry?: string;
  };
}

// Product Schema
export interface ProductSchema extends StructuredData {
  "@type": "Product";
  name: string;
  description: string;
  image?: string[];
  brand?: {
    "@type": "Brand";
    name: string;
  };
  sku?: string;
  gtin?: string;
  offers?: {
    "@type": "Offer";
    price: string;
    priceCurrency: string;
    availability: string;
    url: string;
    priceValidUntil?: string;
    seller?: {
      "@type": "Organization";
      name: string;
    };
  };
  aggregateRating?: {
    "@type": "AggregateRating";
    ratingValue: string;
    reviewCount: string;
    bestRating?: string;
    worstRating?: string;
  };
  reviews?: ReviewSchema[];
}

// Blog/Article Schema
export interface BlogPostingSchema extends StructuredData {
  "@type": "BlogPosting";
  headline: string;
  description: string;
  image?: string[];
  author: {
    "@type": "Person" | "Organization";
    name: string;
    url?: string;
  };
  publisher: {
    "@type": "Organization";
    name: string;
    logo?: string;
  };
  datePublished: string;
  dateModified?: string;
  mainEntityOfPage?: {
    "@type": "WebPage";
    "@id": string;
  };
  wordCount?: number;
  keywords?: string[];
  articleBody?: string;
}

// Collection/ItemList Schema
export interface ItemListSchema extends StructuredData {
  "@type": "ItemList";
  name: string;
  description?: string;
  numberOfItems: number;
  itemListElement: {
    "@type": "ListItem";
    position: number;
    item: ProductSchema | {
      "@type": "Product";
      name: string;
      url: string;
    };
  }[];
}

// Breadcrumb Schema
export interface BreadcrumbListSchema extends StructuredData {
  "@type": "BreadcrumbList";
  itemListElement: {
    "@type": "ListItem";
    position: number;
    name: string;
    item?: string;
  }[];
}

// Review Schema
export interface ReviewSchema extends StructuredData {
  "@type": "Review";
  reviewRating: {
    "@type": "Rating";
    ratingValue: string;
    bestRating?: string;
    worstRating?: string;
  };
  author: {
    "@type": "Person";
    name: string;
  };
  reviewBody?: string;
  datePublished?: string;
}

// WebSite Schema
export interface WebSiteSchema extends StructuredData {
  "@type": "WebSite";
  name: string;
  url: string;
  description?: string;
  potentialAction?: {
    "@type": "SearchAction";
    target: string;
    "query-input": string;
  };
  publisher?: {
    "@type": "Organization";
    name: string;
  };
}

// LocalBusiness Schema
export interface LocalBusinessSchema extends StructuredData {
  "@type": "LocalBusiness";
  name: string;
  url: string;
  logo?: string;
  description?: string;
  sameAs?: string[];
  contactPoint?: {
    "@type": "ContactPoint";
    telephone?: string;
    contactType: string;
    availableLanguage?: string;
  };
  address?: {
    "@type": "PostalAddress";
    streetAddress?: string;
    addressLocality?: string;
    addressRegion?: string;
    postalCode?: string;
    addressCountry?: string;
  };
  openingHours?: string[];
  priceRange?: string;
  telephone?: string;
  servesCuisine?: string;
}

// FAQ Schema
export interface FAQPageSchema extends StructuredData {
  "@type": "FAQPage";
  mainEntity: {
    "@type": "Question";
    name: string;
    acceptedAnswer: {
      "@type": "Answer";
      text: string;
    };
  }[];
}
