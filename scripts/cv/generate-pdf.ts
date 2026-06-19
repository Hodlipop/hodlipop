import { execFileSync } from "node:child_process";
import { copyFileSync, existsSync, mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import puppeteer from "puppeteer-core";

import { getCvOutputPaths, renderCvHtml } from "./render-html";

const CHROME_CANDIDATES = [
  process.env.CHROME_PATH,
  "/usr/bin/google-chrome",
  "/usr/bin/google-chrome-stable",
  "/usr/bin/chromium-browser",
  "/usr/bin/chromium",
].filter(Boolean) as string[];

function findChrome(): string {
  const chrome = CHROME_CANDIDATES.find((path) => existsSync(path));
  if (!chrome) {
    throw new Error(
      "Chrome/Chromium not found. Set CHROME_PATH or install google-chrome.",
    );
  }
  return chrome;
}

function getCvDate(): string {
  if (process.env.CV_DATE) return process.env.CV_DATE;
  return new Date().toISOString().slice(0, 10).replace(/-/g, "");
}

export function getCvPdfFilename(locale: "fr" | "en", date = getCvDate()): string {
  return `${date}.judicael.decriem.${locale}.pdf`;
}

function preparePhoto(htmlDir: string): string {
  const paths = getCvOutputPaths();
  const source = join(dirname(paths.documentsDir), "images/cv/j.decriem.jpg");
  const output = join(htmlDir, "photo.jpg");

  if (existsSync("/usr/bin/convert")) {
    execFileSync("convert", [
      source,
      "-resize",
      "144x144^",
      "-gravity",
      "center",
      "-extent",
      "144x144",
      "-quality",
      "82",
      output,
    ]);
    return output;
  }

  return source;
}

async function generatePdf(htmlPath: string, pdfPath: string) {
  const browser = await puppeteer.launch({
    executablePath: findChrome(),
    headless: true,
    args: ["--no-sandbox", "--disable-dev-shm-usage"],
  });

  try {
    const page = await browser.newPage();
    await page.goto(`file://${htmlPath}`, { waitUntil: "networkidle0" });
    await page.pdf({
      path: pdfPath,
      format: "A4",
      printBackground: true,
      displayHeaderFooter: false,
      margin: {
        top: "12mm",
        right: "12mm",
        bottom: "12mm",
        left: "12mm",
      },
    });
  } finally {
    await browser.close();
  }
}

async function main() {
  const paths = getCvOutputPaths();
  const date = getCvDate();
  mkdirSync(paths.htmlDir, { recursive: true });
  mkdirSync(paths.documentsDir, { recursive: true });

  const photoPath = preparePhoto(paths.htmlDir);
  const generated: Record<"fr" | "en", string> = { fr: "", en: "" };

  for (const locale of ["fr", "en"] as const) {
    const filename = getCvPdfFilename(locale, date);
    const html = renderCvHtml(locale, photoPath);
    const htmlPath = join(paths.htmlDir, `cv-${locale}.html`);
    const pdfPath = join(paths.documentsDir, filename);

    writeFileSync(htmlPath, html, "utf8");
    await generatePdf(htmlPath, pdfPath);

    generated[locale] = filename;
    console.log(`Generated ${pdfPath}`);
  }

  const manifest = {
    date,
    files: generated,
  };

  writeFileSync(
    join(paths.documentsDir, "cv-latest.json"),
    `${JSON.stringify(manifest, null, 2)}\n`,
    "utf8",
  );
  writeFileSync(
    join(paths.dataDir, "cv-latest.json"),
    `${JSON.stringify(manifest, null, 2)}\n`,
    "utf8",
  );

  for (const locale of ["fr", "en"] as const) {
    copyFileSync(
      join(paths.documentsDir, generated[locale]),
      join(paths.documentsDir, `cv-${locale}.pdf`),
    );
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
