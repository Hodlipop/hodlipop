import { getTranslations } from "next-intl/server";

import {
  getTechLogo,
  getTechLogoClass,
  getTechLogoWrapperClass,
  TECH_LOGO_VARIANT,
} from "@/lib/tech-icons";

type StackCategory = {
  title: string;
  items: string[];
};

export async function TechStack() {
  const t = await getTranslations("stack");
  const categories = t.raw("categories") as StackCategory[];
  const logoClass = getTechLogoClass(TECH_LOGO_VARIANT);
  const logoWrapperClass = getTechLogoWrapperClass(TECH_LOGO_VARIANT);

  return (
    <section id="expertises" className="border-y border-card-border py-16">
      <div className="mx-auto max-w-site px-6">
        <p className="mb-2 text-center text-xs font-semibold tracking-widest text-accent">
          {t("label")}
        </p>
        <h2 className="mb-10 text-center text-2xl font-bold">{t("title")}</h2>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {categories.map((category) => (
            <div
              key={category.title}
              className="rounded-xl border border-card-border bg-card p-6"
            >
              <h3 className="mb-4 text-sm font-semibold text-accent">
                {category.title}
              </h3>
              <ul className="space-y-3">
                {category.items.map((item) => {
                  const logo = getTechLogo(item);

                  return (
                    <li key={item} className="flex items-center gap-3 text-sm text-muted">
                      {logo ? (
                        <span className={logoWrapperClass}>
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={logo}
                            alt=""
                            width={20}
                            height={20}
                            className={logoClass}
                          />
                        </span>
                      ) : (
                        <span className="flex h-6 w-6 shrink-0 items-center justify-center text-accent">
                          •
                        </span>
                      )}
                      {item}
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
