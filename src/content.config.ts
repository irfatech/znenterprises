import { z, defineCollection } from "astro:content";
import { glob, file } from "astro/loaders";

const seoSchema = z.object({
  title: z.string().optional(),
  description: z.string().optional(),
  image: z.string().optional(),
  canonical: z.string().optional(),
  noIndex: z.boolean().optional().default(false),
});

const blog = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/blog" }),
  schema: z.object({
    title: z.string(),
    slug: z.string().optional(),
    excerpt: z.string(),
    author: z.string().default("Z N ENTERPRISES"),
    date: z.date({ coerce: true }),
    updatedDate: z.coerce.date().or(z.literal('')).optional(),
    image: z.string().optional(),
    category: z.string().default("General"),
    tags: z.array(z.string()).default([]),
    featured: z.boolean().default(false),
    published: z.boolean().default(true),
    lang: z.string().default("en"),
    seo: seoSchema.optional(),
  }),
});

const products = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/products" }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    excerpt: z.string().optional(),
    icon: z.string().optional(),
    image: z.string().optional(),
    images: z.array(z.string()).default([]),
    features: z.array(z.string()).default([]),
    category: z.string().default("General"),
    order: z.number({ coerce: true }).int().default(0),
    featured: z.boolean().default(false),
    lang: z.string().default("en"),
    seo: seoSchema.optional(),
  }),
});

const services = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/services" }),
  schema: z.object({
    title: z.string(),
    slug: z.string().optional(),
    icon: z.string().optional(),
    description: z.string(),
    excerpt: z.string().optional(),
    order: z.number({ coerce: true }).int().default(0),
    featured: z.boolean().default(false),
    image: z.string().optional(),
    features: z.array(z.string()).default([]),
    ctaText: z.string().default("Learn More"),
    ctaLink: z.string().optional(),
    lang: z.string().default("en"),
    seo: seoSchema.optional(),
  }),
});

const team = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/team" }),
  schema: z.object({
    name: z.string(),
    role: z.string(),
    bio: z.string().optional(),
    image: z.string().optional(),
    email: z.string().optional(),
    phone: z.string().optional(),
    order: z.number({ coerce: true }).int().default(0),
    lang: z.string().default("en"),
  }),
});

const testimonials = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/testimonials" }),
  schema: z.object({
    name: z.string(),
    role: z.string().optional(),
    company: z.string().optional(),
    avatar: z.string().optional(),
    rating: z.number({ coerce: true }).int().min(1).max(5).default(5),
    content: z.string(),
    featured: z.boolean().default(false),
    lang: z.string().default("en"),
  }),
});

const gallery = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/gallery" }),
  schema: z.object({
    title: z.string().optional(),
    image: z.string(),
    category: z.string().default("General"),
    featured: z.boolean().default(false),
    date: z.date({ coerce: true }).optional(),
    lang: z.string().default("en"),
  }),
});

const projects = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/projects" }),
  schema: z.object({
    title: z.string(),
    client: z.string().optional(),
    location: z.string().optional(),
    description: z.string().optional(),
    images: z.array(z.string()).default([]),
    category: z.string().default("General"),
    order: z.number({ coerce: true }).int().default(0),
    featured: z.boolean().default(false),
    lang: z.string().default("en"),
  }),
});

const pages = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/pages" }),
  schema: z.object({
    title: z.string(),
    slug: z.string(),
    description: z.string().optional(),
    image: z.string().optional(),
    lang: z.string().default("en"),
    seo: seoSchema.optional(),
  }),
});

const partners = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/partners" }),
  schema: z.object({
    name: z.string(),
    logo: z.string(),
    url: z.string().optional(),
    order: z.number({ coerce: true }).int().default(0),
    lang: z.string().default("en"),
  }),
});

const siteSettings = defineCollection({
  loader: glob({ pattern: "settings.yaml", base: "./src/content/site-settings" }),
  schema: z.object({
    siteName: z.string().default("Z N ENTERPRISES"),
    tagline: z.string().default("Premium Automotive Services"),
    description: z.string(),
    url: z.string(),
    logo: z.string().optional(),
    logoDark: z.string().optional(),
    favicon: z.string().optional(),
    phone: z.array(z.string()).default([]),
    email: z.string().optional(),
    address: z.string().optional(),
    workingHours: z.string().optional(),
    social: z.object({
      facebook: z.string().optional(),
      instagram: z.string().optional(),
      youtube: z.string().optional(),
      tiktok: z.string().optional(),
      whatsapp: z.string().optional(),
    }).optional(),
    googleMapsEmbedUrl: z.string().optional(),
    currency: z.string().default("USD"),
    language: z.string().default("en"),
    languages: z.array(z.string()).default(["en", "tet", "id"]),
  }),
});

