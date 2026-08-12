import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";
import icon from "astro-icon";

export default defineConfig({
  site: "https://znenterprises.in",
  output: "static",
  trailingSlash: "always",
  build: {
    format: "directory",
  },
  integrations: [
    mdx(),
    sitemap({
      changefreq: "weekly",
      priority: 0.7,
      lastmod: new Date(),
    }),
    icon(),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
  image: {
    service: { entrypoint: "astro/assets/services/sharp" },
  },
  security: {
    csp: false,
  },
});
