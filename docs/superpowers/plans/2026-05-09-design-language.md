# GermanWerks Design Language Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement the GermanWerks design language — Mercedes wireframe hero, floating glass navbar, storytelling homepage flow, and clean minimal product cards.

**Architecture:** Replace the current abstract 3D hero with a Mercedes AMG GT wireframe built in Three.js. Restyle the navbar as a floating frosted-glass bar. Rebuild the homepage as: hero → featured product spotlight → product carousel → trust stats strip. Reuse existing animation components (ScrollReveal, TiltCard, ProductParallax, PageTransition).

**Tech Stack:** Next.js 14+ (App Router), React Three Fiber, Drei, Framer Motion, Tailwind CSS v4

---

## File Structure

| Action | File | Responsibility |
|--------|------|---------------|
| Create | `components/3d/mercedes-hero.tsx` | Mercedes wireframe 3D scene + hero overlay |
| Create | `components/3d/car-wireframe.tsx` | Mercedes AMG GT geometry (vertices, edges, wheels, lights) |
| Create | `components/homepage/featured-spotlight.tsx` | Featured product split layout section |
| Create | `components/homepage/product-carousel.tsx` | Horizontal scrolling product carousel |
| Create | `components/homepage/trust-stats.tsx` | Trust/specs strip |
| Create | `components/homepage/scroll-indicator.tsx` | Animated scroll-down chevron |
| Modify | `components/layout/navbar/index.tsx` | Floating glass bar styling |
| Modify | `components/layout/navbar/mobile-menu.tsx` | Glass aesthetic on mobile menu |
| Modify | `components/grid/tile.tsx` | Clean minimal card style |
| Modify | `components/label.tsx` | Update price badge color from blue to accent |
| Modify | `app/page.tsx` | New homepage flow |
| Delete | `components/3d/hero-scene.tsx` | Replaced by mercedes-hero |
| Delete | `components/3d/floating-geometry.tsx` | No longer used |

---

## Phase 1: Mercedes Wireframe Hero

### Task 1: Create Car Wireframe Geometry

**Files:**
- Create: `components/3d/car-wireframe.tsx`

- [ ] **Step 1: Create the wireframe geometry component**

Create `components/3d/car-wireframe.tsx`. This defines the Mercedes AMG GT silhouette as line segments in Three.js:

