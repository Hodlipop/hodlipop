import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { getLocalized, getScreenshotUrls, stripMarkdown } from "@hodlipop/shared";

import { MarkdownContent } from "@/components/ui/MarkdownContent";
import { ScreenshotGallery } from "@/components/ui/ScreenshotGallery";
import { ProjectLinks } from "@/components/ui/ProjectLinks";
import { ProjectPager } from "@/components/ui/ProjectPager";

import { SubProjectTimeline } from "@/components/sections/SubProjectTimeline";
import { getProjectBySlug, getProjectNeighbors, getProjects, getSiteUrl } from "@/lib/api";
import { JsonLd, createCreativeWorkJsonLd } from "@/lib/seo";
import { routing } from "@/i18n/routing";
import type { Locale } from "@hodlipop/shared";

type PageProps = {
  params: Promise<{ locale: string; slug: string }>;
};

export async function generateStaticParams() {
  const projects = await getProjects();
  return routing.locales.flatMap((locale) =>
    projects.map((project) => ({ locale, slug: project.slug })),
  );
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale, slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project) return {};

  const title = getLocalized(project.title, locale as Locale);
  const description = getLocalized(project.description, locale as Locale);
  const plainDescription = stripMarkdown(description);
  const siteUrl = getSiteUrl();

  return {
    title,
    description: plainDescription,
    alternates: {
      canonical: `${siteUrl}/${locale}/projects/${slug}`,
      languages: Object.fromEntries(
        routing.locales.map((loc) => [loc, `${siteUrl}/${loc}/projects/${slug}`]),
      ),
    },
    openGraph: {
      title,
      description: plainDescription,
      url: `${siteUrl}/${locale}/projects/${slug}`,
      images: [{ url: project.imageUrl }],
    },
  };
}

export default async function ProjectDetailPage({ params }: PageProps) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const project = await getProjectBySlug(slug);
  if (!project) notFound();

  const projects = await getProjects();
  const neighbors = getProjectNeighbors(projects, slug);

  const t = await getTranslations("projects");
  const title = getLocalized(project.title, locale as Locale);
  const description = getLocalized(project.description, locale as Locale);
  const plainDescription = stripMarkdown(description);
  const category = getLocalized(project.category, locale as Locale);
  const siteUrl = getSiteUrl();
  const subprojects = [...project.subprojects].sort((a, b) => a.order - b.order);
  const showPager = neighbors && (neighbors.previous || neighbors.next);

  return (
    <article className="mx-auto max-w-site px-6 py-16">
      <JsonLd
        data={createCreativeWorkJsonLd(
          title,
          plainDescription,
          `${siteUrl}/${locale}/projects/${slug}`,
        )}
      />

      {showPager && (
        <ProjectPager
          previous={neighbors.previous}
          next={neighbors.next}
          locale={locale as Locale}
          navLabel={t("projectNav")}
          previousLabel={t("previousProject")}
          nextLabel={t("nextProject")}
          className="mb-12 border-b border-accent/20 pb-6"
        />
      )}

      <div className="grid gap-10 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] lg:items-start">
        <div>
          <p className="mb-2 text-sm font-medium text-accent">{category}</p>
          <h1 className="mb-6 text-4xl font-bold">{title}</h1>
          <MarkdownContent content={description} className="mb-8 text-lg" />
          <div className="flex flex-wrap gap-2">
            {project.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-card-border px-3 py-1 text-sm text-muted"
              >
                {tag}
              </span>
            ))}
          </div>
          <ProjectLinks
            links={project.links}
            githubUrl={project.githubUrl}
            locale={locale as Locale}
            githubLabel={t("github")}
            className="mt-6"
          />
        </div>

        <ScreenshotGallery
          images={getScreenshotUrls(project)}
          alt={title}
          priority
          variant="plain"
          sizes="(max-width: 1024px) 100vw, 40vw"
        />
      </div>

      {subprojects.length > 0 && (
        <SubProjectTimeline
          subprojects={subprojects}
          locale={locale as Locale}
          label={t("subprojectsLabel")}
          githubLabel={t("github")}
        />
      )}

      {showPager && (
        <ProjectPager
          previous={neighbors.previous}
          next={neighbors.next}
          locale={locale as Locale}
          navLabel={t("projectNav")}
          previousLabel={t("previousProject")}
          nextLabel={t("nextProject")}
          className="mt-20 border-t border-accent/20 pt-8 pb-4"
        />
      )}
    </article>
  );
}
