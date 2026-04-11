---
name: iteration-guide
description: >
  How to safely add features, edit content, or refactor components in the
  Elite Health Club Next.js project without breaking existing sections.
  Use this skill when: modifying an existing section, adding a new feature,
  updating copy or pricing data, changing animations, debugging layout issues,
  or any task described as "update", "change", "fix", "add to", "improve",
  or "tweak" on the running site. Always read this before touching existing files.
---

# Iteration Guide — Elite Health Club

## Before making ANY change

1. Read `src/lib/constants.ts` — all copy, prices, and data live here.
   If you're changing text or numbers, **only edit constants.ts**, not the component.

2. Identify which component owns the feature:
   ```
   Visual / brand decision      → check DESIGN_SYSTEM.md first
   New page section             → follow SECTION_TEMPLATE.md
   Data / copy change           → constants.ts only
   Animation change             → AnimatedSection.tsx or lib/motion.ts
   Nav link change              → Navbar.tsx + matching section id
   Pricing / plan change        → constants.ts PLANS array
   Form fields                  → Booking.tsx + Zod schema in same file
   ```

3. Never edit two concerns in the same change.
   One PR / one task = one concern.

---

## Safe content edits (constants.ts only)

### Update pricing:
```ts
// src/lib/constants.ts
export const PLANS = [
  {
    id: 'silver',
    name: 'Silver',
    monthlyPrice: 2999,   // ← edit here, in paise/cents
    annualPrice: 27999,
    features: ['Gym access', 'Swimming pool', '...'],
    highlighted: false,
  },
  ...
]
```

### Add/remove amenity:
```ts
export const AMENITIES = [
  {
    id: 'pool',
    name: 'Swimming Pool',
    icon: 'Waves',          // lucide-react icon name
    description: '...',
    stat: '25m Olympic',
  },
  // add new object here
]
```

### Add a testimonial:
```ts
export const TESTIMONIALS = [
  {
    id: 't1',
    quote: '...',
    name: 'Priya Sharma',
    tier: 'Gold Member',
    initials: 'PS',
  },
]
```

---

## Safe animation edits

All timing lives in `src/lib/motion.ts`. Change values here — not in individual components.

```ts
// Slow down scroll animations:
export const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (delay = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.7, ease: 'easeOut', delay }  // ← change duration here
  })
}

// Reduce stagger between cards:
export const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } }  // ← change stagger here
}
```

---

## Adding a new section safely

1. Create `src/components/sections/NewSection.tsx` (follow SECTION_TEMPLATE.md)
2. Add data to `src/lib/constants.ts`
3. Import and add to `src/app/page.tsx` in the correct scroll position
4. Add a nav anchor to `src/components/layout/Navbar.tsx`
5. Verify `id` on `<section>` matches the nav `href`

---

## Debugging checklist

### Section not animating?
- [ ] Is `'use client'` at the top of the file?
- [ ] Is `useInView` imported from `react-intersection-observer`?
- [ ] Is `triggerOnce: true` set?
- [ ] Is `animate={inView ? 'visible' : 'hidden'}` on the motion.div?

### Font not applying?
- [ ] Is the section using `font-display` for headings?
- [ ] Are Google Fonts loaded in `layout.tsx` via `next/font/google`?
- [ ] Is `className={`${cormorant.variable} ${dmSans.variable}`}` on `<html>`?

### Nav link not scrolling?
- [ ] Does the section have `id="exact-slug"`?
- [ ] Does the nav href have `href="#exact-slug"`?
- [ ] Is smooth scroll enabled? (`scroll-behavior: smooth` in globals.css)

### Pricing toggle not switching?
- [ ] Is `isAnnual` state in `Membership.tsx`?
- [ ] Is price rendered as `isAnnual ? plan.annualPrice : plan.monthlyPrice`?

### Form not validating?
- [ ] Is the Zod schema updated to match new fields?
- [ ] Is `resolver: zodResolver(schema)` passed to `useForm()`?

---

## Component ownership map

```
Navbar.tsx          → sticky nav, mobile menu, scroll behaviour
Hero.tsx            → full-viewport hero, headline animation, CTAs
Amenities.tsx       → 5-card grid, icon cards, stagger animation
About.tsx           → 2-col layout, stat counters, pull quote
Gallery.tsx         → masonry grid, filter pills, lightbox
Membership.tsx      → toggle, 3 pricing cards, feature lists
Testimonials.tsx    → auto-carousel, dot indicators
Booking.tsx         → form (react-hook-form + zod), map, contact info
Footer.tsx          → links, social icons, back-to-top

AnimatedSection.tsx → reusable fade-up wrapper (DO NOT MODIFY per-section)
SectionHeading.tsx  → overline + h2 + subtitle block (DO NOT MODIFY per-section)
Button.tsx          → primary / ghost / text variants
lib/constants.ts    → ALL data, copy, prices (edit this, not components)
lib/motion.ts       → ALL animation variants (edit this, not components)
```

---

## Deployment checklist before pushing

- [ ] `npm run build` completes with zero errors
- [ ] `npm run lint` passes
- [ ] All images use `next/image` with `alt` text
- [ ] No hardcoded hex values in any component file
- [ ] `constants.ts` is the single source of truth for all copy
- [ ] Mobile layout tested at 375px width
- [ ] Reduced-motion preference tested (OS setting)
