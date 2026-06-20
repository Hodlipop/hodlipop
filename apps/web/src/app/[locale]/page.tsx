import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { Hero } from "@/components/sections/Hero";
import { ServicesGrid } from "@/components/sections/ServicesGrid";
import { TechStack } from "@/components/sections/TechStack";
import { FeaturedProjects } from "@/components/sections/FeaturedProjects";
import { Timeline } from "@/components/sections/Timeline";
import { CtaBanner } from "@/components/sections/CtaBanner";
import { getProjects } from "@/lib/api";
import { createPageMetadata } from "@/lib/metadata";
import {
  JsonLd,
  createPersonJsonLd,
  createProfessionalServiceJsonLd,
} from "@/lib/seo";

type PageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "metadata" });

  return createPageMetadata({
    locale,
    path: "",
    title: t("defaultTitle"),
    description: t("defaultDescription"),
    titleAbsolute: true,
  });
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
