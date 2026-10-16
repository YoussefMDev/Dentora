import { safeWriteLog, writeLog } from "./request-context.js";
export class ApiError extends Error {
  statusCode;
  code;
  constructor(statusCode, code) {
    super(code);
    this.statusCode = statusCode;
    this.code = code;
    this.name = "ApiError";
  }
}
export class RateLimitStoreUnavailableError extends Error {
  constructor() {
    super("Rate limit store unavailable.");
    this.name = "RateLimitStoreUnavailableError";
  }
}
export function createErrorHandler(log = writeLog) {
  return (error, _request, response, next) => {
    void next;
    const candidate = error;
    let statusCode = 500;
    let errorCode = "INTERNAL_ERROR";
    let responseCode = "INTERNAL_ERROR";
    if (error instanceof ApiError) {
      statusCode = error.statusCode;
      errorCode = error.code;
      responseCode = error.code;
    } else if (error instanceof RateLimitStoreUnavailableError) {
      statusCode = 503;
      errorCode = "RATE_LIMIT_STORE_UNAVAILABLE";
      responseCode = "SERVICE_UNAVAILABLE";
    } else if (candidate.type === "entity.too.large") {
      statusCode = 413;
      errorCode = "PAYLOAD_TOO_LARGE";
      responseCode = errorCode;
    } else if (candidate.type === "entity.parse.failed") {
      statusCode = 400;
      errorCode = "BAD_REQUEST";
      responseCode = errorCode;
    }
    const requestId = response.locals?.["requestId"];
    if (typeof requestId === "string") {
      safeWriteLog(log, {
        event: "api_error",
        requestId,
        statusCode,
        errorCode,
      });
    }
    response.status(statusCode).json({
      error: {
        code: responseCode,
        message: "Request could not be processed.",
      },
    });
  };
}
export const errorHandler = createErrorHandler();
