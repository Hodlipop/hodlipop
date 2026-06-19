import { getLocalized, type Locale, type Project } from "@hodlipop/shared";

import { Link } from "@/i18n/navigation";

type ProjectPagerProps = {
  previous: Project | null;
  next: Project | null;
  locale: Locale;
  navLabel: string;
  previousLabel: string;
  nextLabel: string;
  className?: string;
};

export function ProjectPager({
  previous,
  next,
  locale,
  navLabel,
  previousLabel,
  nextLabel,
  className = "",
}: ProjectPagerProps) {
  if (!previous && !next) return null;

  return (
    <nav
      aria-label={navLabel}
      className={`flex items-center justify-between gap-4 ${className}`}
    >
      {previous ? (
        <ProjectPagerLink
          project={previous}
          locale={locale}
          direction="previous"
          label={previousLabel}
        />
      ) : (
        <span className="flex-1" aria-hidden />
      )}

      {next ? (
        <ProjectPagerLink
          project={next}
          locale={locale}
          direction="next"
          label={nextLabel}
        />
      ) : (
        <span className="flex-1" aria-hidden />
      )}
    </nav>
  );
}

function ProjectPagerLink({
  project,
  locale,
  direction,
  label,
}: {
  project: Project;
  locale: Locale;
  direction: "previous" | "next";
  label: string;
}) {
  const title = getLocalized(project.title, locale);
  const isPrevious = direction === "previous";

  return (
    <Link
      href={`/projects/${project.slug}`}
      className={`group flex min-w-0 max-w-[calc(50%-0.5rem)] flex-1 items-center gap-3 ${
        isPrevious ? "" : "justify-end text-right"
      }`}
    >
      {isPrevious && (
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-card-border bg-card/40 transition-colors group-hover:border-accent group-hover:text-accent">
          <ChevronIcon direction="left" />
        </span>
      )}

      <span className="min-w-0 hidden sm:block">
        <span className="mb-0.5 block text-xs text-muted">{label}</span>
        <span className="block truncate font-medium transition-colors group-hover:text-accent">
          {title}
        </span>
      </span>

      <span className="sr-only sm:hidden">
        {label}: {title}
      </span>

      {!isPrevious && (
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-card-border bg-card/40 transition-colors group-hover:border-accent group-hover:text-accent">
          <ChevronIcon direction="right" />
        </span>
      )}
    </Link>
  );
}

function ChevronIcon({ direction }: { direction: "left" | "right" }) {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      aria-hidden
    >
      <path
        d={direction === "left" ? "M15 6l-6 6 6 6" : "M9 6l6 6-6 6"}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
