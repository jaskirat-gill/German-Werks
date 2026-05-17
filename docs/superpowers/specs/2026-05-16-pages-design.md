# Catalog + Product Pages + Navbar Wiring — Design Spec

**Date:** 2026-05-16
**Scope:** Rebuild `/search`, `/search/[collection]`, and `/product/[handle]` in the editorial style; consolidate the footer; simplify the navbar to `Index · Catalog`.

## Problem

The homepage was rebuilt as a dark editorial showcase, but `/search`, `/search/[collection]`, and `/product/[handle]` are still the stock Vercel Commerce templates — plain grids, blue rounded price pill, an old generic `Footer` component. The navbar also still has `Journal` and `Contact` placeholder links going nowhere.

## Goals

- Every navbar link resolves to a working page.
- The catalog and product pages match the editorial brand language (serif display, mono labels, dark theme, bone foreground, accent red).
- The product list and product detail page work cohesively as a shopping flow.
- The footer is the single editorial footer across every route.

## Non-Goals

- No changes to cart logic, cart context, cart modal, or Add-to-Cart mutations. Only the AddToCart button's visual styling on the PDP is restyled.
- No new filters beyond collection chips and the existing sort options.
- No specifications table, fitment accordion, or editorial story block on the PDP.
- No Journal page. No Contact page.
- No changes to the generic `app/[page]/page.tsx` Shopify page route.

## Decisions (resolved during brainstorm)

| Question | Decision |
| --- | --- |
| Scope | PLP + PDP + navbar wiring; remove Journal/Contact; add single Catalog link |
| Catalog layout | Editorial grid + top filter bar (chips + sort) |
| Filtering | Collection chips + sort dropdown only |
| Card style | Lookbook tile (3:4 dark card, mono Vol/In Stock, serif title, mono collection + price) |
| PDP layout | Editorial split: full-bleed gallery + sticky sidebar |
| PDP below-fold | Related products carousel only |
| Footer | EditorialFooter everywhere (move to root layout, delete old footer files) |

---

## Navbar

**File:** `components/layout/editorial-navbar.tsx`

- Remove the `Journal` and `Contact` `<span>` placeholders.
- After the dynamic Shopify menu items, render one static `Catalog` link → `/search`.
- Use `usePathname()` to compute an active state for each link and apply the existing `nav-link active` className when the path matches:
  - `/` → `Index` active
  - `/search` or `/search/...` → `Catalog` active
  - `/search/<handle>` matching a Shopify item → that item active (in addition to Catalog being active; both light up)

**File:** `components/layout/navbar/mobile-menu.tsx`

- Replace the static `Journal` and `Contact` entries in the links array with a single `{ title: 'Catalog', path: '/search' }` entry.
- Order: `Index`, then `...menu` (Shopify), then `Catalog`.

---

## Routes

| URL | Purpose | File |
| --- | --- | --- |
| `/search` | Catalog — all products | `app/search/page.tsx` (rebuilt) |
| `/search/<collection>` | Catalog — single collection | `app/search/[collection]/page.tsx` (rebuilt) |
| `/product/<handle>` | Product detail page | `app/product/[handle]/page.tsx` (rebuilt) |

`app/search/layout.tsx` is simplified: it strips the old sidebar (Collections + FilterList) and the old Footer; becomes a thin wrapper that adds top padding (`pt-[120px]` to clear the fixed navbar) and renders `children`.

---

## Catalog (PLP)

### Files

- **Modify** `app/search/layout.tsx` — thin wrapper, no sidebar, no footer.
- **Modify** `app/search/page.tsx` — fetch all products, render `<Catalog>`.
- **Modify** `app/search/[collection]/page.tsx` — fetch collection products + collection metadata, render `<Catalog>`.
- **New** `components/catalog/catalog.tsx` — shared page body.
- **New** `components/catalog/filter-bar.tsx` — collection chips + sort dropdown.
- **New** `components/catalog/product-tile.tsx` — lookbook product card.
- **Repurpose** `app/search/loading.tsx` — render 8 skeleton tiles in the same grid.

### Layout (desktop ≥ md)

```
[ navbar — fixed ]
─────────────────────────────────────────────
INDEX — 03                              The Catalog
                              Three volumes · 147 pieces

[All] [Body & Aero] [Carbon Fibre] [Performance]    [Sort: Relevance ▾]
─────────────────────────────────────────────
[tile] [tile] [tile] [tile]
[tile] [tile] [tile] [tile]
...
─────────────────────────────────────────────
[ EditorialFooter ]
```

Section paddings follow the global responsive ladder: `px-5 sm:px-7 lg:px-9`, plus `pt-[120px]` to clear the fixed navbar.

### Header strip

- Top-left: `INDEX — 03` mono 11px, letterSpacing 0.18em.
- Top-right: serif `<h1>` "The Catalog" with subtitle below — `<active collection name or 'Three volumes'> · <product count> pieces`.
- Bottom border-rule.

### Filter bar

