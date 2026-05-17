# Responsiveness Audit & Mobile Layout Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Fix the known desktop layout bugs (catalogue title vs navbar collision, footer wordmark overflow) and deliver a complete mobile experience for the homepage and global layout.

**Architecture:** Mobile branching is handled with Tailwind breakpoint classes (`sm:`/`md:`/`lg:`) rather than render-time JS branching, which avoids SSR/hydration mismatches. A single component split is needed where the horizontal-scroll Chapter 02 panel needs a completely different mobile layout — both versions render and CSS hides the inactive one. All structural changes go through existing components; the only new files are a small `ChapterIntroMobile` + `CategoriesMobile` pair.

**Tech Stack:** Next.js 14 (App Router), Tailwind, framer-motion, TypeScript.

**Spec:** `docs/superpowers/specs/2026-05-16-responsiveness-design.md`

---

## File Map

**New:**
- `components/homepage/chapter-intro-mobile.tsx` — Chapter 02 mobile intro panel
- `components/homepage/categories-mobile.tsx` — vertical stacked catalogue grid

**Modified:**
- `components/layout/editorial-navbar.tsx` — hide inline search/links < `md`
- `components/layout/navbar/mobile-menu.tsx` — full drawer body (search + serif links + clock/location)
- `components/homepage/hero-card.tsx` — mobile sizing + safe area
- `components/homepage/categories.tsx` — desktop h2 clamp cap + section top padding + grid stacking
- `components/homepage/catalogue-chapter.tsx` — desktop vs mobile branch
- `components/homepage/atelier.tsx` — responsive paddings, headline clamps, wireframe car height cap
- `components/homepage/marquee.tsx` — smaller font on `<md`
- `components/layout/editorial-footer.tsx` — SVG fit-to-width wordmark, padding pass

---

## Task 1: Navbar — hide desktop chrome below `md`

**Files:**
- Modify: `components/layout/editorial-navbar.tsx`

- [ ] **Step 1: Hide search input + links row on mobile**

In `components/layout/editorial-navbar.tsx`, change the inline Search wrapper from `<div className="hidden md:block">` to keep that. The links section currently uses `hidden items-center gap-8 md:flex` — already correct.

Change the brand block so the long "GERMAN WERKS — MANUFAKTUR '23" wordmark is hidden below `sm`:

```tsx
// Replace lines around:
//   <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10.5px', ... }}>
//     German Werks <span style={{ opacity: 0.55 }}>— Manufaktur &apos;23</span>
//   </div>

<div className="hidden sm:block" style={{ fontFamily: 'var(--font-mono)', fontSize: '10.5px', letterSpacing: '0.22em', textTransform: 'uppercase' }}>
  German Werks <span style={{ opacity: 0.55 }}>— Manufaktur &apos;23</span>
</div>
```

Change horizontal padding from `px-9` to `px-5 sm:px-7 lg:px-9` and the top row vertical padding from `py-[22px]` to `py-4 sm:py-[18px] lg:py-[22px]`:

```tsx
<nav
  className="pointer-events-none fixed inset-x-0 top-0 z-50 flex items-center justify-between px-5 py-4 sm:px-7 sm:py-[18px] lg:px-9 lg:py-[22px]"
  style={{ color: 'var(--color-gw-bone)', mixBlendMode: 'difference' }}
>
```

- [ ] **Step 2: Run dev server and visually check**

Run: `pnpm dev` (start in background if not already running).
Open http://localhost:3000 at 393×852 viewport (Chrome DevTools).
Expected: navbar shows only crest + cart icon + hamburger (no inline search, no links, no wordmark). At 640px+: wordmark appears. At 768px+: search + links appear.

- [ ] **Step 3: Commit**

```bash
git add components/layout/editorial-navbar.tsx
git commit -m "feat(navbar): collapse to crest + cart + menu on mobile"
```

---

## Task 2: Mobile drawer body

**Files:**
- Modify: `components/layout/navbar/mobile-menu.tsx`

The existing file has a working open/close + slide transition but its panel content is plain. Rewrite the panel body to match the editorial visual language.

- [ ] **Step 1: Replace the panel body**

Replace the `<Dialog.Panel>` body content (everything inside `<Dialog.Panel className="...">...</Dialog.Panel>`) with this — keep the panel className but switch the bg to ink, and replace its inner content:

