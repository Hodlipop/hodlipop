import { getLocalized, type Locale } from "@hodlipop/shared";

export function cn(...classes: (string | false | undefined | null)[]): string {
  return classes.filter(Boolean).join(" ");
}

export { getLocalized, type Locale };

export const HERO_TECH = [
  "Next.js",
  "TypeScript",
  "Tailwind CSS",
  "PostgreSQL",
  "WebSockets",
  "AWS",
] as const;

export const SERVICE_ICONS = ["code", "layers", "cloud", "automation", "cto"] as const;

export const SOCIAL_LINKS = {
  linkedin: "https://www.linkedin.com/company/hodlipop",
  githubPersonal: "https://github.com/jdecriem",
  github: "https://github.com/hodlipop",
  website: "https://hodlipop.com",
  email: "mailto:contact@hodlipop.com",
} as const;
