import { prisma } from "./prisma.js";
import { runWorker } from "./worker.js";

let stopRequested = false;
let shutdownSignal: NodeJS.Signals | null = null;

const shutdownHandler = (signal: NodeJS.Signals) => {
  if (stopRequested) {
    return;
  }

  stopRequested = true;
  shutdownSignal = signal;
  console.info(`[ocr-worker] Received ${signal}. Finishing in-flight work...`);
};

process.on("SIGINT", shutdownHandler);
process.on("SIGTERM", shutdownHandler);

try {
  await runWorker(() => stopRequested);
} catch (error) {
  const message =
    error instanceof Error ? error.message : "Unexpected worker crash.";
  console.error(`[ocr-worker] Fatal error: ${message}`);
  process.exitCode = 1;
} finally {
  await prisma.$disconnect();

  if (shutdownSignal) {
    console.info(`[ocr-worker] Prisma disconnected after ${shutdownSignal}.`);
  }
}
