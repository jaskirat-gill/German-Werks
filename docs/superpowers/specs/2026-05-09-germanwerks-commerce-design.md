# GermanWerks Commerce — Design Spec

## Overview

A Vercel Commerce (Shopify) application for GermanWerks, a premium aftermarket automotive parts shop specializing in carbon fiber body components and performance upgrades. The application features a clean, 3D-animated UI that reflects the premium, enthusiast-driven brand identity.

**Target:** https://germanwerks.ca/ (rebuild)
**Tagline:** "By Car Enthusiasts. For Car Enthusiasts."

## Stack

- **Framework:** Next.js 14+ (App Router) via `vercel/commerce` template
- **Commerce Backend:** Shopify (Storefront API via GraphQL)
- **Hosting:** Vercel
- **3D Engine:** React Three Fiber + Drei
- **Animation:** Framer Motion (page/UI transitions), GSAP (complex 3D sequences)
- **Styling:** Tailwind CSS

## Infrastructure & Shopify Setup

### Shopify

1. Create a Shopify Partner account (free)
2. Create a development store via Partner dashboard
3. Create a custom Headless app for Storefront API access token
4. Add 1-2 sample products (carbon fiber hood, side skirt) with placeholder images
5. Set up basic collections: Body, Carbon, Performance

### Vercel Commerce Template

1. Clone `vercel/commerce` template
2. Configure environment variables:
   - `SHOPIFY_STORE_DOMAIN`
   - `SHOPIFY_STOREFRONT_ACCESS_TOKEN`
3. Template provides out of the box: cart, checkout, search, collections, product pages, SEO

### Project Structure Additions

On top of the Vercel Commerce template:

- `/components/3d/` — Three.js scenes and models
- `/components/animations/` — Framer Motion wrappers and transition components
- Custom layouts/pages replacing default template UI with branded 3D experience

## 3D Animation Layer

### Tier 1 — Ambient Scene Elements

- Subtle 3D background canvas on the homepage (floating geometric shapes, particles, or abstract automotive-inspired scene)
- Dark theme with metallic/carbon fiber textures
- Responsive degradation on mobile (reduce particles, simplify geometry)

### Tier 2 — Product Interaction

- 3D product viewer on product detail pages (orbit/rotate)
- GLB/GLTF models when available; fallback to image carousel with 3D parallax depth effect
- Lighting setup that highlights carbon fiber weave and metallic finishes

### Tier 3 — Page & UI Transitions

- Route transitions with 3D transforms (pages slide/rotate in/out)
- Scroll-driven animations on homepage (products animate into view)
- Micro-interactions on cards, buttons, navigation (hover depth, subtle 3D tilts)

### Performance Guardrails

- Lazy-load Three.js canvas (not in critical render path)
- `Suspense` boundaries around 3D scenes
- `prefers-reduced-motion` media query respected
- Canvas renders paused when off-screen (Intersection Observer)
- Target: Lighthouse 90+ without heavy 3D, 80+ on 3D-heavy pages

## Brand & Visual Identity

### Color Palette

- **Primary:** Deep black/charcoal (#0A0A0A)
- **Accent:** Metallic silver/chrome highlights
- **Secondary accent:** Warm tone (amber or red) for CTAs and sale callouts
- **Text:** White/light gray on dark backgrounds

### Typography

- **Headlines:** Bold, geometric sans-serif (Space Grotesk or similar)
- **Body:** Clean sans-serif for readability
- Final font choice during UI implementation

### Brand Tone

- Premium but approachable — performance-community, not luxury-cold
- Product photography and 3D models are the heroes
- "By Car Enthusiasts. For Car Enthusiasts." carried forward

### Layout Principles

- Generous dark space — let products breathe
- Full-bleed hero sections with 3D scenes
- Grid-based product listings with hover depth effects
- Minimal navigation: Home, Shop, Contact

## Product Categories

- **Body** — exterior components and styling elements
- **Carbon** — carbon fiber performance parts
- **Performance** — mechanical upgrades and enhancements

## Initial Scope

- Infrastructure setup (Shopify dev store, Vercel Commerce template, env config)
- 1-2 sample products for development
- Full 3D animated UI implementation
- Product catalog import deferred to later phase
