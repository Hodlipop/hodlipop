import { getSiteUrl } from "./api";

type JsonLdProps = {
  data: Record<string, unknown>;
};

export function JsonLd({ data }: JsonLdProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export function createPersonJsonLd(locale: string) {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Judicael Decriem",
    alternateName: "HODLIPOP",
    jobTitle: locale === "fr" ? "Développeur Fullstack Senior" : "Senior Fullstack Developer",
    url: getSiteUrl(),
    email: "contact@hodlipop.com",
    knowsLanguage: ["French", "English"],
    sameAs: [
      "https://linkedin.com/in/judicael-decriem",
      "https://github.com/hodlipop",
    ],
  };
}

export function createProfessionalServiceJsonLd(locale: string) {
  return {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    name: "HODLIPOP",
    description:
      locale === "fr"
        ? "Développement web freelance — applications modernes et performantes"
        : "Freelance web development — modern and performant applications",
    url: getSiteUrl(),
    provider: createPersonJsonLd(locale),
  };
}

export function createArticleJsonLd(
  title: string,
  description: string,
  publishedAt: string,
  url: string,
) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: title,
    description,
    datePublished: publishedAt,
    author: {
      "@type": "Person",
      name: "Judicael Decriem",
    },
    url,
  };
}

export function createCreativeWorkJsonLd(
  title: string,
  description: string,
  url: string,
) {
  return {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: title,
    description,
    url,
    creator: {
      "@type": "Person",
      name: "Judicael Decriem",
    },
  };
}
