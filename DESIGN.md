# ZN Enterprises — Design System

## Design Philosophy

ZN Enterprises is a B2B corporate signage manufacturer and industrial fabrication company. The design prioritises **trust, engineering precision, and professionalism** over decorative aesthetics. Every decision serves the goal of communicating reliability, technical capability, and pan-India execution strength.

The visual language is **industrial-corporate**: structured, confident, and uncluttered — inspired by heavy industry, precision engineering, and premium corporate branding.

---

## Colour Palette

| Token | Light | Dark | Usage |
|-------|-------|------|-------|
| `brand-500` (Deep Navy) | `#0F1D3A` | `#0F1D3A` | Primary backgrounds, inverse sections, hero |
| `accent` (Safety Orange) | `#FF5E00` | `#FF7A2E` | CTAs, highlights, interactive elements |
| `accent-hover` | `#E05000` | `#FF8C4A` | Button hover states |
| `page` | `#f8f9fb` | `#080c16` | Page background |
| `card` | `#ffffff` | `#0c1324` | Card surfaces |
| `section` | `#f0f2f5` | `#0a101e` | Alternate section backgrounds |
| `body` | `#1f2937` | `#e5e7eb` | Body text |
| `muted` | `#6b7280` | `#9ca3af` | Secondary text |
| `inverse` | `#0F1D3A` | `#ffffff` | Dark section backgrounds |

The Deep Navy + Safety Orange combination was chosen because:
- Deep Navy communicates trust, stability, and corporate authority
- Safety Orange references industrial safety, energy, and the petroleum sector
- Together they create high contrast for accessibility and visual impact

---

## Typography

| Role | Font | Weight | Size Scale |
|------|------|--------|------------|
| Body | Inter | 400 / 500 | `text-sm` to `text-lg` |
| Headings | Inter | 700 / 800 | `text-2xl` to `text-8xl` |
| Display | Inter | 800 / 900 | `text-5xl` to `text-8xl` |
| Meta | Inter | 600 | `text-xs` uppercase + tracking |

- **Inter** was chosen for its excellent legibility at all sizes, strong corporate character, and extensive weight range (300–900).
- Only one typeface is used to maintain a clean, professional appearance.
- Heading tracking is slightly tightened (`-0.02em`) for a more refined corporate look.
- Section labels use uppercase with wide tracking (`0.15em`) as a consistent navigational cue.

---

## Component System

### Layout Components

| Component | Description |
|-----------|-------------|
| `BaseLayout.astro` | Root layout — imports global styles, Navbar, Footer, SEO, skip-to-content, PWA, WhatsApp |
| `Navbar.astro` | Fixed top navigation with backdrop blur, scroll hide/show, dark mode toggle, mobile hamburger |
| `Footer.astro` | Multi-column footer with CTA band, contact info, live open/closed indicator, social links, back-to-top |

### Page Components

| Component | Description |
|-----------|-------------|
| `Hero.astro` | Full-viewport hero with gradient overlay, animated badge, headline, CTAs, trust indicators |
| `StatsBar.astro` | Centered stats row used on homepage and about page |
| `ProcessTimeline.astro` | 8-step project workflow with numbered timeline and cards |
| `CTA.astro` | Reusable call-to-action section with title, description, primary/secondary buttons |

### Card / Content Components

| Component | Description |
|-----------|-------------|
| `ServiceCard.astro` | Service listing card with icon, title, description, features, CTA link |
| `BlogCard.astro` | Blog post card with image, category, date, title, excerpt |
| `TestimonialCard.astro` | Testimonial card with star rating, quote, author avatar |
| `SectionHeader.astro` | Reusable section heading with optional highlight and alignment |

### Utility Components

| Component | Description |
|-----------|-------------|
| `SEO.astro` | Meta tags, Open Graph, Twitter Cards, structured data, breadcrumbs |
| `WhatsAppButton.astro` | Fixed-position WhatsApp chat FAB |
| `Breadcrumb.astro` | Auto-generated breadcrumb navigation |
| `IconBox.astro` | Consistent icon container with hover effects |

---

## Layout Decisions

