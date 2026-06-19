import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  DynamoDBDocumentClient,
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
  const table = process.env.ARTICLES_TABLE;
  if (!table) return response(500, { error: "Missing ARTICLES_TABLE" });

  const slug = event.pathParameters?.slug;

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
    if (!item) return response(404, { error: "Article not found" });
    return response(200, item);
  }

  const result = await client.send(new ScanCommand({ TableName: table }));
  const items = (result.Items ?? []).sort(
    (a, b) =>
      new Date(b.publishedAt as string).getTime() -
      new Date(a.publishedAt as string).getTime(),
  );

  return response(200, items);
};
