# Design System: The Editorial Canvas

## 1. Overview & Creative North Star
**The Creative North Star: "The Digital Atelier"**

This design system is not a template; it is a curated gallery. For a high-end fashion e-commerce experience, we must move away from the rigid, boxed-in layouts of traditional retail and toward a "High-End Editorial" aesthetic. Our goal is to replicate the tactile feel of a luxury lookbook—where the product is the protagonist and the UI is the sophisticated stage.

We break the "generic" look through **Intentional Asymmetry**. Rather than perfectly centered grids, we use staggered image placements and overlapping typography. By treating the screen as a physical composition of layered fine paper and frosted glass, we create a sense of depth and exclusivity that commands a higher price point.

---

## 2. Colors: Tonal Sophistication
The palette is rooted in an organic, "New Neutral" philosophy. We lead with `surface` (#f9f9f7) and `secondary_fixed` (#e4e2e1) to create a warm, cream-and-charcoal foundation, accented by the "Deep Terracotta" (`primary` #70281a) to draw the eye to key conversion points.

### The "No-Line" Rule
**Explicit Instruction:** 1px solid borders for sectioning are strictly prohibited. Boundaries must be defined solely through background color shifts.
*   *Implementation:* To separate a product description from the "You May Also Like" section, transition from `surface` to `surface_container_low`. This creates a soft "horizon line" rather than a hard edge.

### Surface Hierarchy & Nesting
Treat the UI as a series of physical layers. Use the surface-container tiers to define importance:
*   **Base:** `surface` (#f9f9f7) for the main canvas.
*   **Sub-sections:** `surface_container_low` (#f4f4f2) for subtle grouping.
*   **Interactive Cards:** `surface_container_lowest` (#ffffff) to make items appear to float toward the user.

### Signature Textures: The "Glass & Gradient" Rule
To add visual "soul," avoid flat terracotta blocks. For main CTAs or high-impact hero banners, use a subtle linear gradient transitioning from `primary` (#70281a) to `primary_container` (#8e3e2f) at a 45-degree angle. For floating navigation bars, use `surface` at 80% opacity with a `20px` backdrop-blur to create a "frosted glass" effect.

---

## 3. Typography: The Editorial Voice
Our typography pairing is a dialogue between heritage and modernity.

*   **The Serif (Noto Serif):** Used for `display` and `headline` tiers. It represents the "Voice of the Brand"—authoritative, elegant, and timeless. Use generous tracking (-0.02em) for large displays to feel tighter and more bespoke.
*   **The Sans-Serif (Manrope):** Used for `title`, `body`, and `labels`. Manrope’s geometric yet warm structure ensures maximum readability for product details while maintaining a "clean" architectural feel.

**Hierarchy Strategy:** 
Use `display-lg` (3.5rem) for seasonal campaign headers, but drop immediately to `body-md` (0.875rem) for descriptions. This high-contrast jump in scale creates a premium "magazine" feel that avoids the monotonous middle-ground of standard web typography.

---

## 4. Elevation & Depth
In this system, depth is felt, not seen. We reject heavy, artificial shadows in favor of **Tonal Layering**.

*   **The Layering Principle:** Place a `surface_container_lowest` card on a `surface_container_low` background. This creates a natural "lift" mimicking stacked paper without a single drop shadow.
*   **Ambient Shadows:** For floating elements (e.g., a "Quick Add" modal), use an ultra-diffused shadow: `box-shadow: 0 20px 40px rgba(85, 67, 63, 0.06);`. Note the shadow color—it is a tinted version of `on_surface_variant`, not pure black.
*   **The "Ghost Border" Fallback:** If a border is required for accessibility, use `outline_variant` (#dbc1bc) at 20% opacity. It should be barely perceptible, serving as a suggestion of a boundary rather than a wall.

---

## 5. Components

### Buttons (The Statement Piece)
*   **Primary:** `primary` background with `on_primary` text. No border. `0.25rem` (DEFAULT) roundedness. Add a subtle gradient from `primary` to `primary_container`.
*   **Secondary:** `surface_container_highest` background. This provides a tactile, "pressed" look without the aggression of a dark color.
*   **Tertiary:** Text-only in `primary`, using `label-md` with 1px letter spacing for a "fashion house" signature.

### Product Cards & Lists
**Forbid the use of divider lines.** 
*   **Spacing as Divider:** Use the `2rem` spacing scale to separate list items. 
*   **The Image-First Rule:** Product cards should use `surface_container_lowest` for the background. Imagery should have a `0.375rem` (md) radius. 
*   **Interaction:** On hover, do not use a border; instead, transition the background from `surface_container_lowest` to `surface_bright` and apply a subtle `ambient shadow`.

### Input Fields
*   **Styling:** Use a "Minimalist Undersline" approach or a very soft `surface_container_high` fill. 
*   **States:** On focus, the bottom border should animate from `outline_variant` to `primary`. Helper text should always be in `body-sm` using `on_surface_variant`.

### Floating Shopping Bag
A high-end experience keeps the cart accessible but non-intrusive. Use a **Glassmorphic Drawer**: `surface` at 90% opacity, `backdrop-blur: 12px`, and `elevation-xl` (ambient shadow).

---

## 6. Do's and Don'ts

### Do:
*   **Embrace the Void:** Use more white space than you think you need. High-fashion is about what isn't there as much as what is.
*   **Layer Containers:** Nest a `surface_container_lowest` card inside a `surface_container_low` section to create hierarchy.
*   **Use Subtle Animation:** Transitions between `surface` tiers should be slow (300ms) and ease-in-out to mimic the "softness" of the brand.

### Don't:
*   **No "Boxy" Grids:** Avoid placing images in perfectly square, bordered boxes. Allow some images to be 4:5 and others 1:1 to create visual rhythm.
*   **No Pure Black:** Never use #000000. Use `on_background` (#1a1c1b) for text to maintain the "charcoal" sophistication.
*   **No High-Contrast Borders:** Do not use the `outline` token at 100% opacity for decorative boxes. It ruins the "Digital Atelier" softness.