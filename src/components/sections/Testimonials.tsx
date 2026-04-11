"use client";

import { useState, useEffect, useCallback } from "react";
import { cn } from "@/lib/utils";
import { testimonials } from "@/lib/constants";
import SectionHeading from "@/components/ui/SectionHeading";
import AnimatedSection from "@/components/ui/AnimatedSection";

export default function Testimonials() {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const total = testimonials.length;

  const next = useCallback(
    () => setActive((prev) => (prev + 1) % total),
    [total]
  );

  useEffect(() => {
    if (paused) return;
    const id = setInterval(next, 5000);
    return () => clearInterval(id);
  }, [paused, next]);

  return (
    <section
      id="testimonials"
      className="bg-surface py-24"
      aria-label="Testimonials"
    >
      <div className="mx-auto max-w-7xl px-6">
        <AnimatedSection>
          <SectionHeading
            title="What Our Members Say"
            subtitle="Real stories from real members who've made Elite their home."
          />
        </AnimatedSection>

        <AnimatedSection>
          <div
            className="relative mx-auto max-w-3xl"
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
          >
            {/* Cards — CSS scroll-snap carousel */}
            <div className="overflow-hidden">
              <div
                className="flex transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"
                style={{ transform: `translateX(-${active * 100}%)` }}
              >
                {testimonials.map((t) => (
                  <div
                    key={t.name}
                    className="w-full shrink-0 px-4"
                    aria-hidden={testimonials.indexOf(t) !== active}
                  >
                    <div className="rounded-2xl border border-neutral-dark/5 bg-light p-8 text-center sm:p-10">
                      <span className="font-display text-6xl leading-none text-accent">
                        &ldquo;
                      </span>
                      <p className="mt-2 text-lg leading-relaxed text-neutral-dark/80">
                        {t.quote}
                      </p>
                      <div className="mt-6 flex flex-col items-center gap-2">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-brand text-sm font-bold text-white">
                          {t.initials}
                        </div>
                        <p className="font-display text-lg font-semibold text-neutral-dark">
                          {t.name}
                        </p>
                        <p className="text-xs uppercase tracking-wider text-neutral-dark/50">
                          {t.tier}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Dots */}
            <div className="mt-8 flex justify-center gap-2">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActive(i)}
                  className={cn(
                    "h-2.5 rounded-full transition-all duration-300",
                    i === active
                      ? "w-8 bg-brand"
                      : "w-2.5 bg-neutral-dark/20 hover:bg-neutral-dark/40"
                  )}
                  aria-label={`Go to testimonial ${i + 1}`}
                />
              ))}
            </div>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}
