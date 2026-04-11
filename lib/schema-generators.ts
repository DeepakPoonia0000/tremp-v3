import type { StructuredData } from "@/types/schema";

// Utility to generate JSON-LD string
export function generateStructuredData<T extends StructuredData>(data: T): string {
  return JSON.stringify(data, null, 2);
}

// Organization schema generator
export function generateOrganizationSchema(config: {
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
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: config.name,
    url: config.url,
    logo: config.logo,
    description: config.description,
    sameAs: config.sameAs,
    contactPoint: config.contactPoint ? {
      "@type": "ContactPoint",
      telephone: config.contactPoint.telephone,
      contactType: config.contactPoint.contactType,
      availableLanguage: config.contactPoint.availableLanguage || "English",
    } : undefined,
    address: config.address ? {
      "@type": "PostalAddress",
      streetAddress: config.address.streetAddress,
      addressLocality: config.address.addressLocality,
      addressRegion: config.address.addressRegion,
      postalCode: config.address.postalCode,
      addressCountry: config.address.addressCountry,
    } : undefined,
  };
}

// Product schema generator
export function generateProductSchema(config: {
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
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: config.name,
    description: config.description,
    image: config.images,
    sku: config.sku,
    gtin: config.gtin,
    brand: config.brand ? {
      "@type": "Brand",
      name: config.brand,
    } : undefined,
    offers: {
      "@type": "Offer",
      price: config.price.toFixed(2),
      priceCurrency: config.priceCurrency,
      availability: `https://schema.org/${config.availability}`,
      url: config.url,
      priceValidUntil: config.priceValidUntil,
      seller: {
        "@type": "Organization",
        name: "Tremp",
      },
    },
    aggregateRating: config.rating ? {
      "@type": "AggregateRating",
      ratingValue: config.rating.value.toString(),
      reviewCount: config.rating.count.toString(),
      bestRating: "5",
      worstRating: "1",
    } : undefined,
  };
}

// Blog posting schema generator
export function generateBlogPostingSchema(config: {
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
}) {
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: config.headline,
    description: config.description,
    image: config.images,
    author: {
      "@type": "Person",
      name: config.author,
      url: config.authorUrl,
    },
    publisher: {
      "@type": "Organization",
      name: config.publisherName,
      logo: config.publisherLogo,
    },
    datePublished: config.datePublished,
    dateModified: config.dateModified,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": config.url,
    },
    wordCount: config.wordCount,
    keywords: config.keywords,
    articleBody: config.content,
  };
}

// ItemList schema generator for collections
export function generateItemListSchema(config: {
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
}) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: config.name,
    description: config.description,
    numberOfItems: config.items.length,
    itemListElement: config.items.map(item => ({
      "@type": "ListItem",
      position: item.position,
      item: item.price ? {
        "@type": "Product",
        name: item.name,
        url: item.url,
        image: item.image,
        offers: item.price ? {
          "@type": "Offer",
          price: item.price.toFixed(2),
          priceCurrency: item.priceCurrency || "USD",
          availability: item.availability ? `https://schema.org/${item.availability}` : undefined,
        } : undefined,
      } : {
        "@type": "Product",
        name: item.name,
        url: item.url,
      },
    })),
  };
}

// Breadcrumb schema generator
export function generateBreadcrumbSchema(config: {
  breadcrumbs: {
    name: string;
    url?: string;
  }[];
}) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: config.breadcrumbs.map((breadcrumb, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: breadcrumb.name,
      item: breadcrumb.url,
    })),
  };
}

// WebSite schema generator
export function generateWebSiteSchema(config: {
  name: string;
  url: string;
  description?: string;
  searchUrl?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: config.name,
    url: config.url,
    description: config.description,
    potentialAction: config.searchUrl ? {
      "@type": "SearchAction",
      target: config.searchUrl,
      "query-input": "required name=search_term",
    } : undefined,
    publisher: {
      "@type": "Organization",
      name: "Tremp",
    },
  };
}

// FAQ schema generator
export function generateFAQSchema(config: {
  questions: {
    question: string;
    answer: string;
  }[];
}) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: config.questions.map(q => ({
      "@type": "Question",
      name: q.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: q.answer,
      },
    })),
  };
}
