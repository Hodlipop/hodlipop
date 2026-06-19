import { readFileSync } from "fs";
import { join } from "path";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb";

import {
  projectSchema,
  customerSchema,
  articleSchema,
  TABLE_NAMES,
} from "@hodlipop/shared";

const client = DynamoDBDocumentClient.from(new DynamoDBClient({}));

const seedDir = join(process.cwd(), "data/seed");

async function seedTable(
  tableName: string,
  items: Record<string, unknown>[],
) {
  console.log(`Seeding ${items.length} items into ${tableName}...`);
  for (const item of items) {
    await client.send(
      new PutCommand({
        TableName: tableName,
        Item: item,
      }),
    );
  }
}

async function main() {
  const projects = JSON.parse(
    readFileSync(join(seedDir, "projects.json"), "utf-8"),
  );
  const customers = JSON.parse(
    readFileSync(join(seedDir, "customers.json"), "utf-8"),
  );
  const articles = JSON.parse(
    readFileSync(join(seedDir, "articles.json"), "utf-8"),
  );

  projects.forEach((p: unknown) => projectSchema.parse(p));
  customers.forEach((c: unknown) => customerSchema.parse(c));
  articles.forEach((a: unknown) => articleSchema.parse(a));

  await seedTable(TABLE_NAMES.projects, projects);
  await seedTable(TABLE_NAMES.customers, customers);
  await seedTable(TABLE_NAMES.articles, articles);

  console.log("Seed completed successfully.");
}

main().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
