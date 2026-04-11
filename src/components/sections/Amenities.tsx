"use client";

import * as LucideIcons from "lucide-react";
import { amenities } from "@/lib/constants";
import SectionHeading from "@/components/ui/SectionHeading";
import AnimatedSection from "@/components/ui/AnimatedSection";

export default function Amenities() {
  return (
    <section id="amenities" className="bg-surface py-24" aria-label="Amenities">
      <div className="mx-auto max-w-7xl px-6">
        <AnimatedSection>
          <SectionHeading
            title="World-Class Facilities"
            subtitle="Every detail is designed to deliver an unmatched experience — from the water to the weights."
          />
        </AnimatedSection>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {amenities.map((item, i) => {
            const Icon =
              (LucideIcons as unknown as Record<string, LucideIcons.LucideIcon>)[
                item.icon
              ] ?? LucideIcons.Star;

            return (
              <AnimatedSection key={item.id} delay={i * 0.1}>
                <div className="group rounded-2xl border border-transparent bg-light p-6 transition-all duration-200 hover:-translate-y-1 hover:border-brand hover:shadow-lg">
                  <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-brand/10 text-brand transition-colors group-hover:bg-brand group-hover:text-white">
                    <Icon size={28} />
                  </div>
                  <h3 className="font-display text-lg font-bold text-neutral-dark">
                    {item.name}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-neutral-dark/60">
                    {item.description}
                  </p>
                  <p className="mt-3 text-xs font-semibold uppercase tracking-wider text-brand">
                    {item.stat}
                  </p>
                </div>
              </AnimatedSection>
            );
          })}
        </div>
      </div>
    </section>
  );
}
