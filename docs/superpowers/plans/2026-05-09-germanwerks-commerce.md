# GermanWerks Commerce Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a Vercel Commerce (Shopify) storefront for GermanWerks with a 3D-animated UI featuring ambient scenes, product viewers, and page transitions.

**Architecture:** Clone the `vercel/commerce` Next.js template as our foundation — it provides cart, checkout, search, collections, and product pages out of the box. Layer a 3D animation system on top using React Three Fiber + Drei for WebGL scenes, Framer Motion for page/UI transitions, and GSAP for complex animation sequences. Dark theme with automotive-inspired visuals throughout.

**Tech Stack:** Next.js 14+ (App Router), Shopify Storefront API, React Three Fiber, Drei, Framer Motion, GSAP, Tailwind CSS, pnpm

---

## Phase 1: Infrastructure

### Task 1: Shopify Partner Account & Dev Store (Manual)

These steps must be done by the user in a browser. No code task.

- [ ] **Step 1: Create Shopify Partner account**

Go to https://partners.shopify.com and sign up for a free Partner account.

- [ ] **Step 2: Create a development store**

In the Partner dashboard: Stores > Add store > Development store. Name it `germanwerks-dev`. Select "Start with test data" disabled — we'll add products manually.

- [ ] **Step 3: Create a Headless app for Storefront API**

In the Partner dashboard: Apps > Create app > Create app manually. Name it `germanwerks-headless`. Under "Configuration" > "Storefront API", enable these scopes:
- `unauthenticated_read_product_listings`
- `unauthenticated_read_product_inventory`
- `unauthenticated_read_product_tags`
- `unauthenticated_read_content`
- `unauthenticated_read_checkouts`
- `unauthenticated_write_checkouts`
- `unauthenticated_read_customers`

Install the app on the dev store. Copy the **Storefront API access token**.

- [ ] **Step 4: Note your store domain**

Your store domain looks like `germanwerks-dev.myshopify.com`. Save this along with the Storefront API access token — you'll need both in Task 3.

- [ ] **Step 5: Add sample products**

In the dev store admin (Products > Add product), create two products:

**Product 1 — Carbon Fiber Hood:**
- Title: "Dry Carbon Fiber Hood - Alfa Romeo Giulia"
- Description: "Lightweight dry carbon fiber hood replacement. Reduces weight by approximately 15lbs over OEM. UV-resistant clear coat finish."
- Price: $2,499.00
- Compare-at price: $3,199.00
- Collection: Carbon
- Tags: carbon, body, hood, alfa-romeo
- Add 2-3 placeholder product images

**Product 2 — Side Skirt Kit:**
- Title: "Carbon Fiber Side Skirt Kit - Universal Fit"
- Description: "Aggressive carbon fiber side skirts with universal mounting brackets. 3K twill weave with gloss finish."
- Price: $899.00
- Collection: Body
- Tags: carbon, body, side-skirt, universal
- Add 2-3 placeholder product images

- [ ] **Step 6: Create collections**

In the dev store admin (Products > Collections), create three collections:
- **Body** — condition: product tag equals `body`
- **Carbon** — condition: product tag equals `carbon`
- **Performance** — condition: product tag equals `performance`

---

### Task 2: Clone Vercel Commerce Template

**Files:**
- Create: entire project from template

- [ ] **Step 1: Clone the template**

Run:
```bash
npx degit vercel/commerce .
```

Expected: Template files cloned into the current directory (app/, components/, lib/, etc.)

- [ ] **Step 2: Verify the template structure**

Run:
```bash
ls -la
```

Expected: See `app/`, `components/`, `lib/`, `fonts/`, `next.config.ts`, `package.json`, `pnpm-lock.yaml`, `tailwind.config.ts`, `tsconfig.json`

- [ ] **Step 3: Install dependencies**

Run:
```bash
pnpm install
```

Expected: Dependencies installed successfully with no errors.

- [ ] **Step 4: Commit the template**

```bash
git add -A
git commit -m "feat: add vercel/commerce template"
```

---

### Task 3: Configure Environment Variables

