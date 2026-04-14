const DEFAULT_API_BASE_URL = "http://localhost:4000";

export function getApiBaseUrl() {
  return (process.env.NEXT_PUBLIC_API_BASE_URL ?? DEFAULT_API_BASE_URL).replace(
    /\/$/,
    "",
  );
}

export function buildApiUrl(path: string) {
  return new URL(path, `${getApiBaseUrl()}/`).toString();
}

function normalizeApiError(error: unknown) {
  if (error instanceof TypeError) {
    return new Error(
      `Could not reach the API at ${getApiBaseUrl()}. Start pnpm dev:api and reload the page.`,
    );
  }

  if (error instanceof Error) {
    return error;
  }

  return new Error("Unexpected API request failure.");
}

async function buildApiError(response: Response) {
  const payload = (await response.json().catch(() => null)) as
    | { error?: string }
    | null;

  return new Error(payload?.error ?? `Request failed with ${response.status}.`);
}

export async function fetchApi(
  path: string,
  init?: RequestInit,
): Promise<Response> {
  try {
    return await fetch(buildApiUrl(path), init);
  } catch (error) {
    throw normalizeApiError(error);
  }
}

export async function readJson<T>(response: Response): Promise<T> {
  if (!response.ok) {
    throw await buildApiError(response);
  }

  return (await response.json()) as T;
}

export async function fetchJson<T>(
  path: string,
  init?: RequestInit,
): Promise<T> {
  const response = await fetchApi(path, init);
  return readJson<T>(response);
}
