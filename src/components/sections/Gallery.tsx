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
          />
        </AnimatedSection>

        {/* Filter pills */}
        <AnimatedSection>
          <div className="mb-10 flex flex-wrap justify-center gap-2">
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

        {/* Masonry grid */}
        <div className="columns-2 gap-4 sm:columns-3 lg:columns-4">
          {filtered.map((img, i) => (
            <AnimatedSection key={img.src} delay={i * 0.05}>
              <button
                onClick={() =>
                  setLightboxIdx(galleryImages.indexOf(img))
                }
                className="group relative mb-4 block w-full overflow-hidden rounded-xl focus-visible:outline-2 focus-visible:outline-accent"
              >
                <Image
                  src={img.src}
                  alt={img.alt}
                  width={600}
                  height={700}
                  className="w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                />
                <div className="absolute inset-0 flex items-center justify-center bg-brand/60 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                  <ZoomIn size={32} className="text-white" />
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
            width={1200}
            height={900}
            className="max-h-[85vh] w-auto rounded-lg object-contain"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </section>
  );
}