```tsx
'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

function createCarGeometry() {
  const points: THREE.Vector3[] = [];
  const addLine = (x1: number, y1: number, z1: number, x2: number, y2: number, z2: number) => {
    points.push(new THREE.Vector3(x1, y1, z1), new THREE.Vector3(x2, y2, z2));
  };

  // Body profile (right side) — AMG GT proportions: long hood, low cabin, fastback
  const bodyProfile = [
    [-2.0, 0.0], [-1.8, 0.0], [-1.7, 0.3], [-1.5, 0.6], [-1.2, 0.85],
    [-0.6, 1.05], [0.0, 1.15], [0.3, 1.2], [0.6, 1.2], [1.0, 1.15],
    [1.3, 1.05], [1.5, 0.85], [1.6, 0.6], [1.7, 0.3], [1.8, 0.0], [2.0, 0.0],
  ];

  // Draw body profile on both sides (z = +-0.5)
  for (let side = -1; side <= 1; side += 2) {
    const z = side * 0.5;
    for (let i = 0; i < bodyProfile.length - 1; i++) {
      addLine(
        bodyProfile[i]![0]!, bodyProfile[i]![1]!, z,
        bodyProfile[i + 1]![0]!, bodyProfile[i + 1]![1]!, z
      );
    }
  }

  // Cross-members connecting sides
  const crossPoints = [0, 2, 4, 6, 8, 10, 12, 14];
  for (const idx of crossPoints) {
    const p = bodyProfile[idx]!;
    addLine(p[0]!, p[1]!, -0.5, p[0]!, p[1]!, 0.5);
  }

  // Roof / cabin outline
  const roofProfile = [
    [-0.2, 1.2], [0.0, 1.35], [0.3, 1.38], [0.6, 1.35], [0.9, 1.25], [1.1, 1.1],
  ];
  for (let side = -1; side <= 1; side += 2) {
    const z = side * 0.4;
    for (let i = 0; i < roofProfile.length - 1; i++) {
      addLine(
        roofProfile[i]![0]!, roofProfile[i]![1]!, z,
        roofProfile[i + 1]![0]!, roofProfile[i + 1]![1]!, z
      );
    }
  }
  // Roof cross-members
  for (const p of roofProfile) {
    addLine(p[0]!, p[1]!, -0.4, p[0]!, p[1]!, 0.4);
  }

  // A-pillar and C-pillar
  for (let side = -1; side <= 1; side += 2) {
    const z = side * 0.45;
    addLine(-0.2, 1.15, z, -0.1, 1.3, z);  // A-pillar
    addLine(1.0, 1.1, z, 1.1, 1.05, z);     // C-pillar
  }

  // Lower body line (side skirt)
  for (let side = -1; side <= 1; side += 2) {
    addLine(-1.5, 0.15, side * 0.5, 1.5, 0.15, side * 0.5);
  }

  // Door line
  for (let side = -1; side <= 1; side += 2) {
    addLine(0.4, 1.2, side * 0.5, 0.4, 0.15, side * 0.5);
  }

  // Hood line
  for (let side = -1; side <= 1; side += 2) {
    addLine(-1.2, 0.85, side * 0.45, -0.2, 1.05, side * 0.45);
  }

  return points;
}

function createWheelGeometry(cx: number, radius: number) {
  const points: THREE.Vector3[] = [];
  const addLine = (x1: number, y1: number, z1: number, x2: number, y2: number, z2: number) => {
    points.push(new THREE.Vector3(x1, y1, z1), new THREE.Vector3(x2, y2, z2));
  };

  // Wheel circles on both sides
  const segments = 24;
  for (let side = -1; side <= 1; side += 2) {
    const z = side * 0.55;
    for (let i = 0; i < segments; i++) {
      const a1 = (i / segments) * Math.PI * 2;
      const a2 = ((i + 1) / segments) * Math.PI * 2;
      addLine(
        cx + Math.cos(a1) * radius, Math.sin(a1) * radius, z,
        cx + Math.cos(a2) * radius, Math.sin(a2) * radius, z
      );
    }
    // Spokes
    for (let i = 0; i < 5; i++) {
      const a = (i / 5) * Math.PI * 2;
      addLine(cx, 0, z, cx + Math.cos(a) * radius * 0.7, Math.sin(a) * radius * 0.7, z);
    }
    // Hub circle
    for (let i = 0; i < segments; i++) {
      const a1 = (i / segments) * Math.PI * 2;
      const a2 = ((i + 1) / segments) * Math.PI * 2;
      const r = radius * 0.25;
      addLine(
        cx + Math.cos(a1) * r, Math.sin(a1) * r, z,
        cx + Math.cos(a2) * r, Math.sin(a2) * r, z
      );
    }
  }
  // Axle connecting both sides
  addLine(cx, 0, -0.55, cx, 0, 0.55);

  return points;
}

export function CarWireframe() {
  const groupRef = useRef<THREE.Group>(null);

  const { bodyGeometry, frontWheelGeometry, rearWheelGeometry } = useMemo(() => {
    const bodyPoints = createCarGeometry();
    const bodyGeo = new THREE.BufferGeometry().setFromPoints(bodyPoints);

    const frontPoints = createWheelGeometry(-1.3, 0.28);
    const frontGeo = new THREE.BufferGeometry().setFromPoints(frontPoints);

    const rearPoints = createWheelGeometry(1.3, 0.28);
    const rearGeo = new THREE.BufferGeometry().setFromPoints(rearPoints);

    return { bodyGeometry: bodyGeo, frontWheelGeometry: frontGeo, rearWheelGeometry: rearGeo };
  }, []);

  useFrame((state) => {
    if (!groupRef.current) return;
    groupRef.current.rotation.y = state.clock.elapsedTime * 0.15;
  });

  return (
    <group ref={groupRef} position={[0, -0.3, 0]}>
      {/* Car body wireframe */}
      <lineSegments geometry={bodyGeometry}>
        <lineBasicMaterial color="#C0C0C0" opacity={0.45} transparent />
      </lineSegments>

      {/* Front wheel */}
      <lineSegments geometry={frontWheelGeometry}>
        <lineBasicMaterial color="#C0C0C0" opacity={0.3} transparent />
      </lineSegments>

      {/* Rear wheel */}
      <lineSegments geometry={rearWheelGeometry}>
        <lineBasicMaterial color="#C0C0C0" opacity={0.3} transparent />
      </lineSegments>

      {/* Headlight glow */}
      <mesh position={[-1.75, 0.5, 0]}>
        <sphereGeometry args={[0.12, 16, 16]} />
        <meshBasicMaterial color="#CC2936" opacity={0.15} transparent />
      </mesh>
      <pointLight position={[-1.8, 0.5, 0]} color="#CC2936" intensity={0.5} distance={3} />

      {/* Taillight glow */}
      <mesh position={[1.85, 0.4, 0]}>
        <sphereGeometry args={[0.1, 16, 16]} />
        <meshBasicMaterial color="#CC2936" opacity={0.2} transparent />
      </mesh>
      <pointLight position={[1.9, 0.4, 0]} color="#CC2936" intensity={0.3} distance={2} />

      {/* Ground underglow */}
      <mesh position={[0, -0.32, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[3, 1.5]} />
        <meshBasicMaterial color="#CC2936" opacity={0.04} transparent side={THREE.DoubleSide} />
      </mesh>

      {/* Mercedes star (front grille) — simple 3-point star */}
      <group position={[-1.65, 0.7, 0]}>
        <mesh>
          <ringGeometry args={[0.06, 0.07, 24]} />
          <meshBasicMaterial color="#C0C0C0" opacity={0.3} transparent side={THREE.DoubleSide} />
        </mesh>
      </group>

      {/* Exhaust tips */}
      <mesh position={[2.0, 0.1, -0.2]}>
        <ringGeometry args={[0.03, 0.05, 12]} />
        <meshBasicMaterial color="#C0C0C0" opacity={0.2} transparent side={THREE.DoubleSide} />
      </mesh>
      <mesh position={[2.0, 0.1, 0.2]}>
        <ringGeometry args={[0.03, 0.05, 12]} />
        <meshBasicMaterial color="#C0C0C0" opacity={0.2} transparent side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
}
```

