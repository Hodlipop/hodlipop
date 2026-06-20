import * as cdk from "aws-cdk-lib";
import * as s3 from "aws-cdk-lib/aws-s3";
import * as cloudfront from "aws-cdk-lib/aws-cloudfront";
import * as origins from "aws-cdk-lib/aws-cloudfront-origins";
import * as lambda from "aws-cdk-lib/aws-lambda";
import { Construct } from "constructs";
import * as path from "path";
import * as fs from "fs";
import { cloudFrontDomainConfig } from "./cloudfront-domain";

export interface WebStackProps extends cdk.StackProps {
  apiUrl: string;
}

export class WebStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: WebStackProps) {
    super(scope, id, props);

    const openNextDir = path.join(__dirname, "../../apps/web/.open-next");
    const serverFunctionDir = path.join(openNextDir, "server-functions/default");
    const hasOpenNextBuild = fs.existsSync(serverFunctionDir);

    const webBucket = new s3.Bucket(this, "WebBucket", {
      bucketName: `hodlipop-web-${this.account}-${this.region}`,
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
      encryption: s3.BucketEncryption.S3_MANAGED,
      removalPolicy: cdk.RemovalPolicy.RETAIN,
    });

    if (!hasOpenNextBuild) {
      throw new Error(
        "OpenNext build not found at apps/web/.open-next. Run `pnpm build:opennext` before deploying.",
      );
    }

    const serverFn = new lambda.Function(this, "ServerFunction", {
      runtime: lambda.Runtime.NODEJS_20_X,
      handler: "index.handler",
      code: lambda.Code.fromAsset(serverFunctionDir),
      memorySize: 1024,
      timeout: cdk.Duration.seconds(30),
      environment: {
        API_URL: props.apiUrl,
        NEXT_PUBLIC_API_URL: props.apiUrl,
        NEXT_PUBLIC_SITE_URL: `https://${this.node.tryGetContext("domain") ?? "hodlipop.com"}`,
        MATOMO_URL: process.env.MATOMO_URL ?? "",
        MATOMO_PROXY_TARGET: (process.env.MATOMO_URL ?? "").replace(/\/+$/, ""),
        NEXT_PUBLIC_MATOMO_PROXY_PATH: "/api/matomo-proxy",
        NEXT_PUBLIC_MATOMO_PROXY_JS_TRACKER_FILE: "matomo.js",
        NEXT_PUBLIC_MATOMO_PROXY_PHP_TRACKER_FILE: "matomo.php",
        NEXT_PUBLIC_MATOMO_SITE_ID: process.env.NEXT_PUBLIC_MATOMO_SITE_ID ?? "",
      },
    });

    webBucket.grantRead(serverFn);

    const fnUrl = serverFn.addFunctionUrl({
      authType: lambda.FunctionUrlAuthType.NONE,
    });

    const staticOrigin = {
      viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
      cachePolicy: cloudfront.CachePolicy.CACHING_OPTIMIZED,
    } as const;

    const s3Origin = origins.S3BucketOrigin.withOriginAccessControl(webBucket);

    const webDomain = cloudFrontDomainConfig(this, "WebCertificate", "webDomainNames");

    const distribution = new cloudfront.Distribution(this, "WebDistribution", {
      ...(webDomain ?? {}),
      defaultBehavior: {
        origin: new origins.FunctionUrlOrigin(fnUrl),
        viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
        cachePolicy: cloudfront.CachePolicy.CACHING_DISABLED,
        allowedMethods: cloudfront.AllowedMethods.ALLOW_ALL,
        originRequestPolicy: cloudfront.OriginRequestPolicy.ALL_VIEWER_EXCEPT_HOST_HEADER,
      },
      additionalBehaviors: {
        "_next/*": { origin: s3Origin, ...staticOrigin },
        "images/*": { origin: s3Origin, ...staticOrigin },
        "documents/*": { origin: s3Origin, ...staticOrigin },
        BUILD_ID: { origin: s3Origin, ...staticOrigin },
        "logo.png": { origin: s3Origin, ...staticOrigin },
        "logo.dark.png": { origin: s3Origin, ...staticOrigin },
        "logo.single.png": { origin: s3Origin, ...staticOrigin },
      },
      comment: "Hodlipop web distribution",
    });

    new cdk.CfnOutput(this, "WebUrl", {
      value: `https://${distribution.distributionDomainName}`,
    });

    if (webDomain) {
      new cdk.CfnOutput(this, "WebCustomDomains", {
        value: webDomain.domainNames.join(", "),
      });
    }

    new cdk.CfnOutput(this, "WebBucketName", { value: webBucket.bucketName });
  }
}
