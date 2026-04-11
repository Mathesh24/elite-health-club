"use client";

import { stats } from "@/lib/constants";
import SectionHeading from "@/components/ui/SectionHeading";
import AnimatedSection from "@/components/ui/AnimatedSection";

export default function About() {
  return (
    <section id="about" className="bg-light py-24" aria-label="About us">
      <div className="mx-auto max-w-7xl px-6">
        <AnimatedSection>
          <SectionHeading
            title="About Elite Health Club"
            subtitle="More than a fitness centre — a lifestyle destination built on excellence."
          />
        </AnimatedSection>

        <div className="grid items-center gap-12 lg:grid-cols-2">
          {/* Left — stats & text */}
          <AnimatedSection>
            <div className="grid grid-cols-3 gap-6">
              {stats.map((s) => (
                <div key={s.label} className="text-center lg:text-left">
                  <p className="font-display text-4xl font-bold text-brand sm:text-5xl">
                    {s.value}
                  </p>
                  <div className="mx-auto mt-2 h-0.5 w-8 bg-accent lg:mx-0" />
                  <p className="mt-2 text-sm text-neutral-dark/60">{s.label}</p>
                </div>
              ))}
            </div>
            <div className="mt-10 space-y-4 text-neutral-dark/70">
              <p>
                Founded over fifteen years ago, Elite Health Club set out with a
                simple vision: to create a wellness destination that rivals the
                finest resorts in the world, right in the heart of the city.
              </p>
              <p>
                From our Olympic-sized pool to our luxury suites, every square
                foot is designed around our members&apos; well-being. Our team of
                certified trainers, nutritionists, and wellness coaches are
                committed to helping you reach your peak — on your terms.
              </p>
            </div>
            <a
              href="#contact"
              className="mt-6 inline-flex items-center gap-1 text-sm font-semibold text-brand transition-colors hover:text-brand/80"
            >
              Learn Our Story &rarr;
            </a>
          </AnimatedSection>

          {/* Right — pull-quote card */}
          <AnimatedSection delay={0.2}>
            <div className="relative mx-auto max-w-md lg:mx-0 lg:ml-auto">
              <div className="rounded-2xl bg-brand p-1">
                <div className="rounded-xl bg-white p-8">
                  <blockquote className="font-display text-xl italic leading-relaxed text-neutral-dark">
                    &ldquo;We don&apos;t just build bodies — we build a
                    community of people who hold each other to a higher
                    standard.&rdquo;
                  </blockquote>
                  <p className="mt-4 text-sm font-semibold text-brand">
                    — Arjun Mehta, Founder &amp; CEO
                  </p>
                </div>
              </div>
              {/* Decorative accent */}
              <div className="absolute -bottom-4 -right-4 -z-10 h-full w-full rounded-2xl bg-accent/20" />
            </div>
          </AnimatedSection>
        </div>
      </div>
    </section>
  );
}
