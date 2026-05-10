"use client";

import { motion } from "framer-motion";
import {
  BadgeCheck,
  BatteryCharging,
  Coffee,
  CookingPot,
  Droplets,
  ParkingCircle,
  ShieldCheck,
} from "lucide-react";
import AnimatedSection from "@/components/ui/AnimatedSection";
import SectionHeading from "@/components/ui/SectionHeading";
import { cn } from "@/lib/utils";

const clubFeatures = [
  {
    title: "Power Backup & Generator",
    description: "Reliable backup systems for uninterrupted club operations.",
    icon: BatteryCharging,
  },
  {
    title: "RO Water Plant",
    description: "Clean purified water systems for pools and amenities.",
    icon: Droplets,
  },
  {
    title: "24/7 Security & CCTV",
    description: "Round-the-clock monitored security for member safety.",
    icon: ShieldCheck,
  },
  {
    title: "Ample Parking Space",
    description: "Spacious parking facilities for members and guests.",
    icon: ParkingCircle,
  },
  {
    title: "Cloud Kitchen Access",
    description: "Healthy meals and refreshments available through pre-booking.",
    icon: CookingPot,
  },
  {
    title: "24 Hr Cafeteria",
    description: "Clean and healthy dining options available throughout the day.",
    icon: Coffee,
  },
  {
    title: "Members-Only Access",
    description: "Exclusive access reserved for Elite Health Club members.",
    icon: BadgeCheck,
  },
];

export default function ClubFeatures() {
  return (
    <section className="bg-surface py-24" aria-label="Club features">
      <div className="mx-auto max-w-7xl px-6">
        <AnimatedSection>
          <SectionHeading
            title="Club Features"
            subtitle="Thoughtful essentials that keep every visit seamless, secure, and restorative."
          />
        </AnimatedSection>

        <div className="relative mx-auto max-w-5xl">
          <div className="space-y-10 md:space-y-12">
            {clubFeatures.map((feature, index) => {
              const Icon = feature.icon;
              const alignLeft = index % 2 === 0;

              return (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.35 }}
                  transition={{
                    duration: 0.55,
                    delay: index * 0.08,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                >
                  <div className="relative grid gap-4 pl-14 md:grid-cols-[1fr_4rem_1fr] md:items-center md:gap-6 md:pl-0">
                    <div
                      className={cn(
                        "hidden h-px bg-brand/20 md:block",
                        alignLeft ? "col-start-1" : "col-start-3",
                        alignLeft ? "justify-self-end" : "justify-self-start",
                        "w-16"
                      )}
                    />

                    <div className="absolute left-0 top-1 flex h-10 w-10 items-center justify-center rounded-full border border-brand/20 bg-light text-brand shadow-sm md:static md:col-start-2 md:row-start-1 md:justify-self-center">
                      <Icon size={20} strokeWidth={1.8} />
                    </div>

                    <div
                      className={cn(
                        "max-w-md border-t border-neutral-dark/10 pt-4",
                        "md:row-start-1 md:border-t-0 md:pt-0",
                        alignLeft
                          ? "md:col-start-1 md:text-right"
                          : "md:col-start-3 md:text-left"
                      )}
                    >
                      <h3 className="font-display text-xl font-bold text-neutral-dark">
                        {feature.title}
                      </h3>
                      <p className="mt-2 text-sm leading-relaxed text-neutral-dark/60">
                        {feature.description}
                      </p>
                    </div>
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
