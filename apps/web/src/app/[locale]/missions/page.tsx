import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { MissionsSection } from "@/components/sections/MissionsSection";
import { getSiteUrl } from "@/lib/api";
import { routing } from "@/i18n/routing";

type PageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "missions" });
  const siteUrl = getSiteUrl();

  return {
    title: t("pageTitle"),
    description: t("pageDescription"),
    alternates: {
      canonical: `${siteUrl}/${locale}/missions`,
      languages: Object.fromEntries(
        routing.locales.map((loc) => [loc, `${siteUrl}/${loc}/missions`]),
      ),
    },
    openGraph: {
      title: t("pageTitle"),
      description: t("pageDescription"),
      url: `${siteUrl}/${locale}/missions`,
    },
  };
}

export default async function MissionsPage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <div className="pt-4">
      <MissionsSection showExamples />
    </div>
  );
}
