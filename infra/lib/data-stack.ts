import * as cdk from "aws-cdk-lib";
import * as dynamodb from "aws-cdk-lib/aws-dynamodb";
import * as lambda from "aws-cdk-lib/aws-lambda";
import * as cr from "aws-cdk-lib/custom-resources";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import { Construct } from "constructs";
import * as path from "path";

import { TABLE_NAMES } from "@hodlipop/shared";

export interface DataStackTables {
  projects: dynamodb.Table;
  customers: dynamodb.Table;
  articles: dynamodb.Table;
}

export class DataStack extends cdk.Stack {
  public readonly tables: DataStackTables;

  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const projects = new dynamodb.Table(this, "ProjectsTable", {
      tableName: TABLE_NAMES.projects,
      partitionKey: { name: "id", type: dynamodb.AttributeType.STRING },
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
      removalPolicy: cdk.RemovalPolicy.RETAIN,
    });

    projects.addGlobalSecondaryIndex({
      indexName: "slug-index",
      partitionKey: { name: "slug", type: dynamodb.AttributeType.STRING },
      projectionType: dynamodb.ProjectionType.ALL,
    });

    const customers = new dynamodb.Table(this, "CustomersTable", {
      tableName: TABLE_NAMES.customers,
      partitionKey: { name: "id", type: dynamodb.AttributeType.STRING },
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
      removalPolicy: cdk.RemovalPolicy.RETAIN,
    });

    const articles = new dynamodb.Table(this, "ArticlesTable", {
      tableName: TABLE_NAMES.articles,
      partitionKey: { name: "id", type: dynamodb.AttributeType.STRING },
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
      removalPolicy: cdk.RemovalPolicy.RETAIN,
    });

    articles.addGlobalSecondaryIndex({
      indexName: "slug-index",
      partitionKey: { name: "slug", type: dynamodb.AttributeType.STRING },
      projectionType: dynamodb.ProjectionType.ALL,
    });

    this.tables = { projects, customers, articles };

    const seedFn = new NodejsFunction(this, "SeedFunction", {
      entry: path.join(__dirname, "../lambda/seed/handler.ts"),
      handler: "handler",
      runtime: lambda.Runtime.NODEJS_20_X,
      timeout: cdk.Duration.minutes(2),
      environment: {
        PROJECTS_TABLE: projects.tableName,
        CUSTOMERS_TABLE: customers.tableName,
        ARTICLES_TABLE: articles.tableName,
      },
      bundling: {
        commandHooks: {
          beforeBundling(): string[] {
            return [];
          },
          beforeInstall(): string[] {
            return [];
          },
          afterBundling(inputDir: string, outputDir: string): string[] {
            return [
              `cp -r ${path.join(__dirname, "../../data/seed")} ${outputDir}/seed`,
            ];
          },
        },
      },
    });

    projects.grantReadWriteData(seedFn);
    customers.grantReadWriteData(seedFn);
    articles.grantReadWriteData(seedFn);

    const provider = new cr.Provider(this, "SeedProvider", {
      onEventHandler: seedFn,
    });

    new cdk.CustomResource(this, "SeedData", {
      serviceToken: provider.serviceToken,
      properties: {
        version: "1",
      },
    });

    new cdk.CfnOutput(this, "ProjectsTableName", { value: projects.tableName });
    new cdk.CfnOutput(this, "CustomersTableName", { value: customers.tableName });
    new cdk.CfnOutput(this, "ArticlesTableName", { value: articles.tableName });
  }
}
