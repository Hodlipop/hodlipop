import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { CtaBanner } from "@/components/sections/CtaBanner";
import { MissionsSection } from "@/components/sections/MissionsSection";
import { createPageMetadata } from "@/lib/metadata";
import { SOCIAL_LINKS } from "@/lib/utils";

type PageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "contact" });

  return createPageMetadata({
    locale,
    path: "contact",
    title: t("title"),
    description: t("description"),
  });
}

export default async function ContactPage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("contact");
  const cta = await getTranslations("cta");

  return (
    <div>
      <div className="mx-auto max-w-4xl px-6 pt-16">
        <h1 className="mb-4 text-4xl font-bold">{t("title")}</h1>
        <p className="mb-12 text-lg text-muted">{t("description")}</p>

        <div className="mb-8 grid gap-8 sm:grid-cols-3">
          <div className="rounded-xl border border-card-border bg-card p-6">
            <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-accent">
              {t("emailLabel")}
            </p>
            <a
              href={SOCIAL_LINKS.email}
              className="text-lg hover:text-accent"
            >
              {cta("email")}
            </a>
          </div>
          <div className="rounded-xl border border-card-border bg-card p-6">
            <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-accent">
              {t("locationLabel")}
            </p>
            <p className="text-lg">{cta("location")}</p>
          </div>
          <div className="rounded-xl border border-card-border bg-card p-6">
            <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-accent">
              {t("languagesLabel")}
            </p>
            <p className="text-lg">{cta("language")}</p>
          </div>
        </div>
      </div>

      <MissionsSection showPageHeader={false} showContactCta={false} />

      <div className="mx-auto max-w-4xl px-6 pb-16">
        <CtaBanner />
      </div>
    </div>
  );
}
