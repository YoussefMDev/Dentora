import type { Request, Response } from 'express';
import { describe, expect, it, vi } from 'vitest';
import { errorHandler } from '../src/middleware/error-handler.js';

describe('error handler', () => {
  it('does not return unexpected error details to the client', () => {
    const json = vi.fn();
    const status = vi.fn().mockReturnValue({ json });
    const response = { status, json } as unknown as Response;

    errorHandler(
      new Error('sensitive database connection string'),
      {} as Request,
      response,
      vi.fn(),
    );

    expect(status).toHaveBeenCalledWith(500);
    expect(json).toHaveBeenCalledWith({
      error: { code: 'INTERNAL_ERROR', message: 'Request could not be processed.' },
    });
    expect(JSON.stringify(json.mock.calls)).not.toContain('sensitive');
  });
});
