"use client";

import {
  ArrowRight,
  Clock3,
  Flame,
  Hotel,
  LockKeyhole,
  Trophy,
  Waves,
} from "lucide-react";
import AnimatedSection from "@/components/ui/AnimatedSection";

const highlights = [
  { label: "24/7 executive gym access", icon: Clock3 },
  { label: "25-metre swimming pool", icon: Waves },
  { label: "Multi-game outdoor court", icon: Trophy },
  { label: "Sauna and steam bath", icon: Flame },
  { label: "Three luxury suites", icon: Hotel },
  { label: "Members-only environment", icon: LockKeyhole },
];

export default function About() {
  return (
    <section
      id="about"
      className="relative overflow-hidden bg-light py-20 sm:py-24 lg:py-28"
      aria-label="About Elite Health Club"
    >
      <div className="pointer-events-none absolute -right-28 top-10 h-72 w-72 rounded-full bg-brand/8 blur-3xl" />
      <div className="pointer-events-none absolute -left-24 bottom-0 h-64 w-64 rounded-full bg-accent/10 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-6">
        <div className="grid items-start gap-12 lg:grid-cols-[minmax(0,1.05fr)_minmax(24rem,0.95fr)] lg:gap-16">
          <AnimatedSection>
            <p className="mb-4 text-xs font-bold uppercase tracking-[0.28em] text-brand">
              About Elite Health Club
            </p>
            <h2 className="max-w-2xl font-display text-4xl font-bold tracking-tight text-neutral-dark sm:text-5xl lg:text-6xl">
              A New Standard for Wellness
            </h2>
            <div className="mt-8 h-1 w-16 rounded-full bg-accent" />

            <div className="mt-8 max-w-2xl space-y-5 text-base leading-8 text-neutral-dark/70 sm:text-lg">
              <p>
                Elite Health Club is a new wellness initiative created to make
                healthier, more balanced living part of everyday life in
                Kandukur.
              </p>
              <p>
                We bring fitness, recreation, recovery and relaxation together
                in one thoughtfully designed destination—from an executive gym
                and Mini Olympic-sized pool to outdoor sports, sauna, steam bath
                and luxury stays.
              </p>
              <p>
                Our vision is simple: to create a welcoming, members-only
                environment where people can move with purpose, recover deeply
                and invest in their long-term wellbeing.
              </p>
            </div>

            <a
              href="#plans"
              className="mt-8 inline-flex items-center gap-2 rounded-full bg-brand px-6 py-3 text-sm font-bold text-white shadow-[0_12px_30px_rgba(21,112,112,0.2)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-brand/90 hover:shadow-[0_16px_34px_rgba(21,112,112,0.28)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
            >
              Discover the Elite Experience
              <ArrowRight size={17} aria-hidden="true" />
            </a>
          </AnimatedSection>

          <AnimatedSection delay={0.2}>
            <div className="overflow-hidden rounded-3xl border border-white/80 bg-white/75 p-5 shadow-[0_24px_70px_rgba(14,30,26,0.1)] backdrop-blur-sm sm:p-7">
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {highlights.map(({ label, icon: Icon }) => (
                  <div
                    key={label}
                    className="group flex min-h-28 flex-col justify-between rounded-2xl border border-neutral-dark/6 bg-surface p-5 transition-all duration-300 hover:-translate-y-0.5 hover:border-brand/25 hover:shadow-md"
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand/10 text-brand transition-colors duration-300 group-hover:bg-brand group-hover:text-white">
                      <Icon size={20} strokeWidth={1.9} aria-hidden="true" />
                    </div>
                    <p className="mt-5 text-sm font-semibold leading-5 text-neutral-dark/80">
                      {label}
                    </p>
                  </div>
                ))}
              </div>

              <div className="mt-4 rounded-2xl bg-neutral-dark px-6 py-6 text-white sm:px-7">
                <p className="text-[0.68rem] font-bold uppercase tracking-[0.24em] text-accent">
                  Our philosophy
                </p>
                <blockquote className="mt-3 font-display text-lg leading-7 text-white/90 sm:text-xl">
                  Fitness is only the beginning. This is a place to recharge,
                  reconnect and add more life to every year.
                </blockquote>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </div>
    </section>
  );
}
