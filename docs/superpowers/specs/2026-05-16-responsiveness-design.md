# Responsiveness Audit & Mobile Layout — Design Spec

**Date:** 2026-05-16
**Scope:** Homepage (`app/page.tsx`) + global layout (`editorial-navbar.tsx`, `editorial-footer.tsx`). Search page, product pages, and cart UI are out of scope.

## Problem

1. **Desktop:** the catalogue h2 "Three pillars. One obsession." collides with the fixed navbar; the footer wordmark "German Werks." is clipped on the right edge.
2. **Mobile:** the homepage has never been designed for phones or tablets. The horizontal-scroll Chapter 02 panel, the cert-plate hero, the 4-column footer grid, and the inline navbar all break at narrow widths.

## Goals

- Eliminate every visible layout bug on desktop at 1280–1920 widths.
- Deliver a coherent, brand-consistent mobile experience down to 360px.
- Preserve the editorial/cinematic feel on desktop — no compromise there.
- Keep animation budget low on mobile; honor `prefers-reduced-motion`.

## Non-Goals

- No redesign of the desktop visual language.
- No refactor of section internals beyond what responsiveness requires.
- No new components except a `useIsMobile()` hook and a mobile drawer body inside the existing `MobileMenu`.

## Foundations

**Breakpoints** (Tailwind defaults):

| Token  | Range      | Audit device                |
| ------ | ---------- | --------------------------- |
| (base) | < 640      | iPhone 14 Pro (393)         |
| `sm:`  | 640–767    | Large phone / small tablet  |
| `md:`  | 768–1023   | iPad portrait               |
| `lg:`  | 1024–1439  | iPad landscape / MacBook 14 |
| `xl:`  | ≥ 1440     | Desktop / wide              |

**Global rules:**

- Section horizontal padding becomes `px-5 sm:px-7 lg:px-9` (currently hard-coded `px-9`).
- All large serif `clamp()` headings get their upper cap reduced ~25% so they cannot exceed two lines at common desktop widths.
- A new `useIsMobile()` hook (SSR-safe matchMedia at 767px) lets components branch motion/layout logic instead of mounting expensive `useScroll` chains only to hide them with CSS.
- `prefers-reduced-motion: reduce` disables scroll-linked framer-motion transforms (returns identity transforms).

## Component-by-component

### Navbar — `components/layout/editorial-navbar.tsx`

**Desktop (≥md):** unchanged. Keeps `mixBlendMode: difference` for cross-section visibility.

**Mobile (<md):**

- Row: GW crest · "GERMAN WERKS — '23" wordmark (hidden < `sm`) · cart icon · hamburger button.
- The inline `Index / Journal / Contact` link row is hidden below `md:`.
- The inline search input is removed below `md:` — it moves into the drawer.

**Drawer (mobile only):**

- Extend the existing `components/layout/navbar/mobile-menu.tsx` (currently a stub). Slides in from right; full-height; dark ink background with grain.
- Top section: large search input (autofocus on open, submits to `/search`).
- Middle: stacked serif-italic links — `Index`, menu items from Shopify (`Body & Aero`, `Carbon Fibre`, `Performance`, …), plus `Journal` and `Contact`.
- Bottom: location + live clock (echoes the hero rail).
- Close: `×` top-right, `Esc`, or backdrop tap. Body scroll lock when open.

### Hero — `components/homepage/hero-card.tsx`

**Desktop (≥lg):** unchanged.

**Tablet (md):** cert plate already hidden (`hidden lg:block`). Title clamp drops to `clamp(40px, 7.5vw, 110px)`.

**Mobile (<md):**

- Outer section uses `min-h-[100svh]` (small viewport units, handles iOS URL bar) instead of `min-h-[760px]`.
- Bone card: `width: 94vw`, intrinsic height, `min-height: 86svh`.
- Top tri-row stays `hidden sm:flex`. Add a simple `Index / 01 — Manifest` centered line on `<sm`.
- Title lines: `clamp(34px, 11vw, 60px)`.
- Cert plate stays hidden.
- Bottom row: CTA left, clock right. Vancouver pill stays `hidden sm:inline`.
- Outer coordinates rail collapses to single centered `Scroll ↓` on `<sm`.

### Catalogue — `components/homepage/horizontal-chapter.tsx`, `categories.tsx`, `catalogue-chapter.tsx`

