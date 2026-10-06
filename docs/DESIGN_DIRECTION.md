# Design Direction

> Purpose of this doc: the visual language of NoaOS. Layout/flows are in [UX_ARCHITECTURE.md](UX_ARCHITECTURE.md). The Figma work is a UX and hierarchy reference, **not a pixel-perfect contract** — high-fidelity design may evolve directly in code.

## Concept: Organized Chaos

- **~80% functional system:** structured, readable, consistent. Clear hierarchy, predictable components, generous spacing.
- **~20% Noa chaos/personality:** deliberately breaks the system in **controlled, chosen places** (a sticker overlapping an edge, a handwritten note, a broken-grid moment on Today).
- Rule: chaos is an accent with intent. If everything is decorated, nothing is.

## High fidelity: "Noa Glass"

Inspired by Liquid Glass, but **not** an Apple/macOS clone.

Characteristics to explore:
- Frosted translucent surfaces with `backdrop-filter` blur
- Thin light highlights on edges
- Depth and layering (surfaces at different elevations)
- Ambient pastel light behind surfaces
- Subtle motion
- **Material variation** — not every surface is the same glass; some are solid, some chrome, some paper (scrapbook)

### Palette (starting point)

| Role | Colors |
|---|---|
| Brand anchor | **Dark navy** |
| Pastels (ambient light, surfaces, area accents) | baby blue · blush pink · lavender · peach · mint · butter yellow |
| Accent / energy | hot pink |
| Material accent | chrome / silver |

Exact values are defined as tokens in code and iterated visually.

### Typography

Hebrew-first font, self-hosted (no third-party font requests at runtime). Final choice is a design-phase decision. Expect: one strong readable Hebrew sans for UI, optionally one expressive/handwritten face for Noa-layer moments.

## The Noa layer

Elements available, used selectively:
leopard print · chrome/silver · stickers · doodles · handwriting · photos · scrapbook elements · intentionally imperfect / broken-grid moments.

Where it belongs (initial guidance): Today header and focus area, empty states, completion moments, My Noa. Where it doesn't: forms, data entry, settings, dense lists.

## Mini Noa

A recurring resident of the system, not an onboarding mascot. Direction: 2D illustration / sticker / fashion-doll feeling. Possible states: working, workout, pajamas, DJ, writing, travelling. An existing personal illustration/logo may serve as visual DNA. Not built in v0.1 beyond possible placeholders.

## Avoid

- Generic SaaS dashboard; generic AI dashboard
- Beige wellness app
- Excessive pill UI
- A grid of identical rounded cards; turning every section into another dashboard card
- Generic purple/blue AI gradients
- Childish gamification
- Aggressive fitness-dashboard aesthetics (rings of shame, red deficits)
- Punitive streaks

## Accessibility & material constraints

- Glass must keep text readable: check contrast of text on translucent surfaces against the busiest background it can sit on; fall back to more opaque surfaces where needed.
- Respect `prefers-reduced-motion` (reduce/disable motion) and `prefers-reduced-transparency` (more solid surfaces).
- Keep `backdrop-filter` usage measured — many stacked blurred layers are slow on phones.
- Visible keyboard focus states.

## Tokens (naming approach)

Design values live as CSS custom properties in `src/styles/tokens.css`, named by role rather than by value, e.g.:

```css
--color-anchor        /* navy */
--color-accent        /* hot pink */
--color-ambient-1..n  /* pastel light */
--surface-glass-bg, --surface-glass-blur, --surface-glass-highlight
--space-1..n, --radius-1..n, --font-ui, --font-hand
--motion-fast, --motion-base
```

Components consume tokens; raw hex values don't appear in component CSS.
