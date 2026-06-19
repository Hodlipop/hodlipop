import { readFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "../..");
const PUBLIC = join(ROOT, "apps/web/public");

type Locale = "fr" | "en";

type TimelineItem = {
  period: string;
  role: string;
  company: string;
  location?: string;
  highlights?: string[];
};

type EducationItem = {
  period: string;
  degree: string;
  school: string;
  logo: string;
  description?: string;
};

type Publication = {
  title: string;
  authors: string;
  venue: string;
  year: number | null;
  kind: string;
};

type ProfileLink = {
  label: string;
  url: string;
  icon: "linkedin" | "github" | "website" | "malt";
};

type CvMessages = {
  timeline: {
    profile: {
      fullName: string;
      jobTitle: string;
      location: string;
      email: string;
      languages: string;
      drivingLicense: string;
    };
    profileFields: Record<string, string>;
    profileLinks: {
      label: string;
      items: ProfileLink[];
    };
    label: string;
    valueLabel: string;
    items: TimelineItem[];
    values: string[];
    education: {
      label: string;
      title: string;
      items: EducationItem[];
    };
  };
  publications: {
    label: string;
    title: string;
    totalCitations: string;
    kinds: Record<string, string>;
  };
};

function loadMessages(locale: Locale): CvMessages {
  const raw = JSON.parse(
    readFileSync(join(ROOT, "data/i18n", `${locale}.json`), "utf8"),
  ) as { timeline: CvMessages["timeline"]; publications: CvMessages["publications"] };

  return {
    timeline: raw.timeline,
    publications: raw.publications,
  };
}

function loadPublications(): Publication[] {
  const raw = JSON.parse(
    readFileSync(join(ROOT, "data/seed/publications.json"), "utf8"),
  ) as { totalCitations: number; items: Publication[] };

  return raw.items;
}

function getTotalCitations(): number {
  const raw = JSON.parse(
    readFileSync(join(ROOT, "data/seed/publications.json"), "utf8"),
  ) as { totalCitations: number };

  return raw.totalCitations;
}

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function fileUrl(relativePath: string): string {
  return `file://${join(PUBLIC, relativePath.replace(/^\//, ""))}`;
}

function profileLinkIconSvg(icon: ProfileLink["icon"]): string {
  switch (icon) {
    case "linkedin":
      return `<svg class="profile-link-icon" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>`;
    case "github":
      return `<svg class="profile-link-icon" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 10.032 8.207 11.665.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>`;
    case "website":
      return `<svg class="profile-link-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>`;
    case "malt":
      return `<svg class="profile-link-icon" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M4 20V4l6.5 11L17 4v16h-3V11.5L10.5 20H8.5L4 11.5V20H4z"/></svg>`;
  }
}

function formatCitations(template: string, count: number): string {
  return template.replace("{count}", String(count));
}

