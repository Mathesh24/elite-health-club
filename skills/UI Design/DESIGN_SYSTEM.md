---
name: design-system
description: >
  Elite Health Club brand and design system reference. Use this skill before
  writing ANY component, section, or style — even small UI elements.
  Triggers on: creating components, adding styles, choosing colors, picking fonts,
  writing Tailwind classes, building new sections, or any task where visual
  consistency matters. If you're about to write a className or a color value,
  read this first.
---

# Elite Health Club — Design System

## Brand Colors

Use these CSS variable names everywhere. Never hardcode hex values in components.

```css
/* globals.css — already defined */
--color-primary:       #1A7A7A;   /* Deep teal — logo color, primary actions */
--color-primary-dark:  #0F5555;   /* Hover / active state of primary */
--color-primary-light: #E8F5F5;   /* Tinted backgrounds, card hovers */
--color-accent:        #F0C060;   /* Gold — CTAs, highlights, icons */
--color-accent-dark:   #C89A30;   /* Hover state of gold */
--color-dark:          #0F1A1A;   /* Hero bg, footer bg, dark sections */
--color-dark-mid:      #0F2A2A;   /* Booking section bg */
--color-surface:       #F4FAF9;   /* Alternating section bg (light teal tint) */
--color-text-base:     #1A2A2A;   /* Body text */
--color-text-muted:    #5A7070;   /* Subtext, captions */
--color-border:        #D0E8E8;   /* Subtle borders */
```

### Tailwind usage (tailwind.config.ts already extends these):
```
bg-primary        text-primary        border-primary
bg-accent         text-accent         border-accent
bg-dark           text-dark
bg-surface        (alternating section backgrounds)
text-muted        (secondary text)
```

### Section background pattern — alternate strictly in this order:
1. Hero          → bg-dark        (deep teal-black)
2. Amenities     → bg-white
3. About         → bg-surface     (light teal)
4. Gallery       → bg-white
5. Membership    → bg-surface
6. Testimonials  → bg-white
7. Booking       → bg-dark-mid    (dark teal)

---

## Typography

### Font families (loaded via next/font/google):
```
--font-display: 'Cormorant Garamond'   → headings, pull quotes, hero
--font-body:    'DM Sans'              → body, UI, labels, buttons
```

### Tailwind classes:
```
font-display    → Cormorant Garamond
font-body       → DM Sans (default, applied on <body>)
```

### Type scale — always use these, never arbitrary sizes:
| Role             | Class                              | Notes                        |
|------------------|------------------------------------|------------------------------|
| Hero H1          | `text-6xl lg:text-8xl font-display`| Cormorant, white             |
| Section H2       | `text-4xl lg:text-5xl font-display`| Cormorant, on-brand color    |
| Card title       | `text-xl font-semibold font-body`  | DM Sans                      |
| Body             | `text-base font-body`              | DM Sans, text-base           |
| Caption / label  | `text-sm text-muted font-body`     | Muted, uppercase + tracking  |
| Overline         | `text-xs uppercase tracking-widest text-accent font-body` | Gold, small caps feel |
| Price            | `text-5xl font-display font-light` | Cormorant                    |

---

## Spacing & Layout

- Section vertical padding: `py-20 lg:py-32`
- Section inner container: `container mx-auto px-6 lg:px-16`
- Max content width: `max-w-7xl`
- Card gap: `gap-6 lg:gap-8`
- Grid: mobile first — `grid-cols-1 sm:grid-cols-2 lg:grid-cols-3/4/5`

---

## Component Tokens

### Buttons

**Primary (Gold CTA):**
```tsx
<button className="bg-accent hover:bg-accent-dark text-dark font-body
  font-semibold px-8 py-3 rounded-none tracking-wide
  transition-colors duration-200">
  Join Now
</button>
```

**Ghost (outline on dark bg):**
```tsx
<button className="border border-white/40 hover:border-white text-white
  font-body px-8 py-3 rounded-none tracking-wide
  transition-colors duration-200">
  Take a Tour
</button>
```

**Text link:**
```tsx
<span className="text-primary hover:text-primary-dark font-body
  font-medium underline-offset-4 hover:underline transition-colors">
  Learn More →
</span>
```

> Note: `rounded-none` is intentional — sharp corners reinforce the modern-luxury aesthetic.

### Cards

**Amenity / feature card:**
```tsx
<div className="bg-white border border-border p-8
  hover:border-primary hover:-translate-y-1 hover:shadow-lg
  transition-all duration-300 group">
```

**Pricing card (standard):**
```tsx
<div className="bg-white border border-border p-8">
```

**Pricing card (featured / Gold plan):**
```tsx
<div className="bg-white border-2 border-primary p-8 scale-105 shadow-xl">
```

### Section heading block (use `<SectionHeading>` component):
```tsx
// Always centered, always this structure:
<div className="text-center mb-16">
  <p className="text-xs uppercase tracking-widest text-accent mb-3">overline</p>
  <h2 className="text-4xl lg:text-5xl font-display text-dark">Main Title</h2>
  <p className="text-muted mt-4 max-w-xl mx-auto">Optional subtitle</p>
</div>
```

---

## Animation Conventions

All scroll-triggered animations use `<AnimatedSection>` wrapper:
```tsx
<AnimatedSection delay={0.1}>
  {/* content */}
</AnimatedSection>
```

Standard motion variants (defined once in `lib/motion.ts`):
```ts
export const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (delay = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.6, ease: 'easeOut', delay }
  })
}

export const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } }
}
```

Stagger delay pattern for grids:
```tsx
// cards[0]=0.0, cards[1]=0.1, cards[2]=0.2 ...
{items.map((item, i) => (
  <AnimatedSection key={item.id} delay={i * 0.1}>
    <Card {...item} />
  </AnimatedSection>
))}
```

Always wrap animations in:
```tsx
// In AnimatedSection.tsx
const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
// Skip animation if true
```

---

## Icon Usage

Always use `lucide-react`. Standard icon sizing:
```tsx
<Icon size={24} className="text-primary" />   // amenity cards
<Icon size={20} className="text-accent" />    // feature list checkmarks
<Icon size={16} />                            // inline / button icons
```

Amenity icon map (from `constants.ts`):
```
Swimming Pool  → Waves
Gym            → Dumbbell
Tennis         → CircleDot
Badminton      → Zap
Resort         → BedDouble
```

---

## Do / Don't

| ✅ Do                                          | ❌ Don't                              |
|-----------------------------------------------|---------------------------------------|
| Use `font-display` for all headings            | Use Inter or system fonts             |
| Use `rounded-none` on buttons and cards        | Add border-radius to cards/buttons    |
| Use teal/gold for all accent moments           | Use blue, purple, or red anywhere     |
| Keep section padding `py-20 lg:py-32`          | Invent custom vertical spacing        |
| Animate with `AnimatedSection` wrapper         | Add raw framer-motion to every file   |
| Use CSS vars for all color values              | Hardcode any hex in component files   |
