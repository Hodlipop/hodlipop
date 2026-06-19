import fs from "fs";
import path from "path";

const TIMELINE_LOGOS_DIR = path.join(process.cwd(), "public/images/timeline");
const METADATA_PATH = path.join(TIMELINE_LOGOS_DIR, "logos.json");

const IMAGE_EXTENSIONS = /\.(png|jpe?g|svg|webp)$/i;

type LocalizedAlt = {
  fr: string;
  en: string;
};

type LogosMetadata = Record<string, Record<string, LocalizedAlt>>;

export type TimelineLogo = {
  src: string;
  filename: string;
  alt: string;
};

let metadataCache: LogosMetadata | null = null;

function loadMetadata(): LogosMetadata {
  if (metadataCache) return metadataCache;

  if (!fs.existsSync(METADATA_PATH)) {
    metadataCache = {};
    return metadataCache;
  }

  metadataCache = JSON.parse(
    fs.readFileSync(METADATA_PATH, "utf-8"),
  ) as LogosMetadata;

  return metadataCache;
}

function resolveAlt(
  itemId: string,
  filename: string,
  locale: string,
): string {
  const entry = loadMetadata()[itemId]?.[filename];
  if (!entry) {
    return filename.replace(/^\d+-/, "").replace(/\.[^.]+$/, "").replace(/-/g, " ");
  }

  if (locale === "en") return entry.en;
  return entry.fr;
}

export function getTimelineLogos(
  itemId: string,
  locale = "fr",
): TimelineLogo[] {
  const dir = path.join(TIMELINE_LOGOS_DIR, itemId);

  if (!fs.existsSync(dir)) {
    return [];
  }

  return fs
    .readdirSync(dir)
    .filter((file) => IMAGE_EXTENSIONS.test(file) && !file.startsWith("."))
    .sort()
    .map((file) => ({
      src: `/images/timeline/${itemId}/${file}`,
      filename: file,
      alt: resolveAlt(itemId, file, locale),
    }));
}

export const TIMELINE_LOGO_IDS = [
  "freelance-2025",
  "mytroc-cto",
  "cnrs-hotvolc",
  "harvest-rd",
  "reykjavik-phd",
  "cea-cassini",
  "cnes-mars-express",
  "arianespace",
  "eads-fleximage",
  "aerospatiale",
] as const;
