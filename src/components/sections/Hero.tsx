"use client";

import { motion } from "framer-motion";
import { Waves, Dumbbell, Hotel, ChevronDown } from "lucide-react";
import Image from "next/image";
import Button from "@/components/ui/Button";

const headline = ["Elevate", "Your", "Wellness", "Journey"];

const highlights = [
  { icon: Waves, label: "Infinity Pool", stat: "25 m heated" },
  { icon: Dumbbell, label: "Premium Gym", stat: "12,000 sq ft" },
  { icon: Hotel, label: "Luxury Suites", stat: "24 rooms" },
];

export default function Hero() {
  return (
    <section
      id="hero"
      className="relative flex min-h-svh items-center overflow-hidden bg-[#EEF4F1]"
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
        <source src="/video1.mp4" type="video/mp4" />
      </video>

      {/* Hero logo — top-left, same position as navbar logo; navbar is hidden during the hero so no overlap */}
      <motion.a
        href="#"
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="absolute left-6 top-4 z-10 lg:left-[calc((100vw-80rem)/2+1.5rem)]"
        aria-label="Elite Health Club home"
      >
        <Image
          src="/logo1.png"
          alt="Elite Health Club"
          width={724}
          height={585}
          className="h-24 w-auto [filter:drop-shadow(0_0_6px_rgba(255,255,255,0.95))_drop-shadow(0_0_18px_rgba(255,255,255,0.55))]"
          priority
        />
      </motion.a>

      {/* Minimal dark scrim — only left side where text sits, ensures contrast without covering video */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-black/20 to-transparent" />

      {/* Content */}
      <div className="relative mx-auto w-full max-w-7xl px-6 py-32 lg:py-0">
        <div className="max-w-2xl">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-4 text-sm font-semibold uppercase tracking-[0.25em] text-accent"
          >
            Where Elite Begins
          </motion.p>

          <h1 className="font-hero text-5xl font-extralight leading-[1.15] tracking-wide text-white drop-shadow-[0_2px_16px_rgba(0,0,0,0.6)] sm:text-7xl lg:text-8xl">
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
            className="mt-6 max-w-lg text-lg leading-relaxed text-white/75"
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

      {/* Floating amenity cards — bottom of hero */}
      <div className="absolute inset-x-6 bottom-16 hidden gap-3 lg:flex lg:inset-x-0 lg:px-[calc((100vw-80rem)/2+1.5rem)]">
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
              <p className="text-xs text-white/60">{stat}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Scroll indicator */}
      <motion.a
        href="#amenities"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white/40 transition-colors hover:text-white"
        aria-label="Scroll down"
      >
        <ChevronDown size={28} className="animate-bounce" />
      </motion.a>
    </section>
  );
}
