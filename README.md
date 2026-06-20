# Hodlipop

Landing page for [HODLIPOP](https://hodlipop.com) — freelance senior fullstack developer services.

## Stack

- **Frontend:** Next.js 15, TypeScript, Tailwind CSS v4, next-intl (FR/EN)
- **Infrastructure:** AWS CDK (S3, CloudFront, API Gateway, Lambda, DynamoDB)
- **Deploy:** OpenNext + GitHub Actions

## Project structure

```
apps/web/          Next.js marketing site
infra/             AWS CDK stacks
packages/shared/   Zod schemas & shared types
data/seed/         JSON seed data for DynamoDB
data/i18n/         Static UI translations (FR/EN)
scripts/           Seed & utility scripts
ressources/        Design references & brand assets
```

## Local development

```bash
pnpm install
pnpm dev
```

Open [http://localhost:3000/fr](http://localhost:3000/fr).

Copy `apps/web/.env.example` to `apps/web/.env.local` for optional API, Matomo, and site URL settings. Without API URL, the app uses local JSON seed data.

## Build

```bash
pnpm build          # Typecheck all packages + Next.js build
pnpm build:opennext # Next.js + OpenNext (required before CDK web deploy)
```

## AWS deployment

### Prerequisites

1. AWS account with CLI configured (`aws configure` or SSO)
2. CDK bootstrapped: `cd infra && npx cdk bootstrap`
3. GitHub OIDC role for CI (set `AWS_ROLE_ARN` secret)

### Manual deploy

```bash
pnpm deploy:aws   # build OpenNext → CDK deploy → aws s3 sync (parallel)
pnpm sync:s3      # re-upload static files only (after infra is up)
```

### Seed DynamoDB manually

```bash
pnpm seed
```

Requires AWS credentials and deployed DynamoDB tables.

### CDK stacks

| Stack | Resources |
|-------|-----------|
| HodlipopData | DynamoDB tables + seed custom resource |
| HodlipopApi | HTTP API Gateway + Lambda handlers |
| HodlipopWeb | OpenNext server Lambda + S3 + CloudFront (static files via `pnpm sync:s3`) |

### Custom domain & TLS (important)

CloudFront is managed by CDK. **Any domain or certificate added only in the AWS console is removed on the next `cdk deploy`.**

Add your ACM certificate ARN (must be in **us-east-1**) once in `infra/cdk.json`:

```json
"cloudfrontCertificateArn": "arn:aws:acm:us-east-1:ACCOUNT_ID:certificate/UUID",
"webDomainNames": ["hodlipop.com", "www.hodlipop.com"]
```

Or pass it at deploy time: `CLOUDFRONT_CERTIFICATE_ARN=arn:aws:acm:... pnpm deploy:aws`

Find the ARN in ACM (N. Virginia / us-east-1) or run:

```bash
aws acm list-certificates --region us-east-1 --output table
```


## API endpoints

- `GET /projects` — list projects (`?featured=true` optional)
- `GET /projects/{slug}` — project detail
- `GET /customers` — list customers/testimonials
- `GET /articles` — list articles
- `GET /articles/{slug}` — article detail

## i18n

Routes are locale-prefixed: `/fr/...` and `/en/...`. Default locale is French.

## SEO

Per-page `generateMetadata`, sitemap at `/sitemap.xml`, robots at `/robots.txt`, JSON-LD structured data, and hreflang alternates.
