import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { Hero } from "@/components/sections/Hero";
import { ServicesGrid } from "@/components/sections/ServicesGrid";
import { TechStack } from "@/components/sections/TechStack";
import { FeaturedProjects } from "@/components/sections/FeaturedProjects";
import { Timeline } from "@/components/sections/Timeline";
import { CtaBanner } from "@/components/sections/CtaBanner";
import { getProjects, getSiteUrl } from "@/lib/api";
import {
  JsonLd,
  createPersonJsonLd,
  createProfessionalServiceJsonLd,
} from "@/lib/seo";
import { routing } from "@/i18n/routing";

type PageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "metadata" });
  const siteUrl = getSiteUrl();

  return {
    title: t("defaultTitle"),
    description: t("defaultDescription"),
    alternates: {
      canonical: `${siteUrl}/${locale}`,
      languages: Object.fromEntries(
        routing.locales.map((loc) => [loc, `${siteUrl}/${loc}`]),
      ),
    },
    openGraph: {
      title: t("defaultTitle"),
      description: t("defaultDescription"),
      url: `${siteUrl}/${locale}`,
      siteName: t("siteName"),
      locale: locale === "fr" ? "fr_FR" : "en_US",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: t("defaultTitle"),
      description: t("defaultDescription"),
    },
  };
}

export default async function HomePage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  const projects = await getProjects({ featured: true });

  return (
    <>
      <JsonLd data={createPersonJsonLd(locale)} />
      <JsonLd data={createProfessionalServiceJsonLd(locale)} />
      <Hero />
      <TechStack />
      <ServicesGrid />
      <FeaturedProjects projects={projects} />
      <Timeline compact />
      <CtaBanner />
    </>
  );
}
