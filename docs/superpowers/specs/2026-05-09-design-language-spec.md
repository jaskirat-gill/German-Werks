# GermanWerks Design Language Spec

## Overview

Refined design language for the GermanWerks Commerce application. Builds on the existing dark theme infrastructure with automotive-inspired 3D elements, a floating glass navigation, and a storytelling-driven homepage flow.

## Color System

| Token | Hex | Usage |
|-------|-----|-------|
| `gw-black` | #0A0A0A | Page background |
| `gw-charcoal` | #1A1A1A | Card backgrounds, borders |
| `gw-dark` | #111111 | Elevated surfaces |
| `gw-silver` | #C0C0C0 | Wireframe lines, secondary text |
| `gw-chrome` | #E8E8E8 | Bright highlights |
| `gw-accent` | #CC2936 | Primary accent (CTAs, active states, glow) |
| `gw-text` | #F5F5F5 | Primary text |
| `gw-muted` | #888888 | Secondary text |

## Typography

- **Headings:** Space Grotesk (bold, wide tracking)
- **Body:** Geist Sans
- **Accent text:** Uppercase, letter-spacing 2-5px

## Hero Section

Full viewport-height hero with a 3D Mercedes AMG GT wireframe silhouette:

- Wireframe rendered in Three.js using `LineSegments` or `EdgesGeometry`
- Silver/chrome wireframe lines (#C0C0C0 at ~30-55% opacity)
- Red headlight glow (#CC2936) and red taillight glow
- Mercedes star on grille area
- Wheel detail with spokes
- Dual exhaust tips
- Car slowly rotates on Y-axis (0.15 rad/s)
- Subtle ground plane reflection (mirrored, faded, blurred)
- Speed lines drift in background
- Ground line beneath car
- Red ambient underglow beneath car

**Overlay content (centered above the car):**
- Tagline: "BY CAR ENTHUSIASTS. FOR CAR ENTHUSIASTS." in red, uppercase, letter-spacing 5px
- "GERMANWERKS" large heading, white, letter-spacing 6px
- Subtitle: "PREMIUM CARBON FIBER & PERFORMANCE" in muted gray
- "SHOP NOW" CTA button with red border

**Scroll indicator** at bottom of hero (animated chevron or arrow).

## Navigation — Floating Glass Bar

Replace the current edge-to-edge navbar with a floating glass bar:

- `position: fixed`, `top: 16px`, centered with `max-width` and auto margins
- Background: `#111111cc` with `backdrop-filter: blur(12px)`
- Border: `1px solid #22222266`
- Border-radius: `12px`
- Contains: logo + brand name (left), nav links (center), search + cart (right)
- Nav links: uppercase, letter-spacing 1px, `gw-muted` color, `gw-text` on hover
- Stays above all content with `z-index: 50`
- On mobile: collapses to hamburger menu (existing mobile menu, restyled to match glass aesthetic)

## Homepage Flow (Below the Fold)

### Section 1: Featured Product Spotlight

Split layout:
- **Left:** Large product image (with 3D parallax tilt on hover)
- **Right:** Product details
  - "NEW ARRIVAL" or "FEATURED" label in red
  - Product name in heading font
  - Vehicle fitment subtitle in muted text
  - Price (bold, white)
  - "SHOP NOW" CTA button (red border)
- Entire section wrapped in `ScrollReveal`

### Section 2: Product Carousel

- Horizontal scrolling strip of product cards
- "MORE PRODUCTS →" header in muted text
- Cards use the clean minimal style (dark bg, red accent line on hover, 3D tilt)
- Carousel auto-scrolls slowly, draggable
- Cards fade out at edges

### Section 3: Trust/Specs Strip

Horizontal row of 3 key stats, separated by vertical dividers:
- "100% DRY CARBON" — material quality
- "-15 LBS AVG SAVINGS" — weight reduction
- "UV COAT PROTECTED" — durability
- Stats in white bold, labels in muted small text
- Wrapped in `ScrollReveal`

### Footer

Existing footer (already branded with tagline).

## Product Cards — Clean Minimal

- Background: `gw-dark` (#111111)
- Border: `1px solid #222222`
- Border-radius: `8px`
- On hover: bottom edge shows 2px red accent line, card tilts via `TiltCard` wrapper
- Content: product image area, then padding with:
  - Product name (white, semibold, 12-14px)
  - Vehicle/category subtitle (muted, 11px)
  - Price (white, bold) aligned left, "VIEW →" in red aligned right
- No sale badges, no quick-add — keep it clean

## 3D & Animation Inventory

| Component | Location | Purpose |
|-----------|----------|---------|
| `MercedesHeroScene` | `components/3d/mercedes-hero.tsx` | Full hero wireframe car |
| `ProductParallax` | `components/3d/product-parallax.tsx` | Product image tilt (exists) |
| `PageTransition` | `components/animations/page-transition.tsx` | Route enter animation (exists) |
| `ScrollReveal` | `components/animations/scroll-reveal.tsx` | Scroll-in animation (exists) |
| `TiltCard` | `components/animations/tilt-card.tsx` | Hover tilt on cards (exists) |

## Performance

- Hero 3D scene lazy-loaded via `Suspense`
- `prefers-reduced-motion` hides 3D scene entirely
- WebGL context loss handled gracefully (existing)
- Carousel uses CSS scroll-snap, not JS-heavy solutions
- Target: Lighthouse 85+ on homepage
