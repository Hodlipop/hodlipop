import { getLocalized, getScreenshotUrls, type Locale, type SubProject } from "@hodlipop/shared";

import { MarkdownContent } from "@/components/ui/MarkdownContent";
import { ProjectLinks } from "@/components/ui/ProjectLinks";
import { ScreenshotGallery } from "@/components/ui/ScreenshotGallery";

type SubProjectTimelineProps = {
  subprojects: SubProject[];
  locale: Locale;
  label: string;
  githubLabel: string;
};

export function SubProjectTimeline({
  subprojects,
  locale,
  label,
  githubLabel,
}: SubProjectTimelineProps) {
  return (
    <section className="mt-16">
      <p className="mb-10 text-xs font-semibold tracking-widest text-accent">
        {label}
      </p>

      <div className="relative space-y-16 border-l border-accent/30 pl-8 lg:space-y-20 lg:pl-10">
        {subprojects.map((subproject, index) => {
          const title = getLocalized(subproject.title, locale);
          const description = getLocalized(subproject.description, locale);
          const imageRight = index % 2 === 0;

          return (
            <article key={subproject.id} id={subproject.slug} className="relative scroll-mt-24">
              <span className="absolute -left-[2.55rem] top-2 h-3 w-3 rounded-full bg-accent lg:-left-[2.85rem]" />

              <div className="grid items-center gap-8 lg:grid-cols-2 lg:gap-12">
                <div className={imageRight ? "lg:order-1" : "lg:order-2"}>
                  <h3 className="mb-3 text-2xl font-semibold">{title}</h3>
                  <MarkdownContent
                    content={description}
                    className="mb-4 text-sm lg:text-base"
                  />
                  <div className="flex flex-wrap gap-2">
                    {subproject.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full border border-card-border px-2.5 py-0.5 text-xs text-muted"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <ProjectLinks
                    links={subproject.links}
                    githubUrl={subproject.githubUrl}
                    locale={locale}
                    githubLabel={githubLabel}
                    className="mt-4"
                  />
                </div>

                <div className={imageRight ? "lg:order-2" : "lg:order-1"}>
                  <ScreenshotGallery
                    images={getScreenshotUrls(subproject)}
                    alt={title}
                    variant="plain"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                  />
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
