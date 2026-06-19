import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { getLocalized } from "@hodlipop/shared";

import { Link } from "@/i18n/navigation";
import { getArticles, getSiteUrl } from "@/lib/api";
import { routing } from "@/i18n/routing";
import type { Locale } from "@hodlipop/shared";

type PageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "articles" });
  const siteUrl = getSiteUrl();

  return {
    title: t("title"),
    description: t("description"),
    alternates: {
      canonical: `${siteUrl}/${locale}/articles`,
      languages: Object.fromEntries(
        routing.locales.map((loc) => [loc, `${siteUrl}/${loc}/articles`]),
      ),
    },
  };
}

export default async function ArticlesPage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("articles");
  const articles = await getArticles();

  return (
    <div className="mx-auto max-w-4xl px-6 py-16">
      <h1 className="mb-2 text-4xl font-bold">{t("title")}</h1>
      <p className="mb-12 text-muted">{t("description")}</p>

      <div className="space-y-8">
        {articles.map((article) => (
          <article
            key={article.id}
            className="rounded-xl border border-card-border bg-card p-6 transition-colors hover:border-accent/50"
          >
            <time className="text-xs text-accent">{article.publishedAt}</time>
            <h2 className="mt-2 text-xl font-semibold">
              <Link
                href={`/articles/${article.slug}`}
                className="hover:text-accent"
              >
                {getLocalized(article.title, locale as Locale)}
              </Link>
            </h2>
            <p className="mt-2 text-muted">
              {getLocalized(article.excerpt, locale as Locale)}
            </p>
            <Link
              href={`/articles/${article.slug}`}
              className="mt-4 inline-block text-sm text-accent hover:text-accent-hover"
            >
              {t("readMore")} →
            </Link>
          </article>
        ))}
      </div>
    </div>
  );
}
