import { readFileSync, readdirSync } from "fs";
import { join } from "path";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb";
import type { CloudFormationCustomResourceEvent, Context } from "aws-lambda";

const client = DynamoDBDocumentClient.from(new DynamoDBClient({}));

async function seedTable(tableName: string, items: Record<string, unknown>[]) {
  for (const item of items) {
    await client.send(
      new PutCommand({
        TableName: tableName,
        Item: item,
      }),
    );
  }
}

function loadSeedFile(filename: string): Record<string, unknown>[] {
  const seedDir = join(__dirname, "seed");
  const content = readFileSync(join(seedDir, filename), "utf-8");
  return JSON.parse(content) as Record<string, unknown>[];
}

export async function handler(
  event: CloudFormationCustomResourceEvent,
  _context: Context,
) {
  const physicalId = "hodlipop-seed-data";

  if (event.RequestType === "Delete") {
    return {
      PhysicalResourceId: physicalId,
      Data: {},
    };
  }

  const projectsTable = process.env.PROJECTS_TABLE!;
  const customersTable = process.env.CUSTOMERS_TABLE!;
  const articlesTable = process.env.ARTICLES_TABLE!;

  await seedTable(projectsTable, loadSeedFile("projects.json"));
  await seedTable(customersTable, loadSeedFile("customers.json"));
  await seedTable(articlesTable, loadSeedFile("articles.json"));

  return {
    PhysicalResourceId: physicalId,
    Data: { seeded: true },
  };
}