**Files:**
- Create: `.env.local`
- Modify: `.gitignore` (verify `.env.local` is listed)

- [ ] **Step 1: Check .gitignore includes .env.local**

Run:
```bash
grep -c '.env.local' .gitignore
```

Expected: 1 or more (already included by the template). If 0, add `.env.local` to `.gitignore`.

- [ ] **Step 2: Create .env.local with Shopify credentials**

Create `.env.local` with:
```
COMPANY_NAME="GermanWerks"
SITE_NAME="GermanWerks"
SHOPIFY_STORE_DOMAIN="germanwerks-dev.myshopify.com"
SHOPIFY_STOREFRONT_ACCESS_TOKEN="your-storefront-access-token-here"
SHOPIFY_REVALIDATION_SECRET="your-random-secret-here"
```

Replace `germanwerks-dev.myshopify.com` with your actual store domain and the access token with the one from Task 1 Step 3.

Generate a random revalidation secret:
```bash
openssl rand -hex 32
```

- [ ] **Step 3: Verify the dev server starts**

Run:
```bash
pnpm dev
```

Expected: Next.js dev server starts on `localhost:3000`. Open in browser — should see the commerce storefront with your sample products. If you see "No products found", double-check your Shopify env vars and that products are published to the "Online Store" sales channel.

- [ ] **Step 4: Commit .gitignore changes if any**

```bash
git add .gitignore
git commit -m "chore: ensure .env.local is gitignored"
```

---

### Task 4: Install 3D & Animation Dependencies

**Files:**
- Modify: `package.json`

- [ ] **Step 1: Install React Three Fiber and Drei**

Run:
```bash
pnpm add three @react-three/fiber @react-three/drei
pnpm add -D @types/three
```

Expected: Packages added to `package.json` dependencies.

- [ ] **Step 2: Install Framer Motion**

Run:
```bash
pnpm add framer-motion
```

- [ ] **Step 3: Install GSAP**

Run:
```bash
pnpm add gsap
```

- [ ] **Step 4: Verify dev server still starts cleanly**

Run:
```bash
pnpm dev
```

Expected: No errors. Server starts on `localhost:3000`.

- [ ] **Step 5: Commit**

```bash
git add package.json pnpm-lock.yaml
git commit -m "feat: add 3d and animation dependencies (r3f, framer-motion, gsap)"
```

---

## Phase 2: Dark Theme & Brand Foundation

### Task 5: Apply Dark Theme to Tailwind Config

**Files:**
- Modify: `tailwind.config.ts`
- Modify: `app/globals.css` (or equivalent global styles)

- [ ] **Step 1: Read the existing Tailwind config**

Run:
```bash
cat tailwind.config.ts
```

Understand the existing color and theme structure before modifying.

- [ ] **Step 2: Extend the Tailwind config with GermanWerks colors**

Add custom colors to the `extend.colors` section of `tailwind.config.ts`:

```ts
colors: {
  gw: {
    black: '#0A0A0A',
    charcoal: '#1A1A1A',
    dark: '#111111',
    silver: '#C0C0C0',
    chrome: '#E8E8E8',
    amber: '#D4920B',
    red: '#CC2936',
    text: '#F5F5F5',
    muted: '#888888',
  }
}
```

- [ ] **Step 3: Set dark background as default in global CSS**

Read the existing global CSS file, then add/modify the body styles:

```css
body {
  background-color: #0A0A0A;
  color: #F5F5F5;
}
```

- [ ] **Step 4: Verify the dark theme renders**

Run:
```bash
pnpm dev
```

Open `localhost:3000`. The page should now have a dark background with light text. Some template components may need individual fixes — that's expected and will be handled in later tasks.

- [ ] **Step 5: Commit**

```bash
git add tailwind.config.ts app/globals.css
git commit -m "feat: apply germanwerks dark theme and brand colors"
```

---

### Task 6: Update Layout & Typography

**Files:**
- Modify: `app/layout.tsx`
- Potentially modify: font loading files in `fonts/`

- [ ] **Step 1: Read the existing layout**

Run:
```bash
cat app/layout.tsx
```

