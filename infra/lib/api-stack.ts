import * as cdk from "aws-cdk-lib";
import * as apigatewayv2 from "aws-cdk-lib/aws-apigatewayv2";
import * as apigatewayv2Integrations from "aws-cdk-lib/aws-apigatewayv2-integrations";
import * as dynamodb from "aws-cdk-lib/aws-dynamodb";
import * as lambda from "aws-cdk-lib/aws-lambda";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import { Construct } from "constructs";
import * as path from "path";

import type { DataStackTables } from "./data-stack";

export interface ApiStackProps extends cdk.StackProps {
  tables: DataStackTables;
}

export class ApiStack extends cdk.Stack {
  public readonly apiUrl: string;

  constructor(scope: Construct, id: string, props: ApiStackProps) {
    super(scope, id, props);

    const commonEnv = {
      PROJECTS_TABLE: props.tables.projects.tableName,
      CUSTOMERS_TABLE: props.tables.customers.tableName,
      ARTICLES_TABLE: props.tables.articles.tableName,
    };

    const projectsHandler = this.createHandler("ProjectsHandler", "projects/handler.ts", commonEnv);
    const customersHandler = this.createHandler("CustomersHandler", "customers/handler.ts", commonEnv);
    const articlesHandler = this.createHandler("ArticlesHandler", "articles/handler.ts", commonEnv);

    props.tables.projects.grantReadData(projectsHandler);
    props.tables.customers.grantReadData(customersHandler);
    props.tables.articles.grantReadData(articlesHandler);

    const httpApi = new apigatewayv2.HttpApi(this, "HodlipopApi", {
      apiName: "hodlipop-api",
      corsPreflight: {
        allowHeaders: ["Content-Type"],
        allowMethods: [apigatewayv2.CorsHttpMethod.GET, apigatewayv2.CorsHttpMethod.OPTIONS],
        allowOrigins: ["*"],
      },
    });

    httpApi.addRoutes({
      path: "/projects",
      methods: [apigatewayv2.HttpMethod.GET],
      integration: new apigatewayv2Integrations.HttpLambdaIntegration(
        "ProjectsListIntegration",
        projectsHandler,
      ),
    });

    httpApi.addRoutes({
      path: "/projects/{slug}",
      methods: [apigatewayv2.HttpMethod.GET],
      integration: new apigatewayv2Integrations.HttpLambdaIntegration(
        "ProjectsDetailIntegration",
        projectsHandler,
      ),
    });

    httpApi.addRoutes({
      path: "/customers",
      methods: [apigatewayv2.HttpMethod.GET],
      integration: new apigatewayv2Integrations.HttpLambdaIntegration(
        "CustomersListIntegration",
        customersHandler,
      ),
    });

    httpApi.addRoutes({
      path: "/articles",
      methods: [apigatewayv2.HttpMethod.GET],
      integration: new apigatewayv2Integrations.HttpLambdaIntegration(
        "ArticlesListIntegration",
        articlesHandler,
      ),
    });

    httpApi.addRoutes({
      path: "/articles/{slug}",
      methods: [apigatewayv2.HttpMethod.GET],
      integration: new apigatewayv2Integrations.HttpLambdaIntegration(
        "ArticlesDetailIntegration",
        articlesHandler,
      ),
    });

    this.apiUrl = httpApi.apiEndpoint;

    new cdk.CfnOutput(this, "ApiUrl", { value: this.apiUrl });
  }

  private createHandler(
    id: string,
    entryPath: string,
    environment: Record<string, string>,
  ): lambda.Function {
    return new NodejsFunction(this, id, {
      entry: path.join(__dirname, "../lambda", entryPath),
      handler: "handler",
      runtime: lambda.Runtime.NODEJS_20_X,
      timeout: cdk.Duration.seconds(10),
      environment,
    });
  }
}