**Desktop fix (collision with navbar):**

- `categories.tsx` h2 clamp: `clamp(48px, 7vw, 120px)` → `clamp(40px, 6vw, 88px)`.
- Section gets `pt-[120px]` (clears 88px nav + breathing room).
- `gridTemplateColumns: '200px 1fr'` → `'180px 1fr'` on `lg`+; stacks (single column with INDEX label above h2) on `<md`.

**Mobile (<md): drop the horizontal slide.**

`catalogue-chapter.tsx` branches by breakpoint:

```tsx
<>
  <div className="hidden md:block">
    <HorizontalChapter ...>{(p) => <Categories progress={p} />}</HorizontalChapter>
  </div>
  <div className="md:hidden">
    <ChapterIntroMobile index="Chapter 02" title="The Catalogue." subtitle="…" />
    <CategoriesMobile />
  </div>
</>
```

`ChapterIntroMobile`: dark `min-h-[80svh]` panel with chapter title + accent line + scroll cue. `whileInView` fade-in only — no `useScroll`.

`CategoriesMobile`: same `CATEGORIES` data array, single-column vertical stack. Cards: aspect-ratio `4/5`, full-width minus `px-5`, identical typography to desktop card. Soft `y` translate on enter; no rotateY parallax.

### Atelier — `components/homepage/atelier.tsx`

**Desktop:** unchanged.

**Tablet (md):** trust columns 3 → 2-and-wrap (verify existing `sm:grid-cols-2 lg:grid-cols-3` is correct). Headline drops one clamp tier.

**Mobile (<md):**

- Intro headline `clamp(36px, 9vw, 56px)`.
- Wireframe car SVG container capped at `max-h-[40vh]`.
- Side-by-side text+image blocks stack vertically.
- Trust columns become single column with horizontal rules.
- Wireframe car scroll-linked reveal kept (SVG opacity is cheap); collapse to fully drawn under `prefers-reduced-motion`.
- All internal `px-9` → `px-5 sm:px-7 lg:px-9`.

### Footer — `components/layout/editorial-footer.tsx`

**"German Werks." wordmark fix:** replace the `whitespace-nowrap` + `clamp()` `<motion.div>` with an SVG that scales-to-fit:

```tsx
<svg viewBox="0 0 1000 180" preserveAspectRatio="xMinYMid meet" className="w-full">
  <text x="0" y="150" fontFamily="var(--font-serif)" fontSize="180"
        letterSpacing="-7" fill="currentColor">
    German <tspan fontStyle="italic" fill="var(--color-gw-accent)">Werks.</tspan>
  </text>
</svg>
```

Wrapper `<motion.div>` keeps the y/scale/opacity scroll-reveal — only the text rendering moves to SVG.

**Grid:** already `grid-cols-1 sm:grid-cols-2 lg:grid-cols-4`. Bump column header `marginBottom` to 12. Mobile gap `gap-10` → `gap-8`.

**Bottom bar:** already stacks (`flex-col md:flex-row`); tighten mobile gap.

**Padding:** `px-9` → `px-5 sm:px-7 lg:px-9`.

### Smaller pieces

- `marquee.tsx`: add smaller font + tighter padding on `<md`. No structural change.
- `featured-spotlight.tsx`: side-by-side image+copy → stack on mobile.
- `product-carousel.tsx`: existing horizontal swipe carousel; shrink card width to `78vw` on mobile.
- `trust-stats.tsx`: 4-col → 2×2 on mobile.
- `scroll-sections.tsx`: cap any headings exceeding 7vw upper bound; otherwise no structural change.

## Verification

Manual browser checks at 393, 768, 1024, 1512, 1920. Per breakpoint:

- Navbar legible against section background.
- Hero card fits viewport without scroll-trap.
- Catalogue title clear of nav, never wraps to 3 lines.
- Catalogue cards visible (no overflow).
- Atelier wireframe car does not exceed viewport width.
- Footer wordmark fully visible (no clip).
- No horizontal scrollbar on `body`.

Plus `prefers-reduced-motion: reduce` (Chrome DevTools → Rendering): scroll-linked animations are static.

## Out of scope

- Search page, product page, cart UI responsiveness.
- Visual redesign of any section.
- Refactor of section internals beyond responsive prop additions.
- Tablet-only optimizations that aren't covered by the `md:` breakpoint.
