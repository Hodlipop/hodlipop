import type { MetadataRoute } from "next";

import { getArticles, getProjects, getSiteUrl } from "@/lib/api";
import { routing } from "@/i18n/routing";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = getSiteUrl();
  const projects = await getProjects();
  const articles = await getArticles();

  const staticPaths = ["", "/projects", "/missions", "/articles", "/about", "/parcours", "/contact"];

  const entries: MetadataRoute.Sitemap = [];

  for (const locale of routing.locales) {
    for (const path of staticPaths) {
      entries.push({
        url: `${siteUrl}/${locale}${path}`,
        lastModified: new Date(),
        changeFrequency: path === "" ? "weekly" : "monthly",
        priority: path === "" ? 1 : 0.8,
        alternates: {
          languages: Object.fromEntries(
            routing.locales.map((loc) => [loc, `${siteUrl}/${loc}${path}`]),
          ),
        },
      });
    }

    for (const project of projects) {
      entries.push({
        url: `${siteUrl}/${locale}/projects/${project.slug}`,
        lastModified: new Date(),
        changeFrequency: "monthly",
        priority: 0.7,
      });
    }

    for (const article of articles) {
      entries.push({
        url: `${siteUrl}/${locale}/articles/${article.slug}`,
        lastModified: new Date(article.publishedAt),
        changeFrequency: "monthly",
        priority: 0.6,
      });
    }
  }

  return entries;
}
