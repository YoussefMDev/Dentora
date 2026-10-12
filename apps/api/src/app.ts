import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import { errorHandler } from './middleware/error-handler.js';
import { healthRouter } from './routes/health.js';

export interface AppOptions {
  webOrigin: string;
}

export function createApp({ webOrigin }: AppOptions) {
  const app = express();

  app.disable('x-powered-by');
  app.use(helmet());
  app.use(
    cors({
      origin: (requestOrigin, callback) => {
        callback(null, requestOrigin === webOrigin ? requestOrigin : false);
      },
      credentials: false,
      methods: ['GET', 'HEAD', 'OPTIONS'],
      optionsSuccessStatus: 204,
    }),
  );
  app.use(express.json({ limit: '16kb', strict: true }));
  app.use('/api', healthRouter);
  app.use((_request, response) => {
    response.status(404).json({
      error: { code: 'NOT_FOUND', message: 'The requested resource was not found.' },
    });
  });
  app.use(errorHandler);

  return app;
}
