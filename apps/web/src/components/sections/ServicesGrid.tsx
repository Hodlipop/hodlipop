import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { SERVICE_ICONS } from "@/lib/utils";

const ICONS: Record<string, React.ReactNode> = {
  code: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polyline points="16 18 22 12 16 6" />
      <polyline points="8 6 2 12 8 18" />
    </svg>
  ),
  layers: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polygon points="12 2 2 7 12 12 22 7 12 2" />
      <polyline points="2 17 12 22 22 17" />
      <polyline points="2 12 12 17 22 12" />
    </svg>
  ),
  cloud: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M18 10h-1.26A8 8 0 109 20h9a5 5 0 000-10z" />
    </svg>
  ),
  automation: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="3" />
      <path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83" />
    </svg>
  ),
  cto: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" />
    </svg>
  ),
};

export async function ServicesGrid() {
  const t = await getTranslations("services");
  const missions = await getTranslations("missions");
  const items = t.raw("items") as Array<{ title: string; description: string }>;

  return (
    <section id="missions" className="mx-auto max-w-site px-6 py-20">
      <div className="mb-12 flex items-end justify-between gap-6">
        <div>
          <p className="mb-2 text-xs font-semibold tracking-widest text-accent">
            {t("label")}
          </p>
          <h2 className="text-3xl font-bold lg:text-4xl">{t("title")}</h2>
        </div>
        <Link
          href="/missions"
          className="hidden shrink-0 text-sm text-accent transition-colors hover:text-accent-hover sm:block"
        >
          {missions("viewDetails")} →
        </Link>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {items.map((item, index) => (
          <div
            key={item.title}
            className="rounded-xl border border-card-border bg-card p-6 transition-colors hover:border-accent/50"
          >
            <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10 text-accent">
              {ICONS[SERVICE_ICONS[index] ?? "code"]}
            </div>
            <h3 className="mb-2 font-semibold">{item.title}</h3>
            <p className="text-sm text-muted">{item.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
