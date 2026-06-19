# CV PDF generation

Generates printable resumes from i18n + publications seed data:

```bash
pnpm generate:cv
```

Outputs dated PDFs in `apps/web/public/documents/`:

- `YYYYMMDD.judicael.decriem.fr.pdf`
- `YYYYMMDD.judicael.decriem.en.pdf`

Also writes:

- `cv-fr.pdf` / `cv-en.pdf` — stable copies for direct links
- `cv-latest.json` — manifest used by the site download button
- `data/cv-latest.json` — same manifest for the Next.js app import

Override the date with `CV_DATE=20250619 pnpm generate:cv`.

Requires Google Chrome or Chromium (`CHROME_PATH` to override). Uses Puppeteer with `displayHeaderFooter: false` (no date/title header, no file URL footer).

Publications start on a new page (`page-break-before`).
