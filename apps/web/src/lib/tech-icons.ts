const TECH_LOGO_FILES: Record<string, string> = {
  "Next.js": "nextjs.svg",
  React: "react.svg",
  TypeScript: "typescript.svg",
  Stripe: "stripe.svg",
  CSS: "css.svg",
  SEO: "seo.svg",
  "Node.js": "nodejs.svg",
  PHP: "php.svg",
  Java: "java.svg",
  "AWS Lambda": "aws-lambda.svg",
  "AWS API Gateway": "aws-api-gateway.svg",
  "REST APIs": "rest-apis.svg",
  AWS: "aws.svg",
  "OVH Cloud": "ovh-cloud.svg",
  Debian: "debian.svg",
  Grafana: "grafana.svg",
  SonarQube: "sonarqube.svg",
  DevOps: "devops.svg",
  PostgreSQL: "postgresql.svg",
  PostGIS: "postgis.svg",
  MySQL: "mysql.svg",
  DynamoDB: "dynamodb.svg",
  Redis: "redis.svg",
  Elasticsearch: "elasticsearch.svg",
};

export type TechLogoVariant = "mono" | "color";

/**
 * Active tech logo style.
 * - "color": brand-colored SVGs from /images/tech/color/
 * - "mono": monochrome SVGs from /images/tech/ (rendered white via CSS invert)
 */
export const TECH_LOGO_VARIANT: TechLogoVariant =
  (process.env.NEXT_PUBLIC_TECH_LOGO_VARIANT as TechLogoVariant | undefined) ??
  "color";

const VARIANT_DIR: Record<TechLogoVariant, string> = {
  mono: "/images/tech",
  color: "/images/tech/color",
};

export const TECH_LOGO_CLASS: Record<TechLogoVariant, string> = {
  mono: "h-5 w-5 opacity-80 brightness-0 invert",
  color: "h-4 w-4",
};

export const TECH_LOGO_WRAPPER_CLASS: Record<TechLogoVariant, string> = {
  mono: "flex h-6 w-6 shrink-0 items-center justify-center",
  color:
    "flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white shadow-sm",
};

export function getTechLogo(
  name: string,
  variant: TechLogoVariant = TECH_LOGO_VARIANT,
): string | undefined {
  const file = TECH_LOGO_FILES[name];
  if (!file) return undefined;
  return `${VARIANT_DIR[variant]}/${file}`;
}

export function getTechLogoClass(
  variant: TechLogoVariant = TECH_LOGO_VARIANT,
): string {
  return TECH_LOGO_CLASS[variant];
}

export function getTechLogoWrapperClass(
  variant: TechLogoVariant = TECH_LOGO_VARIANT,
): string {
  return TECH_LOGO_WRAPPER_CLASS[variant];
}
