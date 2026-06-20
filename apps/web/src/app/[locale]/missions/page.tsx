import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { MissionsSection } from "@/components/sections/MissionsSection";
import { createPageMetadata } from "@/lib/metadata";

type PageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "missions" });

  return createPageMetadata({
    locale,
    path: "missions",
    title: t("pageTitle"),
    description: t("pageDescription"),
  });
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
