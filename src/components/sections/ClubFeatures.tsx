"use client";

import { motion } from "framer-motion";
import {
  BatteryCharging,
  CarFront,
  ChefHat,
  Coffee,
  Droplets,
  LockKeyhole,
  ShieldCheck,
} from "lucide-react";
import AnimatedSection from "@/components/ui/AnimatedSection";
import SectionHeading from "@/components/ui/SectionHeading";

const clubFeatures = [
  {
    title: "Power Backup & Generator",
    icon: BatteryCharging,
  },
  {
    title: "RO Water Plant",
    icon: Droplets,
  },
  {
    title: "24/7 Security & CCTV",
    icon: ShieldCheck,
  },
  {
    title: "Ample Parking Space",
    icon: CarFront,
  },
  {
    title: "Cloud Kitchen Access",
    icon: ChefHat,
  },
  {
    title: "24 Hr Cafeteria",
    icon: Coffee,
  },
  {
    title: "Members-Only Access",
    icon: LockKeyhole,
  },
];

export default function ClubFeatures() {
  return (
    <section
      className="relative overflow-hidden bg-surface py-8 sm:py-10"
      aria-label="Club features"
    >
      <div className="pointer-events-none absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-accent/35 to-transparent" />
      <div className="pointer-events-none absolute left-1/2 top-20 h-36 w-36 -translate-x-[32rem] rounded-full bg-accent/12 blur-3xl" />
      <div className="pointer-events-none absolute right-1/2 bottom-8 h-40 w-40 translate-x-[31rem] rounded-full bg-[#3C9088]/10 blur-3xl" />
      <div className="pointer-events-none absolute inset-x-0 top-24 mx-auto h-24 max-w-3xl bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.55),transparent_70%)]" />

      <div className="relative mx-auto max-w-7xl px-6">
        <AnimatedSection>
          <SectionHeading
            title="Club Features"
            subtitle="Thoughtful essentials that keep every visit seamless, secure, and restorative."
            className="mb-6 max-w-xl sm:mb-8 [&_h2]:text-3xl [&_p]:mx-auto [&_p]:max-w-xl [&_p]:text-sm [&_p]:leading-6 sm:[&_h2]:text-[2.3rem] sm:[&_p]:text-base sm:[&_p]:leading-7"
          />
        </AnimatedSection>

        <div className="mx-auto max-w-6xl">
          <div className="grid grid-cols-2 gap-x-4 gap-y-5 sm:gap-x-6 sm:gap-y-7 md:grid-cols-3 lg:grid-cols-12 lg:gap-y-8">
            {clubFeatures.map((feature, index) => {
              const Icon = feature.icon;

              return (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.35 }}
                  transition={{
                    duration: 0.45,
                    delay: index * 0.05,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  className="lg:col-span-3 lg:[&:nth-child(5)]:col-start-3"
                >
                  <div className="group flex min-h-24 flex-col items-center justify-start text-center sm:min-h-28">
                    <div className="relative mb-2.5 flex h-16 w-16 items-center justify-center overflow-hidden rounded-full border border-white/70 bg-white/45 shadow-[0_10px_22px_rgba(14,30,26,0.065)] backdrop-blur-[2px] transition-all duration-500 ease-out before:absolute before:inset-1 before:rounded-full before:border before:border-accent/18 before:bg-gradient-to-br before:from-white/85 before:via-light/65 before:to-white/72 before:content-[''] after:absolute after:-left-5 after:top-2 after:h-14 after:w-5 after:rotate-12 after:bg-white/35 after:blur-sm after:transition-transform after:duration-700 after:content-[''] group-hover:-translate-y-1 group-hover:border-accent/32 group-hover:bg-white/58 group-hover:shadow-[0_16px_32px_rgba(14,30,26,0.11)] group-hover:after:translate-x-20 sm:mb-4 sm:h-[5.1rem] sm:w-[5.1rem] sm:shadow-[0_14px_30px_rgba(14,30,26,0.075)] sm:group-hover:-translate-y-1.5 lg:h-[5.25rem] lg:w-[5.25rem]">
                      <div className="absolute inset-[0.34rem] rounded-full border border-white/60" />
                      <Icon
                        size={24}
                        strokeWidth={1.95}
                        className="relative z-10 text-[#0E5F5A] drop-shadow-[0_3px_3px_rgba(14,30,26,0.16)] transition-all duration-500 ease-out [filter:drop-shadow(0_1px_0_rgba(255,255,255,0.55))_drop-shadow(0_5px_8px_rgba(14,30,26,0.14))] group-hover:scale-105 group-hover:text-[#157070] group-hover:[filter:drop-shadow(0_1px_0_rgba(255,255,255,0.65))_drop-shadow(0_7px_10px_rgba(14,30,26,0.18))] sm:size-[31px]"
                      />
                    </div>
                    <h3 className="max-w-32 font-display text-[0.78rem] font-medium leading-snug tracking-[0.01em] text-neutral-dark/80 transition-colors duration-300 group-hover:text-neutral-dark sm:max-w-44 sm:text-base">
                      {feature.title}
                    </h3>
                    <div className="mt-2 h-px w-6 rounded-full bg-accent/40 transition-all duration-500 group-hover:w-8 group-hover:bg-accent/65 sm:mt-3 sm:w-8 sm:group-hover:w-10" />
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
