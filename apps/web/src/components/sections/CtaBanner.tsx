import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";

export async function CtaBanner() {
  const t = await getTranslations("cta");

  return (
    <section className="mx-auto max-w-site px-6 py-20">
      <div className="rounded-2xl border border-card-border bg-card p-8 lg:p-12">
        <div className="grid items-center gap-8 lg:grid-cols-[auto_1fr_auto]">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-accent/10 text-3xl">
            🍭
          </div>
          <div>
            <h2 className="mb-2 text-2xl font-bold lg:text-3xl">{t("title")}</h2>
            <p className="mb-4 text-muted">{t("description")}</p>
            <div className="flex flex-wrap gap-4 text-sm text-muted">
              <span>{t("email")}</span>
              <span>•</span>
              <span>{t("location")}</span>
              <span>•</span>
              <span>{t("language")}</span>
            </div>
          </div>
          <Link
            href="/contact"
            className="inline-flex justify-center rounded-full bg-accent px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-accent-hover"
          >
            {t("button")} →
          </Link>
        </div>
      </div>
    </section>
  );
}
