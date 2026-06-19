import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";
import path from "node:path";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

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
};

export default withNextIntl(nextConfig);
