# שקור רביע · משרד רואה חשבון

Mobile-first Hebrew RTL landing page for the accounting firm **Shakour Rabia** (Haifa).

Built as a static site — pure HTML/CSS/JS, no build step, no dependencies. Just open `index.html`.

## Highlights

- **RTL Hebrew** with proper `dir="rtl"` and `lang="he"`
- **Editorial-luxury aesthetic** — deep forest green, warm ivory, antique gold
- **Distinctive Hebrew typography** — Frank Ruhl Libre (display) + Heebo (body) + Bellefair (refined Latin)
- **3D rotating prism** in the hero, parallax-aware on desktop
- **Scroll-triggered reveals**, animated counters, marquee strip, custom cursor
- **Hover-tilt service cards** (perspective transforms)
- **Floating WhatsApp** with double-pulse and prefilled message
- **Mobile menu** with staggered link reveals
- **Fully responsive**, tested down to 360px
- **Accessibility** — skip link, reduced-motion support, semantic HTML, focus-visible, ARIA labels, color contrast
- **SEO** — meta tags, OpenGraph, Twitter cards, canonical, JSON-LD `AccountingService` schema, `sitemap.xml`, `robots.txt`

## Files

| File | Purpose |
|---|---|
| `index.html` | Single-page markup (sections: hero, about, services, process, why, testimonials, FAQ, CTA, contact, footer) |
| `styles.css` | All styling and responsive layout |
| `script.js` | Interactivity (reveals, counters, tilt, cursor, menu, form) |
| `robots.txt`, `sitemap.xml` | SEO crawl helpers |

## Business

- **שקור רביע** — משרד רואה חשבון
- **חיפה**, ישראל
- **טלפון:** 052-774-2312
- **וואטסאפ:** [wa.me/972527742312](https://wa.me/972527742312)

## Local development

No build needed. Open `index.html` directly in a browser, or serve with any static server:

```bash
# Python
python -m http.server 8080

# Node
npx serve .
```

## Deployment

Drop the four files (`index.html`, `styles.css`, `script.js`, `robots.txt`, `sitemap.xml`) onto any static host — Netlify, Vercel, GitHub Pages, Cloudflare Pages, or shared hosting.

For production, update the canonical URL and `og:url` in `index.html` to match the live domain.