- **Max-width**: `max-w-7xl` (80rem / 1280px) for all content sections
- **Vertical rhythm**: Sections use `py-16 sm:py-20 lg:py-24`
- **Grid**: Cards use `grid sm:grid-cols-2 lg:grid-cols-4 gap-6`
- **Content**: Text-heavy pages use `max-w-3xl` for optimal reading width
- **Hero**: Full viewport (`min-h-screen` or `min-h-[90vh]`) with gradient overlays

---

## Icon Strategy

- All icons use **Heroicons** (via inline SVG `stroke="currentColor"`)
- Icons are used sparingly and intentionally:
  - Section label indicators
  - Service/product feature lists
  - Contact information items
  - Social media links
- Icon containers use a consistent `h-14 w-14 rounded-xl bg-accent-soft text-accent` pattern with hover transitions

---

## Image Strategy

- **Hero**: Background image with dark gradient overlay for legibility
- **About / Content**: Unsplash industrial photography
- **Blog**: Post-specific imagery or placeholder
- **Gallery / Projects**: Content-managed images via `getCollection("gallery")`
- All images use `loading="lazy"` (except hero which uses preload)
- Aspect ratios are maintained with `aspect-[4/3]`, `aspect-[16/9]`, `aspect-square`
- Default placeholder images for empty states

---

## Animation Guidelines

| Element | Animation | Duration | Trigger |
|---------|-----------|----------|---------|
| Hero badge | `fade-in` | 0.6s | On load |
| Hero headline | `slide-up` | 0.6s | On load (0.1s & 0.2s stagger) |
| Card hover | translateY(-4px) + shadow | 0.3s | Hover |
| Navbar | translateY(-100%) | 0.3s | Scroll down > 200px |
| Scrolling indicator (hero) | `bounce` | Continuous | On load |
| Open status dot | `pulse` | Continuous | When open |

- `prefers-reduced-motion` is respected: all animations are disabled
- All transitions use `ease-out` or `ease` timing functions

---

## Accessibility

- Skip-to-content link (hidden until focused)
- Semantic HTML: `header`, `nav`, `main`, `section`, `article`, `figure`, `footer`
- ARIA labels on all interactive elements
- `aria-expanded` on mobile menu toggle
- `aria-label` on icon-only buttons and links
- `focus-visible` outlines styled with accent colour
- Colour contrast meets WCAG AA standards
- Form inputs have explicit labels
- Breadcrumbs use `nav aria-label="Breadcrumb"`
- Tab order follows visual order

---

## Responsive Strategy

| Breakpoint | Prefix | Usage |
|------------|--------|-------|
| < 640px | (default) | Single column, compact padding |
| ≥ 640px | `sm:` | 2-column grids, larger type |
| ≥ 1024px | `lg:` | 3-4 column grids, full navigation |
| ≥ 1280px | `xl:` | Larger heading type |

- Navigation collapses to hamburger below `lg:` (1024px)
- Cards switch from 4 → 2 → 1 columns responsively
- Spacing scales up at each breakpoint
- Mobile menu is full-width with backdrop blur

---

## UI Patterns

| Pattern | Implementation |
|---------|---------------|
| Section labels | `/// Label` — uppercase, tracked, accent-colour |
| Gradient text | `gradient-text` utility class on accent-colour gradient |
| Cards | Rounded-2xl, border, background, subtle shadow, hover lift |
| Buttons (primary) | Accent background, white text, hover darkens, shadow |
| Buttons (secondary) | Border only, hover fills |
| CTA sections | Dark background (`bg-inverse`) with radial gradient |
| Feature lists | Checkmark SVG + text, muted colour |
| Filter buttons | Pill-shaped, active state = accent fill |

---

## Future Design Recommendations

1. **Custom icon library** — Replace inline Heroicon SVGs with a custom icon set specific to signage and industrial themes
2. **Case study pages** — Add a dedicated collection and template for detailed project case studies
3. **Video content** — Consider adding installation and fabrication videos to the gallery
4. **Client logo grid** — Replace text-based client list with actual client logo images
5. **Interactive project map** — Show pan-India project locations on an interactive map
6. **Certificate / accreditation badges** — Display ISO certifications and industry memberships
7. **Testimonials carousel** — If more testimonials are added, consider a carousel or slider component
8. **Live chat** — Consider adding a live chat widget (in addition to WhatsApp) for B2B enquiries
9. **Regional language pages** — The i18n config exists but no translated content is populated yet