Understand how fonts are loaded and the layout structure.

- [ ] **Step 2: Add Space Grotesk font**

If the layout uses `next/font`, add Space Grotesk:

```ts
import { Space_Grotesk } from 'next/font/google';

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-space-grotesk',
});
```

Apply it to the `<html>` or `<body>` element's className alongside any existing font variables.

- [ ] **Step 3: Configure Tailwind to use the font variable**

In `tailwind.config.ts`, add:
```ts
fontFamily: {
  heading: ['var(--font-space-grotesk)', 'sans-serif'],
}
```

- [ ] **Step 4: Verify fonts render correctly**

Run:
```bash
pnpm dev
```

Open `localhost:3000`. Headings should render in Space Grotesk. Body text in the template's default sans-serif.

- [ ] **Step 5: Commit**

```bash
git add app/layout.tsx tailwind.config.ts
git commit -m "feat: add space grotesk font for headings"
```

---

## Phase 3: 3D Ambient Scene

### Task 7: Create 3D Scene Component

**Files:**
- Create: `components/3d/hero-scene.tsx`
- Create: `components/3d/floating-geometry.tsx`

- [ ] **Step 1: Create the floating geometry component**

Create `components/3d/floating-geometry.tsx`:

```tsx
'use client';

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { MeshDistortMaterial } from '@react-three/drei';
import type { Mesh } from 'three';

export function FloatingGeometry({
  position,
  scale,
  speed,
  distort,
  color,
}: {
  position: [number, number, number];
  scale: number;
  speed: number;
  distort: number;
  color: string;
}) {
  const meshRef = useRef<Mesh>(null);

  useFrame((state) => {
    if (!meshRef.current) return;
    meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * speed * 0.3) * 0.2;
    meshRef.current.rotation.y = state.clock.elapsedTime * speed * 0.15;
    meshRef.current.position.y =
      position[1] + Math.sin(state.clock.elapsedTime * speed * 0.5) * 0.3;
  });

  return (
    <mesh ref={meshRef} position={position} scale={scale}>
      <icosahedronGeometry args={[1, 4]} />
      <MeshDistortMaterial
        color={color}
        roughness={0.2}
        metalness={0.9}
        distort={distort}
        speed={speed * 2}
      />
    </mesh>
  );
}
```

- [ ] **Step 2: Create the hero scene component**

Create `components/3d/hero-scene.tsx`:

```tsx
'use client';

import { Suspense, useEffect, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { Environment, Float } from '@react-three/drei';
import { FloatingGeometry } from './floating-geometry';

function Scene() {
  return (
    <>
      <ambientLight intensity={0.15} />
      <directionalLight position={[5, 5, 5]} intensity={0.4} color="#E8E8E8" />
      <pointLight position={[-5, 3, -5]} intensity={0.3} color="#D4920B" />

      <Float speed={1.5} rotationIntensity={0.3} floatIntensity={0.5}>
        <FloatingGeometry
          position={[-3, 0, -2]}
          scale={1.2}
          speed={0.8}
          distort={0.3}
          color="#1A1A1A"
        />
      </Float>

      <Float speed={1.2} rotationIntensity={0.2} floatIntensity={0.4}>
        <FloatingGeometry
          position={[3, 1, -3]}
          scale={0.8}
          speed={0.6}
          distort={0.4}
          color="#2A2A2A"
        />
      </Float>

      <Float speed={1.8} rotationIntensity={0.4} floatIntensity={0.6}>
        <FloatingGeometry
          position={[0, -1, -1.5]}
          scale={0.5}
          speed={1}
          distort={0.2}
          color="#333333"
        />
      </Float>

      <Environment preset="city" environmentIntensity={0.1} />
    </>
  );
}

export function HeroScene() {
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mq.matches);
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  if (reducedMotion) return null;

  return (
    <div className="absolute inset-0 -z-10">
      <Suspense fallback={null}>
        <Canvas
          camera={{ position: [0, 0, 6], fov: 45 }}
          dpr={[1, 1.5]}
          gl={{ antialias: true, alpha: true }}
          style={{ background: 'transparent' }}
        >
          <Scene />
        </Canvas>
      </Suspense>
    </div>
  );
}
```

