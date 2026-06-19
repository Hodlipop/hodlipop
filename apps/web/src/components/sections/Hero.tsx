import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { HERO_TECH } from "@/lib/utils";

import { HeroShowcase } from "./HeroShowcase";

export async function Hero() {
  const t = await getTranslations("hero");

  return (
    <section className="relative">
      <div className="absolute inset-0 overflow-hidden">
        <div aria-hidden className="absolute inset-0 hero-background" />
        <div
          aria-hidden
          className="absolute inset-0"
          style={{
            backgroundColor:
              "color-mix(in oklab, var(--color-background) 30%, transparent)",
          }}
        />
      </div>

      <div className="relative mx-auto max-w-site px-6 py-20 pb-28 lg:py-28 lg:pb-36">
        <div className="grid min-w-0 items-center gap-12 lg:grid-cols-2">
          <div className="min-w-0">
            <p className="mb-4 text-xs font-semibold tracking-widest text-accent">
              {t("tagline")}
            </p>
            <h1 className="mb-6 text-4xl font-bold leading-tight lg:text-5xl xl:text-6xl">
              {t("title")}
            </h1>
            <p className="mb-8 max-w-xl text-lg text-muted">{t("description")}</p>

            <div className="mb-10 flex flex-wrap gap-4">
              <Link
                href="/contact"
                className="rounded-full bg-accent px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-accent-hover"
              >
                {t("ctaPrimary")} →
              </Link>
              <Link
                href="/#projects"
                className="rounded-full border border-card-border px-6 py-3 text-sm font-medium transition-colors hover:border-accent hover:text-accent"
              >
                {t("ctaSecondary")}
              </Link>
            </div>

            <div className="mb-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
              {(["experience", "cto", "remote", "bilingual"] as const).map((key) => (
                <div key={key} className="flex items-center gap-2">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-accent/10 text-accent">
                    ✓
                  </span>
                  <span className="text-xs text-muted">{t(`stats.${key}`)}</span>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap gap-2">
              {HERO_TECH.map((tech) => (
                <span
                  key={tech}
                  className="rounded-full border border-card-border bg-card px-3 py-1 text-xs text-muted"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>

          <div className="min-w-0 lg:pr-10">
            <HeroShowcase />
          </div>
        </div>
      </div>
    </section>
  );
}
