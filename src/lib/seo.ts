export interface ReviewData {
  author: string;
  authorTitle?: string;
  reviewBody: string;
  ratingValue: number;
}

export interface AggregateRatingData {
  ratingValue: number;
  reviewCount: number;
  bestRating?: number;
}

export interface SEOProps {
  title?: string;
  description?: string;
  image?: string;
  imageAlt?: string;
  canonical?: string;
  noIndex?: boolean;
  type?: "website" | "article" | "product";
  publishedTime?: string;
  modifiedTime?: string;
  author?: string;
  articleSection?: string;
  articleTags?: string[];
  breadcrumbs?: { label: string; href: string }[];
  siteName?: string;
  url?: string;
  /** WebPage subtype for this page, e.g. "AboutPage", "ContactPage", "FAQPage", "CollectionPage". */
  pageType?: string;
  /** Primary schema.org entity for the page — embedded into the WebPage node. */
  mainEntity?: Record<string, unknown>;
  /** Do not emit the Organization/WebSite/LocalBusiness graph on this page (404, legal, utility pages). */
  hideBusinessSchema?: boolean;
  reviews?: ReviewData[];
  aggregateRating?: AggregateRatingData;
}

const defaults = {
  siteName: "ZN Enterprises",
  title: "ZN Enterprises — Corporate Signage Manufacturing & Installation Across India",
  description:
    "ZN Enterprises is a full-service corporate signage manufacturer specializing in Retail Visual Identity (RVI), petroleum signage, LED signage, and industrial fabrication across India.",
  url: "https://znenterprises.in",
  image: "/images/og-default.jpg",
};

export function buildSEO(props: SEOProps) {
  const title = props.title
    ? `${props.title} | ${defaults.siteName}`
    : defaults.title;
  const description = props.description || defaults.description;
  const image = props.image || defaults.image;
  const url = props.canonical || props.url || defaults.url;
  const siteName = props.siteName || defaults.siteName;

  return {
    title,
    description,
    image,
    imageAlt: props.imageAlt,
    url,
    siteName,
    noIndex: props.noIndex,
    canonical: props.canonical,
    type: props.type || "website",
    publishedTime: props.publishedTime,
    modifiedTime: props.modifiedTime,
    author: props.author,
    articleSection: props.articleSection,
    articleTags: props.articleTags,
    breadcrumbs: props.breadcrumbs,
    pageType: props.pageType,
    mainEntity: props.mainEntity,
    hideBusinessSchema: props.hideBusinessSchema,
    reviews: props.reviews,
    aggregateRating: props.aggregateRating,
  };
}