# ocr-tutor-service

Minimal Fastify + Prisma service for the OCR Tutor MVP.

## Scripts

- `pnpm dev`: start the API in watch mode
- `pnpm build`: compile TypeScript into `dist/`
- `pnpm start`: run the compiled service
- `pnpm db:up`: start local Postgres via Docker Compose
- `pnpm db:down`: stop local Postgres
- `pnpm prisma:migrate`: run pending Prisma migrations

## Environment

The service reads configuration from `.env`. The committed `.env.example`
contains the default local development values.

## API

- `POST /api/submissions`: multipart upload with `collectionName` and one or more `files`
- `GET /api/collections`: list collection names
- `GET /api/submissions`: list submissions
- `GET /api/submissions/:id`: fetch submission detail
- `GET /uploads/*`: serve stored images
