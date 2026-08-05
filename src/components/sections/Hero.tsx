"use client";

import { motion } from "framer-motion";
import { Waves, Dumbbell, Hotel, ChevronDown } from "lucide-react";
import Image from "next/image";
import Button from "@/components/ui/Button";

const headline = "Elevate Your Wellness Journey";

const highlights = [
  { icon: Waves, label: "Infinity Pool", stat: "25 m heated" },
  { icon: Dumbbell, label: "Premium Gym", stat: "12,000 sq ft" },
  { icon: Hotel, label: "LUXURY SUITES", stat: "24 rooms" },
];

export default function Hero() {
  return (
    <section
      id="hero"
      className="relative flex min-h-svh flex-col overflow-hidden bg-[#EEF4F1]"
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
          src={`${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}/logo1.png`}
          alt="Elite Health Club"
          width={724}
          height={585}
          className="h-20 w-auto [filter:drop-shadow(0_0_6px_rgba(255,255,255,0.95))_drop-shadow(0_0_18px_rgba(255,255,255,0.55))] sm:h-24"
          loading="eager"
        />
      </motion.a>

      {/* Soft scrim for legibility over the video */}
      <div className="absolute inset-0 bg-black/20" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/45 via-black/18 to-transparent" />

      {/* Content */}
      <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-1 items-center px-6 pb-10 pt-32 sm:pt-40 lg:pb-32 lg:pt-36 xl:pb-36">
        <div className="max-w-3xl text-left">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-5 max-w-full text-[0.84rem] font-semibold uppercase tracking-[0.42em] text-accent/95 sm:text-sm"
          >
            Where Elite Begins
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="max-w-full font-hero text-[3.15rem] font-extralight leading-[0.97] tracking-[-0.05em] text-white drop-shadow-[0_2px_16px_rgba(0,0,0,0.55)] sm:text-[4.3rem] md:text-[5.1rem] lg:text-[6.3rem] xl:text-[6.7rem]"
          >
            {headline}
          </motion.h1>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.45 }}
            className="mt-8 max-w-xl space-y-4 text-[0.98rem] leading-[1.7] text-white/80 sm:text-[1.05rem]"
          >
            <p>
              Discover a world-class wellness destination where cutting-edge
              fitness meets resort-style luxury — designed for those who expect
              nothing but the best.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
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
      <div className="relative z-10 mx-auto mb-12 grid w-full max-w-7xl grid-cols-1 gap-3 px-6 sm:grid-cols-3 lg:absolute lg:bottom-8 lg:left-1/2 lg:mb-0 lg:-translate-x-1/2">
        {highlights.map(({ icon: Icon, label, stat }, i) => (
          <motion.div
            key={label}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.8 + i * 0.12 }}
            className="flex min-h-20 items-center gap-3 rounded-xl border border-white/20 bg-white/10 px-4 py-3 backdrop-blur-md"
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#5C7B79]/75 text-white">
              <Icon size={18} />
            </div>
            <div>
              <p className="text-sm font-semibold text-white">{label}</p>
              <p className="text-xs text-white/70">{stat}</p>
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
        className="absolute bottom-6 left-1/2 hidden -translate-x-1/2 text-white/40 transition-colors hover:text-white lg:block"
        aria-label="Scroll down"
      >
        <ChevronDown size={28} className="animate-bounce" />
      </motion.a>
    </section>
  );
}
