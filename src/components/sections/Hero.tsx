"use client";

import { motion } from "framer-motion";
import { Waves, Dumbbell, Hotel, ChevronDown } from "lucide-react";
import Image from "next/image";
import Button from "@/components/ui/Button";

const headline = ["Elevate", "Your", "Wellness", "Journey"];

const highlights: {
  icon: typeof Waves;
  label: string;
  stat?: string;
}[] = [
  { icon: Waves, label: "Swimming Pool" },
  { icon: Dumbbell, label: "Premium Gym" },
  { icon: Hotel, label: "Luxury Suites" },
];

export default function Hero() {
  return (
    <section
      id="hero"
      className="relative overflow-hidden bg-[#EEF4F1]"
    >
      {/* Background video */}
      <video
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        className="absolute inset-0 h-full w-full object-cover object-center"
      >
        <source src={`${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}/video1.mp4`} type="video/mp4" />
      </video>

      {/* Minimal dark scrim — only left side where text sits, ensures contrast without covering video */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-black/20 to-transparent" />

      {/* Content — one flow column inside the shared max-w-7xl container, so the
          logo, copy and chips can never overlap or fall outside narrow/short viewports */}
      <div className="relative z-10 mx-auto flex min-h-svh w-full max-w-7xl flex-col px-6 pb-[min(4rem,7vh)] pt-4">
        {/* Hero logo — same container alignment as the navbar logo; the navbar is
            hidden during the hero so there is no overlap */}
        <motion.a
          href="#"
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="shrink-0 self-start"
          aria-label="Elite Health Club home"
        >
          <Image
            src={`${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}/logo1.png`}
            alt="Elite Health Club"
            width={724}
            height={585}
            className="h-[min(6rem,11vh)] w-auto [filter:drop-shadow(0_0_6px_rgba(255,255,255,0.95))_drop-shadow(0_0_18px_rgba(255,255,255,0.55))]"
            loading="eager"
          />
        </motion.a>

        <div className="flex flex-1 items-center py-[min(2rem,3.5vh)]">
          <div className="max-w-2xl">
            {/* Fluid size: capped by viewport height too, so short laptop windows
                (a scaled 14" screen) don't push the copy past the fold */}
            <h1 className="font-hero text-5xl font-extralight leading-[1.15] tracking-wide text-white drop-shadow-[0_2px_16px_rgba(0,0,0,0.6)] sm:text-7xl lg:text-[min(6rem,7.5vw,10vh)]">
              {headline.map((word, i) => (
                <motion.span
                  key={word}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.15 + i * 0.1 }}
                  className="mr-[0.25em] inline-block"
                >
                  {word}
                </motion.span>
              ))}
            </h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="mt-6 max-w-lg text-base leading-relaxed text-white/75 sm:text-lg"
            >
              Discover a world-class wellness destination where cutting-edge
              fitness meets resort-style luxury — designed for those who expect
              nothing but the&nbsp;best.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.75 }}
              className="mt-8 flex flex-wrap gap-4"
            >
              <Button href="#plans" variant="primary">
                Explore Membership
              </Button>
              <Button href="#gallery" variant="ghost">
                Take a Tour
              </Button>
            </motion.div>
          </div>
        </div>

        {/* Floating amenity chips — hidden on small screens and in very short
            windows (see .hero-highlights in globals.css) */}
        <div className="hero-highlights hidden shrink-0 flex-wrap gap-3 lg:flex">
          {highlights.map(({ icon: Icon, label, stat }, i) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.8 + i * 0.12 }}
              className="flex items-center gap-3 rounded-xl border border-white/15 bg-white/10 px-4 py-3 backdrop-blur-md"
            >
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-brand/40 text-white">
                <Icon size={18} />
              </div>
              <div>
                <p className="text-sm font-semibold text-white">{label}</p>
                {stat && <p className="text-xs text-white/60">{stat}</p>}
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.a
        href="#amenities"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="absolute bottom-6 left-1/2 z-10 -translate-x-1/2 text-white/40 transition-colors hover:text-white"
        aria-label="Scroll down"
      >
        <ChevronDown size={28} className="animate-bounce" />
      </motion.a>
    </section>
  );
}
