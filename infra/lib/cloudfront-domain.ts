import * as acm from "aws-cdk-lib/aws-certificatemanager";
import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";

export interface CloudFrontDomainConfig {
  domainNames: string[];
  certificate: acm.ICertificate;
}

/**
 * Custom domain + ACM cert for CloudFront (cert must be in us-east-1).
 * Configure once in infra/cdk.json — otherwise each CDK deploy wipes console edits.
 */
export function cloudFrontDomainConfig(
  scope: Construct,
  certificateId: string,
  domainNamesContextKey: string,
): CloudFrontDomainConfig | undefined {
  const certArn =
    process.env.CLOUDFRONT_CERTIFICATE_ARN ??
    (scope.node.tryGetContext("cloudfrontCertificateArn") as string | undefined);

  const domainNames = scope.node.tryGetContext(domainNamesContextKey) as string[] | undefined;

  if (!certArn || !domainNames?.length) {
    cdk.Annotations.of(scope).addWarning(
      `[${scope.node.path}] cloudfrontCertificateArn / ${domainNamesContextKey} missing — ` +
        "CloudFront will use *.cloudfront.net only. Set them in infra/cdk.json (or CLOUDFRONT_CERTIFICATE_ARN) " +
        "so manual domain/certificate changes are not reset on deploy.",
    );
    return undefined;
  }

  if (!certArn.includes(":us-east-1:")) {
    cdk.Annotations.of(scope).addError(
      `cloudfrontCertificateArn must be in us-east-1 (N. Virginia) for CloudFront. Got: ${certArn}`,
    );
    return undefined;
  }

  return {
    domainNames,
    certificate: acm.Certificate.fromCertificateArn(scope, certificateId, certArn),
  };
}
