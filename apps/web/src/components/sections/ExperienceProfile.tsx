import Image from "next/image";
import { getTranslations } from "next-intl/server";

import cvLatest from "../../../../../data/cv-latest.json";

type ProfileField = {
  label: string;
  value: string;
  href?: string;
};

type ExperienceProfileData = {
  fullName: string;
  jobTitle: string;
  location: string;
  email: string;
  languages: string;
  drivingLicense: string;
};

export async function ExperienceProfile({ locale }: { locale: string }) {
  const t = await getTranslations("timeline");
  const profile = t.raw("profile") as ExperienceProfileData;
  const fieldLabels = t.raw("profileFields") as Record<string, string>;
  const cvLocale = locale === "en" ? "en" : "fr";
  const cvFilename = cvLatest.files[cvLocale];
  const cvPath = `/documents/${cvFilename}`;

  const fields: ProfileField[] = [
    {
      label: fieldLabels.location,
      value: profile.location,
    },
    {
      label: fieldLabels.email,
      value: profile.email,
      href: `mailto:${profile.email}`,
    },
    {
      label: fieldLabels.languages,
      value: profile.languages,
    },
    {
      label: fieldLabels.drivingLicense,
      value: profile.drivingLicense,
    },
  ];

  return (
    <div className="rounded-xl border border-card-border bg-card p-6 sm:p-8">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-start">
          <Image
            src="/images/cv/j.decriem.jpg"
            alt={profile.fullName}
            width={128}
            height={128}
            className="h-32 w-32 shrink-0 rounded-xl border border-card-border object-cover"
            priority
          />
          <div>
            <h1 className="text-3xl font-bold sm:text-4xl">{profile.fullName}</h1>
            <p className="mt-2 text-lg text-muted">{profile.jobTitle}</p>
          </div>
        </div>

        <a
          href={cvPath}
          download={cvFilename}
          className="inline-flex shrink-0 self-start rounded-full border border-card-border px-5 py-2.5 text-sm transition-colors hover:border-accent hover:text-accent"
        >
          {t("downloadCv")}
        </a>
      </div>

      <dl className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {fields.map((field) => (
          <div key={field.label}>
            <dt className="mb-1 text-xs font-semibold uppercase tracking-widest text-accent">
              {field.label}
            </dt>
            <dd className="whitespace-pre-line text-sm text-muted">
              {field.href ? (
                <a href={field.href} className="transition-colors hover:text-accent">
                  {field.value}
                </a>
              ) : (
                field.value
              )}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