const navigation = defineCollection({
  loader: glob({ pattern: "nav.yaml", base: "./src/content/navigation" }),
  schema: z.object({
    items: z.array(z.object({
      label: z.string(),
      href: z.string(),
      children: z.array(z.object({
        label: z.string(),
        href: z.string(),
      })).optional(),
    })),
  }),
});

const footer = defineCollection({
  loader: glob({ pattern: "footer.yaml", base: "./src/content/footer" }),
  schema: z.object({
    description: z.string().optional(),
    columns: z.array(z.object({
      title: z.string(),
      links: z.array(z.object({
        label: z.string(),
        href: z.string(),
      })),
    })),
    bottomText: z.string().optional(),
  }),
});

const hero = defineCollection({
  loader: glob({ pattern: "hero.yaml", base: "./src/content/hero" }),
  schema: z.object({
    badge: z.string(),
    headingLine1: z.string(),
    headingLine2: z.string(),
    headingLine3: z.string(),
    highlightLine: z.number({ coerce: true }).int().min(1).max(3).default(2),
    subtitle: z.string(),
    ctaPrimaryText: z.string(),
    ctaPrimaryLink: z.string(),
    ctaSecondaryText: z.string(),
    ctaSecondaryLink: z.string(),
    trustBadges: z.array(z.object({
      text: z.string(),
    })).default([]),
    heroImage: z.string(),
    heroImageAlt: z.string().default(""),
  }),
});

const process = defineCollection({
  loader: glob({ pattern: "process.yaml", base: "./src/content/process" }),
  schema: z.object({
    sectionLabel: z.string(),
    heading: z.string(),
    highlightWord: z.string(),
    subtitle: z.string(),
    steps: z.array(z.object({
      number: z.string(),
      title: z.string(),
      description: z.string(),
    })),
  }),
});

const about = defineCollection({
  loader: glob({ pattern: "about.yaml", base: "./src/content/about" }),
  schema: z.object({
    heroLabel: z.string(),
    heroHeading: z.string(),
    heroHighlight: z.string(),
    heroDescription: z.string(),

    storyImage: z.string(),
    storyImageAlt: z.string().default(""),
    storyHeading: z.string(),
    storyHighlight: z.string(),
    storyParagraphs: z.array(z.string()),
    stats: z.array(z.object({
      number: z.string(),
      label: z.string(),
    })),

    missionTitle: z.string(),
    missionText: z.string(),
    visionTitle: z.string(),
    visionText: z.string(),

    valuesSectionLabel: z.string(),
    valuesHeading: z.string(),
    valuesHighlight: z.string(),
    valuesSubtitle: z.string(),
    values: z.array(z.object({
      title: z.string(),
      description: z.string(),
    })),

    homeLabel: z.string(),
    homeHeading: z.string(),
    homeHighlight: z.string(),
    homeSubHead: z.string().optional(),
    homeProblem: z.string().optional(),
    homeSolution: z.string().optional(),
    homePhilosophy: z.string().optional(),
    homeParagraphs: z.array(z.string()),
    homeImage1: z.string(),
    homeImage1Alt: z.string().default(""),
    homeImage2: z.string(),
    homeImage2Alt: z.string().default(""),

    ctaTitle: z.string(),
    ctaDescription: z.string(),
    ctaPrimaryLabel: z.string(),
    ctaPrimaryLink: z.string(),
    ctaSecondaryLabel: z.string(),
    ctaSecondaryLink: z.string(),
  }),
});

const clients = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/clients" }),
  schema: z.object({
    name: z.string(),
    fullName: z.string().optional(),
    slug: z.string(),
    logo: z.string(),
    description: z.string(),
    order: z.number({ coerce: true }).int().default(0),
    lang: z.string().default("en"),
  }),
});

export const collections = {
  blog,
  products,
  services,
  team,
  testimonials,
  gallery,
  projects,
  pages,
  partners,
  clients,
  "site-settings": siteSettings,
  navigation,
  footer,
  hero,
  process,
  about,
};
