export interface SEOProps {
  title?: string;
  description?: string;
  image?: string;
  canonical?: string;
  noIndex?: boolean;
  type?: "website" | "article" | "product";
  publishedTime?: string;
  author?: string;
  breadcrumbs?: { label: string; href: string }[];
  siteName?: string;
  url?: string;
}

const defaults = {
  siteName: "Z N ENTERPRISES",
  title: "Z N ENTERPRISES — Premium Corporate Signage Solutions Across India",
  description:
    "Z N ENTERPRISES specializes in designing, manufacturing, installing, repairing, and maintaining premium corporate signage across India.",
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
    url,
    siteName,
    noIndex: props.noIndex,
    canonical: props.canonical,
    type: props.type || "website",
    publishedTime: props.publishedTime,
    author: props.author,
    breadcrumbs: props.breadcrumbs,
  };
}
