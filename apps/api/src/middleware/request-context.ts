import { randomUUID } from 'node:crypto';
import type { RequestHandler } from 'express';

export type SafeLogRecord =
  | {
      event: 'http_request';
      requestId: string;
      method: string;
      statusCode: number;
      durationMs: number;
    }
  | {
      event: 'api_error';
      requestId: string;
      statusCode: number;
      errorCode: string;
    }
  | {
      event: 'rate_limit_store_failure';
      policy: string;
    }
  | {
      event: 'rate_limit_library_error' | 'rate_limit_configuration_warning';
      policy: string;
    };

export type LogSink = (record: SafeLogRecord) => void;

export const writeLog: LogSink = (record) => {
  process.stdout.write(`${JSON.stringify(record)}\n`);
};

export function safeWriteLog(log: LogSink, record: SafeLogRecord): void {
  try {
    log(record);
  } catch {
    // Logging failures must not disrupt request handling or expose log errors.
  }
}

export function requestContext(log: LogSink = writeLog): RequestHandler {
  return (request, response, next) => {
    const requestId = randomUUID();
    const startedAt = performance.now();
    response.locals['requestId'] = requestId;
    response.setHeader('X-Request-Id', requestId);

    response.on('finish', () => {
      safeWriteLog(log, {
        event: 'http_request',
        requestId,
        method: request.method,
        statusCode: response.statusCode,
        durationMs: Math.max(0, Math.round(performance.now() - startedAt)),
      });
    });

    next();
  };
}
