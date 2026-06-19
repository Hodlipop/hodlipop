import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  DynamoDBDocumentClient,
  PutCommand,
  ScanCommand,
  QueryCommand,
} from "@aws-sdk/lib-dynamodb";
import type { APIGatewayProxyHandlerV2 } from "aws-lambda";

const client = DynamoDBDocumentClient.from(new DynamoDBClient({}));

function response(statusCode: number, body: unknown) {
  return {
    statusCode,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
    },
    body: JSON.stringify(body),
  };
}

export const handler: APIGatewayProxyHandlerV2 = async (event) => {
  const table = process.env.PROJECTS_TABLE;
  if (!table) return response(500, { error: "Missing PROJECTS_TABLE" });

  const slug = event.pathParameters?.slug;
  const featured = event.queryStringParameters?.featured === "true";

  if (slug) {
    const result = await client.send(
      new QueryCommand({
        TableName: table,
        IndexName: "slug-index",
        KeyConditionExpression: "slug = :slug",
        ExpressionAttributeValues: { ":slug": slug },
        Limit: 1,
      }),
    );
    const item = result.Items?.[0];
    if (!item) return response(404, { error: "Project not found" });
    return response(200, item);
  }

  const result = await client.send(new ScanCommand({ TableName: table }));
  let items = result.Items ?? [];

  if (featured) {
    items = items.filter((item) => item.featured === true);
  }

  items.sort((a, b) => (a.order as number) - (b.order as number));
  return response(200, items);
};
