import { existsSync, readFileSync } from "node:fs";
import path from "node:path";

/** Load KEY=VALUE lines from .env files without overriding existing env vars. */
export function loadEnvFiles(...files: string[]): void {
  for (const file of files) {
    if (!existsSync(file)) continue;

    for (const line of readFileSync(file, "utf8").split("\n")) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;

      const eq = trimmed.indexOf("=");
      if (eq === -1) continue;

      const key = trimmed.slice(0, eq).trim();
      let value = trimmed.slice(eq + 1).trim();
      if (
        (value.startsWith('"') && value.endsWith('"')) ||
        (value.startsWith("'") && value.endsWith("'"))
      ) {
        value = value.slice(1, -1);
      }

      if (key && process.env[key] === undefined) {
        process.env[key] = value;
      }
    }
  }
}

export function loadRepoEnv(): void {
  const root = path.join(__dirname, "../..");
  loadEnvFiles(
    path.join(root, ".env"),
    path.join(root, "apps/web/.env"),
    path.join(root, "apps/web/.env.local"),
  );
}