- [ ] **Step 3: Verify both files compile**

Run:
```bash
pnpm dev
```

Expected: No compilation errors. The components aren't mounted yet, so no visual change.

- [ ] **Step 4: Commit**

```bash
git add components/3d/hero-scene.tsx components/3d/floating-geometry.tsx
git commit -m "feat: add 3d hero scene with floating geometry"
```

---

### Task 8: Mount Hero Scene on Homepage

**Files:**
- Modify: `app/page.tsx`

- [ ] **Step 1: Read the existing homepage**

Run:
```bash
cat app/page.tsx
```

Understand the current structure and what components are rendered.

- [ ] **Step 2: Import and mount HeroScene**

At the top of `app/page.tsx`, add the import:
```tsx
import { HeroScene } from 'components/3d/hero-scene';
```

Then wrap the existing content in a relative container and add the scene behind it:

```tsx
<div className="relative min-h-screen">
  <HeroScene />
  {/* existing homepage content stays here */}
</div>
```

The `HeroScene` uses `absolute inset-0 -z-10` so it sits behind all page content.

- [ ] **Step 3: Verify the 3D scene renders**

Run:
```bash
pnpm dev
```

Open `localhost:3000`. You should see subtle floating metallic shapes behind the homepage content. They should animate slowly — rotating and bobbing.

- [ ] **Step 4: Commit**

```bash
git add app/page.tsx
git commit -m "feat: mount 3d hero scene on homepage"
```

---

## Phase 4: Animation Wrappers

### Task 9: Create Framer Motion Page Transition Wrapper

**Files:**
- Create: `components/animations/page-transition.tsx`

- [ ] **Step 1: Create the page transition component**

Create `components/animations/page-transition.tsx`:

```tsx
'use client';

import { motion } from 'framer-motion';
import type { ReactNode } from 'react';

const variants = {
  hidden: {
    opacity: 0,
    rotateY: -5,
    scale: 0.98,
    transformPerspective: 1200,
  },
  enter: {
    opacity: 1,
    rotateY: 0,
    scale: 1,
    transformPerspective: 1200,
    transition: {
      duration: 0.5,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  },
  exit: {
    opacity: 0,
    rotateY: 5,
    scale: 0.98,
    transformPerspective: 1200,
    transition: {
      duration: 0.3,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  },
};

export function PageTransition({ children }: { children: ReactNode }) {
  return (
    <motion.div
      variants={variants}
      initial="hidden"
      animate="enter"
      exit="exit"
    >
      {children}
    </motion.div>
  );
}
```

- [ ] **Step 2: Verify it compiles**

Run:
```bash
pnpm dev
```

Expected: No errors. Component isn't mounted yet.

- [ ] **Step 3: Commit**

```bash
git add components/animations/page-transition.tsx
git commit -m "feat: add framer motion page transition wrapper"
```

---

### Task 10: Create Scroll-Reveal Animation Component

**Files:**
- Create: `components/animations/scroll-reveal.tsx`

- [ ] **Step 1: Create the scroll reveal component**

Create `components/animations/scroll-reveal.tsx`:

```tsx
'use client';

import { motion } from 'framer-motion';
import type { ReactNode } from 'react';

const variants = {
  hidden: {
    opacity: 0,
    y: 40,
    rotateX: 8,
    transformPerspective: 800,
  },
  visible: {
    opacity: 1,
    y: 0,
    rotateX: 0,
    transformPerspective: 800,
    transition: {
      duration: 0.6,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  },
};

export function ScrollReveal({
  children,
  className,
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  return (
    <motion.div
      variants={variants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-50px' }}
      transition={{ delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add components/animations/scroll-reveal.tsx
git commit -m "feat: add scroll reveal animation component"
```

---

### Task 11: Create 3D Tilt Card Component

**Files:**
- Create: `components/animations/tilt-card.tsx`

- [ ] **Step 1: Create the tilt card component**

Create `components/animations/tilt-card.tsx`:

