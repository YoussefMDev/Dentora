import { Router } from 'express';
import type { HealthResponse } from '@dentora/contracts';

export const healthRouter = Router();

healthRouter.get('/health', (_request, response) => {
  const body: HealthResponse = { status: 'ok' };
  response.status(200).json(body);
});
