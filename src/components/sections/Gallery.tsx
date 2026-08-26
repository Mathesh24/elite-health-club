"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, ChevronLeft, ChevronRight, X, ZoomIn } from "lucide-react";
import { galleryImages, GALLERY_CATEGORIES } from "@/lib/constants";
import { cn } from "@/lib/utils";
import SectionHeading from "@/components/ui/SectionHeading";
import AnimatedSection from "@/components/ui/AnimatedSection";

const FILTER_PAGE_SIZE = 6;
const categoryNames = GALLERY_CATEGORIES.filter((category) => category !== "All");

const thumbnailSrc = (src: string) => src.replace(/\.webp$/, "-thumb.webp");

const getAllCardClass = (index: number, total: number) => {
  if (total === 1) return "lg:col-span-12 h-80 sm:h-[28rem]";
  if (total === 2) {
    return cn(
      "h-80 sm:h-96",
      index === 0 ? "lg:col-span-7" : "lg:col-span-5"
    );
  }
  if (total === 3) return "h-72 sm:h-80 lg:col-span-4";

  const layouts = [
    "h-80 sm:h-96 lg:col-span-7 lg:h-[26rem]",
    "h-80 sm:h-96 lg:col-span-5 lg:h-[26rem]",
    "h-72 lg:col-span-4",
    "h-72 lg:col-span-4",
    "h-72 lg:col-span-4",
    "h-72 sm:h-80 lg:col-span-12",
  ];

  return layouts[index] ?? "h-72 lg:col-span-4";
};

