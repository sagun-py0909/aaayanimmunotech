# AAAyan Immunotech redesign — handover

Last updated: 14 Sep 2026. Pick up from here in a new chat.

## The two repos

| Repo | Path | Role |
|---|---|---|
| **aaayanimmunotech** (new site) | `C:\Yugaas\aaayanimmunotech` · github.com/sagun-py0909/aaayanimmunotech (public) | All current work happens here. Vite + React 19 + Tailwind v4 + wouter SPA, Express server. |
| **Aaayam-ImmunoTech** (legacy live site) | `C:\Yugaas\Aaayam-ImmunoTech` | The static HTML site live at https://aaayanimmunotech.co.in. **Read-only source** for copy, catalogue, SEO, photos. Nothing was changed there. Its `SEO.md`, `SEO/keyword-map.md` and `SEO/TODO.md` explain the SEO strategy. |

## Branches (new repo)

| Branch | Head | Pushed | Contents |
|---|---|---|---|
| `main` | `8e3b1bb` | yes | Redesign + SEO port + photo carousels. Original charcoal / pale-gold palette. |
| `theme/green-gold` | `c229a4d` | yes | main + green/gold palette, **no black anywhere** (client request). |
| `theme/blue-gold` | `2afa1a3` | **no — ask before pushing** | Same as green-gold with navy instead of green. |

The client is choosing between green and blue. Feature work goes on `main` first, then gets merged into both theme branches (see "Palette workflow").

## What was built

- **Pages / routes** (`client/src/App.tsx`): `/`, `/products`, `/products/:id`, `/equipment/:slug` (5 categories), `/sectors`, `/sectors/:slug` (5), `/guides`, `/guides/:slug` (6), `/support`, `/contact`.
- **Data**, all in `shared/` so both client and server use it:
  - `shared/site.ts` holds the catalogue, sectors, categories, guides, stats and contact details. `client/src/data/site.ts` just re-exports it.
    - The catalogue has the 13 real models from the legacy `js/data/catalog.js` (OXYL-25, CryoDuo 4/Elite 6, Miracle 5040/6200/Max 9600, Life Capsul L-1S/L-2S, Superhuman/Longevity/Recovery Suites, cold plunge, compression).
  - `shared/content.ts` is generated copy ported from the legacy keyword-mapped pages (equipment, guides, sectors, FAQs). Edit it directly; the generator was a one-off.
  - `shared/seo.ts` is the SEO module.
- **SEO** (ported from the legacy `main` branch):
  - **Per-route metadata:** titles, descriptions, canonicals, OG/Twitter tags and JSON-LD (Organization, Service, Product without offers, FAQPage, BreadcrumbList).
  - **Server-side injection:** `server/index.ts` injects the head tags between `<!-- SEO:START/END -->` in `client/index.html`, returns 404 for unknown routes, generates `/sitemap.xml` (35 URLs) and `/robots.txt`, and 301s every legacy `.html` URL.
  - **Client sync:** `client/src/lib/seo.ts` keeps tags in sync on client-side navigation.
  - **Analytics:** Ahrefs analytics tag is in `index.html`.
- **UI:**
  - `client/src/components/SiteChrome.tsx` has the header with dropdowns, the footer with the full crawlable link directory, the WhatsApp button, `PageShell`, `ProductCard`, `StatsStrip`, and `Html` (renders ported markup and keeps links client-side).
  - `client/src/components/PhotoCarousels.tsx` has `HeroCarousel` (full-bleed, autoplay 6s, thumbnails) and `GalleryCarousel` (draggable, 11 photos). Both use embla.
  - Pages live in `client/src/pages/` (`Home`, `Products`, `Pages` with Support/Contact/ProductDetail, `Sectors`, `ContentPages`).
- **Images:**
  - `client/public/images/placeholders/*.svg` are generated labelled placeholders for products, categories and sectors. The user wanted placeholders for products.
  - `client/public/images/photos/*.webp` are converted from the legacy repo. Only 4 are real equipment photos (hbot-chamber-residence, hbot-multiplace-interior, red-light-panel, red-light-bed, at 1164–1600px). The rest are AI-style renders at 640px (only OK at card size).
  - `og-default.png`, `favicon.svg` and the logo are also in `client/public/images/`.

