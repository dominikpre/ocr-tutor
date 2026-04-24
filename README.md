# OCR Tutor Monorepo

## Layout

- `apps/web`: Next.js frontend
- `apps/api`: Fastify + Prisma backend
- `apps/ocr-worker`: background OCR worker that processes uploaded submissions
- `packages/contracts`: shared TypeScript API contract types
- `infra/ansible`: deployment automation
- `infra/proxy`: reverse proxy configuration

## Workspace

- `pnpm dev:web`: run the frontend
- `pnpm dev:api`: run `pnpm db:up`, then start the backend
- `pnpm dev:worker`: run the OCR worker
- `pnpm build`: build all workspace packages that define a build script
- `pnpm lint`: lint all workspace packages that define a lint script

## Local Development

1. Start Docker Desktop.
2. Run `pnpm dev:api` to reuse `pnpm db:up` and then start the API.
3. Run `pnpm --filter @ocr-tutor/api prisma:migrate` the first time you set up the repo and whenever the Prisma schema changes.
4. Run `pnpm dev:worker` to process uploaded submissions in the background.
5. Run `pnpm dev:web` to start the frontend on `http://localhost:3000`.

If you want to start Postgres without the API, use `pnpm db:up`. If Docker Desktop is not running, `pnpm dev:api` will fail before the API starts because `pnpm db:up` cannot reach the Docker daemon.
