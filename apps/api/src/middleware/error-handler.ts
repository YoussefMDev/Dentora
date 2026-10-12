import type { ErrorRequestHandler } from 'express';

export const errorHandler: ErrorRequestHandler = (error, _request, response, next) => {
  void next;
  const candidate = error as { type?: string };
  if (candidate.type === 'entity.too.large') {
    response.status(413).json({
      error: { code: 'PAYLOAD_TOO_LARGE', message: 'Request could not be processed.' },
    });
    return;
  }

  if (candidate.type === 'entity.parse.failed') {
    response.status(400).json({
      error: { code: 'BAD_REQUEST', message: 'Request could not be processed.' },
    });
    return;
  }

  response.status(500).json({
    error: { code: 'INTERNAL_ERROR', message: 'Request could not be processed.' },
  });
};
