const fs = require("fs");
const path = require("path");

const dist = path.resolve(__dirname, "..", "dist");
const contentRoot = path.resolve(__dirname, "..", "src", "content");

const SOURCE = path.join(dist, "sitemap-0.xml");
const raw = fs.readFileSync(SOURCE, "utf-8");

const urlRegex = /<url>[\s\S]*?<\/url>/g;
const entries = [];
let match;
while ((match = urlRegex.exec(raw)) !== null) {
  const block = match[0];
  const loc = (block.match(/<loc>(.*?)<\/loc>/) || [])[1];
  if (loc) entries.push({ loc });
}

function readFrontmatter(file) {
  const src = fs.readFileSync(file, "utf-8");
  const m = src.match(/^---\n([\s\S]*?)\n---/);
  if (!m) return {};
  const body = m[1];
  const out = {};
  const dateMatch = body.match(/^date:\s*(.+)$/m);
  if (dateMatch) out.date = dateMatch[1].trim().replace(/['"]/g, "");
  const updatedMatch = body.match(/^updatedDate:\s*(.+)$/m);
  if (updatedMatch) out.updatedDate = updatedMatch[1].trim().replace(/['"]/g, "");
  const imageMatch = body.match(/^image(?![a-z]):\s*(.+)$/m);
  if (imageMatch) out.image = imageMatch[1].trim().replace(/^["']|["']$/g, "");
  const imagesMatch = body.match(/^images:\s*\n((?:\s+-\s*.+\n?)+)/m);
  if (imagesMatch) {
    out.images = [...imagesMatch[1].matchAll(/-\s*(\S.*)/g)].map((x) => x[1].trim().replace(/^["']|["']$/g, ""));
  }
  return out;
}

function loadContentMeta() {
  const map = {};
  for (const dir of ["blog", "products", "services", "projects"]) {
    const folder = path.join(contentRoot, dir);
    if (!fs.existsSync(folder)) continue;
    for (const file of fs.readdirSync(folder)) {
      const fileMatch = file.match(/^(.*)\.(md|mdx)$/);
      if (!fileMatch) continue;
      map[`/${dir}/${fileMatch[1]}/`] = readFrontmatter(path.join(folder, file));
    }
  }
  return map;
}

const contentMeta = loadContentMeta();

const EXCLUDED = ["/install", "/privacy", "/terms"];

function categorize(loc) {
  const u = new URL(loc);
  const p = u.pathname.replace(/\/$/, "");
  if (EXCLUDED.includes(p)) return "excluded";
  if (p === "" || ["/about", "/contact", "/faq", "/gallery", "/industries", "/products", "/projects", "/careers"].includes(p)) {
    return "main";
  }
  if (p.startsWith("/blog")) return "blog";
  if (p.startsWith("/services")) return "services";
  if (p.startsWith("/products")) return "products";
  if (p.startsWith("/projects")) return "projects";
  return "other";
}

function priorityFor(cat, pathname) {
  if (pathname === "") return "1.0";
  if (cat === "blog") return pathname === "/blog" ? "0.8" : "0.6";
  if (cat === "services") return pathname === "/services" ? "0.8" : "0.8";
  if (cat === "products") return pathname === "/products" ? "0.8" : "0.7";
  if (cat === "projects") return pathname === "/projects" ? "0.8" : "0.6";
  return "0.8";
}

function lastmodFor(pathname, meta) {
  if (!meta) return undefined;
  const dates = [meta.date, meta.updatedDate].filter(Boolean);
  if (dates.length === 0) return undefined;
  return dates
    .map((d) => new Date(d).toISOString())
    .sort()
    .pop();
}

function imagesFor(pathname, meta, origin) {
  if (!meta) return [];
  const imgs = [];
  if (meta.image) imgs.push(meta.image);
  for (const im of meta.images || []) imgs.push(im);
  return [...new Set(imgs)].filter(Boolean).map((i) => (i.startsWith("http") ? i : origin + i));
}

const groups = { main: [], blog: [], services: [], products: [], projects: [], other: [] };
for (const e of entries) {
  const u = new URL(e.loc);
  const p = u.pathname.replace(/\/$/, "");
  const cat = categorize(e.loc);
  if (cat === "excluded") continue;
  const meta = contentMeta[p + "/"];
  groups[cat].push({
    loc: e.loc,
    lastmod: lastmodFor(p, meta),
    priority: priorityFor(cat, p),
    images: imagesFor(p, meta, u.origin),
  });
}

function buildSitemap(urlset) {
  const lines = [`<?xml version="1.0" encoding="UTF-8"?>`];
  lines.push(`<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">`);
  for (const e of urlset) {
    lines.push("  <url>");
    lines.push(`    <loc>${e.loc}</loc>`);
    if (e.lastmod) lines.push(`    <lastmod>${e.lastmod}</lastmod>`);
    if (e.priority) lines.push(`    <priority>${e.priority}</priority>`);
    for (const img of e.images) {
      lines.push("    <image:image>");
      lines.push(`      <image:loc>${img}</image:loc>`);
      lines.push("    </image:image>");
    }
    lines.push("  </url>");
  }
  lines.push("</urlset>");
  return lines.join("\n");
}

const written = [];
for (const [name, urlset] of Object.entries(groups)) {
  if (urlset.length === 0) continue;
  fs.writeFileSync(path.join(dist, `sitemap-${name}.xml`), buildSitemap(urlset), "utf-8");
  written.push(name);
}

const indexLines = [`<?xml version="1.0" encoding="UTF-8"?>`];
indexLines.push(`<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`);
for (const name of written) {
  indexLines.push("  <sitemap>");
  indexLines.push(`    <loc>https://znenterprises.in/sitemap-${name}.xml</loc>`);
  indexLines.push("  </sitemap>");
}
indexLines.push("</sitemapindex>");
fs.writeFileSync(path.join(dist, "sitemap-index.xml"), indexLines.join("\n"), "utf-8");

fs.rmSync(SOURCE, { force: true });

console.log("Categorized sitemaps generated:");
for (const name of written) {
  console.log(`  sitemap-${name}.xml — ${groups[name].length} URLs`);
}

/* ── Generate sw.js with all known page URLs ── */

function walkDir(dir) {
  const results = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) results.push(...walkDir(full));
    else if (entry.isFile()) results.push(full);
  }
  return results;
}

const pageUrls = [];
const assetUrls = [
  "/fonts/inter-latin.woff2",
  "/fonts/bruno-ace-latin.woff2",
  "/fonts/lato-latin-300.woff2",
  "/fonts/lato-latin-400.woff2",
  "/fonts/lato-latin-700.woff2",
  "/manifest.json",
  "/favicon.svg",
  "/apple-touch-icon.png",
  "/pwa-192x192.png",
  "/pwa-512x512.png",
  "/zn-enterprises-logo.png",
  "/icon.png",
];

for (const file of walkDir(dist)) {
  if (!file.endsWith(".html")) continue;
  const rel = path.relative(dist, file);
  const parts = rel.split(path.sep);
  if (parts.includes("admin")) continue;
  if (parts.length === 1 && parts[0] !== "index.html") continue;
  pageUrls.push("/" + parts.slice(0, -1).join("/") + (parts[0] === "index.html" ? "" : "/"));
}

const allPrecache = [...new Set([...pageUrls, ...assetUrls])].sort();

const swLines = [`const CACHE_NAME = "zn-enterprises-v1";`, ""];
swLines.push("const PRECACHE_URLS = [");
for (const url of allPrecache) {
  swLines.push(`  "${url}",`);
}
swLines.push("];");
swLines.push("");
swLines.push(`self.addEventListener("install", (event) => {
  event.waitUntil(
    (async () => {
      const cache = await caches.open(CACHE_NAME);
      await cache.addAll(PRECACHE_URLS);
      await self.skipWaiting();
    })(),
  );
});`);
swLines.push("");
swLines.push(`self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();
      await Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)));
      await self.clients.claim();
    })(),
  );
});`);
swLines.push("");
swLines.push(`async function cacheFirst(request) {
  const cached = await caches.match(request);
  if (cached) return cached;
  try {
    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, response.clone());
    }
    return response;
  } catch {
    return new Response("Offline", { status: 503 });
  }
};`);
swLines.push("");
swLines.push(`async function networkFirst(request) {
  try {
    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, response.clone());
    }
    return response;
  } catch {
    const cached = await caches.match(request);
    if (cached) return cached;
    return caches.match("/");
  }
};`);
swLines.push("");
swLines.push(`self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET") return;
  if (!request.url.startsWith("http")) return;

  if (request.mode === "navigate") {
    event.respondWith(networkFirst(request));
  } else {
    event.respondWith(cacheFirst(request));
  }
});`);

fs.writeFileSync(path.join(dist, "sw.js"), swLines.join("\n"), "utf-8");
console.log(`  sw.js generated — ${allPrecache.length} URLs precached`);
