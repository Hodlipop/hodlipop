import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { getLocalized } from "@hodlipop/shared";

import { MarkdownContent } from "@/components/ui/MarkdownContent";
import { getArticleBySlug, getArticles, getSiteUrl } from "@/lib/api";
import { JsonLd, createArticleJsonLd } from "@/lib/seo";
import { routing } from "@/i18n/routing";
import type { Locale } from "@hodlipop/shared";

type PageProps = {
  params: Promise<{ locale: string; slug: string }>;
};

export async function generateStaticParams() {
  const articles = await getArticles();
  return routing.locales.flatMap((locale) =>
    articles.map((article) => ({ locale, slug: article.slug })),
  );
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale, slug } = await params;
  const article = await getArticleBySlug(slug);
  if (!article) return {};

  const title =
    article.seo?.title
      ? getLocalized(article.seo.title, locale as Locale)
      : getLocalized(article.title, locale as Locale);
  const description =
    article.seo?.description
      ? getLocalized(article.seo.description, locale as Locale)
      : getLocalized(article.excerpt, locale as Locale);
  const siteUrl = getSiteUrl();

  return {
    title,
    description,
    alternates: {
      canonical: `${siteUrl}/${locale}/articles/${slug}`,
      languages: Object.fromEntries(
        routing.locales.map((loc) => [loc, `${siteUrl}/${loc}/articles/${slug}`]),
      ),
    },
    openGraph: {
      title,
      description,
      url: `${siteUrl}/${locale}/articles/${slug}`,
      type: "article",
      publishedTime: article.publishedAt,
    },
  };
}

export default async function ArticleDetailPage({ params }: PageProps) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const article = await getArticleBySlug(slug);
  if (!article) notFound();

  const title = getLocalized(article.title, locale as Locale);
  const body = getLocalized(article.body, locale as Locale);
  const excerpt = getLocalized(article.excerpt, locale as Locale);
  const siteUrl = getSiteUrl();

  return (
    <article className="mx-auto max-w-3xl px-6 py-16">
      <JsonLd
        data={createArticleJsonLd(
          title,
          excerpt,
          article.publishedAt,
          `${siteUrl}/${locale}/articles/${slug}`,
        )}
      />
      <time className="text-sm text-accent">{article.publishedAt}</time>
      <h1 className="mb-8 mt-2 text-4xl font-bold">{title}</h1>
      <MarkdownContent content={body} className="max-w-none" />
    </article>
  );
}