- Horizontal row at ≥md, horizontal-scroll (`overflow-x-auto`) at <md.
- Chips: `All` (route `/search`) followed by one chip per Shopify collection from `getCollections()` (route `/search/<handle>`).
- Active chip: bone fill, ink text. Inactive: transparent fill, bone outline, bone text.
- Sort dropdown (right-aligned at ≥md, full-width below chips at <md): mono `Sort: <current>` label + chevron; clicking opens a list of options from `lib/constants.ts` `sorting[]`. Selecting updates the `?sort=` URL param; server re-renders with the new ordering.

### Grid

- `grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 sm:gap-6`.
- No max-width cap — full-bleed minus the global padding ladder.

### Empty state

When `products.length === 0`:

- Centered block, ~`py-32`.
- Serif italic "No pieces match" `clamp(40px, 6vw, 64px)`.
- Below: mono uppercase 10.5px "Try a different volume".
- Below that: a `Link` to `/search` styled as an outlined editorial button.

### Product tile (`product-tile.tsx`)

Props: `{ product: Product }`.

- Aspect ratio `3/4`, `rounded-[14px]`.
- Background `var(--color-gw-ink)`, foreground `var(--color-gw-bone)`.
- Top row: mono `VOL. 0X` derived from primary collection, and an `IN STOCK` pill (from `product.availableForSale`). Pill: rounded-full, 1px border at 0.45 opacity.
- Center: product `featuredImage` filled with `object-cover`. Subtle inset vignette overlay.
- Bottom row inside same card: serif title 22px (`clamp(18px, 2.2vw, 22px)`), single-line truncate; below it a mono row with collection name left + price right (10.5px, letterSpacing 0.14em, uppercase).
- Hover (`group-hover:`):
  - Card scales `1.02`.
  - Accent red line slides in along the bottom edge (`group-hover:before:scale-x-100` or similar).
  - "View →" arrow fades in bottom-right.
- Fallback when no image: gradient background plus the title visible in the center.

**Vol. mapping:** the primary collection is `product.collections.edges[0]?.node` or, since Storefront API typically returns it as a flat field, whatever `getProducts()` already provides. If the Shopify response does not include collections per product, fall back to omitting the Vol. label (do not invent one). The product tile must handle both shapes — confirm during implementation by reading `lib/shopify/types.ts` and the actual GraphQL fragment.

---

## Product page (PDP)

### Files

- **Modify** `app/product/[handle]/page.tsx` — remove the bordered white card and old `Footer`; render `<Pdp product={product} />`.
- **New** `components/product/pdp.tsx` — the editorial split layout.
- **New** `components/product/pdp-gallery.tsx` — gallery + thumb rail.
- **Modify** `components/product/product-description.tsx` — restyle (keep export name).
- **Modify** `components/product/variant-selector.tsx` — restyle to pill row (keep state logic).
- **Modify** `components/cart/add-to-cart.tsx` — restyle button (keep mutation logic). If the file's logic and presentation are tangled, accept a small refactor to separate them.
- **Reuse** related-products logic from current page; render with the new `ProductTile`.

### Layout (≥lg)

```
[ navbar — fixed ]
─────────────────────────────────────────────
│ ┌──────────────────────┐ ┌────────────────┐│
│ │                      │ │ VOL. 02        ││
│ │                      │ │ Carbon Lip     ││
│ │                      │ │ Spoiler        ││
│ │      Big image       │ │ $1,240 USD     ││
│ │      (parallax)      │ │                ││
│ │                      │ │ Finish:        ││
│ │                      │ │ (Gloss) (Matte)││
│ │                      │ │                ││
│ │                      │ │ [Add to cart]  ││
│ │                      │ │                ││
│ └──────────────────────┘ │ Description    ││
│ ▢ ▢ ▢ ▢ ▢                │ paragraph...   ││
│                          └────────────────┘│
─────────────────────────────────────────────
IN THE SAME VOLUME                  → See all
[tile] [tile] [tile] [tile]
─────────────────────────────────────────────
[ EditorialFooter ]
```

### Grid

- `<lg`: single column. Gallery first, then sidebar content stacked.
- `≥lg`: 2-column grid `lg:grid-cols-[3fr_2fr] gap-10`. Sidebar uses `lg:sticky lg:top-[88px]` so it remains visible while gallery scrolls.

### Gallery (`pdp-gallery.tsx`)

- Active image: full-width within left column, `aspect-ratio: 4/5`, `max-height: 82svh`, `rounded-[14px]`, `overflow-hidden`, background `var(--color-gw-ink)`.
- Image rendered via existing `ProductParallax` component.
- Below the image: horizontal thumb rail (`flex gap-2`). Each thumb: `64px × 64px`, `rounded-md`, `overflow-hidden`. Active thumb has a 2px accent border. Click swaps active image via the existing `?image=N` URL param mechanism.
- Drop the absolute-positioned overlay arrow buttons from the current `Gallery` component.

### Sidebar content (top-to-bottom)

