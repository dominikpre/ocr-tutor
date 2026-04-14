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

type ApiFetchOptions = RequestInit & {
  allowNotFound?: boolean;
};

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

export function apiFetch<T>(
  path: string,
  options: ApiFetchOptions & { allowNotFound: true },
): Promise<T | null>;
export function apiFetch<T>(path: string, options?: ApiFetchOptions): Promise<T>;

export async function apiFetch<T>(
  path: string,
  options: ApiFetchOptions = {},
): Promise<T | null> {
  const { allowNotFound = false, ...init } = options;
  let response: Response;

  try {
    response = await fetch(buildApiUrl(path), init);
  } catch (error) {
    throw normalizeApiError(error);
  }

  if (allowNotFound && response.status === 404) {
    return null;
  }

  if (!response.ok) {
    const payload = (await response.json().catch(() => null)) as
      | { error?: string }
      | null;

    throw new Error(payload?.error ?? `Request failed with ${response.status}.`);
  }

  return (await response.json()) as T;
}