```tsx
<Dialog.Panel
  className="fixed inset-0 flex h-full w-full flex-col"
  style={{
    background: 'var(--color-gw-ink)',
    color: 'var(--color-gw-bone)',
  }}
>
  {/* Top row: close button */}
  <div className="flex items-center justify-between px-5 py-4">
    <span
      style={{
        fontFamily: 'var(--font-mono)',
        fontSize: '10.5px',
        letterSpacing: '0.22em',
        textTransform: 'uppercase',
        opacity: 0.55,
      }}
    >
      Menu
    </span>
    <button
      onClick={closeMobileMenu}
      aria-label="Close mobile menu"
      className="flex h-11 w-11 items-center justify-center rounded-md"
      style={{ border: '1px solid rgba(239, 234, 226, 0.18)' }}
    >
      <XMarkIcon className="h-5 w-5" />
    </button>
  </div>

  {/* Search */}
  <div className="px-5 pb-6">
    <Suspense fallback={<SearchSkeleton />}>
      <Search />
    </Suspense>
  </div>

  {/* Links */}
  <nav className="flex flex-1 flex-col gap-1 px-5">
    {[
      { title: 'Index', path: '/' },
      ...menu,
      { title: 'Journal', path: '#' },
      { title: 'Contact', path: '#' },
    ].map((item) => (
      <Link
        key={item.title}
        href={item.path}
        onClick={closeMobileMenu}
        className="block py-3"
        style={{
          fontFamily: 'var(--font-serif)',
          fontStyle: 'italic',
          fontWeight: 400,
          fontSize: 'clamp(34px, 9vw, 52px)',
          lineHeight: 1.05,
          letterSpacing: '-0.02em',
          borderBottom: '1px solid rgba(239, 234, 226, 0.08)',
        }}
      >
        {item.title}
      </Link>
    ))}
  </nav>

  {/* Bottom rail: location */}
  <div
    className="flex items-center justify-between px-5 py-6"
    style={{
      fontFamily: 'var(--font-mono)',
      fontSize: '10.5px',
      letterSpacing: '0.16em',
      textTransform: 'uppercase',
      opacity: 0.55,
    }}
  >
    <span>Vancouver · BC</span>
    <span>49.18°N · 122.92°W</span>
  </div>
</Dialog.Panel>
```

Also remove the old slide direction (currently slides from left). Change `Transition.Child` enter/leave classes to slide from right:

```tsx
enterFrom="translate-x-full"
enterTo="translate-x-0"
leaveFrom="translate-x-0"
leaveTo="translate-x-full"
```

And update the hamburger trigger button border styling to match the editorial language:

```tsx
<button
  onClick={openMobileMenu}
  aria-label="Open mobile menu"
  className="flex h-10 w-10 items-center justify-center rounded-md md:hidden"
  style={{ border: '1px solid currentColor', color: 'inherit' }}
>
  <Bars3Icon className="h-4 w-4" />
</button>
```

- [ ] **Step 2: Visually check the drawer**

At 393px viewport, tap hamburger.
Expected: drawer slides from right, dark ink background, search input at top, large serif italic links (Index, Body & Aero, Carbon Fibre, Performance, Journal, Contact), location strip at bottom. Tap close, drawer slides out right.

- [ ] **Step 3: Commit**

```bash
git add components/layout/navbar/mobile-menu.tsx
git commit -m "feat(navbar): editorial mobile drawer with serif links + search"
```

---

## Task 3: Hero card mobile sizing

**Files:**
- Modify: `components/homepage/hero-card.tsx`

- [ ] **Step 1: Update outer section + card sizing**

Find the outer `<section>` (around line 158):

```tsx
<section className="grain relative h-screen min-h-[760px] overflow-hidden" ...>
```

Replace with:

```tsx
<section className="grain relative overflow-hidden" style={{ background: 'var(--color-gw-ink)', minHeight: '100svh', height: '100svh' }}>
```

Find the floating card `<motion.div>` style (around line 187):

```tsx
style={{
  width: 'min(1280px, 86vw)',
  height: 'min(560px, 62vh)',
  ...
}}
```