```tsx
'use client';

import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import type { ReactNode, MouseEvent } from 'react';
import { useRef, useCallback } from 'react';

export function TiltCard({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0.5);
  const y = useMotionValue(0.5);

  const rotateX = useSpring(useTransform(y, [0, 1], [8, -8]), {
    stiffness: 300,
    damping: 30,
  });
  const rotateY = useSpring(useTransform(x, [0, 1], [-8, 8]), {
    stiffness: 300,
    damping: 30,
  });

  const handleMouse = useCallback(
    (e: MouseEvent<HTMLDivElement>) => {
      if (!ref.current) return;
      const rect = ref.current.getBoundingClientRect();
      x.set((e.clientX - rect.left) / rect.width);
      y.set((e.clientY - rect.top) / rect.height);
    },
    [x, y]
  );

  const handleLeave = useCallback(() => {
    x.set(0.5);
    y.set(0.5);
  }, [x, y]);

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouse}
      onMouseLeave={handleLeave}
      style={{
        rotateX,
        rotateY,
        transformPerspective: 800,
        transformStyle: 'preserve-3d',
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add components/animations/tilt-card.tsx
git commit -m "feat: add 3d tilt card hover effect component"
```

---

## Phase 5: Integrate Animations Into Template Pages

### Task 12: Add Scroll Reveal to Product Grid

**Files:**
- Modify: the template's product grid component (likely `components/grid/three-items.tsx` and/or `components/grid/tile.tsx`)

- [ ] **Step 1: Find the product grid components**

Run:
```bash
find components -name '*.tsx' | head -30
```

And:
```bash
grep -rl 'grid' components/ --include='*.tsx'
```

Identify the files responsible for rendering the product grid on the homepage and collection pages.

- [ ] **Step 2: Wrap grid items with ScrollReveal**

Import `ScrollReveal` at the top of the grid component:
```tsx
import { ScrollReveal } from 'components/animations/scroll-reveal';
```

Wrap each product grid item with `<ScrollReveal>`, using staggered delays:
```tsx
<ScrollReveal delay={index * 0.1}>
  {/* existing grid item content */}
</ScrollReveal>
```

- [ ] **Step 3: Verify scroll animations work**

Run:
```bash
pnpm dev
```

Open `localhost:3000`. Scroll down — product cards should fade in with a subtle 3D rotation as they enter the viewport.

- [ ] **Step 4: Commit**

```bash
git add components/grid/
git commit -m "feat: add scroll reveal animations to product grid"
```

---

### Task 13: Add Tilt Effect to Product Cards

**Files:**
- Modify: the product card/tile component (likely `components/grid/tile.tsx`)

- [ ] **Step 1: Read the tile component**

Run:
```bash
cat components/grid/tile.tsx
```

- [ ] **Step 2: Wrap the card with TiltCard**

Import `TiltCard`:
```tsx
import { TiltCard } from 'components/animations/tilt-card';
```

Wrap the outer card element:
```tsx
<TiltCard className="group ...existing-classes">
  {/* existing tile content */}
</TiltCard>
```

- [ ] **Step 3: Verify hover tilt works**

Run:
```bash
pnpm dev
```

Open `localhost:3000`. Hover over product cards — they should tilt subtly following the mouse cursor.

- [ ] **Step 4: Commit**

```bash
git add components/grid/tile.tsx
git commit -m "feat: add 3d tilt effect to product cards"
```

---

### Task 14: Add Page Transitions to Layout

**Files:**
- Modify: `app/layout.tsx` or relevant layout wrapper

- [ ] **Step 1: Read the layout**

Run:
```bash
cat app/layout.tsx
```

- [ ] **Step 2: Wrap children with PageTransition**

Import `PageTransition`:
```tsx
import { PageTransition } from 'components/animations/page-transition';
```

Wrap the `{children}` in the layout body:
```tsx
<PageTransition>
  {children}
</PageTransition>
```

Note: Since Next.js App Router doesn't have native exit animations between routes, this provides an enter animation on each page load. Full exit animations would require `AnimatePresence` with a template component — we can add that as a refinement later.

