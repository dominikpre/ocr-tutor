# OCR Tutor Monorepo

## Layout

- `apps/web`: Next.js frontend
- `apps/api`: Fastify + Prisma backend
- `packages/contracts`: shared TypeScript API contract types
- `infra/ansible`: deployment automation
- `infra/proxy`: reverse proxy configuration

## Workspace

- `pnpm dev:web`: run the frontend
- `pnpm dev:api`: run the backend
- `pnpm build`: build all workspace packages that define a build script
- `pnpm lint`: lint all workspace packages that define a lint script
