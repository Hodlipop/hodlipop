import Image from "next/image";
import { getTranslations } from "next-intl/server";

type EducationItem = {
  id: string;
  period: string;
  degree: string;
  school: string;
  logo: string;
  description?: string;
};

export async function Education() {
  const t = await getTranslations("timeline");
  const items = t.raw("education.items") as EducationItem[];

  return (
    <section className="mx-auto max-w-site px-6 pb-20">
      <div className="mb-10 max-w-2xl">
        <p className="mb-2 text-xs font-semibold tracking-widest text-accent">
          {t("education.label")}
        </p>
        <h2 className="text-3xl font-bold">{t("education.title")}</h2>
      </div>

      <div className="relative space-y-10 border-l border-accent/30 pl-8">
        {items.map((item) => (
          <article key={item.id} className="relative">
            <span className="absolute -left-[2.4rem] top-1 h-3 w-3 rounded-full bg-accent" />

            <div className="grid gap-4 lg:grid-cols-[1fr_auto] lg:items-start">
              <div>
                <p className="text-xs font-medium text-accent">{item.period}</p>
                <p className="mt-1 font-semibold">{item.degree}</p>
                <p className="text-sm text-muted">{item.school}</p>
                {item.description && (
                  <p className="mt-3 text-sm leading-relaxed text-muted">
                    {item.description}
                  </p>
                )}
              </div>

              <div className="flex shrink-0 items-start justify-start lg:justify-end">
                <div className="h-14 w-14 overflow-hidden rounded-lg border border-card-border bg-white">
                  <Image
                    src={item.logo}
                    alt={item.school}
                    width={56}
                    height={56}
                    className="h-full w-full object-contain p-1"
                  />
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