## Palette workflow

The themes are pure hex find-and-replace over `SiteChrome.tsx`, `PhotoCarousels.tsx` and the 5 page files. To carry new `main` work into a theme branch:

1. Merge `main` with `--no-commit`.
2. Take `--theirs` (main) for conflicted files.
3. Re-run the sed chains in order.
4. Build, then commit.

The sed chains:

- **G1 (green palette):** `#24231f→#133E2F`, `#d5c59d→#C5A059`, `#9d8251→#C5A059`, `#314341→#1A4731`
- **G2 (remove black):** `#161615/#171716→#0F3326`, `#191918/#20201e/#1a1a19/#171717/#22221f/#34322d/#302d27/#1d1d1b/#1c1b18/#1d1b18/#1c1c1a/#28231a→#133E2F`, `#272724/#2b2a26→#1A4731`, `rgba(13,13,12,→rgba(10,42,31,`, `(from|via|to|bg|shadow)-black/→…-[#0A2A1F]/`
- **B (blue, applied after G1+G2):** `#0F3326→#0F2440`, `#133E2F→#132F4F`, `#1A4731→#1A3B63`, `#0A2A1F→#0A1C33`, `rgba(10,42,31,→rgba(10,28,51,`

When writing new `main` code, use the **main** palette hexes so the chains keep working.

The placeholder SVGs were regenerated per theme with `handover/scripts/gen-placeholders.mjs`. Its palettes currently hold the **blue** values and its output path is absolute.

## Scripts (one-off, not committed)

`handover/scripts/extract-content.mjs` ported the legacy copy into `shared/content.ts`. `gen-placeholders.mjs` draws the SVG placeholders. Both use absolute Windows paths.

## Commands

- `pnpm install` (node_modules is already installed) · `npx tsc --noEmit` · `npm run build`
- Preview production: `NODE_ENV=production PORT=4173 node dist/index.js`. It reads `dist/public/index.html` at startup, so restart after every build.
- Git warns LF→CRLF on Windows; files on disk are CRLF, so use `\r?\n` in regex edits.

## Open items / decisions pending

1. **Client decision:** green vs blue. Push `theme/blue-gold` only if asked.
2. **Placeholder contact details:** phone and WhatsApp are placeholders (`+91 98765 43210`, `shared/site.ts` → `contact`). They're kept out of JSON-LD on purpose until real NAP details exist.
3. **Unverified stats:** the 25+ customers / 98% satisfaction strip came from the live site, but the legacy `redesign/product-pages` branch dropped it as unverifiable. Needs client confirmation.
4. **Cryotherapy spec conflict:** the catalogue says down to −160°C, nitrogen or electric; the legacy category page says electric, nitrogen-free, −85 to −110°C.
5. **Photos:**
   - Most gallery and sector images are concept renders, not real installations.
   - Photos show third-party brand names (OXYPRO, RedLife, Whalepod) that aren't in the catalogue.
   - Higher-resolution originals are needed.
6. **Gold text contrast:** `#C5A059` text on cream (#f4f1ea) is about 2.3:1, below accessibility minimums. Suggest a darker gold such as `#8C6D2F` for small text.
7. **Leftover black:** remains only in template leftovers (`client/src/index.css`, the unused `ManusDialog.tsx`), not in site pages.
8. **Console noise:** the umami analytics script in `index.html` has unset env placeholders and logs console errors (template leftover).
9. **Unused hero photo:** the `/manus-storage/...` image is no longer used by the hero; other `manus-storage` references may remain in unused template code.

## Content rules (from the legacy SEO work)

- Describe equipment, specification, cost and installation only. No therapeutic or outcome claims.
- No prices anywhere, including structured data (quote-on-request).
- Canonical host is the apex `https://aaayanimmunotech.co.in`, never www.
