import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";

type MissionExample = {
  title: string;
  description: string;
  duration?: string;
};

type MissionSection = {
  id: string;
  title: string;
  description: string;
  highlights: string[];
  examples?: MissionExample[];
};

const SECTION_ICONS: Record<string, React.ReactNode> = {
  ponctuelles: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
    </svg>
  ),
  longues: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="4" width="18" height="18" rx="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  ),
  accompagnement: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 00-3-3.87" />
      <path d="M16 3.13a4 4 0 010 7.75" />
    </svg>
  ),
};

type MissionsSectionProps = {
  showPageHeader?: boolean;
  showContactCta?: boolean;
  showExamples?: boolean;
};

export async function MissionsSection({
  showPageHeader = true,
  showContactCta = true,
  showExamples = false,
}: MissionsSectionProps) {
  const t = await getTranslations("missions");
  const sections = t.raw("sections") as MissionSection[];

  return (
    <section id="missions" className="mx-auto max-w-site px-6 py-16">
      {showPageHeader && (
        <div className="mb-12 max-w-2xl">
          <p className="mb-2 text-xs font-semibold tracking-widest text-accent">
            {t("label")}
          </p>
          <h1 className="mb-4 text-4xl font-bold">{t("pageTitle")}</h1>
          <p className="text-lg text-muted">{t("pageDescription")}</p>
        </div>
      )}

      {!showPageHeader && (
        <div className="mb-10">
          <p className="mb-2 text-xs font-semibold tracking-widest text-accent">
            {t("label")}
          </p>
          <h2 className="text-3xl font-bold">{t("title")}</h2>
        </div>
      )}

      <div className="space-y-8">
        {sections.map((section) => (
          <article
            key={section.id}
            id={section.id}
            className="scroll-mt-24 rounded-xl border border-card-border bg-card p-6 sm:p-8"
          >
            <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)] lg:items-start">
              <div>
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10 text-accent">
                  {SECTION_ICONS[section.id]}
                </div>
                <h3 className="mb-3 text-2xl font-semibold">{section.title}</h3>
                <p className="text-muted">{section.description}</p>
              </div>

              <ul className="space-y-3">
                {section.highlights.map((highlight) => (
                  <li key={highlight} className="flex gap-3 text-sm text-muted">
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-accent/10 text-xs text-accent">
                      ✓
                    </span>
                    {highlight}
                  </li>
                ))}
              </ul>
            </div>

            {showExamples && section.examples && section.examples.length > 0 && (
              <div className="mt-8 border-t border-card-border pt-6">
                <p className="mb-4 text-xs font-semibold tracking-widest text-accent">
                  {t("examplesLabel")}
                </p>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {section.examples.map((example) => (
                    <div
                      key={example.title}
                      className="rounded-lg border border-card-border bg-background/40 p-4"
                    >
                      <div className="mb-2 flex items-start justify-between gap-3">
                        <h4 className="text-sm font-semibold leading-snug">{example.title}</h4>
                        {example.duration && (
                          <span className="shrink-0 rounded-full border border-accent/30 px-2 py-0.5 text-xs text-accent">
                            {example.duration}
                          </span>
                        )}
                      </div>
                      <p className="text-sm leading-relaxed text-muted">{example.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </article>
        ))}
      </div>

      {showContactCta && (
        <div className="mt-10">
          <Link
            href="/contact"
            className="inline-flex rounded-full bg-accent px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-accent-hover"
          >
            {t("contactCta")} →
          </Link>
        </div>
      )}
    </section>
  );
}
