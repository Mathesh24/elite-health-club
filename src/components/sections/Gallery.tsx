"use client";

import { useState, useCallback } from "react";
import Image from "next/image";
import { X, ZoomIn } from "lucide-react";
import { galleryImages, GALLERY_CATEGORIES } from "@/lib/constants";
import { cn } from "@/lib/utils";
import SectionHeading from "@/components/ui/SectionHeading";
import AnimatedSection from "@/components/ui/AnimatedSection";

export default function Gallery() {
  const [filter, setFilter] = useState<string>("All");
  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null);

  const filtered =
    filter === "All"
      ? galleryImages
      : galleryImages.filter((img) => img.category === filter);

  const closeLightbox = useCallback(() => setLightboxIdx(null), []);

  return (
    <section id="gallery" className="bg-surface py-24" aria-label="Gallery">
      <div className="mx-auto max-w-7xl px-6">
        <AnimatedSection>
          <SectionHeading
            title="A Glimpse Inside"
            subtitle="Explore our world-class facilities through the lens."
            className="mb-8"
          />
        </AnimatedSection>

        {/* Filter pills */}
        <AnimatedSection>
          <div className="mb-8 flex flex-wrap justify-center gap-2 sm:mb-10">
            {GALLERY_CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={cn(
                  "rounded-full px-5 py-2 text-sm font-medium transition-all duration-200",
                  filter === cat
                    ? "bg-brand text-white shadow-md"
                    : "bg-light text-neutral-dark/70 hover:bg-brand/10"
                )}
              >
                {cat}
              </button>
            ))}
          </div>
        </AnimatedSection>

        {/* Uniform gallery grid */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((img, i) => (
            <AnimatedSection
              key={img.src}
              delay={i * 0.05}
              className="h-64 sm:h-72"
            >
              <button
                onClick={() => setLightboxIdx(galleryImages.indexOf(img))}
                className="group relative block h-full w-full overflow-hidden rounded-2xl border border-white/70 bg-light shadow-[0_12px_35px_rgba(14,30,26,0.08)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                aria-label={`View ${img.alt}`}
              >
                <Image
                  src={img.src}
                  alt={img.alt}
                  fill
                  className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04]"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 67vw"
                />
                <div className="absolute inset-0 flex items-end justify-between bg-gradient-to-t from-neutral-dark/75 via-neutral-dark/5 to-transparent p-5 opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100">
                  <span className="text-left text-sm font-semibold tracking-wide text-white">
                    {img.category}
                  </span>
                  <span className="rounded-full bg-white/15 p-2 text-white backdrop-blur-sm">
                    <ZoomIn size={20} />
                  </span>
                </div>
              </button>
            </AnimatedSection>
          ))}
        </div>
      </div>

      {/* Lightbox */}
      {lightboxIdx !== null && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
          onClick={closeLightbox}
          role="dialog"
          aria-label="Image lightbox"
        >
          <button
            onClick={closeLightbox}
            className="absolute right-6 top-6 text-white/70 transition-colors hover:text-white"
            aria-label="Close lightbox"
          >
            <X size={32} />
          </button>
          <Image
            src={galleryImages[lightboxIdx].src}
            alt={galleryImages[lightboxIdx].alt}
            width={
              "width" in galleryImages[lightboxIdx]
                ? galleryImages[lightboxIdx].width
                : 1200
            }
            height={
              "height" in galleryImages[lightboxIdx]
                ? galleryImages[lightboxIdx].height
                : 900
            }
            className="max-h-[85vh] w-auto rounded-lg object-contain"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </section>
  );
}
