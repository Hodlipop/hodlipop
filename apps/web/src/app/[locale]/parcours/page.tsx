import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { Education } from "@/components/sections/Education";
import { ExperienceProfile } from "@/components/sections/ExperienceProfile";
import { ProfileLinks } from "@/components/sections/ProfileLinks";
import { Publications } from "@/components/sections/Publications";
import { Timeline } from "@/components/sections/Timeline";
import { getSiteUrl } from "@/lib/api";
import { routing } from "@/i18n/routing";

type PageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "timeline" });
  const siteUrl = getSiteUrl();

  return {
    title: t("pageTitle"),
    description: t("pageDescription"),
    alternates: {
      canonical: `${siteUrl}/${locale}/parcours`,
      languages: Object.fromEntries(
        routing.locales.map((loc) => [loc, `${siteUrl}/${loc}/parcours`]),
      ),
    },
  };
}

export default async function ParcoursPage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("timeline");

  return (
    <div>
      <div className="mx-auto max-w-site px-6 pt-16 pb-8">
        <ExperienceProfile locale={locale} />
      </div>
      <ProfileLinks />
      <div className="mx-auto max-w-site px-6 pb-8">
        <p className="mb-2 text-xs font-semibold tracking-widest text-accent">
          {t("label")}
        </p>
        <h2 className="mb-4 text-3xl font-bold">{t("pageTitle")}</h2>
        <p className="max-w-2xl text-lg text-muted">{t("pageDescription")}</p>
      </div>
      <Timeline showHeader={false} />
      <Education />
      <Publications />
    </div>
  );
}
