import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

import { routing } from "@/i18n/routing";
import { getSiteUrl } from "./api";

export const DEFAULT_OG_IMAGE = "/images/og.image.jpg";
export const SITE_ICON = "/logo.single.png";

function openGraphLocale(locale: string): string {
  return locale === "fr" ? "fr_FR" : "en_US";
}

function pageUrl(locale: string, path: string): string {
  const siteUrl = getSiteUrl();
  const suffix = path ? `/${path.replace(/^\//, "")}` : "";
  return `${siteUrl}/${locale}${suffix}`;
}

export function buildAlternates(locale: string, path: string): Metadata["alternates"] {
  const suffix = path ? `/${path.replace(/^\//, "")}` : "";
  const siteUrl = getSiteUrl();

  return {
    canonical: `${siteUrl}/${locale}${suffix}`,
    languages: Object.fromEntries(
      routing.locales.map((loc) => [loc, `${siteUrl}/${loc}${suffix}`]),
    ),
  };
}

export async function createDefaultMetadata(locale: string): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: "metadata" });
  const title = t("defaultTitle");
  const description = t("defaultDescription");
  const siteName = t("siteName");
  const image = { url: DEFAULT_OG_IMAGE, alt: t("defaultOgImageAlt") };

  return {
    title: {
      default: title,
      template: `%s | ${siteName}`,
    },
    description,
    robots: { index: true, follow: true },
    icons: {
      icon: SITE_ICON,
      shortcut: SITE_ICON,
      apple: SITE_ICON,
    },
    openGraph: {
      siteName,
      locale: openGraphLocale(locale),
      type: "website",
      images: [image],
    },
    twitter: {
      card: "summary_large_image",
      images: [DEFAULT_OG_IMAGE],
    },
  };
}

export type PageMetadataOptions = {
  locale: string;
  path: string;
  title: string;
  description: string;
  titleAbsolute?: boolean;
  openGraph?: {
    type?: "website" | "article";
    images?: Array<string | { url: string; alt?: string }>;
    publishedTime?: string;
  };
};

export async function createPageMetadata(options: PageMetadataOptions): Promise<Metadata> {
  const { locale, path, title, description, titleAbsolute, openGraph: og } = options;
  const t = await getTranslations({ locale, namespace: "metadata" });
  const url = pageUrl(locale, path);
  const ogType = og?.type ?? "website";
  const ogImages =
    og?.images && og.images.length > 0
      ? og.images.map((img) => (typeof img === "string" ? { url: img } : img))
      : [{ url: DEFAULT_OG_IMAGE, alt: t("defaultOgImageAlt") }];
  const twitterImages = ogImages.map((img) => img.url);

  return {
    title: titleAbsolute ? { absolute: title } : title,
    description,
    alternates: buildAlternates(locale, path),
    openGraph: {
      title,
      description,
      url,
      siteName: t("siteName"),
      locale: openGraphLocale(locale),
      type: ogType,
      images: ogImages,
      ...(ogType === "article" && og?.publishedTime
        ? { publishedTime: og.publishedTime }
        : {}),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: twitterImages,
    },
  };
}
