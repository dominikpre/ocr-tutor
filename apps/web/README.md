# OCR Tutor Web

Next.js frontend for the OCR Tutor workspace.

## Workspace Commands

- From the monorepo root: `pnpm dev:web`
- From `apps/web`: `pnpm dev`
- Production build: `pnpm --filter @ocr-tutor/web build`
- Lint: `pnpm --filter @ocr-tutor/web lint`

## Environment

The app reads the backend base URL from `NEXT_PUBLIC_API_BASE_URL`.

## Local Development

1. Start the API from the monorepo root with `pnpm dev:api`.
2. Start the web app with `pnpm dev:web`.
3. Open [http://localhost:3000](http://localhost:3000).

If you prefer working from the package directory, run `pnpm dev` inside `apps/web`.

## Scope

- `/`: recent submissions overview
- `/upload`: upload one or more image files into a collection
- `/submissions`: list stored submissions
- `/submissions/[id]`: submission detail with the stored original image

TODO: extend the scope to include the OCR pipeline and review overlays after the MVP is complete.
Review overlays and corrected-text UI are intentionally not rendered yet; the backend contract remains in place for the upcoming producer.