export default function Gallery() {
  const [filter, setFilter] = useState<string>("All");
  const [pageIndex, setPageIndex] = useState(0);
  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null);

  const pages = useMemo(() => {
    if (filter === "All") {
      const groups = categoryNames.map((category) =>
        galleryImages.filter((image) => image.category === category)
      );
      const pageCount = Math.max(...groups.map((group) => group.length));

      return Array.from({ length: pageCount }, (_, index) =>
        groups.map((group) => group[index]).filter(Boolean)
      );
    }

    const filtered = galleryImages.filter((image) => image.category === filter);
    return Array.from(
      { length: Math.ceil(filtered.length / FILTER_PAGE_SIZE) },
      (_, index) =>
        filtered.slice(index * FILTER_PAGE_SIZE, (index + 1) * FILTER_PAGE_SIZE)
    );
  }, [filter]);

  const visibleImages = pages[pageIndex] ?? pages[0] ?? [];
  const closeLightbox = useCallback(() => setLightboxIdx(null), []);

  const moveLightbox = useCallback((direction: number) => {
    setLightboxIdx((current) => {
      if (current === null) return null;
      return (current + direction + galleryImages.length) % galleryImages.length;
    });
  }, []);

  useEffect(() => {
    if (lightboxIdx === null) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeLightbox();
      if (event.key === "ArrowLeft") moveLightbox(-1);
      if (event.key === "ArrowRight") moveLightbox(1);
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [closeLightbox, lightboxIdx, moveLightbox]);

  const selectFilter = (category: string) => {
    setFilter(category);
    setPageIndex(0);
  };

  const seeMore = () => {
    setPageIndex((current) => (current + 1) % pages.length);
  };

  return (
    <section
      id="gallery"
      className="scroll-mt-24 overflow-hidden bg-surface py-24"
      aria-label="Gallery"
    >
      <div className="mx-auto max-w-7xl px-6">
        <AnimatedSection>
          <SectionHeading
            title="A Glimpse Inside"
            subtitle="Explore our world-class facilities through the lens."
            className="mb-8"
          />
        </AnimatedSection>

        <AnimatedSection>
          <div className="mb-10 flex flex-wrap justify-center gap-2 sm:mb-12">
            {GALLERY_CATEGORIES.map((category) => (
              <button
                key={category}
                type="button"
                onClick={() => selectFilter(category)}
                aria-pressed={filter === category}
                className={cn(
                  "rounded-full border px-5 py-2.5 text-sm font-medium transition-all duration-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent",
                  filter === category
                    ? "border-brand bg-brand text-white shadow-[0_8px_24px_rgba(21,112,112,0.22)]"
                    : "border-neutral-dark/10 bg-white/70 text-neutral-dark/65 backdrop-blur-sm hover:-translate-y-0.5 hover:border-brand/30 hover:bg-white hover:text-brand"
                )}
              >
                {category}
              </button>
            ))}
          </div>
        </AnimatedSection>

        <AnimatePresence mode="wait">
          <motion.div
            key={`${filter}-${pageIndex}`}
            initial={{ opacity: 0, y: 24, scale: 0.985 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -16, scale: 0.99 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className={cn(
              "grid grid-cols-1 gap-4 sm:grid-cols-2",
              filter === "All" ? "lg:grid-cols-12" : "lg:grid-cols-3"
            )}
          >
            {visibleImages.map((image, index) => (
              <motion.button
                key={image.src}
                type="button"
                onClick={() => setLightboxIdx(galleryImages.indexOf(image))}
                aria-label={`View ${image.alt}`}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.5,
                  delay: index * 0.06,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className={cn(
                  "group relative block overflow-hidden rounded-[1.75rem] border border-white/80 bg-light text-left shadow-[0_18px_55px_rgba(14,30,26,0.09)] transition-[transform,box-shadow] duration-500 hover:-translate-y-1.5 hover:shadow-[0_28px_70px_rgba(14,30,26,0.16)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent",
                  filter === "All"
                    ? getAllCardClass(index, visibleImages.length)
                    : "h-72 sm:h-80"
                )}
              >
                <Image
                  src={thumbnailSrc(image.src)}
                  alt={image.alt}
                  fill
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.045]"
                  sizes={
                    filter === "All"
                      ? "(max-width: 640px) calc(100vw - 3rem), (max-width: 1024px) calc(50vw - 2rem), 58vw"
                      : "(max-width: 640px) calc(100vw - 3rem), (max-width: 1024px) calc(50vw - 2rem), 400px"
                  }
                />
                <span className="absolute inset-0 bg-gradient-to-tr from-black/10 via-transparent to-white/10 opacity-50 transition-opacity duration-500 group-hover:opacity-80" />
                <span className="absolute right-5 top-5 flex h-11 w-11 translate-y-2 items-center justify-center rounded-full border border-white/50 bg-neutral-dark/25 text-white opacity-0 shadow-lg backdrop-blur-md transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:translate-y-0 group-focus-visible:opacity-100">
                  <ZoomIn size={19} aria-hidden="true" />
                </span>
              </motion.button>
            ))}
          </motion.div>
        </AnimatePresence>

        {pages.length > 1 && (
          <div className="mt-10 flex flex-col items-center gap-4">
            <button
              type="button"
              onClick={seeMore}
              className="group inline-flex items-center gap-3 rounded-full bg-neutral-dark px-7 py-3.5 text-sm font-semibold text-white shadow-[0_12px_30px_rgba(14,30,26,0.18)] transition-all duration-300 hover:-translate-y-1 hover:bg-brand hover:shadow-[0_18px_38px_rgba(21,112,112,0.24)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
            >
              See more
              <ArrowRight
                size={18}
                className="transition-transform duration-300 group-hover:translate-x-1"
                aria-hidden="true"
              />
            </button>
            <div className="flex gap-2" aria-hidden="true">
              {pages.map((_, index) => (
                <span
                  key={index}
                  className={cn(
                    "h-1.5 rounded-full transition-all duration-300",
                    pageIndex === index ? "w-7 bg-brand" : "w-1.5 bg-brand/20"
                  )}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      <AnimatePresence>
        {lightboxIdx !== null && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-dark/95 p-4 backdrop-blur-sm sm:p-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeLightbox}
            role="dialog"
            aria-modal="true"
            aria-label="Image lightbox"
          >
            <button
              type="button"
              onClick={closeLightbox}
              className="absolute right-5 top-5 z-10 flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-white/10 text-white/75 backdrop-blur-md transition-colors hover:bg-white/20 hover:text-white sm:right-7 sm:top-7"
              aria-label="Close lightbox"
            >
              <X size={24} />
            </button>
            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                moveLightbox(-1);
              }}
              className="absolute left-3 z-10 flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-white/10 text-white/75 backdrop-blur-md transition-colors hover:bg-white/20 hover:text-white sm:left-7"
              aria-label="Previous image"
            >
              <ChevronLeft size={26} />
            </button>
            <motion.div
              key={galleryImages[lightboxIdx].src}
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              className="relative flex max-h-[88vh] max-w-[88vw] items-center justify-center"
              onClick={(event) => event.stopPropagation()}
            >
              <Image
                src={galleryImages[lightboxIdx].src}
                alt={galleryImages[lightboxIdx].alt}
                width={galleryImages[lightboxIdx].width}
                height={galleryImages[lightboxIdx].height}
                className="max-h-[88vh] w-auto max-w-[88vw] rounded-2xl object-contain shadow-2xl"
                sizes="90vw"
              />
            </motion.div>
            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                moveLightbox(1);
              }}
              className="absolute right-3 z-10 flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-white/10 text-white/75 backdrop-blur-md transition-colors hover:bg-white/20 hover:text-white sm:right-7"
              aria-label="Next image"
            >
              <ChevronRight size={26} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
