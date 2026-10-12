import type { RequestHandler } from 'express';
import type { ZodObject } from 'zod';
import { ApiError } from './error-handler.js';

/**
 * Validates untrusted JSON without replacing req.body. Route handlers should
 * read the validated value from response.locals['validatedBody'].
 * The top-level object is made strict here. Nested object schemas must also
 * use z.strictObject so unknown nested fields are rejected rather than stripped.
 */
export function validateBody(schema: ZodObject): RequestHandler {
  const strictSchema = schema.strict();
  return (request, response, next) => {
    const result = strictSchema.safeParse(request.body);
    if (!result.success) {
      next(new ApiError(400, 'VALIDATION_ERROR'));
      return;
    }

    response.locals['validatedBody'] = result.data;
    next();
  };
}
