import type { OpenNextConfig } from "@opennextjs/aws/types/open-next.js";

const config: OpenNextConfig = {
  default: {},
  buildCommand: "pnpm build",
  appPath: ".",
  packageJsonPath: "../..",
};

export default config;
