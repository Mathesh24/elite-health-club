---
name: section-template
description: >
  How to build a new page section for Elite Health Club. Use this skill
  whenever creating, editing, or extending any section component under
  src/components/sections/. Triggers on: "add a new section", "build the X section",
  "create a section for", "add a page block". Ensures every section follows
  the same file structure, animation pattern, data wiring, and responsive layout.
---

# Section Template — Elite Health Club

Every section must follow this exact pattern. Read DESIGN_SYSTEM.md before writing
any classNames or colors.

---

## File checklist for a new section

```
src/
  components/sections/
    NewSection.tsx          ← the section component (this file)
  lib/
    constants.ts            ← add section data here (not in the component)
```

---

## Section component template

```tsx
// src/components/sections/ExampleSection.tsx
'use client'

import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import SectionHeading from '@/components/ui/SectionHeading'
import AnimatedSection from '@/components/ui/AnimatedSection'
import { EXAMPLE_DATA } from '@/lib/constants'

export default function ExampleSection() {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 })

  return (
    <section
      id="example"                          // ← always add id for nav anchor
      aria-label="Example section"          // ← always add aria-label
      className="py-20 lg:py-32 bg-white"   // ← bg from DESIGN_SYSTEM alternating pattern
    >
      <div className="container mx-auto px-6 lg:px-16 max-w-7xl">

        {/* Section heading — always use SectionHeading component */}
        <SectionHeading
          overline="Our Services"
          title="What We Offer"
          subtitle="Optional supporting sentence here."
        />

        {/* Content grid */}
        <motion.div
          ref={ref}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8"
        >
          {EXAMPLE_DATA.map((item, i) => (
            <AnimatedSection key={item.id} delay={i * 0.1}>
              {/* Card content here */}
            </AnimatedSection>
          ))}
        </motion.div>

      </div>
    </section>
  )
}
```

---

## Rules

### 1. Data always lives in constants.ts
Never hardcode text, prices, names, or copy inside a component.
```ts
// src/lib/constants.ts
export const EXAMPLE_DATA = [
  { id: 'item-1', title: '...', description: '...' },
]
```

### 2. Section IDs match nav links
The `id` on `<section>` must match the href in Navbar:
```
id="amenities"   ↔   href="#amenities"
id="about"       ↔   href="#about"
id="gallery"     ↔   href="#gallery"
id="membership"  ↔   href="#membership"
id="contact"     ↔   href="#contact"
```

### 3. Background alternates (see DESIGN_SYSTEM.md)
Never pick a background color freely — follow the alternating pattern.

### 4. All sections are 'use client' only if they use hooks
If a section has no interactivity (no useState, no useInView), remove 'use client'
and make it a React Server Component for better performance.

### 5. Mobile first, always
Write `grid-cols-1` first, then `sm:grid-cols-2 lg:grid-cols-N`.
Never write desktop-first breakpoints.

### 6. Responsive typography
Always pair a mobile size with a desktop size:
```
text-4xl lg:text-5xl    ← section headings
text-xl lg:text-2xl     ← card titles
text-base               ← body (no change needed)
```

---

## Register in page.tsx

After creating a section, add it to `src/app/page.tsx` in scroll order:

```tsx
import HeroSection        from '@/components/sections/Hero'
import AmenitiesSection   from '@/components/sections/Amenities'
import AboutSection       from '@/components/sections/About'
import GallerySection     from '@/components/sections/Gallery'
import MembershipSection  from '@/components/sections/Membership'
import TestimonialsSection from '@/components/sections/Testimonials'
import BookingSection     from '@/components/sections/Booking'

export default function Home() {
  return (
    <main>
      <HeroSection />
      <AmenitiesSection />
      <AboutSection />
      <GallerySection />
      <MembershipSection />
      <TestimonialsSection />
      <BookingSection />
    </main>
  )
}
```

---

## Quick variants

### Dark section (Hero, Booking, Footer)
```tsx
<section className="py-20 lg:py-32 bg-dark text-white" ...>
```

### Split two-column section (About)
```tsx
<div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
  <div>{/* left content */}</div>
  <div>{/* right content */}</div>
</div>
```

### Full-width image section (Gallery)
```tsx
// No max-w-7xl on the grid — let it breathe edge to edge
<div className="container mx-auto px-0 lg:px-0">
  <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
```
