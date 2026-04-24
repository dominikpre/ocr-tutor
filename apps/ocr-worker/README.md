# OCR Tutor OCR Worker

Background worker that claims uploaded submissions from Postgres, loads image
bytes from storage, runs OCR through Ollama, normalizes extracted overlay
geometry, and persists `correctedText`, `overlays`, and retry/status metadata
(`ocrLastError`, `nextOcrAttemptAt`, `processedAt`, `status`).

## Scripts

- `pnpm dev`: start the worker in watch mode
- `pnpm build`: compile TypeScript into `dist/`
- `pnpm start`: run the compiled worker

## Environment

The worker supports endpoint-style Ollama routing through `OLLAMA_BASE_URL`.
The value may be either:

- Full URL, e.g. `https://ollama.internal`
- Host/IP with optional port, e.g. `10.10.40.23:11434`

The worker normalizes host/IP values to `http://...` automatically.

Storage is abstracted behind `SUBMISSION_STORAGE_DRIVER`. Today only `local` is
implemented, but `storagePath` is treated as an opaque storage key so future
object-storage migration only requires a new adapter.

Retries are automatic and bounded by `OCR_MAX_ATTEMPTS`. Failed attempts are
requeued after `OCR_RETRY_DELAY_MS`, then marked `failed` when the max attempt
count is reached.
