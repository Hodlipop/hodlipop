import {
  type Article,
  type Customer,
  type Locale,
  type Project,
  articleSchema,
  customerSchema,
  projectSchema,
} from "@hodlipop/shared";

import projectsSeed from "../../../../data/seed/projects.json";
import customersSeed from "../../../../data/seed/customers.json";
import articlesSeed from "../../../../data/seed/articles.json";

const API_URL = process.env.API_URL ?? process.env.NEXT_PUBLIC_API_URL;

async function fetchFromApi<T>(path: string): Promise<T | null> {
  if (!API_URL) return null;

  try {
    const res = await fetch(`${API_URL}${path}`, {
      next: { revalidate: 3600 },
    });
    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch {
    return null;
  }
}

function parseSeed<T>(schema: { parse: (data: unknown) => T }, data: unknown): T {
  return schema.parse(data);
}

export async function getProjects(options?: {
  featured?: boolean;
}): Promise<Project[]> {
  const query = options?.featured ? "?featured=true" : "";
  const apiData = await fetchFromApi<Project[]>(`/projects${query}`);
  if (apiData) return apiData;

  const projects = projectsSeed.map((p) => parseSeed(projectSchema, p));
  if (options?.featured) return projects.filter((p) => p.featured);
  return projects.sort((a, b) => a.order - b.order);
}

export async function getProjectBySlug(slug: string): Promise<Project | null> {
  const apiData = await fetchFromApi<Project>(`/projects/${slug}`);
  if (apiData) return apiData;

  const project = projectsSeed.find((p) => p.slug === slug);
  return project ? parseSeed(projectSchema, project) : null;
}

export function getProjectNeighbors(
  projects: Project[],
  slug: string,
): { previous: Project | null; next: Project | null } | null {
  if (projects.length <= 1) return null;

  const sorted = [...projects].sort((a, b) => a.order - b.order);
  const index = sorted.findIndex((project) => project.slug === slug);
  if (index === -1) return null;

  return {
    previous: index > 0 ? sorted[index - 1] : null,
    next: index < sorted.length - 1 ? sorted[index + 1] : null,
  };
}

export async function getCustomers(): Promise<Customer[]> {
  const apiData = await fetchFromApi<Customer[]>("/customers");
  if (apiData) return apiData;

  return customersSeed
    .map((c) => parseSeed(customerSchema, c))
    .sort((a, b) => a.order - b.order);
}

export async function getArticles(): Promise<Article[]> {
  const apiData = await fetchFromApi<Article[]>("/articles");
  if (apiData) return apiData;

  return articlesSeed
    .map((a) => parseSeed(articleSchema, a))
    .sort(
      (a, b) =>
        new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
    );
}

export async function getArticleBySlug(slug: string): Promise<Article | null> {
  const apiData = await fetchFromApi<Article>(`/articles/${slug}`);
  if (apiData) return apiData;

  const article = articlesSeed.find((a) => a.slug === slug);
  return article ? parseSeed(articleSchema, article) : null;
}

export function getSiteUrl(): string {
  return process.env.NEXT_PUBLIC_SITE_URL ?? "https://hodlipop.com";
}

export function localizedPath(locale: Locale, path: string): string {
  return `/${locale}${path}`;
}
