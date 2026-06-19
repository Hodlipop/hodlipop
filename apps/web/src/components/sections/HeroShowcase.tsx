"use client";

import Image from "next/image";

const LAYERS = [
  {
    src: "/images/hero/02.hero.screenshot.jpg",
    alt: "Alephium Mirrors dashboard",
    slotClassName: "hero-slot-main",
    animClassName: "hero-anim-main",
    width: 900,
    height: 560,
  },
  {
    src: "/images/hero/04.contract.state.jpg",
    alt: "Smart contract state explorer",
    slotClassName: "hero-slot-contract",
    animClassName: "hero-anim-contract",
    width: 520,
    height: 360,
  },
  {
    src: "/images/hero/03.hero.popup.jpg",
    alt: "Epoch emission distribution",
    slotClassName: "hero-slot-popup",
    animClassName: "hero-anim-popup",
    width: 420,
    height: 320,
  },
] as const;

export function HeroShowcase() {
  return (
    <div className="hero-showcase">
      <div className="hero-showcase-glow" aria-hidden />
      <div className="hero-showcase-stage">
        {LAYERS.map((layer) => (
          <div key={layer.src} className={`hero-card-slot ${layer.slotClassName}`}>
            <div className={`hero-neon-card ${layer.animClassName}`}>
              <Image
                src={layer.src}
                alt={layer.alt}
                width={layer.width}
                height={layer.height}
                className="block h-auto w-full rounded-[10px]"
                priority={layer.slotClassName === "hero-slot-main"}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
