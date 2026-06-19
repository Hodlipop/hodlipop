import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";

import { TimelineItemLogos } from "./TimelineItemLogos";

type TimelineItem = {
  id: string;
  period: string;
  role: string;
  company: string;
  location?: string;
  highlights?: string[];
};

type TimelineProps = {
  compact?: boolean;
  showHeader?: boolean;
};

function ValuesBox({
  label,
  values,
}: {
  label: string;
  values: string[];
}) {
  return (
    <div className="mt-8 rounded-xl border border-card-border bg-card p-6">
      <p className="mb-4 text-xs font-semibold tracking-widest text-accent">
        {label}
      </p>
      <ul className="space-y-3">
        {values.map((value) => (
          <li key={value} className="flex items-center gap-3 text-sm">
            <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-accent/10 text-xs text-accent">
              ✓
            </span>
            {value}
          </li>
        ))}
      </ul>
    </div>
  );
}

export async function Timeline({ compact = false, showHeader = true }: TimelineProps) {
  const t = await getTranslations("timeline");
  const items = t.raw("items") as TimelineItem[];
  const values = t.raw("values") as string[];

  return (
    <section
      className={`mx-auto max-w-site px-6 ${showHeader ? "py-20" : "pb-20 pt-8"}`}
    >
      <div
        className={
          showHeader
            ? "grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,2.5fr)]"
            : "grid gap-12"
        }
      >
        {showHeader && (
          <div className="lg:sticky lg:top-24 lg:self-start">
            <p className="mb-2 text-xs font-semibold tracking-widest text-accent">
              {t("label")}
            </p>
            <h2 className="mb-6 text-3xl font-bold lg:text-4xl">{t("title")}</h2>
            <Link
              href="/parcours"
              className="inline-flex rounded-full border border-card-border px-5 py-2.5 text-sm transition-colors hover:border-accent hover:text-accent"
            >
              {t("downloadCv")}
            </Link>
            <ValuesBox label={t("valueLabel")} values={values} />
          </div>
        )}

        <div
          className={`relative border-l border-accent/30 pl-8 ${
            compact ? "space-y-5" : "space-y-10"
          }`}
        >
          {items.map((item) => (
            <div key={item.id} className="relative">
              <span className="absolute -left-[2.4rem] top-1 h-3 w-3 rounded-full bg-accent" />
              <div className="grid gap-4 lg:grid-cols-[1fr_auto] lg:items-start">
                <div>
                  <p className="text-xs font-medium text-accent">{item.period}</p>
                  <p className={`font-semibold ${compact ? "mt-0.5 text-sm" : "mt-1"}`}>
                    {item.role}
                  </p>
                  <p className={`text-muted ${compact ? "text-xs" : "text-sm"}`}>
                    {item.company}
                  </p>
                  {!compact && item.location && (
                    <p className="mt-1 text-xs text-muted/80">{item.location}</p>
                  )}
                  {!compact && item.highlights && item.highlights.length > 0 && (
                    <ul className="mt-3 space-y-1.5">
                      {item.highlights.map((highlight) => (
                        <li
                          key={highlight}
                          className="flex gap-2 text-sm text-muted before:mt-2 before:h-1 before:w-1 before:shrink-0 before:rounded-full before:bg-accent/60 before:content-['']"
                        >
                          {highlight}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
                <TimelineItemLogos itemId={item.id} compact={compact} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
