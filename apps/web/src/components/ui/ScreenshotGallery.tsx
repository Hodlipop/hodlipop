"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { useTranslations } from "next-intl";

type ScreenshotGalleryProps = {
  images: string[];
  alt: string;
  alts?: string[];
  className?: string;
  priority?: boolean;
  sizes?: string;
  variant?: "framed" | "plain";
};

export function ScreenshotGallery({
  images,
  alt,
  alts,
  className = "",
  priority = false,
  sizes = "(max-width: 1024px) 100vw, 50vw",
  variant = "framed",
}: ScreenshotGalleryProps) {
  const isPlain = variant === "plain";
  const t = useTranslations("gallery");
  const [activeIndex, setActiveIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  const hasMultiple = images.length > 1;
  const activeSrc = images[activeIndex] ?? images[0];
  const activeAlt = alts?.[activeIndex] ?? alt;

  const openLightbox = useCallback((index: number) => {
    setActiveIndex(index);
    setLightboxOpen(true);
  }, []);

  const closeLightbox = useCallback(() => {
    setLightboxOpen(false);
  }, []);

  const showPrevious = useCallback(() => {
    setActiveIndex((index) => (index - 1 + images.length) % images.length);
  }, [images.length]);

  const showNext = useCallback(() => {
    setActiveIndex((index) => (index + 1) % images.length);
  }, [images.length]);

  useEffect(() => {
    if (!lightboxOpen) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeLightbox();
      if (event.key === "ArrowLeft") showPrevious();
      if (event.key === "ArrowRight") showNext();
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [lightboxOpen, closeLightbox, showPrevious, showNext]);

  if (!activeSrc) return null;

  return (
    <>
      <div
        className={
          isPlain
            ? className
            : `overflow-hidden rounded-xl border border-card-border bg-[#111] ${className}`
        }
      >
        <button
          type="button"
          onClick={() => openLightbox(activeIndex)}
          className="group relative block w-full cursor-zoom-in"
          aria-label={t("openLightbox")}
        >
          <div className="relative aspect-[16/10]">
            <Image
              src={activeSrc}
              alt={activeAlt}
              fill
              className={
                isPlain
                  ? "object-contain object-center transition-opacity duration-200"
                  : "object-cover object-top transition-opacity duration-200"
              }
              sizes={sizes}
              priority={priority}
            />
          </div>
          {!isPlain && (
            <>
              <span className="pointer-events-none absolute inset-0 bg-black/0 transition-colors group-hover:bg-black/10" />
              <span className="pointer-events-none absolute bottom-3 right-3 rounded-full border border-white/20 bg-black/50 px-2.5 py-1 text-xs text-white/90 opacity-0 backdrop-blur-sm transition-opacity group-hover:opacity-100">
                {t("expand")}
              </span>
            </>
          )}
          {isPlain && (
            <span className="pointer-events-none absolute bottom-2 right-2 rounded-full bg-black/40 px-2 py-0.5 text-xs text-white/80 opacity-0 backdrop-blur-sm transition-opacity group-hover:opacity-100">
              {t("expand")}
            </span>
          )}
        </button>

        {hasMultiple && (
          <div
            className={
              isPlain
                ? "mt-3 flex justify-center gap-2 overflow-x-auto"
                : "flex gap-2 overflow-x-auto border-t border-card-border p-3"
            }
          >
            {images.map((src, index) => {
              const thumbAlt = alts?.[index] ?? alt;
              const isActive = index === activeIndex;

              return (
                <button
                  key={src}
                  type="button"
                  onClick={() => setActiveIndex(index)}
                  onDoubleClick={() => openLightbox(index)}
                  className={
                    isPlain
                      ? `relative h-14 w-24 shrink-0 overflow-hidden rounded-md transition-opacity ${
                          isActive
                            ? "opacity-100 ring-2 ring-accent ring-offset-2 ring-offset-background"
                            : "opacity-50 hover:opacity-80"
                        }`
                      : `relative h-14 w-24 shrink-0 overflow-hidden rounded-md border transition-colors ${
                          isActive
                            ? "border-accent ring-1 ring-accent/50"
                            : "border-card-border opacity-70 hover:opacity-100"
                        }`
                  }
                  aria-label={t("showImage", { index: index + 1, total: images.length })}
                  aria-current={isActive}
                >
                  <Image
                    src={src}
                    alt={thumbAlt}
                    fill
                    className={
                      isPlain
                        ? "object-contain object-center"
                        : "object-cover object-top"
                    }
                    sizes="96px"
                  />
                </button>
              );
            })}
          </div>
        )}
      </div>

      {lightboxOpen && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-label={activeAlt}
          onClick={closeLightbox}
        >
          <button
            type="button"
            onClick={closeLightbox}
            className="absolute right-4 top-4 z-10 rounded-full border border-white/20 bg-black/60 p-2 text-white transition-colors hover:bg-black/80"
            aria-label={t("close")}
          >
            <CloseIcon />
          </button>

          {hasMultiple && (
            <>
              <button
                type="button"
                onClick={(event) => {
                  event.stopPropagation();
                  showPrevious();
                }}
                className="absolute left-4 top-1/2 z-10 -translate-y-1/2 rounded-full border border-white/20 bg-black/60 p-2 text-white transition-colors hover:bg-black/80"
                aria-label={t("previous")}
              >
                <ChevronIcon direction="left" />
              </button>
              <button
                type="button"
                onClick={(event) => {
                  event.stopPropagation();
                  showNext();
                }}
                className="absolute right-4 top-1/2 z-10 -translate-y-1/2 rounded-full border border-white/20 bg-black/60 p-2 text-white transition-colors hover:bg-black/80"
                aria-label={t("next")}
              >
                <ChevronIcon direction="right" />
              </button>
            </>
          )}

          <div
            className="relative max-h-[90vh] max-w-[min(96rem,95vw)]"
            onClick={(event) => event.stopPropagation()}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={activeSrc}
              alt={activeAlt}
              className="max-h-[90vh] w-auto max-w-full rounded-lg object-contain"
            />
            {hasMultiple && (
              <p className="mt-3 text-center text-sm text-white/70">
                {t("imageCounter", { current: activeIndex + 1, total: images.length })}
              </p>
            )}
          </div>
        </div>
      )}
    </>
  );
}

function CloseIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M6 6l12 12M18 6L6 18"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function ChevronIcon({ direction }: { direction: "left" | "right" }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d={direction === "left" ? "M15 6l-6 6 6 6" : "M9 6l6 6-6 6"}
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