export function renderCvHtml(locale: Locale, photoPath?: string): string {
  const { timeline, publications } = loadMessages(locale);
  const items = loadPublications();
  const totalCitations = getTotalCitations();
  const profile = timeline.profile;
  const fields = timeline.profileFields;
  const photoUrl = photoPath ? `file://${photoPath}` : fileUrl("/images/cv/j.decriem.jpg");

  const experienceHtml = timeline.items
    .map(
      (item) => `
      <article class="entry">
        <div class="entry-head">
          <div>
            <p class="entry-period">${escapeHtml(item.period)}</p>
            <h3 class="entry-title">${escapeHtml(item.role)}</h3>
            <p class="entry-sub">${escapeHtml(item.company)}${item.location ? ` · ${escapeHtml(item.location)}` : ""}</p>
          </div>
        </div>
        ${
          item.highlights?.length
            ? `<ul class="bullets">${item.highlights.map((h) => `<li>${escapeHtml(h)}</li>`).join("")}</ul>`
            : ""
        }
      </article>`,
    )
    .join("");

  const educationHtml = timeline.education.items
    .map(
      (item) => `
      <article class="entry education-entry">
        <img class="edu-logo" src="${fileUrl(item.logo)}" alt="" />
        <div>
          <p class="entry-period">${escapeHtml(item.period)}</p>
          <h3 class="entry-title">${escapeHtml(item.degree)}</h3>
          <p class="entry-sub">${escapeHtml(item.school)}</p>
          ${item.description ? `<p class="entry-desc">${escapeHtml(item.description)}</p>` : ""}
        </div>
      </article>`,
    )
    .join("");

  const profileLinksHtml = timeline.profileLinks.items
    .map(
      (link) => `
      <a class="profile-link" href="${escapeHtml(link.url)}">
        ${profileLinkIconSvg(link.icon)}
        <span class="profile-link-label">${escapeHtml(link.label)}</span>
        <span class="profile-link-url">${escapeHtml(link.url.replace(/^https?:\/\//, ""))}</span>
      </a>`,
    )
    .join("");

  const publicationsHtml = items
    .map((item) => {
      const kind = publications.kinds[item.kind] ?? item.kind;
      return `
      <article class="pub">
        <div class="pub-meta">
          <span class="pub-kind">${escapeHtml(kind)}</span>
          ${item.year ? `<span class="pub-year">${item.year}</span>` : ""}
        </div>
        <p class="pub-title">${escapeHtml(item.title)}</p>
        <p class="pub-authors">${escapeHtml(item.authors)}</p>
        ${item.venue ? `<p class="pub-venue">${escapeHtml(item.venue)}</p>` : ""}
      </article>`;
    })
    .join("");

  return `<!DOCTYPE html>
<html lang="${locale}">
<head>
  <meta charset="utf-8" />
  <title>${escapeHtml(profile.fullName)} — CV</title>
  <style>
    @page {
      size: A4;
      margin: 12mm 12mm;
    }

    * {
      box-sizing: border-box;
    }

    body {
      margin: 0;
      color: #111;
      font-family: Inter, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      font-size: 8pt;
      line-height: 1.32;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }

    h1, h2, h3, p, ul {
      margin: 0;
    }

    .header {
      display: grid;
      grid-template-columns: 72px 1fr;
      gap: 12px;
      align-items: center;
      padding-bottom: 10px;
      border-bottom: 2px solid #e91e8c;
      margin-bottom: 10px;
    }

    .photo {
      width: 72px;
      height: 72px;
      border-radius: 8px;
      object-fit: cover;
      border: 1px solid #ddd;
    }

    .name {
      font-size: 17pt;
      font-weight: 700;
      letter-spacing: -0.02em;
    }

    .job-title {
      margin-top: 2px;
      font-size: 9.5pt;
      color: #555;
    }

    .contact {
      display: flex;
      flex-wrap: wrap;
      gap: 4px 10px;
      margin-top: 6px;
      font-size: 7.5pt;
      color: #444;
    }

    .contact-item strong {
      color: #e91e8c;
      font-weight: 600;
      text-transform: uppercase;
      font-size: 6pt;
      letter-spacing: 0.06em;
      margin-right: 3px;
    }

    .section {
      margin-bottom: 10px;
    }

    .section-title {
      font-size: 7pt;
      font-weight: 700;
      letter-spacing: 0.12em;
      text-transform: uppercase;
      color: #e91e8c;
      margin-bottom: 6px;
    }

    .entry + .entry {
      margin-top: 8px;
      padding-top: 8px;
      border-top: 1px solid #ececec;
    }

    .entry-period {
      font-size: 7pt;
      font-weight: 600;
      color: #e91e8c;
    }

    .entry-title {
      margin-top: 1px;
      font-size: 9pt;
      font-weight: 700;
    }

    .entry-sub {
      margin-top: 1px;
      color: #555;
      font-size: 7.5pt;
    }

    .entry-desc {
      margin-top: 2px;
      color: #444;
      font-size: 7.5pt;
    }

    .bullets {
      margin: 4px 0 0 0;
      padding-left: 14px;
      color: #333;
      font-size: 7.5pt;
    }

    .bullets li + li {
      margin-top: 1px;
    }

    .education-entry {
      display: grid;
      grid-template-columns: 28px 1fr;
      gap: 8px;
      align-items: start;
    }

    .edu-logo {
      width: 28px;
      height: 28px;
      border-radius: 4px;
      border: 1px solid #ddd;
      object-fit: contain;
      background: #fff;
      padding: 1px;
    }

    .profile-links {
      display: flex;
      flex-wrap: wrap;
      gap: 6px 12px;
    }

    .profile-link {
      display: inline-flex;
      align-items: center;
      gap: 5px;
      color: #111;
      text-decoration: none;
      font-size: 7.5pt;
      border: 1px solid #ddd;
      border-radius: 999px;
      padding: 3px 10px;
    }

    .profile-link-icon {
      width: 10px;
      height: 10px;
      flex-shrink: 0;
      color: #e91e8c;
    }

    .profile-link-label {
      font-weight: 600;
      color: #111;
    }

    .profile-link-url {
      color: #0066cc;
      text-decoration: underline;
    }

    .page-break {
      page-break-before: always;
      break-before: page;
    }

    .pub + .pub {
      margin-top: 5px;
      padding-top: 5px;
      border-top: 1px solid #f0f0f0;
    }

    .pub-meta {
      display: flex;
      gap: 6px;
      align-items: center;
      margin-bottom: 1px;
    }

    .pub-kind {
      font-size: 6pt;
      font-weight: 700;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      color: #e91e8c;
    }

    .pub-year {
      font-size: 6.5pt;
      color: #777;
    }

    .pub-title {
      font-size: 7.5pt;
      font-weight: 600;
      line-height: 1.28;
    }

    .pub-authors,
    .pub-venue {
      margin-top: 1px;
      font-size: 7pt;
      color: #555;
    }

    .pub-intro {
      margin-bottom: 6px;
      color: #555;
      font-size: 7.5pt;
    }
  </style>
</head>
<body>
  <header class="header">
    <img class="photo" src="${photoUrl}" alt="" />
    <div>
      <h1 class="name">${escapeHtml(profile.fullName)}</h1>
      <p class="job-title">${escapeHtml(profile.jobTitle)}</p>
      <div class="contact">
        <span class="contact-item"><strong>${escapeHtml(fields.location)}</strong>${escapeHtml(profile.location)}</span>
        <span class="contact-item"><strong>${escapeHtml(fields.email)}</strong>${escapeHtml(profile.email)}</span>
        <span class="contact-item"><strong>${escapeHtml(fields.languages)}</strong>${escapeHtml(profile.languages)}</span>
        <span class="contact-item"><strong>${escapeHtml(fields.drivingLicense)}</strong>${escapeHtml(profile.drivingLicense)}</span>
      </div>
    </div>
  </header>

  <section class="section">
    <h2 class="section-title">${escapeHtml(timeline.profileLinks.label)}</h2>
    <div class="profile-links">${profileLinksHtml}</div>
  </section>

  <section class="section">
    <h2 class="section-title">${escapeHtml(timeline.label)}</h2>
    ${experienceHtml}
  </section>

  <section class="section">
    <h2 class="section-title">${escapeHtml(timeline.education.title)}</h2>
    ${educationHtml}
  </section>

  <section class="section page-break">
    <h2 class="section-title">${escapeHtml(publications.title)}</h2>
    <p class="pub-intro">${escapeHtml(formatCitations(publications.totalCitations, totalCitations))}</p>
    ${publicationsHtml}
  </section>
</body>
</html>`;
}

export function getCvOutputPaths() {
  return {
    documentsDir: join(PUBLIC, "documents"),
    dataDir: join(ROOT, "data"),
    htmlDir: join(ROOT, "scripts/cv/output"),
  };
}