- [ ] **Step 3: Verify page transition works**

Run:
```bash
pnpm dev
```

Navigate between pages. Each page should fade/rotate in subtly on load.

- [ ] **Step 4: Commit**

```bash
git add app/layout.tsx
git commit -m "feat: add page transition animations to layout"
```

---

## Phase 6: Product Detail 3D Viewer

### Task 15: Create Product Image Parallax Component

**Files:**
- Create: `components/3d/product-parallax.tsx`

- [ ] **Step 1: Create the parallax product viewer**

This component provides a 3D parallax depth effect on product images (the fallback when no GLTF model exists). Create `components/3d/product-parallax.tsx`:

```tsx
'use client';

import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import Image from 'next/image';
import { useRef, useCallback } from 'react';
import type { MouseEvent } from 'react';

export function ProductParallax({
  src,
  alt,
  width,
  height,
}: {
  src: string;
  alt: string;
  width: number;
  height: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0.5);
  const y = useMotionValue(0.5);

  const rotateX = useSpring(useTransform(y, [0, 1], [12, -12]), {
    stiffness: 200,
    damping: 25,
  });
  const rotateY = useSpring(useTransform(x, [0, 1], [-12, 12]), {
    stiffness: 200,
    damping: 25,
  });
  const scale = useSpring(1, { stiffness: 200, damping: 25 });

  const handleMouse = useCallback(
    (e: MouseEvent<HTMLDivElement>) => {
      if (!ref.current) return;
      const rect = ref.current.getBoundingClientRect();
      x.set((e.clientX - rect.left) / rect.width);
      y.set((e.clientY - rect.top) / rect.height);
      scale.set(1.05);
    },
    [x, y, scale]
  );

  const handleLeave = useCallback(() => {
    x.set(0.5);
    y.set(0.5);
    scale.set(1);
  }, [x, y, scale]);

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouse}
      onMouseLeave={handleLeave}
      style={{
        rotateX,
        rotateY,
        scale,
        transformPerspective: 1000,
        transformStyle: 'preserve-3d',
      }}
      className="cursor-grab overflow-hidden rounded-lg"
    >
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        className="h-full w-full object-cover"
      />
    </motion.div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add components/3d/product-parallax.tsx
git commit -m "feat: add 3d parallax product image viewer"
```

---

### Task 16: Integrate Parallax Viewer on Product Page

**Files:**
- Modify: product page image component (likely `components/product/gallery.tsx` or similar)

- [ ] **Step 1: Find the product image component**

Run:
```bash
find components/product -name '*.tsx' -o -name '*.ts' | head -20
```

And:
```bash
grep -rl 'Image\|gallery\|image' components/product/ --include='*.tsx'
```

- [ ] **Step 2: Read the component**

Read the file that handles the main product image display.

- [ ] **Step 3: Replace or wrap the main image with ProductParallax**

Import the component:
```tsx
import { ProductParallax } from 'components/3d/product-parallax';
```

Replace the main product image with:
```tsx
<ProductParallax
  src={image.url}
  alt={image.altText}
  width={800}
  height={800}
/>
```

Keep the thumbnail gallery as-is — the parallax effect should only apply to the main featured image.

- [ ] **Step 4: Verify on product detail page**

Run:
```bash
pnpm dev
```

Navigate to a product page. The main product image should have a 3D parallax tilt effect on mouse hover.

- [ ] **Step 5: Commit**

```bash
git add components/product/
git commit -m "feat: integrate 3d parallax viewer on product detail page"
```

---

## Phase 7: Dark Theme Polish

### Task 17: Update Template Components for Dark Theme

**Files:**
- Modify: `components/layout/navbar/` (navigation)
- Modify: `components/layout/footer.tsx`
- Modify: `components/cart/` (cart components)
- Modify: `components/layout/search.tsx` (if exists)

- [ ] **Step 1: Audit template components for light theme styles**

Run:
```bash
grep -rn 'bg-white\|bg-gray\|text-black\|text-gray\|border-gray' components/ --include='*.tsx' | head -40
```

