import { getTranslations } from "next-intl/server";

import {
  getPublications,
  getPublicationsProfile,
  type PublicationKind,
} from "@/lib/publications";

const kindStyles: Record<PublicationKind, string> = {
  journal: "border-accent/30 bg-accent/10 text-accent",
  conference: "border-card-border bg-card text-muted",
  thesis: "border-card-border bg-card text-muted",
};

function PublicationItem({
  publication,
  kindLabel,
  citationsLabel,
}: {
  publication: ReturnType<typeof getPublications>[number];
  kindLabel: string;
  citationsLabel: (count: number) => string;
}) {
  return (
    <li className="rounded-xl border border-card-border bg-card/50 p-5 transition-colors hover:border-accent/40">
      <div className="mb-2 flex flex-wrap items-center gap-2">
        <span
          className={`rounded-full border px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${kindStyles[publication.kind]}`}
        >
          {kindLabel}
        </span>
        {publication.year && (
          <span className="text-xs font-medium text-muted">{publication.year}</span>
        )}
        {publication.citations > 0 && (
          <span className="text-xs text-muted/80">
            {citationsLabel(publication.citations)}
          </span>
        )}
      </div>
      <a
        href={publication.scholarUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="text-base font-semibold leading-snug transition-colors hover:text-accent"
      >
        {publication.title}
      </a>
      <p className="mt-2 text-sm text-muted">{publication.authors}</p>
      {publication.venue && (
        <p className="mt-1 text-xs text-muted/80">{publication.venue}</p>
      )}
    </li>
  );
}

export async function Publications() {
  const t = await getTranslations("publications");
  const publications = getPublications();
  const profile = getPublicationsProfile();
  const kindLabels = t.raw("kinds") as Record<PublicationKind, string>;

  return (
    <section className="mx-auto max-w-site px-6 pb-20">
      <div className="mb-10 max-w-2xl">
        <p className="mb-2 text-xs font-semibold tracking-widest text-accent">
          {t("label")}
        </p>
        <h2 className="mb-4 text-3xl font-bold">{t("title")}</h2>
        <p className="text-muted">{t("description")}</p>
        <p className="mt-3 text-sm text-muted/80">
          {t("totalCitations", { count: profile.totalCitations })}
        </p>
      </div>

      <ul className="space-y-4">
        {publications.map((publication) => (
          <PublicationItem
            key={publication.id}
            publication={publication}
            kindLabel={kindLabels[publication.kind]}
            citationsLabel={(count) => t("citations", { count })}
          />
        ))}
      </ul>

      <div className="mt-8">
        <a
          href={profile.profileUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex rounded-full border border-card-border px-5 py-2.5 text-sm transition-colors hover:border-accent hover:text-accent"
        >
          {t("viewOnScholar")}
        </a>
      </div>
    </section>
  );
}
