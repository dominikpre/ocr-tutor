import type { ApiResponse } from "@/lib/types/api";

const DEFAULT_LATENCY_MS = 240;

function wait(ms: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

export async function mockApi<T>(
  factory: () => T | Promise<T>,
  latencyMs = DEFAULT_LATENCY_MS,
): Promise<ApiResponse<T>> {
  const startedAt = Date.now();

  await wait(latencyMs);

  return {
    data: await factory(),
    meta: {
      mock: true,
      requestedAt: new Date().toISOString(),
      latencyMs: Date.now() - startedAt,
    },
  };
}
