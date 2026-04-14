# OCR Tutor API

Minimal Fastify + Prisma API for the OCR Tutor MVP.

## Scripts

- `pnpm dev`: start the API in watch mode
- `pnpm build`: compile TypeScript into `dist/`
- `pnpm start`: run the compiled service
- `pnpm db:up`: start local Postgres via Docker Compose
- `pnpm db:down`: stop local Postgres
- `pnpm prisma:migrate`: run pending Prisma migrations

## Environment

The service reads configuration from environment variables. A `.env` file is
optional for local convenience only.

If no environment variables are present, the service falls back to the local
development defaults documented in `.env.example`, including the Postgres
connection string that matches `compose.yaml`.

The Prisma scripts use the same local Postgres default when `DATABASE_URL` is
unset.

## API

- `POST /api/submissions`: multipart upload with `collectionName` and one or more `files`
- `GET /api/collections`: list collection names
- `GET /api/submissions`: list submissions
- `GET /api/submissions/:id`: fetch submission detail
- `GET /uploads/*`: serve stored images