1. **Vol. label** — mono 10.5px uppercase, accent color. Comes from primary collection title (e.g. `Carbon Fibre` → `VOL. 02`). Omit if no collection.
2. **Title `<h1>`** — serif 400, `clamp(34px, 4vw, 56px)`, line-height 0.95, color bone.
3. **Price** — mono 14px uppercase tracking-wide, color bone. No background pill.
4. **Variant selector** — each option (e.g. "Finish") shows a small mono uppercase label (10.5px, opacity 0.55) followed by a pill row. Pill: `rounded-full px-4 py-2`, mono 11px uppercase. Active: bone fill, ink text. Inactive: 1px bone border at 0.4 opacity, bone text. Unavailable: opacity 0.35, strikethrough. State logic in `variant-selector.tsx` is preserved.
5. **Add-to-cart button** — full-width, ink fill, bone text, mono uppercase 12px, `Add to cart  ·  $1,240 USD  →`. Height 56px. Disabled state when `product.availableForSale` false: opacity 0.4, label "Out of stock", arrow hidden.
6. **Description** — rendered via existing `<Prose>` with overridden CSS: `font-family: var(--font-serif)` for paragraphs, serif italic for emphasis, mono uppercase for `<strong>` if any. Color bone at 0.8 opacity. Spacing top: 32px.

### Mobile sticky CTA

On `<lg` only, render a fixed bottom bar:

- Full-width, `position: fixed`, `bottom-0 left-0 right-0`, ink background with top border-rule.
- Inside: the same AddToCart button (renders the same component), with the title and price compressed on the left, button on the right. Height ~72px.
- Add `pb-[80px]` to the sidebar container on `<lg` so the sticky CTA doesn't cover content.

### Related products ("In the same volume")

- Below the gallery+sidebar split, full-width section, `mt-24`.
- Header row: mono `IN THE SAME VOLUME` left, `→ See all` link right. The link goes to `/search/<primary-collection-handle>` or `/search` if no primary collection.
- Body: horizontal swipe carousel (CSS `flex snap-x snap-mandatory overflow-x-auto`). Each tile is the same `ProductTile` from §3 with `aspect-ratio: 3/4` and width `w-[78vw] sm:w-[44vw] md:w-[30vw] lg:w-[22vw]`. Fade overlays at left/right edges.
- Data: existing `getProductRecommendations(id)` call. If empty, the whole section is omitted.

### JSON-LD & metadata

Keep `generateMetadata` and the `productJsonLd` script tag exactly as they are today. Move them into the rebuilt `app/product/[handle]/page.tsx` without modification.

---

## Footer consolidation

- **Modify** `app/layout.tsx` — import `EditorialFooter`, render it inside `<main>` after `<PageTransition>`.
- **Modify** `app/page.tsx` — remove the inline `<EditorialFooter />` and its import.
- **Modify** `app/product/[handle]/page.tsx` — remove the `<Footer />` import and render.
- **Modify** `app/search/layout.tsx` — remove the `<Footer />` import and render (handled as part of catalog layout strip).
- **Delete** `components/layout/footer.tsx`.
- **Delete** `components/layout/footer-menu.tsx`.
- `components/logo-square.tsx`: grep for remaining usages; delete only if unreferenced after footer removal.

---

## Responsive behavior

Inherits the breakpoint and padding ladder established in `docs/superpowers/specs/2026-05-16-responsiveness-design.md`:

- Section horizontal padding `px-5 sm:px-7 lg:px-9`.
- Top padding under fixed navbar `pt-[120px]` on every full-page section that sits flush with the top.
- All large headings use `clamp()` with capped upper bounds.
- Existing `prefers-reduced-motion` philosophy applies — no scroll-linked transforms on PLP/PDP except cheap fades.

---

## Cart preservation

Cart context, cart provider, cart modal, cart mutations, and the optimistic-update flow are out of scope. Only the visual presentation of the `AddToCart` button changes. If the existing `add-to-cart.tsx` mixes mutation logic with visual presentation in a way that resists restyling, a small in-place refactor to separate them is acceptable — but no behavior changes.

---

## Verification

Manual browser checks at 393, 768, 1024, 1512:

- Navbar shows `Index · [Shopify items] · Catalog` (plus search + cart on ≥md).
- Mobile drawer shows `Index / [Shopify items] / Catalog`.
- Active link state correct per route.
- `/search` lists all products with editorial tiles and filter bar; `All` chip active.
- `/search/<handle>` lists only that collection's products; matching chip active.
- Sort param round-trips correctly.
- Empty state renders when query matches no products.
- `/product/<handle>` renders editorial split on ≥lg, stacked layout on <lg.
- Variant selector works (existing logic preserved).
- Add-to-cart works (existing mutation preserved); button styled editorial.
- Sticky bottom CTA appears only on <lg.
- "In the same volume" carousel scrolls horizontally; "See all" routes correctly; omitted when no recommendations.
- Editorial footer at the bottom of every route. No old footer rendering.
- TypeScript clean; no broken imports from deleted footer files.

## Out of scope

- Cart UI redesign.
- Search-suggestion / autocomplete dropdown on the navbar search input.
- Per-product specs table, fitment data, or editorial story content.
- Journal, Contact, About, or other secondary pages.
- Image zoom / lightbox on the PDP gallery.
- Reviews, ratings, social proof.