- [ ] **Step 2: Verify it compiles**

Run:
```bash
npx tsc --noEmit
```

Expected: No errors.

- [ ] **Step 3: Commit**

```bash
git add components/3d/car-wireframe.tsx
git commit -m "feat: add mercedes amg gt wireframe geometry"
```

---

### Task 2: Create Mercedes Hero Scene

**Files:**
- Create: `components/3d/mercedes-hero.tsx`
- Create: `components/homepage/scroll-indicator.tsx`

- [ ] **Step 1: Create the scroll indicator component**

Create `components/homepage/scroll-indicator.tsx`:

```tsx
'use client';

import { motion } from 'framer-motion';

export function ScrollIndicator() {
  return (
    <motion.div
      className="absolute bottom-8 left-1/2 -translate-x-1/2"
      animate={{ y: [0, 8, 0] }}
      transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
    >
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#888" strokeWidth="1.5">
        <path d="M12 5v14M5 12l7 7 7-7" />
      </svg>
    </motion.div>
  );
}
```

- [ ] **Step 2: Create the mercedes hero scene**

Create `components/3d/mercedes-hero.tsx`:

```tsx
'use client';

import { Suspense, useEffect, useRef, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { CarWireframe } from './car-wireframe';
import { ScrollIndicator } from 'components/homepage/scroll-indicator';
import Link from 'next/link';

function Scene() {
  return (
    <>
      <ambientLight intensity={0.3} />
      <CarWireframe />
    </>
  );
}

export function MercedesHero() {
  const [reducedMotion, setReducedMotion] = useState(false);
  const [contextLost, setContextLost] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mq.matches);
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const handleLost = (e: Event) => { e.preventDefault(); setContextLost(true); };
    const handleRestored = () => setContextLost(false);
    canvas.addEventListener('webglcontextlost', handleLost);
    canvas.addEventListener('webglcontextrestored', handleRestored);
    return () => {
      canvas.removeEventListener('webglcontextlost', handleLost);
      canvas.removeEventListener('webglcontextrestored', handleRestored);
    };
  }, []);

  return (
    <section className="relative flex h-screen items-center justify-center overflow-hidden">
      {/* 3D Background */}
      {!reducedMotion && !contextLost && (
        <div className="absolute inset-0 -z-10">
          <Suspense fallback={null}>
            <Canvas
              ref={canvasRef}
              camera={{ position: [0, 0.5, 5], fov: 40 }}
              dpr={[1, 1.5]}
              gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
              style={{ background: 'transparent' }}
            >
              <Scene />
            </Canvas>
          </Suspense>
        </div>
      )}

      {/* Hero overlay content */}
      <div className="relative z-10 text-center">
        <p className="mb-3 text-xs font-medium uppercase tracking-[5px] text-gw-accent">
          By Car Enthusiasts. For Car Enthusiasts.
        </p>
        <h1 className="font-heading text-5xl font-bold tracking-[6px] text-gw-text md:text-7xl">
          GERMANWERKS
        </h1>
        <p className="mt-3 text-sm uppercase tracking-[2px] text-gw-muted">
          Premium Carbon Fiber & Performance
        </p>
        <Link
          href="/search"
          className="mt-8 inline-block border border-gw-accent px-8 py-3 text-xs font-medium uppercase tracking-[3px] text-gw-accent transition-colors hover:bg-gw-accent hover:text-white"
        >
          Shop Now
        </Link>
      </div>

      {/* Scroll indicator */}
      <ScrollIndicator />
    </section>
  );
}
```

