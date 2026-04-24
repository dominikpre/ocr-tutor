import type { SubmissionOverlay } from "@ocr-tutor/contracts";

import { config } from "./config.js";

type OcrResult = {
  correctedText: string;
  overlays: SubmissionOverlay[];
  rawResponse: string;
};

type OllamaGenerateResponse = {
  error?: string;
  response?: string;
};

export class OcrOutputParseError extends Error {
  rawResponse: string;

  constructor(message: string, rawResponse: string) {
    super(message);
    this.rawResponse = rawResponse;
  }
}

function asNumber(value: unknown): number | null {
  if (typeof value !== "number" || !Number.isFinite(value)) {
    return null;
  }

  return value;
}

function normalizeCoordinate(value: number, dimensionLimit: number) {
  // Allow normalized coordinates in range [0, 1] and map them to pixels.
  if (value >= 0 && value <= 1) {
    return Math.round(value * dimensionLimit);
  }

  return Math.round(value);
}

function sanitizeOverlay(
  candidate: unknown,
  index: number,
  imageWidth: number,
  imageHeight: number,
): SubmissionOverlay | null {
  if (typeof candidate !== "object" || candidate === null) {
    return null;
  }

  const maybeOverlay = candidate as {
    bounds?: {
      height?: unknown;
      width?: unknown;
      x?: unknown;
      y?: unknown;
    };
    comment?: unknown;
    id?: unknown;
    label?: unknown;
  };

  const x = asNumber(maybeOverlay.bounds?.x);
  const y = asNumber(maybeOverlay.bounds?.y);
  const width = asNumber(maybeOverlay.bounds?.width);
  const height = asNumber(maybeOverlay.bounds?.height);

  if (x === null || y === null || width === null || height === null) {
    return null;
  }

  if (width <= 0 || height <= 0) {
    return null;
  }

  const normalizedX = normalizeCoordinate(x, imageWidth);
  const normalizedY = normalizeCoordinate(y, imageHeight);
  const normalizedWidth = normalizeCoordinate(width, imageWidth);
  const normalizedHeight = normalizeCoordinate(height, imageHeight);

  if (
    normalizedX < 0 ||
    normalizedY < 0 ||
    normalizedWidth <= 0 ||
    normalizedHeight <= 0
  ) {
    return null;
  }

  return {
    bounds: {
      height: normalizedHeight,
      width: normalizedWidth,
      x: normalizedX,
      y: normalizedY,
    },
    comment:
      typeof maybeOverlay.comment === "string"
        ? maybeOverlay.comment.trim() || undefined
        : undefined,
    id:
      typeof maybeOverlay.id === "string" && maybeOverlay.id.trim().length > 0
        ? maybeOverlay.id.trim()
        : `overlay-${index + 1}`,
    label:
      typeof maybeOverlay.label === "string" && maybeOverlay.label.trim().length > 0
        ? maybeOverlay.label.trim()
        : "OCR note",
  };
}

function parseOcrResult(
  rawResponse: string,
  imageWidth: number,
  imageHeight: number,
): OcrResult {
  let parsed: unknown;

  try {
    parsed = JSON.parse(rawResponse);
  } catch {
    throw new OcrOutputParseError(
      `Ollama response was not valid JSON: "${rawResponse}".`,
      rawResponse,
    );
  }

  if (typeof parsed !== "object" || parsed === null) {
    throw new OcrOutputParseError(
      "Ollama response JSON must be an object.",
      rawResponse,
    );
  }

  const result = parsed as {
    correctedText?: unknown;
    overlays?: unknown;
  };

  const correctedText =
    typeof result.correctedText === "string" ? result.correctedText.trim() : "";

  const overlays = Array.isArray(result.overlays)
    ? result.overlays
        .map((overlay, index) =>
          sanitizeOverlay(overlay, index, imageWidth, imageHeight),
        )
        .filter((overlay): overlay is SubmissionOverlay => overlay !== null)
    : [];

  return {
    correctedText,
    overlays,
    rawResponse,
  };
}

function buildPrompt(imageWidth: number, imageHeight: number) {
  return [
    "You are an OCR extraction service for handwritten tutoring submissions.",
    "Read the image and return strict JSON only.",
    "Required JSON shape:",
    '{"correctedText":"string","overlays":[{"id":"string","label":"string","bounds":{"x":0,"y":0,"width":0,"height":0},"comment":"optional"}]}',
    `Image dimensions: width=${imageWidth}, height=${imageHeight}.`,
    "Rules:",
    "- correctedText: best-effort transcription preserving line breaks.",
    '- overlays: use [] if uncertain. If provided, bounds can be pixel values or normalized [0,1].',
    "- Do not output markdown.",
    "- Do not output keys other than correctedText and overlays.",
  ].join("\n");
}

export async function extractOcrFromImage(
  imageBytes: Buffer,
  imageWidth: number,
  imageHeight: number,
): Promise<OcrResult> {
  const requestBody = {
    format: "json",
    images: [imageBytes.toString("base64")],
    model: config.ollamaModel,
    options: {
      temperature: 0,
    },
    prompt: buildPrompt(imageWidth, imageHeight),
    stream: false,
  };

  const controller = new AbortController();
  const timeout = setTimeout(() => {
    controller.abort();
  }, config.ollamaRequestTimeoutMs);

  let response: Response;

  try {
    response = await fetch(new URL("/api/generate", config.ollamaBaseUrl), {
      body: JSON.stringify(requestBody),
      headers: {
        "Content-Type": "application/json",
        ...(config.ollamaApiKey
          ? { Authorization: `Bearer ${config.ollamaApiKey}` }
          : {}),
      },
      method: "POST",
      signal: controller.signal,
    });
  } finally {
    clearTimeout(timeout);
  }

  if (!response.ok) {
    const responseBody = await response.text();
    throw new Error(
      `Ollama request failed with ${response.status}: ${responseBody || "empty body"}.`,
    );
  }

  const payload = (await response.json()) as OllamaGenerateResponse;

  if (payload.error) {
    throw new Error(`Ollama error: ${payload.error}`);
  }

  if (!payload.response || payload.response.trim().length === 0) {
    throw new Error("Ollama response did not include OCR output.");
  }

  return parseOcrResult(payload.response, imageWidth, imageHeight);
}
