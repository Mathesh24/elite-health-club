"use client";

import * as LucideIcons from "lucide-react";
import { amenities } from "@/lib/constants";
import SectionHeading from "@/components/ui/SectionHeading";
import AnimatedSection from "@/components/ui/AnimatedSection";

export default function Amenities() {
  return (
    <section id="amenities" className="bg-surface py-12 sm:py-14" aria-label="Amenities">
      <div className="mx-auto max-w-7xl px-6">
        <AnimatedSection>
          <SectionHeading
            title="World-Class Facilities"
            subtitle="Every detail is designed to deliver an unmatched experience from the water to the weights."
            className="mb-8 sm:mb-10"
          />
        </AnimatedSection>

        <div className="grid auto-rows-fr grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
          {amenities.map((item, i) => {
            const Icon =
              (LucideIcons as unknown as Record<string, LucideIcons.LucideIcon>)[
                item.icon
              ] ?? LucideIcons.Star;

            return (
              <AnimatedSection key={item.id} delay={i * 0.1} className="h-full">
                <div className="group flex h-full min-h-48 flex-col rounded-xl border border-white/60 bg-light/85 p-5 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-brand/35 hover:bg-light hover:shadow-lg">
                  <div className="mb-4 flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#157070]/10 text-[#0E5F5A] transition-colors group-hover:bg-gradient-to-br group-hover:from-[#0E4D49] group-hover:to-[#3C9088] group-hover:text-white">
                    <Icon size={22} />
                  </div>
                  <h3 className="font-display text-base font-bold leading-snug text-neutral-dark">
                    {item.name}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-neutral-dark/60">
                    {item.description}
                  </p>
                  {item.stat && (
                    <p className="mt-auto pt-4 text-xs font-semibold uppercase tracking-wider text-[#0E6A65]">
                      {item.stat}
                    </p>
                  )}
                </div>
              </AnimatedSection>
            );
          })}
        </div>
      </div>
    </section>
  );
}
