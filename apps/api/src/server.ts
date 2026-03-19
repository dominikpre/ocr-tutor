import { buildApp } from "./app.js";
import { config } from "./config.js";

// Build the fully configured Fastify instance before listening for requests.
const app = await buildApp();

try {
  // Bind on all interfaces so the service is reachable from the local frontend
  // and from Docker/host networking during development.
  await app.listen({
    host: "0.0.0.0",
    port: config.port,
  });
} catch (error) {
  // Surface startup failures through Fastify's logger and exit with a non-zero
  // code so scripts and CI can detect the failure.
  app.log.error(error);
  process.exit(1);
}