- [ ] **Step 3: Verify both files compile**

Run:
```bash
npx tsc --noEmit
```

Expected: No errors.

- [ ] **Step 4: Commit**

```bash
git add components/3d/mercedes-hero.tsx components/homepage/scroll-indicator.tsx
git commit -m "feat: add mercedes hero scene with overlay and scroll indicator"
```

---

### Task 3: Remove Old Hero and Wire Up Mercedes Hero

**Files:**
- Delete: `components/3d/hero-scene.tsx`
- Delete: `components/3d/floating-geometry.tsx`
- Modify: `app/page.tsx`

- [ ] **Step 1: Delete the old hero components**

```bash
rm components/3d/hero-scene.tsx components/3d/floating-geometry.tsx
```

- [ ] **Step 2: Update the homepage to use MercedesHero**

Replace the contents of `app/page.tsx` with:

```tsx
import { MercedesHero } from "components/3d/mercedes-hero";
import Footer from "components/layout/footer";

export const metadata = {
  description:
    "Premium aftermarket carbon fiber and performance automotive parts. By Car Enthusiasts. For Car Enthusiasts.",
  openGraph: {
    type: "website",
  },
};

export default function HomePage() {
  return (
    <>
      <MercedesHero />
      <Footer />
    </>
  );
}
```

Note: We're temporarily removing ThreeItemGrid and Carousel — they'll be replaced by the new homepage sections in Tasks 5-7.

- [ ] **Step 3: Verify it compiles and the dev server starts**

Run:
```bash
npx tsc --noEmit
```

Then briefly:
```bash
pnpm dev
```