Replace with a responsive width/height (Tailwind doesn't have arbitrary `svh` modifier easily for motion style, so we set via class + style):

```tsx
className={`overflow-hidden rounded-[18px] sm:rounded-[22px] will-change-transform ${revealed ? 'is-revealed' : 'is-animating'}`}
style={{
  width: 'min(1280px, 94vw)',
  height: 'min(560px, 70svh)',
  minHeight: '480px',
  background: 'var(--color-gw-bone)',
  boxShadow: '0 60px 120px -30px rgba(0,0,0,0.55), 0 0 0 1px rgba(255,255,255,0.04)',
  y: cardTranslateY,
  scale: cardScale,
  opacity: cardOpacity,
}}
```

- [ ] **Step 2: Update inner padding and tri-row**

Find the inner padding wrapper (around line 197):

```tsx
<div className="absolute inset-0 flex flex-col p-[22px_26px] lg:p-[26px_30px]">
```

Replace with:

```tsx
<div className="absolute inset-0 flex flex-col p-[18px_18px] sm:p-[22px_26px] lg:p-[26px_30px]">
```

Find the top tri-row (`<div className="hidden items-center justify-between sm:flex"`) — leave as-is (it already hides below sm). Immediately above it (or just below), add a mobile-only single line:

```tsx
{/* Mobile top line */}
<div className="flex items-center justify-center sm:hidden" style={{ fontFamily: 'var(--font-mono)', fontSize: '9.5px', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--color-gw-ink)', opacity: 0.6 }}>
  Index / 01 — Manifest
</div>
```

- [ ] **Step 3: Scale down the h1 clamp**

Find the h1 style (around line 215):

```tsx
fontSize: 'clamp(40px, 8vw, 160px)',
```

Replace with:

```tsx
fontSize: 'clamp(34px, 9.5vw, 160px)',
```

- [ ] **Step 4: Hide outer coordinates rail on phones, keep Scroll cue**

Find the bottom-left and bottom-right coord rails (around lines 266-273):

```tsx
<div className="absolute bottom-9 left-9 z-[5] flex flex-col gap-1.5" ...>
  <span style={{ opacity: 0.55 }}>Reel · 2026</span>
  <span>Scroll ↓</span>
</div>
<div className="absolute bottom-9 right-9 z-[5] flex flex-col gap-1.5 text-right" ...>
  <span style={{ opacity: 0.55 }}>49.180° N · 122.922° W</span>
  <span>BC · 12°C · LIGHT RAIN</span>
</div>
```

Replace with:

```tsx
{/* Bottom rails — desktop only */}
<div className="absolute bottom-6 left-5 z-[5] hidden flex-col gap-1.5 sm:flex sm:bottom-9 sm:left-9" style={{ color: 'var(--color-gw-bone)', fontFamily: 'var(--font-mono)', fontSize: '10.5px', letterSpacing: '0.16em', textTransform: 'uppercase' }}>
  <span style={{ opacity: 0.55 }}>Reel · 2026</span>
  <span>Scroll ↓</span>
</div>
<div className="absolute bottom-9 right-9 z-[5] hidden flex-col gap-1.5 text-right sm:flex" style={{ color: 'var(--color-gw-bone)', fontFamily: 'var(--font-mono)', fontSize: '10.5px', letterSpacing: '0.16em', textTransform: 'uppercase' }}>
  <span style={{ opacity: 0.55 }}>49.180° N · 122.922° W</span>
  <span>BC · 12°C · LIGHT RAIN</span>
</div>

{/* Mobile-only scroll cue */}
<div className="absolute bottom-5 left-1/2 z-[5] -translate-x-1/2 sm:hidden" style={{ color: 'var(--color-gw-bone)', fontFamily: 'var(--font-mono)', fontSize: '10.5px', letterSpacing: '0.18em', textTransform: 'uppercase', opacity: 0.7 }}>
  Scroll ↓
</div>
```

- [ ] **Step 5: Visually check**

At 393, 768, 1024, 1512 viewports. Expected:
- 393: card is ~94vw wide, title fits comfortably on three lines, no cert plate, single centered "Scroll ↓" cue at bottom.
- 768: card a bit wider, cert plate still hidden, two corner rails appear.
- 1024+: cert plate appears beside title, both corner rails visible.

- [ ] **Step 6: Commit**

```bash
git add components/homepage/hero-card.tsx
git commit -m "feat(hero): responsive sizing + mobile scroll cue"
```

---

## Task 4: Catalogue desktop fix — h2 clamp + section padding

**Files:**
- Modify: `components/homepage/categories.tsx`

- [ ] **Step 1: Adjust section padding and h2 clamp**

Find the `<section>` opening (around line 112):

```tsx
<section className="grain grain-soft relative flex h-full flex-col justify-center px-9 py-16" ...>
```

Replace with:

```tsx
<section className="grain grain-soft relative flex h-full flex-col justify-center px-5 pb-12 pt-[120px] sm:px-7 sm:py-16 sm:pt-[120px] lg:px-9" style={{ background: 'var(--color-gw-paper)', color: 'var(--color-gw-ink)' }}>
```

Find the section head grid (around line 116):

```tsx
className="mb-12 grid items-end gap-[60px]"
style={{ gridTemplateColumns: '200px 1fr', x: headX, opacity: headOpacity }}
```

Replace with:

```tsx
className="mb-10 grid items-end gap-6 sm:mb-12 sm:gap-[60px]"
style={{ gridTemplateColumns: '180px 1fr', x: headX, opacity: headOpacity }}
```

Find the h2 (around line 122):

```tsx
<h2 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(48px, 7vw, 120px)', lineHeight: 0.92, letterSpacing: '-0.03em', fontWeight: 400 }}>
```

Replace with:

```tsx
<h2 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(40px, 6vw, 88px)', lineHeight: 0.94, letterSpacing: '-0.03em', fontWeight: 400 }}>
```

- [ ] **Step 2: Visually check**

At 1512 and 1920 widths.
Expected: "Three pillars. One obsession." now sits well below the fixed navbar with at least 30px of clear space. Title is two lines, never three. Catalogue card grid still fits within viewport height (no double-scroll).

- [ ] **Step 3: Commit**

```bash
git add components/homepage/categories.tsx
git commit -m "fix(catalogue): cap h2 clamp + add top padding to clear navbar"
```

---

## Task 5: Catalogue mobile — split into stacked layout

**Files:**
- Create: `components/homepage/chapter-intro-mobile.tsx`
- Create: `components/homepage/categories-mobile.tsx`
- Modify: `components/homepage/catalogue-chapter.tsx`

- [ ] **Step 1: Create ChapterIntroMobile**

```tsx
// components/homepage/chapter-intro-mobile.tsx
'use client';

import { motion } from 'framer-motion';

export function ChapterIntroMobile({
  index,
  title,
  subtitle,
}: {
  index: string;
  title: string;
  subtitle: string;
}) {
  return (
    <section
      className="grain relative flex flex-col items-center justify-center overflow-hidden px-5 py-24 text-center"
      style={{
        background: 'var(--color-gw-ink)',
        color: 'var(--color-gw-bone)',
        minHeight: '80svh',
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 0.9, ease: [0.18, 0.7, 0.2, 1] }}
        className="relative z-[2]"
      >
        <div
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '10px',
            letterSpacing: '0.22em',
            textTransform: 'uppercase',
            color: 'var(--color-gw-accent)',
            marginBottom: 16,
          }}
        >
          {index}
        </div>
        <div
          style={{
            fontFamily: 'var(--font-serif)',
            fontSize: 'clamp(56px, 14vw, 96px)',
            fontWeight: 400,
            fontStyle: 'italic',
            letterSpacing: '-0.03em',
            lineHeight: 0.92,
          }}
        >
          {title}
        </div>
        <div
          className="mx-auto mt-5"
          style={{
            height: 1,
            width: 80,
            background: 'var(--color-gw-accent)',
            opacity: 0.6,
          }}
        />
        <div
          className="mt-3"
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '10.5px',
            letterSpacing: '0.16em',
            textTransform: 'uppercase',
            opacity: 0.55,
          }}
        >
          {subtitle}
        </div>
        <div
          className="mt-12"
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '10px',
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
            opacity: 0.5,
          }}
        >
          Scroll ↓
        </div>
      </motion.div>
    </section>
  );
}
```

- [ ] **Step 2: Create CategoriesMobile**

```tsx
// components/homepage/categories-mobile.tsx
'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';

const CATEGORIES = [
  {
    no: 'Vol. 01',
    name: 'Body',
    italic: '& Aero',
    sub: 'Splitters · Diffusers · Wings',
    count: '48 pieces',
    bg: 'linear-gradient(135deg, #1a1816 0%, #2a2825 60%, #0a0a08 100%)',
    accent: 'linear-gradient(120deg, transparent 30%, rgba(181,51,25,0.18) 60%, transparent 100%)',
  },
  {
    no: 'Vol. 02',
    name: 'Carbon',
    italic: 'Fibre',
    sub: 'Pre-preg · 2x2 Twill',
    count: '62 pieces',
    bg: 'linear-gradient(135deg, #2a2825 0%, #14130f 100%)',
    accent:
      'repeating-linear-gradient(45deg, transparent 0 6px, rgba(0,0,0,0.4) 6px 12px), repeating-linear-gradient(-45deg, transparent 0 6px, rgba(255,255,255,0.04) 6px 12px)',
  },
  {
    no: 'Vol. 03',
    name: 'Perform-',
    italic: 'ance',
    sub: 'Intake · ECU · Cooling',
    count: '37 pieces',
    bg: 'linear-gradient(135deg, #1a1916 0%, #0a0a08 100%)',
    accent: 'radial-gradient(circle at 30% 70%, rgba(181,51,25,0.3), transparent 50%)',
  },
];

export function CategoriesMobile() {
  return (
    <section
      className="grain grain-soft relative flex flex-col gap-6 px-5 pb-16 pt-[100px]"
      style={{ background: 'var(--color-gw-paper)', color: 'var(--color-gw-ink)' }}
    >
      {/* Section head */}
      <div className="mb-2">
        <div
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 11,
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
            opacity: 0.6,
          }}
        >
          <span>Index — 02</span>
          <strong className="mt-1.5 block text-[13px] font-medium" style={{ opacity: 1 }}>
            The Catalogue
          </strong>
        </div>
        <h2
          className="mt-4"
          style={{
            fontFamily: 'var(--font-serif)',
            fontSize: 'clamp(40px, 11vw, 64px)',
            lineHeight: 0.95,
            letterSpacing: '-0.03em',
            fontWeight: 400,
          }}
        >
          Three pillars.{' '}
          <em style={{ fontStyle: 'italic', color: 'var(--color-gw-accent)' }}>One obsession.</em>
        </h2>
      </div>

      {/* Stacked cards */}
      {CATEGORIES.map((c, i) => (
        <motion.div
          key={c.name}
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.7, delay: i * 0.05, ease: [0.18, 0.7, 0.2, 1] }}
        >
          <Link
            href="/search"
            className="relative block overflow-hidden rounded-[14px]"
            style={{
              aspectRatio: '4/5',
              background: 'var(--color-gw-ink)',
              isolation: 'isolate',
            }}
          >
            <div
              className="absolute"
              style={{
                inset: '-6%',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                background: c.bg,
                filter: 'grayscale(0.85) contrast(1.1)',
              }}
            >
              <div className="absolute inset-0" style={{ background: c.accent }} />
            </div>
            <div
              className="absolute inset-0"
              style={{
                background:
                  'linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.1) 50%, rgba(0,0,0,0.4) 100%)',
              }}
            />
            <div
              className="absolute inset-0 z-[2] flex flex-col justify-between p-5"
              style={{ color: 'var(--color-gw-bone)' }}
            >
              <div className="flex items-start justify-between">
                <span
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: 10,
                    letterSpacing: '0.16em',
                    textTransform: 'uppercase',
                    opacity: 0.85,
                  }}
                >
                  {c.no}
                </span>
                <span
                  className="rounded-full border px-2.5 py-1"
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: 9,
                    letterSpacing: '0.18em',
                    textTransform: 'uppercase',
                    borderColor: 'rgba(255,255,255,0.45)',
                  }}
                >
                  In stock
                </span>
              </div>
              <div className="flex flex-col gap-2">
                <h3
                  style={{
                    fontFamily: 'var(--font-serif)',
                    fontSize: 44,
                    lineHeight: 0.92,
                    letterSpacing: '-0.02em',
                    fontWeight: 400,
                  }}
                >
                  {c.name}
                  <br />
                  <em style={{ fontStyle: 'italic' }}>{c.italic}</em>
                </h3>
                <div
                  className="mt-1 flex justify-between"
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '10px',
                    letterSpacing: '0.14em',
                    textTransform: 'uppercase',
                    opacity: 0.7,
                  }}
                >
                  <span>{c.sub}</span>
                  <span>{c.count}</span>
                </div>
              </div>
            </div>
          </Link>
        </motion.div>
      ))}
    </section>
  );
}
```

- [ ] **Step 3: Update CatalogueChapter to branch**

Replace `components/homepage/catalogue-chapter.tsx` entirely:

```tsx
'use client';

import { HorizontalChapter } from './horizontal-chapter';
import { Categories } from './categories';
import { ChapterIntroMobile } from './chapter-intro-mobile';
import { CategoriesMobile } from './categories-mobile';

export function CatalogueChapter() {
  return (
    <>
      {/* Desktop ≥ md: horizontal cinematic chapter */}
      <div className="hidden md:block">
        <HorizontalChapter
          index="Chapter 02"
          title="The Catalogue."
          subtitle="Three volumes · 147 pieces · Certified"
        >
          {(progress) => <Categories progress={progress} />}
        </HorizontalChapter>
      </div>

      {/* Mobile < md: stacked vertical chapter */}
      <div className="md:hidden">
        <ChapterIntroMobile
          index="Chapter 02"
          title="The Catalogue."
          subtitle="Three volumes · 147 pieces · Certified"
        />
        <CategoriesMobile />
      </div>
    </>
  );
}
```

- [ ] **Step 4: Visually check**

At 393px: chapter intro page appears (dark, full-screen, "The Catalogue." in serif italic, scroll cue), then below it three pillar cards stacked vertically with the "Three pillars. One obsession." heading.
At 768px+: original horizontal slide chapter still works as before.

- [ ] **Step 5: Commit**

```bash
git add components/homepage/chapter-intro-mobile.tsx components/homepage/categories-mobile.tsx components/homepage/catalogue-chapter.tsx
git commit -m "feat(catalogue): mobile stacked layout (drop horizontal slide < md)"
```

---

## Task 6: Atelier responsive pass

**Files:**
- Modify: `components/homepage/atelier.tsx`

- [ ] **Step 1: Section padding + max-width**

Find the `<section>` (around line 214):

```tsx
className="grain relative overflow-hidden px-9 py-[160px]"
```

Replace with:

```tsx
className="grain relative overflow-hidden px-5 py-24 sm:px-7 sm:py-32 lg:px-9 lg:py-[160px]"
```

- [ ] **Step 2: Head grid responsive**

Find the head grid (around line 241):

```tsx
<div className="grid items-end border-b pb-10" style={{ gridTemplateColumns: '1fr auto', borderColor: 'rgba(239, 234, 226, 0.14)' }}>
```

Replace with:

```tsx
<div className="grid items-end gap-6 border-b pb-8 sm:gap-0 sm:pb-10" style={{ gridTemplateColumns: '1fr auto', borderColor: 'rgba(239, 234, 226, 0.14)' }}>
```

Find the right side of head with `<div className="flex gap-10" ...>` — make it wrap nicely on mobile:

```tsx
<div className="hidden gap-10 sm:flex" style={{ fontFamily: 'var(--font-mono)', fontSize: '9.5px', letterSpacing: '0.14em', textTransform: 'uppercase' }}>
  <span>Tech. drawing · E63 ref</span>
  <span style={{ opacity: 0.55 }}>{String(Math.round(progress * 100)).padStart(3, '0')} · reveal</span>
</div>
```

- [ ] **Step 3: Headline clamp**

Find the h2 (around line 259):

```tsx
fontSize: 'clamp(72px, 11vw, 200px)',
```

Replace with:

```tsx
fontSize: 'clamp(48px, 11vw, 160px)',
```

And reduce the inline `padding: '60px 0 30px'` to:

```tsx
padding: '40px 0 24px',
```

(Keep the `className="py-[60px_30px]"` line — actually that's an invalid Tailwind class; the inline padding wins. Leave the className but it's a no-op.)

- [ ] **Step 4: Wireframe car height cap**

Find the wireframe car wrapper (around line 292):

```tsx
className="mx-auto max-w-[1300px] will-change-transform"
style={{ y: carTranslateY, margin: '40px auto 60px', position: 'relative' }}
```

Replace with:

```tsx
className="mx-auto max-w-[1300px] will-change-transform"
style={{ y: carTranslateY, margin: '24px auto 40px', position: 'relative', maxHeight: '46svh' }}
```

Note: `maxHeight` constrains the wrapper; the SVG inside scales with viewBox.

- [ ] **Step 5: Manifest text clamp**

Find the manifest `<p>` (around line 307):

```tsx
fontSize: 'clamp(28px, 3.4vw, 56px)',
```

Replace with:

```tsx
fontSize: 'clamp(20px, 4.4vw, 52px)',
```

And reduce its bottom margin for mobile by adding responsive class:

```tsx
className="atelier-manifest"
```

And add CSS-in-JS-equivalent via inline `margin: '32px 0 60px'` (replace the previous `margin: '40px 0 80px'`).

- [ ] **Step 6: Trust columns**

Find the trust columns grid (around line 424):

```tsx
className="grid grid-cols-1 gap-9 border-t pt-10 md:grid-cols-3"
```

This is already responsive. Leave as-is. Just verify the rendered content (mono fontSize 11.5/10.5px) looks fine on mobile — it should.

- [ ] **Step 7: Floating CTA — already hidden on mobile**

The Atelier floating CTA already has `hidden ... md:flex` — leave as-is.

- [ ] **Step 8: Honor prefers-reduced-motion for wireframe car reveal**

The wireframe car SVG opacity is driven by `reveal` from `useTransform(scrollYProgress, ...)`. Under reduced motion we want it fully drawn at all times.

At the top of the `Atelier` component (after the existing `useScroll` declarations and before the JSX), add:

```tsx
import { useReducedMotion } from 'framer-motion';
// ... inside the component:
const prefersReducedMotion = useReducedMotion();
```

Then, where the `reveal` motion value is read by `WireframeCar`, override to fully drawn when reduced:

```tsx
<WireframeCar progress={prefersReducedMotion ? 1 : reveal} />
```

Also, for the manifest words that translate up from below using `seen`, default `seen` to `true` under reduced motion. Find the `seen` state initialization (likely `useState(false)`) and replace with:

```tsx
const [seen, setSeen] = useState(false);
// ...existing motion-value-event that sets setSeen(true)...
const effectiveSeen = prefersReducedMotion ? true : seen;
```

Then replace every reference to `seen` inside the JSX with `effectiveSeen` (there are ~4 references in the title and manifest blocks — use Find/Replace within this component scope only).

- [ ] **Step 9: Visually check**

At 393px: headline reads "By enthusiasts, / for enthusiasts." comfortably, wireframe car fits without horizontal scroll, manifest paragraph reads as a normal column, trust columns stack vertically, no floating right-edge CTA.
At 768px: floating CTA appears.
At 1512+: unchanged from before.

- [ ] **Step 10: Commit**

```bash
git add components/homepage/atelier.tsx
git commit -m "feat(atelier): responsive layout + reduced-motion handling"
```

---

## Task 7: Footer — SVG fit-to-width wordmark

**Files:**
- Modify: `components/layout/editorial-footer.tsx`

- [ ] **Step 1: Replace the wordmark motion.div**

Find the wordmark (lines 22–38):

```tsx
<motion.div
  className="mb-[60px] whitespace-nowrap"
  style={{
    fontFamily: 'var(--font-serif)',
    fontSize: 'clamp(120px, 18vw, 300px)',
    lineHeight: 0.85,
    letterSpacing: '-0.04em',
    fontWeight: 400,
    y: brandY,
    scale: brandScale,
    opacity: brandOpacity,
    transformOrigin: 'left center',
  }}
>
  German <em style={{ fontStyle: 'italic', color: 'var(--color-gw-accent)' }}>Werks.</em>
</motion.div>
```

Replace with:

```tsx
<motion.div
  className="mb-10 sm:mb-[60px]"
  style={{
    y: brandY,
    scale: brandScale,
    opacity: brandOpacity,
    transformOrigin: 'left center',
  }}
>
  <svg
    viewBox="0 0 1000 200"
    preserveAspectRatio="xMinYMid meet"
    className="block w-full"
    aria-label="German Werks."
  >
    <text
      x="0"
      y="160"
      fontFamily="var(--font-serif)"
      fontSize="200"
      letterSpacing="-7"
      fill="currentColor"
      fontWeight={400}
    >
      German{' '}
      <tspan fontStyle="italic" fill="var(--color-gw-accent)">
        Werks.
      </tspan>
    </text>
  </svg>
</motion.div>
```

- [ ] **Step 2: Section padding pass**

Find the footer opening (line 21):

```tsx
<footer ref={ref} className="grain grain-soft relative overflow-hidden px-9 pb-9 pt-20" ...>
```

Replace with:

```tsx
<footer
  ref={ref}
  className="grain grain-soft relative overflow-hidden px-5 pb-7 pt-16 sm:px-7 sm:pt-20 lg:px-9 lg:pb-9"
  style={{ background: 'var(--color-gw-ink)', color: 'var(--color-gw-bone)' }}
>
```

- [ ] **Step 3: Grid gap tweak**

Find the grid (around line 42):

```tsx
className="grid grid-cols-1 gap-10 border-t py-10 sm:grid-cols-2 lg:grid-cols-4"
```

Replace with:

```tsx
className="grid grid-cols-1 gap-8 border-t py-10 sm:grid-cols-2 sm:gap-10 lg:grid-cols-4"
```

- [ ] **Step 4: Visually check**

At 393, 768, 1512, 1920: "German Werks." now scales smoothly to viewport width without clipping. Footer columns stack to 1 / 2 / 4 across breakpoints.

- [ ] **Step 5: Commit**

```bash
git add components/layout/editorial-footer.tsx
git commit -m "fix(footer): SVG fit-to-width wordmark + responsive padding"
```

---

## Task 8: Marquee — smaller font on mobile

**Files:**
- Modify: `components/homepage/marquee.tsx`

- [ ] **Step 1: Update font size + padding**

Find the inner motion.div (around line 60):

```tsx
<motion.div
  className="flex gap-16 whitespace-nowrap"
  style={{
    animation: `marquee 38s linear infinite${reverse ? ' reverse' : ''}`,
    fontFamily: 'var(--font-serif)',
    fontSize: 52,
    fontStyle: 'italic',
    fontWeight: 400,
    letterSpacing: '-0.01em',
    x: translateX,
  }}
>
```

Replace fontSize 52 with a clamp and reduce gap:

```tsx
<motion.div
  className="flex gap-10 whitespace-nowrap sm:gap-16"
  style={{
    animation: `marquee 38s linear infinite${reverse ? ' reverse' : ''}`,
    fontFamily: 'var(--font-serif)',
    fontSize: 'clamp(28px, 5vw, 52px)',
    fontStyle: 'italic',
    fontWeight: 400,
    letterSpacing: '-0.01em',
    x: translateX,
  }}
>
```

Find the outer motion.div padding (around line 47):

```tsx
className="relative border-y py-[22px]"
```

Replace with:

```tsx
className="relative border-y py-3 sm:py-[22px]"
```

- [ ] **Step 2: Visually check**

At 393: marquees feel proportionate to mobile typography (not 52px monstrosity). Animation still smooth.

- [ ] **Step 3: Commit**

```bash
git add components/homepage/marquee.tsx
git commit -m "feat(marquee): responsive font + padding for mobile"
```

---

## Task 9: Final verification pass

- [ ] **Step 1: Verify TypeScript compiles**

Run: `pnpm tsc --noEmit 2>&1 | head -40`
Expected: no new errors introduced by this work.

- [ ] **Step 2: Verify lint passes**

Run: `pnpm lint 2>&1 | tail -20`
Expected: no new errors introduced.

- [ ] **Step 3: Manual viewport checks**

Start dev server (if not already): `pnpm dev`.

For each viewport size, open Chrome DevTools device emulator and load http://localhost:3000. Walk through the page from top to bottom and verify the checklist:

**Viewports:** 393×852, 768×1024, 1024×768, 1512×982, 1920×1080.

**Checklist per viewport:**
- [ ] Navbar visible & legible (no overlap with content text)
- [ ] Hero card fits within viewport (no rigid 760px min on phones)
- [ ] Marquee text proportionate, animates smoothly
- [ ] Catalogue chapter:
  - On phones: dark intro panel → stacked pillar cards.
  - On `md+`: original horizontal slide reveals the three-pillar grid.
  - Catalogue h2 never collides with navbar.
- [ ] Atelier section: headline fits, wireframe car doesn't overflow, manifest paragraph readable, trust columns stack correctly.
- [ ] Footer: "German Werks." fully visible at every width, no clip on right.
- [ ] No horizontal scrollbar on `body` (use DevTools Console: `document.body.scrollWidth === window.innerWidth`).

- [ ] **Step 4: Reduced motion check**

In Chrome DevTools → Rendering → "Emulate CSS media feature `prefers-reduced-motion`" → `reduce`. Reload page. Scroll through.
Expected: parallax/scroll-linked transforms become static or near-static. Page remains usable; no broken layout.

If anything important is animation-driven for visibility (e.g., something is invisible until scroll), make it visible by default under `prefers-reduced-motion`. This applies primarily to Atelier's manifest words — verify they're readable without the entry animation.

- [ ] **Step 5: Commit any verification fixes**

If any visual bugs surfaced during verification that weren't caught in earlier tasks, fix them inline and commit:

```bash
git add <files>
git commit -m "fix: <specific bug found during verification pass>"
```

If no fixes needed, skip the commit.

---

## Done

The homepage is now responsive across 393 → 1920 widths, the desktop layout bugs are fixed, and `prefers-reduced-motion` is honored.
