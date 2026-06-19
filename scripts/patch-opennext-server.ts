#!/usr/bin/env tsx
/**
 * Copy Next.js runtime peer deps into the OpenNext Lambda bundle.
 * pnpm + monorepo file tracing often omits styled-jsx from apps/web/node_modules.
 */

import { cpSync, existsSync, mkdirSync } from "node:fs";
import path from "node:path";

const ROOT = path.join(__dirname, "..");
const TARGET = path.join(
  ROOT,
  "apps/web/.open-next/server-functions/default/apps/web/node_modules",
);

const PEERS = ["styled-jsx", "@next/env", "@swc/helpers"] as const;

function copyPeer(name: string): void {
  const source = path.join(ROOT, "node_modules", name);
  const dest = path.join(TARGET, name);

  if (!existsSync(source)) {
    throw new Error(`Missing peer dependency at ${source}. Run pnpm install.`);
  }

  mkdirSync(path.dirname(dest), { recursive: true });
  cpSync(source, dest, { recursive: true, dereference: true });
  console.log(`  patched ${name}`);
}

function main(): void {
  if (!existsSync(TARGET)) {
    throw new Error("OpenNext server bundle not found. Run pnpm build:opennext first.");
  }

  console.log("Patching OpenNext server bundle:");
  for (const peer of PEERS) {
    copyPeer(peer);
  }
}

main();
