"use client";

import { motion } from "framer-motion";
import { ArrowRight, Clock, Crown, ShieldCheck, Sparkles } from "lucide-react";
import SectionHeading from "@/components/ui/SectionHeading";
import AnimatedSection from "@/components/ui/AnimatedSection";
import Button from "@/components/ui/Button";

const membershipHighlights = [
  { icon: Clock, label: "Early Bird Access" },
  { icon: ShieldCheck, label: "Priority Access" },
  { icon: Crown, label: "Limited Slots" },
];

export default function Membership() {
  return (
    <section
      id="plans"
      className="relative overflow-hidden bg-light py-12 sm:py-14"
      aria-label="Exclusive membership invitation"
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent/35 to-transparent" />
      <div className="pointer-events-none absolute left-1/2 top-14 h-56 w-56 -translate-x-[34rem] rounded-full bg-accent/10 blur-3xl" />
      <div className="pointer-events-none absolute right-1/2 bottom-6 h-64 w-64 translate-x-[34rem] rounded-full bg-[#3C9088]/10 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-6">
        <AnimatedSection>
          <SectionHeading
            title="Join the Elite Community"
            subtitle="Early memberships are opening for families who value wellness, leisure, privacy, and resort-style amenities in one refined destination."
            className="mb-8 sm:mb-10"
          />
        </AnimatedSection>

        <AnimatedSection>
          <div className="mx-auto max-w-4xl overflow-hidden rounded-3xl border border-white/70 bg-white/45 p-1 shadow-[0_24px_70px_rgba(14,30,26,0.12)] backdrop-blur-md">
            <div className="relative rounded-[1.35rem] border border-white/70 bg-gradient-to-br from-white/90 via-surface/85 to-light/80 px-6 py-7 text-center sm:px-10 sm:py-8 lg:px-12">
              <div className="pointer-events-none absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-accent/50 to-transparent" />

              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full border border-accent/25 bg-white/70 text-[#0E5F5A] shadow-[0_12px_28px_rgba(14,30,26,0.08)]">
                <Sparkles size={24} strokeWidth={1.9} />
              </div>

              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-accent">
                Early Bird Access
              </p>
              <h3 className="mx-auto mt-3 max-w-2xl bg-gradient-to-r from-[#8A6A2F] via-accent to-[#B88A2F] bg-clip-text font-display text-3xl font-bold tracking-tight text-transparent sm:text-4xl">
                Become an Early Member
              </h3>
              <p className="mx-auto mt-3 max-w-2xl text-sm leading-7 text-neutral-dark/65 sm:text-base">
                Reserve priority access to a limited membership community built
                around premium fitness, calm recovery, family leisure, and the
                everyday luxury of a private wellness club.
              </p>

              <div className="mx-auto mt-6 grid max-w-2xl gap-3 sm:grid-cols-3">
                {membershipHighlights.map(({ icon: Icon, label }, index) => (
                  <motion.div
                    key={label}
                    initial={{ opacity: 0, y: 12 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.5 }}
                    transition={{ duration: 0.4, delay: index * 0.08 }}
                    className="flex items-center justify-center gap-2 rounded-full border border-brand/10 bg-white/45 px-4 py-2.5 text-sm font-medium text-neutral-dark/75"
                  >
                    <Icon size={16} className="text-[#0E6A65]" strokeWidth={1.9} />
                    {label}
                  </motion.div>
                ))}
              </div>

              <div className="mt-7 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <Button
                  href="#contact"
                  variant="primary"
                  className="group min-w-52 shadow-xl shadow-accent/20"
                >
                  Reserve Your Access
                  <ArrowRight
                    size={16}
                    className="ml-2 transition-transform duration-200 group-hover:translate-x-1"
                  />
                </Button>
                <span className="text-xs font-medium uppercase tracking-[0.22em] text-neutral-dark/45">
                  Limited founding slots
                </span>
              </div>
            </div>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}
