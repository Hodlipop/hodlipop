#!/usr/bin/env tsx
/**
 * Upload static assets to S3 with parallel aws s3 sync (replaces CDK BucketDeployment).
 */

import { execFileSync } from "node:child_process";
import { existsSync } from "node:fs";
import path from "node:path";

const ROOT = path.join(__dirname, "..");
const REGION = process.env.AWS_REGION ?? process.env.CDK_DEFAULT_REGION ?? "eu-west-3";

const OPEN_NEXT_ASSETS = path.join(ROOT, "apps/web/.open-next/assets");
const PUBLIC_IMAGES = path.join(ROOT, "apps/web/public/images");
const PUBLIC_DOCUMENTS = path.join(ROOT, "apps/web/public/documents");

function aws(args: string[]): string {
  return execFileSync("aws", args, {
    encoding: "utf8",
    stdio: ["inherit", "pipe", "inherit"],
    env: { ...process.env, AWS_REGION: REGION },
  }).trim();
}

function awsInherit(args: string[]): void {
  execFileSync("aws", args, {
    stdio: "inherit",
    env: { ...process.env, AWS_REGION: REGION },
  });
}

function requireDir(dir: string, hint: string): void {
  if (!existsSync(dir)) {
    throw new Error(`Missing ${dir}. Run \`${hint}\` first.`);
  }
}

function sync(localDir: string, bucket: string, prefix: string, excludes: string[] = []): void {
  const target = prefix ? `s3://${bucket}/${prefix}` : `s3://${bucket}`;
  const args = [
    "s3",
    "sync",
    localDir,
    target,
    "--region",
    REGION,
    "--delete",
    ...excludes.flatMap((pattern) => ["--exclude", pattern]),
  ];
  console.log(`\n→ aws ${args.join(" ")}`);
  awsInherit(args);
}

function main(): void {
  requireDir(OPEN_NEXT_ASSETS, "pnpm build:opennext");
  requireDir(PUBLIC_IMAGES, "pnpm optimize:images (optional)");
  requireDir(PUBLIC_DOCUMENTS, "pnpm generate:cv (optional)");

  const account = aws(["sts", "get-caller-identity", "--query", "Account", "--output", "text"]);
  const webBucket = `hodlipop-web-${account}-${REGION}`;

  console.log(`Account: ${account}  Region: ${REGION}`);
  console.log(`Web bucket: ${webBucket}`);

  // OpenNext HTML references /_next/*, logos and BUILD_ID at bucket root.
  sync(OPEN_NEXT_ASSETS, webBucket, "", ["images/*", "documents/*"]);
  sync(PUBLIC_IMAGES, webBucket, "images");
  sync(PUBLIC_DOCUMENTS, webBucket, "documents");

  console.log("\nS3 sync complete.");
}

main();
