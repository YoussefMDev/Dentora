import { loadConfig } from "./config.js";
import { startApi } from "./lifecycle.js";
async function main() {
  const config = loadConfig();
  const runtime = await startApi(config);
  process.stdout.write(`Dentora API listening on 127.0.0.1:${config.port}\n`);
  let shuttingDown = false;
  const shutdown = (signal) => {
    if (shuttingDown) return;
    shuttingDown = true;
    process.stdout.write(`Received ${signal}; shutting down Dentora API.\n`);
    void runtime.shutdown().then(
      () => {
        process.exitCode = 0;
      },
      () => {
        process.stderr.write("Dentora API shutdown encountered an error.\n");
        process.exitCode = 1;
      },
    );
  };
  process.once("SIGINT", shutdown);
  process.once("SIGTERM", shutdown);
}
void main().catch((error) => {
  const safeMessage =
    error instanceof Error &&
    [
      "NODE_ENV must be development, test, or production.",
      "API_PORT must be a valid TCP port.",
      "WEB_ORIGIN must be configured in production.",
      "WEB_ORIGIN must be an exact http(s) origin.",
      "WEB_ORIGIN must be an exact http(s) origin without a path.",
      "WEB_ORIGIN must use HTTPS in production.",
      "MONGODB_URI must be configured outside the test environment.",
      "MONGODB_URI must be a valid MongoDB connection string.",
      "Dentora API could not start. Check required configuration and MongoDB connectivity.",
    ].includes(error.message)
      ? error.message
      : "Dentora API could not start. Check required configuration and MongoDB connectivity.";
  process.stderr.write(`${safeMessage}\n`);
  process.exitCode = 1;
});
