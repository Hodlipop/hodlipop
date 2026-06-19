import Image from "next/image";
import { getLocalized, stripMarkdown, type Locale, type Project } from "@hodlipop/shared";
import { getTranslations, getLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";

type FeaturedProjectsProps = {
  projects: Project[];
  showViewAll?: boolean;
};

export async function FeaturedProjects({ projects, showViewAll = true }: FeaturedProjectsProps) {
  const t = await getTranslations("projects");
  const locale = (await getLocale()) as Locale;

  return (
    <section id="projects" className="mx-auto max-w-site px-6 py-20">
      <div className="mb-12 flex items-end justify-between">
        <div>
          <p className="mb-2 text-xs font-semibold tracking-widest text-accent">
            {t("label")}
          </p>
          <h2 className="text-3xl font-bold lg:text-4xl">{t("title")}</h2>
        </div>
        {showViewAll && (
          <Link
            href="/projects"
            className="hidden text-sm text-accent transition-colors hover:text-accent-hover sm:block"
          >
            {t("viewAll")} →
          </Link>
        )}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {projects.map((project) => (
          <ProjectCard
            key={project.id}
            project={project}
            locale={locale}
            subprojectCountLabel={
              project.subprojects.length > 0
                ? t("subprojectCount", { count: project.subprojects.length })
                : undefined
            }
          />
        ))}
      </div>
    </section>
  );
}

export function ProjectCard({
  project,
  locale,
  subprojectCountLabel,
}: {
  project: Project;
  locale: Locale;
  subprojectCountLabel?: string;
}) {
  return (
    <Link
      href={`/projects/${project.slug}`}
      className="group overflow-hidden rounded-xl border border-card-border bg-card transition-colors hover:border-accent/50"
    >
      <div className="relative aspect-video overflow-hidden bg-[#111]">
        <Image
          src={project.imageUrl}
          alt={getLocalized(project.title, locale)}
          fill
          className="object-cover"
          sizes="(max-width: 1024px) 100vw, 50vw"
        />
      </div>
      <div className="p-6">
        <div className="mb-2 flex items-center justify-between gap-3">
          <span className="text-xs font-medium text-accent">
            {getLocalized(project.category, locale)}
          </span>
          {subprojectCountLabel && (
            <span className="text-xs text-muted">{subprojectCountLabel}</span>
          )}
        </div>
        <h3 className="mb-2 text-lg font-semibold group-hover:text-accent">
          {getLocalized(project.title, locale)}
        </h3>
        <p className="mb-4 line-clamp-2 text-sm text-muted">
          {stripMarkdown(getLocalized(project.description, locale))}
        </p>
        <div className="flex flex-wrap gap-2">
          {project.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full border border-card-border px-2 py-0.5 text-xs text-muted"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </Link>
  );
}
