import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { FeaturedProjects } from "@/components/sections/FeaturedProjects";
import { getProjects } from "@/lib/api";
import { createPageMetadata } from "@/lib/metadata";

type PageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "projects" });

  return createPageMetadata({
    locale,
    path: "projects",
    title: t("pageTitle"),
    description: t("pageDescription"),
  });
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
