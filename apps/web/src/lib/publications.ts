import publicationsSeed from "../../../../data/seed/publications.json";

export type PublicationKind = "journal" | "conference" | "thesis";

export type Publication = {
  id: string;
  title: string;
  authors: string;
  venue: string;
  year: number | null;
  citations: number;
  kind: PublicationKind;
  scholarUrl: string;
};

export type PublicationsData = {
  profileUrl: string;
  totalCitations: number;
  items: Publication[];
};

const data = publicationsSeed as PublicationsData;

export function getPublications(): Publication[] {
  return data.items;
}

export function getPublicationsProfile(): Pick<
  PublicationsData,
  "profileUrl" | "totalCitations"
> {
  return {
    profileUrl: data.profileUrl,
    totalCitations: data.totalCitations,
  };
}
