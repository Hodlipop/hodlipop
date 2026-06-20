#!/usr/bin/env node
import * as cdk from "aws-cdk-lib";
import { loadRepoEnv } from "../../scripts/load-env";
import { DataStack } from "../lib/data-stack";
import { ApiStack } from "../lib/api-stack";
import { WebStack } from "../lib/web-stack";

loadRepoEnv();

const app = new cdk.App();

const env = {
  account: process.env.CDK_DEFAULT_ACCOUNT,
  region: process.env.CDK_DEFAULT_REGION ?? "eu-west-3",
};

const dataStack = new DataStack(app, "HodlipopData", { env });
const apiStack = new ApiStack(app, "HodlipopApi", {
  env,
  tables: dataStack.tables,
});
const webStack = new WebStack(app, "HodlipopWeb", {
  env,
  apiUrl: apiStack.apiUrl,
});

webStack.addDependency(apiStack);
apiStack.addDependency(dataStack);

app.synth();