This identifies all hardcoded light-theme colors that need updating.

- [ ] **Step 2: Update navbar for dark theme**

Read the navbar files and replace light-theme classes:
- `bg-white` → `bg-gw-black`
- `text-black` → `text-gw-text`
- `border-gray-*` → `border-gw-charcoal`
- `text-gray-*` → `text-gw-muted`

- [ ] **Step 3: Update footer for dark theme**

Apply the same pattern to the footer component.

- [ ] **Step 4: Update cart components for dark theme**

Apply the same pattern to cart modal/drawer components.

- [ ] **Step 5: Update search components for dark theme**

Apply the same pattern to any search UI components.

- [ ] **Step 6: Verify the full site is consistently dark**

Run:
```bash
pnpm dev
```

Navigate through: homepage, product page, cart (add item), search. All pages should be consistently dark-themed with no jarring white sections.

- [ ] **Step 7: Commit**

```bash
git add components/
git commit -m "feat: update all template components to dark theme"
```

---

### Task 18: Add GermanWerks Branding

**Files:**
- Modify: navbar component (logo/brand name)
- Modify: `app/layout.tsx` (metadata)

- [ ] **Step 1: Update metadata in layout**

In `app/layout.tsx`, update the metadata:
```tsx
export const metadata = {
  title: 'GermanWerks | By Car Enthusiasts. For Car Enthusiasts.',
  description: 'Premium aftermarket carbon fiber and performance automotive parts.',
};
```

- [ ] **Step 2: Update navbar brand name**

Find and update the logo/brand text in the navbar to display "GERMANWERKS" in the heading font:

```tsx
<span className="font-heading text-lg font-bold tracking-wider text-gw-text">
  GERMANWERKS
</span>
```

- [ ] **Step 3: Verify branding**

Run:
```bash
pnpm dev
```

Check that the browser tab shows the correct title and the navbar displays "GERMANWERKS".

- [ ] **Step 4: Commit**

```bash
git add app/layout.tsx components/layout/
git commit -m "feat: add germanwerks branding and metadata"
```

---

## Phase 8: Final Verification

### Task 19: Full Integration Test

No files modified — this is a verification pass.

- [ ] **Step 1: Run the build**

Run:
```bash
pnpm build
```

Expected: Build completes with no errors. Note any warnings.

- [ ] **Step 2: Run production server**

Run:
```bash
pnpm start
```

- [ ] **Step 3: Manual verification checklist**

Open `localhost:3000` and verify:
- [ ] Homepage: 3D floating geometry visible behind content
- [ ] Homepage: Products animate in on scroll
- [ ] Product cards: 3D tilt on hover
- [ ] Product page: Parallax image viewer works
- [ ] Page transitions: Subtle animation on navigation
- [ ] Dark theme: Consistent across all pages (home, product, cart, search)
- [ ] Branding: "GERMANWERKS" in navbar, correct page title
- [ ] Cart: Can add items and view cart
- [ ] Mobile: Site is usable on mobile viewport (resize browser)
- [ ] Reduced motion: Enable "reduce motion" in OS accessibility settings — 3D scene should disappear, animations should be minimal

- [ ] **Step 4: Commit any final fixes**

If any issues were found and fixed:
```bash
git add -A
git commit -m "fix: address integration test findings"
```

---

## Summary

| Phase | Tasks | What it delivers |
|-------|-------|-----------------|
| 1: Infrastructure | 1-4 | Shopify dev store + Vercel Commerce template + 3D deps |
| 2: Dark Theme Foundation | 5-6 | Brand colors, dark background, Space Grotesk font |
| 3: 3D Ambient Scene | 7-8 | Floating metallic geometry on homepage |
| 4: Animation Wrappers | 9-11 | Page transitions, scroll reveal, tilt cards |
| 5: Integrate Animations | 12-14 | Animations wired into template components |
| 6: Product 3D Viewer | 15-16 | Parallax depth effect on product images |
| 7: Dark Theme Polish | 17-18 | All components dark-themed, branding applied |
| 8: Verification | 19 | Full integration test |
