import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, ScanCommand } from "@aws-sdk/lib-dynamodb";
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

export const handler: APIGatewayProxyHandlerV2 = async () => {
  const table = process.env.CUSTOMERS_TABLE;
  if (!table) return response(500, { error: "Missing CUSTOMERS_TABLE" });

  const result = await client.send(new ScanCommand({ TableName: table }));
  const items = (result.Items ?? []).sort(
    (a, b) => (a.order as number) - (b.order as number),
  );

  return response(200, items);
};
