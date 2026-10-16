import { randomUUID } from "node:crypto";
export const writeLog = (record) => {
  process.stdout.write(`${JSON.stringify(record)}\n`);
};
export function safeWriteLog(log, record) {
  try {
    log(record);
  } catch {
    // Logging failures must not disrupt request handling or expose log errors.
  }
}
export function requestContext(log = writeLog) {
  return (request, response, next) => {
    const requestId = randomUUID();
    const startedAt = performance.now();
    response.locals["requestId"] = requestId;
    response.setHeader("X-Request-Id", requestId);
    response.on("finish", () => {
      safeWriteLog(log, {
        event: "http_request",
        requestId,
        method: request.method,
        statusCode: response.statusCode,
        durationMs: Math.max(0, Math.round(performance.now() - startedAt)),
      });
    });
    next();
  };
}
