# Market My Art — Art & Culture Multi‑Vendor Ecommerce (React + TypeScript)

This is a full conversion of the original **Market My Art** Tailwind/HTML/Alpine.js
template into a real, installable **Vite + React + TypeScript + Tailwind CSS v4**
project.

## Getting started

```bash
npm install
npm run dev       # start local dev server
npm run build     # production build -> dist/
npm run preview   # preview the production build
```

Requires Node.js 18+.

## What's in here

- **Vite + React 19 + TypeScript**, with `@/*` path aliases pointing at `src/`.
- **Tailwind CSS v4** (via `@tailwindcss/vite`), with your original design tokens
  (colors like `primary-main`, `gray-primary`, `success-light`, etc. and the
  DM Sans / TikTok Sans fonts) reconstructed in `src/index.css` under `@theme`.
- **react-router-dom** for routing — every original page has a route (see
  `src/App.tsx`), matching the original file names as closely as possible
  (`/products`, `/product-details-1`, `/cart-single-vendor`, `/checkout-1`,
  `/vendor-list`, `/vendor-profile`, `/blog-list`, `/blog-details`, `/faq`,
  `/contact`, `/wishlist`, `/compare-list`, `/order-success`,
  `/empty-cart-screen`, `/user-dashboard`, `/signup`, `/otp-verification`,
  `/password-lost`, `/password-reset`, `/password-reset-success`,
  `/privacy-policy`, `/term-and-conditions`, `/coming-soon`).
- **swiper** for the hero banner, product carousels, and testimonials.
- **lucide-react** for iconography (the template's own inline SVG icon set was
  replaced with this maintained icon library for consistency and easy reuse).
- **animate.css** for the drawer/modal open animations, same as the original.

## Project structure

```
src/
  components/
    ui/        Reusable primitives: Button, ProductCard, Rating, Accordion,
               Tabs, Drawer, Modal, Dropdown, QuantityStepper, Breadcrumb,
               Container/Section, PlaceholderImage, Logo, brand icons.
    layout/    Header, Footer, MobileMenu, CartDrawer, AuthDrawers,
               MobileBottomNav, ScrollToTop, and the root Layout.
    home/      Home-page-only sections: HeroSlider, CategoryGrid,
               BestSellingTabs, DealsCountdown, ProductSlider,
               TestimonialsSection, BlogSection, TrustBadges.
  pages/       One component per route (see App.tsx).
  store/       StoreContext — global cart / wishlist / compare / drawer state.
  data/        Mock catalog, category, vendor, blog and FAQ content.
  types/       Shared TypeScript interfaces (Product, Category, Vendor, ...).
  styles/      custom.css — the template's non-utility custom CSS (decorative
               background classes, the size-guide range slider styling, etc.)
               extracted from the original compiled style.css.
```

## About the images

The uploaded template archive's `images/` and `src/images/` folders were
**empty** — the HTML referenced hundreds of images
(`src/images/home-1/best-seller/product-1.webp`, etc.) but the actual image
files were never included in the zip.

Rather than ship broken `<img>` tags, every image slot in this project uses a
`<PlaceholderImage />` component (`src/components/ui/PlaceholderImage.tsx`) —
a simple styled box with an icon and a label. Swap these out for real
`<img>` tags once you have your product/category/blog photos. Since the
catalog data is centralized in `src/data/products.ts` and `src/data/content.ts`,
you can add an `image` URL field there and wire it into `ProductCard`,
`CategoryGrid`, etc. in a few small edits rather than hunting through every page.

## Notes on the conversion

- The original template's header, footer, cart drawer, auth flows (sign in /
  sign up / forgot password / OTP / reset password), mobile menu, and
  scroll-to-top button were duplicated across all 21 HTML pages — these
  now live as single shared components in `components/layout/`, rendered once
  via the root `Layout`.
- Repeated structural content (product cards, category tiles, nav items, FAQ
  entries, order rows, etc.) was converted to data-driven `.map()` rendering
  instead of hand-copied markup, per the "reusable components" ask.
- Product/category/vendor/blog data is currently mock data generated in
  `src/data/`. Replace it with a real API call or CMS integration when you're
  ready — the `Product`, `Category`, `Vendor`, and `BlogPost` types in
  `src/types/index.ts` describe the shape everything expects.
- Alpine.js's `x-data` / `x-show` interactivity (dropdowns, accordions, tabs,
  drawers) was re-implemented with React state/hooks — see
  `components/ui/Accordion.tsx`, `Tabs.tsx`, `Dropdown.tsx`, `Drawer.tsx`.
