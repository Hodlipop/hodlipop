import type { NextConfig } from "next";
import { loadEnvConfig } from "@next/env";
import createNextIntlPlugin from "next-intl/plugin";
import path from "node:path";

// Load monorepo root + app env so MATOMO_* in repo .env apply during build.
loadEnvConfig(path.join(__dirname, "../.."));
loadEnvConfig(path.join(__dirname));

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

/** Stable proxy path — must match app/api/matomo-proxy/[...path]/route.ts */
export const MATOMO_PROXY_PATH = "/api/matomo-proxy";

const matomoUrl = process.env.MATOMO_URL?.replace(/\/+$/, "") ?? "";
const matomoSiteId = process.env.NEXT_PUBLIC_MATOMO_SITE_ID ?? "";

const nextConfig: NextConfig = {
  output: "standalone",
  outputFileTracingRoot: path.join(__dirname, "../.."),
  outputFileTracingIncludes: {
    "/*": [
      "../../node_modules/styled-jsx/**/*",
      "../../node_modules/@swc/helpers/**/*",
      "../../node_modules/@next/env/**/*",
    ],
  },
  // Images are pre-optimized in public/; skip /_next/image Lambda (broken on AWS OpenNext).
  images: {
    unoptimized: true,
  },
  transpilePackages: ["@hodlipop/shared"],
  // No rewrites: OpenNext on Lambda does not apply beforeFiles rewrites reliably.
  // The client calls /api/matomo-proxy/* directly (see MATOMO_PROXY_PATH).
  ...(matomoUrl
    ? {
        env: {
          NEXT_PUBLIC_MATOMO_PROXY_PATH: MATOMO_PROXY_PATH,
          MATOMO_PROXY_TARGET: matomoUrl,
          NEXT_PUBLIC_MATOMO_PROXY_JS_TRACKER_FILE: "matomo.js",
          NEXT_PUBLIC_MATOMO_PROXY_PHP_TRACKER_FILE: "matomo.php",
          ...(matomoSiteId
            ? {
                NEXT_PUBLIC_MATOMO_SITE_ID: matomoSiteId,
                NEXT_PUBLIC_MATOMO_PROXY_SITE_ID: matomoSiteId,
              }
            : {}),
        },
      }
    : {}),
};

export default withNextIntl(nextConfig);