Expected: Homepage shows the Mercedes wireframe with hero overlay text. No import errors.

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "feat: replace abstract hero with mercedes wireframe hero"
```

---

## Phase 2: Floating Glass Navbar

### Task 4: Restyle Navbar as Floating Glass Bar

**Files:**
- Modify: `components/layout/navbar/index.tsx`
- Modify: `components/layout/navbar/mobile-menu.tsx`

- [ ] **Step 1: Update the navbar component**

Replace `components/layout/navbar/index.tsx` with:

```tsx
import CartModal from "components/cart/modal";
import LogoSquare from "components/logo-square";
import { getMenu } from "lib/shopify";
import { Menu } from "lib/shopify/types";
import Link from "next/link";
import { Suspense } from "react";
import MobileMenu from "./mobile-menu";
import Search, { SearchSkeleton } from "./search";

const { SITE_NAME } = process.env;

export async function Navbar() {
  const menu = await getMenu("next-js-frontend-header-menu");

  return (
    <nav className="fixed top-4 left-1/2 z-50 w-[calc(100%-2rem)] max-w-screen-xl -translate-x-1/2 rounded-xl border border-[#22222266] bg-[#111111cc] px-4 py-3 backdrop-blur-xl lg:px-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="block md:hidden">
            <Suspense fallback={null}>
              <MobileMenu menu={menu} />
            </Suspense>
          </div>
          <Link
            href="/"
            prefetch={true}
            className="flex items-center gap-2"
          >
            <LogoSquare />
            <span className="hidden text-sm font-bold uppercase tracking-[3px] font-heading text-gw-text lg:block">
              {SITE_NAME}
            </span>
          </Link>
        </div>

        {menu.length ? (
          <ul className="hidden gap-6 text-xs uppercase tracking-wider md:flex md:items-center">
            {menu.map((item: Menu) => (
              <li key={item.title}>
                <Link
                  href={item.path}
                  prefetch={true}
                  className="text-gw-muted transition-colors hover:text-gw-text"
                >
                  {item.title}
                </Link>
              </li>
            ))}
          </ul>
        ) : null}

        <div className="flex items-center gap-4">
          <div className="hidden md:block">
            <Suspense fallback={<SearchSkeleton />}>
              <Search />
            </Suspense>
          </div>
          <CartModal />
        </div>
      </div>
    </nav>
  );
}
```

- [ ] **Step 2: Update mobile menu to match glass aesthetic**

Read `components/layout/navbar/mobile-menu.tsx` and update:
- The Dialog.Panel background from `bg-gw-black` to `bg-[#111111f0] backdrop-blur-xl`
- The hamburger button border to `border-[#33333366]`
- The close button border to `border-[#33333366]`

- [ ] **Step 3: Add top padding to main content**

Since the navbar is now `fixed` and floating, it overlaps content. In `app/layout.tsx`, add top padding to the `<main>` element:

```tsx
<main className="pt-20">
```

This gives enough space for the fixed navbar (48px height + 16px top offset + padding).

Note: The hero section uses `h-screen` so it fills the viewport regardless. The padding is for non-hero pages.

- [ ] **Step 4: Verify the floating navbar renders**

Run:
```bash
pnpm dev
```

Open `localhost:3000`. The navbar should float above the hero with rounded corners and a frosted glass effect.

- [ ] **Step 5: Commit**

```bash
git add components/layout/navbar/index.tsx components/layout/navbar/mobile-menu.tsx app/layout.tsx
git commit -m "feat: restyle navbar as floating glass bar"
```

---

## Phase 3: Homepage Sections

### Task 5: Featured Product Spotlight

**Files:**
- Create: `components/homepage/featured-spotlight.tsx`

- [ ] **Step 1: Create the featured product spotlight component**

Create `components/homepage/featured-spotlight.tsx`:

```tsx
import { ProductParallax } from "components/3d/product-parallax";
import { ScrollReveal } from "components/animations/scroll-reveal";
import { getCollectionProducts } from "lib/shopify";
import Link from "next/link";

export async function FeaturedSpotlight() {
  const products = await getCollectionProducts({
    collection: "hidden-homepage-featured-items",
  });

  const product = products[0];
  if (!product) return null;

  const image = product.featuredImage;

  return (
    <section className="mx-auto max-w-screen-xl px-6 py-24">
      <ScrollReveal>
        <div className="grid items-center gap-12 md:grid-cols-2">
          {/* Left: product image with parallax */}
          <div className="aspect-square overflow-hidden rounded-lg bg-gw-dark">
            {image ? (
              <ProductParallax
                src={image.url}
                alt={image.altText || product.title}
                width={800}
                height={800}
              />
            ) : (
              <div className="flex h-full items-center justify-center text-gw-muted">
                No image
              </div>
            )}
          </div>

          {/* Right: product details */}
          <div>
            <p className="mb-2 text-xs font-medium uppercase tracking-[3px] text-gw-accent">
              Featured
            </p>
            <h2 className="font-heading text-3xl font-bold tracking-wide text-gw-text md:text-4xl">
              {product.title}
            </h2>
            {product.description && (
              <p className="mt-3 text-sm leading-relaxed text-gw-muted">
                {product.description}
              </p>
            )}
            <p className="mt-6 text-2xl font-bold text-gw-text">
              ${parseFloat(product.priceRange.maxVariantPrice.amount).toLocaleString()}
              <span className="ml-2 text-sm font-normal text-gw-muted">
                {product.priceRange.maxVariantPrice.currencyCode}
              </span>
            </p>
            <Link
              href={`/product/${product.handle}`}
              className="mt-8 inline-block border border-gw-accent px-8 py-3 text-xs font-medium uppercase tracking-[3px] text-gw-accent transition-colors hover:bg-gw-accent hover:text-white"
            >
              Shop Now
            </Link>
          </div>
        </div>
      </ScrollReveal>
    </section>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add components/homepage/featured-spotlight.tsx
git commit -m "feat: add featured product spotlight section"
```

---

### Task 6: Product Carousel

**Files:**
- Create: `components/homepage/product-carousel.tsx`

- [ ] **Step 1: Create the product carousel component**

Create `components/homepage/product-carousel.tsx`:

```tsx
import { ScrollReveal } from "components/animations/scroll-reveal";
import { getCollectionProducts } from "lib/shopify";
import { GridTileImage } from "components/grid/tile";
import Link from "next/link";

export async function ProductCarousel() {
  const products = await getCollectionProducts({
    collection: "hidden-homepage-carousel",
  });

  if (!products?.length) return null;

  return (
    <section className="py-16">
      <ScrollReveal>
        <div className="mx-auto max-w-screen-xl px-6">
          <p className="mb-6 text-xs uppercase tracking-[3px] text-gw-muted">
            More Products →
          </p>
        </div>
        <div className="relative">
          {/* Fade edges */}
          <div className="pointer-events-none absolute left-0 top-0 z-10 h-full w-12 bg-gradient-to-r from-gw-black to-transparent" />
          <div className="pointer-events-none absolute right-0 top-0 z-10 h-full w-12 bg-gradient-to-l from-gw-black to-transparent" />

          {/* Scrollable strip */}
          <div className="flex snap-x snap-mandatory gap-4 overflow-x-auto px-6 pb-4 scrollbar-hide">
            {products.map((product) => (
              <Link
                key={product.handle}
                href={`/product/${product.handle}`}
                prefetch={true}
                className="relative aspect-square w-64 flex-none snap-start md:w-72"
              >
                <GridTileImage
                  alt={product.title}
                  label={{
                    title: product.title,
                    amount: product.priceRange.maxVariantPrice.amount,
                    currencyCode: product.priceRange.maxVariantPrice.currencyCode,
                  }}
                  src={product.featuredImage?.url}
                  fill
                  sizes="(min-width: 768px) 288px, 256px"
                />
              </Link>
            ))}
          </div>
        </div>
      </ScrollReveal>
    </section>
  );
}
```

- [ ] **Step 2: Add scrollbar-hide utility to globals.css**

Add to `app/globals.css` inside the `@layer base` block:

```css
.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}
```

- [ ] **Step 3: Commit**

```bash
git add components/homepage/product-carousel.tsx app/globals.css
git commit -m "feat: add product carousel section"
```

---

### Task 7: Trust Stats Strip

**Files:**
- Create: `components/homepage/trust-stats.tsx`

- [ ] **Step 1: Create the trust stats component**

Create `components/homepage/trust-stats.tsx`:

```tsx
import { ScrollReveal } from "components/animations/scroll-reveal";

const stats = [
  { value: "100%", label: "DRY CARBON" },
  { value: "-15 LBS", label: "AVG SAVINGS" },
  { value: "UV COAT", label: "PROTECTED" },
];

export function TrustStats() {
  return (
    <section className="border-t border-gw-charcoal py-16">
      <ScrollReveal>
        <div className="mx-auto flex max-w-screen-lg items-center justify-center gap-12 md:gap-20">
          {stats.map((stat, i) => (
            <div key={stat.label} className="flex items-center gap-12 md:gap-20">
              <div className="text-center">
                <p className="font-heading text-xl font-bold text-gw-text md:text-2xl">
                  {stat.value}
                </p>
                <p className="mt-1 text-[10px] uppercase tracking-[2px] text-gw-muted">
                  {stat.label}
                </p>
              </div>
              {i < stats.length - 1 && (
                <div className="h-8 w-px bg-gw-charcoal" />
              )}
            </div>
          ))}
        </div>
      </ScrollReveal>
    </section>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add components/homepage/trust-stats.tsx
git commit -m "feat: add trust stats strip"
```

---

### Task 8: Wire Up Complete Homepage Flow

**Files:**
- Modify: `app/page.tsx`

- [ ] **Step 1: Update the homepage with all sections**

Replace `app/page.tsx` with:

```tsx
import { MercedesHero } from "components/3d/mercedes-hero";
import { FeaturedSpotlight } from "components/homepage/featured-spotlight";
import { ProductCarousel } from "components/homepage/product-carousel";
import { TrustStats } from "components/homepage/trust-stats";
import Footer from "components/layout/footer";

export const metadata = {
  description:
    "Premium aftermarket carbon fiber and performance automotive parts. By Car Enthusiasts. For Car Enthusiasts.",
  openGraph: {
    type: "website",
  },
};

export default function HomePage() {
  return (
    <>
      <MercedesHero />
      <FeaturedSpotlight />
      <ProductCarousel />
      <TrustStats />
      <Footer />
    </>
  );
}
```

- [ ] **Step 2: Verify the full homepage renders**

Run:
```bash
pnpm dev
```

Open `localhost:3000`. You should see:
1. Full-screen Mercedes wireframe hero with branding overlay
2. Featured product spotlight with parallax image
3. Horizontal product carousel
4. Trust stats strip
5. Footer

- [ ] **Step 3: Commit**

```bash
git add app/page.tsx
git commit -m "feat: wire up complete homepage flow"
```

---

## Phase 4: Product Card Refinement

### Task 9: Update Product Cards to Clean Minimal Style

**Files:**
- Modify: `components/grid/tile.tsx`
- Modify: `components/label.tsx`

- [ ] **Step 1: Update the grid tile**

Replace `components/grid/tile.tsx` with:

```tsx
'use client';

import { TiltCard } from "components/animations/tilt-card";
import clsx from "clsx";
import Image from "next/image";
import Price from "./price";

export function GridTileImage({
  isInteractive = true,
  active,
  label,
  ...props
}: {
  isInteractive?: boolean;
  active?: boolean;
  label?: {
    title: string;
    amount: string;
    currencyCode: string;
    position?: "bottom" | "center";
  };
} & React.ComponentProps<typeof Image>) {
  const content = (
    <div
      className={clsx(
        "group relative flex h-full w-full flex-col overflow-hidden rounded-lg border bg-gw-dark",
        {
          "border-2 border-gw-accent": active,
          "border-[#222222] hover:border-[#222222]": !active,
        },
      )}
    >
      {/* Image area */}
      <div className="relative flex-1">
        {props.src ? (
          <Image
            className={clsx("h-full w-full object-contain", {
              "transition duration-300 ease-in-out group-hover:scale-105":
                isInteractive,
            })}
            {...props}
          />
        ) : null}
      </div>

      {/* Red accent line on hover */}
      <div className="h-[2px] w-full bg-transparent transition-colors group-hover:bg-gw-accent" />

      {/* Product info */}
      {label ? (
        <div className="p-3">
          <h3 className="text-sm font-semibold text-gw-text">{label.title}</h3>
          <div className="mt-2 flex items-center justify-between">
            <Price
              className="text-sm font-bold text-gw-text"
              amount={label.amount}
              currencyCode={label.currencyCode}
            />
            <span className="text-[10px] uppercase tracking-wider text-gw-accent">
              View →
            </span>
          </div>
        </div>
      ) : null}
    </div>
  );

  return isInteractive ? <TiltCard>{content}</TiltCard> : content;
}
```

- [ ] **Step 2: Update the label component**

Replace `components/label.tsx` with:

```tsx
import Price from "./price";

const Label = ({
  title,
  amount,
  currencyCode,
}: {
  title: string;
  amount: string;
  currencyCode: string;
  position?: "bottom" | "center";
}) => {
  return (
    <div className="absolute bottom-0 left-0 flex w-full px-4 pb-4">
      <div className="flex items-center rounded-full border border-gw-charcoal bg-gw-black/80 p-1 text-xs font-semibold text-gw-text backdrop-blur-md">
        <h3 className="mr-4 line-clamp-2 grow pl-2 leading-none tracking-tight">
          {title}
        </h3>
        <Price
          className="flex-none rounded-full bg-gw-accent p-2 text-white"
          amount={amount}
          currencyCode={currencyCode}
        />
      </div>
    </div>
  );
};

export default Label;
```

- [ ] **Step 3: Verify cards render correctly**

Run:
```bash
pnpm dev
```

Navigate to a search/collection page. Product cards should show the clean minimal style with dark background, red accent line on hover, tilt effect, and "View →" text.

- [ ] **Step 4: Commit**

```bash
git add components/grid/tile.tsx components/label.tsx
git commit -m "feat: update product cards to clean minimal style"
```

---

## Phase 5: Build Verification

### Task 10: Full Build and Visual Verification

No new files — verification only.

- [ ] **Step 1: Run the production build**

```bash
pnpm build
```

Expected: Build completes with no errors.

- [ ] **Step 2: Visual verification checklist**

Run `pnpm dev` and check:
- [ ] Homepage: Mercedes wireframe rotates smoothly behind hero text
- [ ] Homepage: "GERMANWERKS" heading + tagline + CTA visible
- [ ] Homepage: Scroll indicator animates at bottom of hero
- [ ] Homepage: Featured product spotlight shows below the fold with parallax
- [ ] Homepage: Product carousel scrolls horizontally with fade edges
- [ ] Homepage: Trust stats strip displays 3 stats with dividers
- [ ] Navbar: Floats with glass effect, rounded corners, stays fixed on scroll
- [ ] Product cards: Dark bg, red accent line on hover, tilt effect
- [ ] Mobile: Navbar hamburger works, hero scales down
- [ ] Reduced motion: Hero 3D scene hidden when enabled

- [ ] **Step 3: Commit any fixes**

```bash
git add -A
git commit -m "fix: address build and visual verification findings"
```

---

## Summary

| Phase | Tasks | What it delivers |
|-------|-------|-----------------|
| 1: Mercedes Hero | 1-3 | Wireframe car scene replacing abstract geometry |
| 2: Glass Navbar | 4 | Floating frosted glass navigation bar |
| 3: Homepage Sections | 5-8 | Featured spotlight + carousel + trust stats |
| 4: Product Cards | 9 | Clean minimal card style with red accents |
| 5: Verification | 10 | Full build + visual check |
