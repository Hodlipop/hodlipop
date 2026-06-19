import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { FeaturedProjects } from "@/components/sections/FeaturedProjects";
import { getProjects, getSiteUrl } from "@/lib/api";
import { routing } from "@/i18n/routing";

type PageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "projects" });
  const siteUrl = getSiteUrl();

  return {
    title: t("pageTitle"),
    description: t("pageDescription"),
    alternates: {
      canonical: `${siteUrl}/${locale}/projects`,
      languages: Object.fromEntries(
        routing.locales.map((loc) => [loc, `${siteUrl}/${loc}/projects`]),
      ),
    },
    openGraph: {
      title: t("pageTitle"),
      description: t("pageDescription"),
      url: `${siteUrl}/${locale}/projects`,
    },
  };
}

export default async function ProjectsPage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  const projects = await getProjects();

  return (
    <div className="py-12">
      <FeaturedProjects projects={projects} showViewAll={false} />
    </div>
  );
}
