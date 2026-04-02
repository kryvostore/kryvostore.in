# Design System Document: The Editorial Merchant

## 1. Overview & Creative North Star
**The Creative North Star: "The Curated Gallery"**

This design system rejects the "template" aesthetic of traditional e-commerce. Instead of a cluttered grid of product tiles, we treat the store as a high-end digital gallery. The goal is to move beyond "trustworthy" into "authoritative." 

We achieve this through **Intentional Asymmetry** and **Tonal Depth**. By utilizing overlapping elements—such as a product image bleeding into a text container—and a strict "No-Line" policy, we create a fluid, sophisticated interface. This system prioritizes breathing room and high-contrast typography to ensure that the products are not just seen, but curated.

---

## 2. Colors: The Tonal Spectrum
Our palette is anchored by deep, architectural navies and crisp, layered neutrals. 

### Surface Hierarchy & The "No-Line" Rule
**Explicit Directive:** 1px solid borders are strictly prohibited for sectioning or containment. 
Structure is defined through **Background Color Shifts**. 
- **Surface (Primary Canvas):** `#f8f9fa` — Use this for the main body of the page.
- **Surface-Container-Low:** `#f3f4f5` — Use for secondary content areas like "Related Products" or "Newsletter Signups."
- **Surface-Container-Highest:** `#e1e3e4` — Use for small, high-attention utility areas like cart drawers or search bars.

### The "Glass & Gradient" Rule
To elevate the experience from "flat" to "premium":
- **Glassmorphism:** For floating navigation headers or sticky "Add to Cart" bars, use `surface` at 80% opacity with a `24px` backdrop-blur. This ensures the product imagery remains visible as the user scrolls, creating a sense of depth.
- **Signature Textures:** Main CTAs should not be flat. Use a subtle linear gradient from `primary` (#001420) to `primary_container` (#002a3e) at a 135-degree angle. This adds a "weighted" feel to the interaction points.

---

## 3. Typography: Editorial Authority
We use a dual-font strategy to balance character with utility.

- **The Display/Headline Layer (Manrope):** This is our "Voice." Manrope provides a geometric, modern structure that feels engineered and precise. Use `display-lg` (3.5rem) for hero statements with tight letter-spacing (-0.02em) to create an editorial impact.
- **The Functional Layer (Inter):** Inter is our "Engine." It is used for all UI labels, body copy, and titles. It offers maximum readability at small scales.
- **Hierarchy Logic:** 
    - **Headline-LG (2rem):** Used for category titles.
    - **Title-MD (1.125rem):** Used for product names.
    - **Body-MD (0.875rem):** Used for product descriptions to maintain a refined, minimalist footprint.

---

## 4. Elevation & Depth: Tonal Layering
Traditional dropshipping sites feel "cheap" because of harsh shadows. This system uses **Atmospheric Perspective**.

- **The Layering Principle:** Instead of shadows, stack containers. Place a `surface_container_lowest` (#ffffff) card atop a `surface_container_low` (#f3f4f5) background. The change in hex code provides enough contrast to signify a "lift" without visual noise.
- **Ambient Shadows:** Only use shadows for "Floating" elements (e.g., Modals, Tooltips). 
    - **Specs:** `0px 12px 32px` with 6% opacity using the `on_surface` color. This mimics natural light diffusion.
- **The Ghost Border:** If high-contrast accessibility is required, use `outline_variant` at 15% opacity. It should be felt, not seen.

---

## 5. Components: The Refined Toolkit

### Buttons
- **Primary:** Gradient-filled (Primary to Primary-Container). Border-radius: `md` (0.375rem). High-contrast `on_primary` (#ffffff) text in `label-md`.
- **Secondary:** Surface-only with a "Ghost Border." Use `surface_container_high` for the hover state.
- **Tertiary:** No background. Underline on hover only.

### Product Cards
- **Construction:** No borders. Use `surface_container_lowest` as the card background. 
- **Spacing:** `spacing-4` (1.4rem) internal padding. 
- **Imagery:** Product images must have a 1:1 or 4:5 aspect ratio. Use `rounded-lg` (0.5rem) on images to soften the high-contrast layout.

### Input Fields
- **Default State:** Background: `surface_container_low`. No border.
- **Focus State:** Background remains the same, but add a 2px `outline` (#71787b) to signify activity.
- **Error State:** Background shifts to `error_container`, text shifts to `on_error_container`.

### Lists & Navigation
- **The "No-Divider" Rule:** Forbid 1px horizontal lines between list items. Instead, use `spacing-3` (1rem) of vertical white space or a slight hover-state background shift using `surface_container_highest`.

---

## 6. Do's and Don'ts

### Do
- **Do** use asymmetrical padding. For example, a hero section might have `spacing-24` on the left and `spacing-12` on the right to lead the eye.
- **Do** prioritize "negative space." If a section feels crowded, double the padding using the `20` or `24` spacing tokens.
- **Do** use `primary_fixed_dim` (#a4cbe8) for subtle accents like "In Stock" indicators to keep the vibe sophisticated.

### Don't
- **Don't** use pure black (#000000). Always use `primary` (#001420) or `on_surface` (#191c1d) for text.
- **Don't** use standard 1px dividers. If you must separate content, use a 4px wide vertical "bar" in `surface_variant` (#e1e3e4).
- **Don't** use "Drop Shadows" on product images. Let the high-quality photography sit flat against the clean surface layers.