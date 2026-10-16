import cors from "cors";
import express from "express";
import helmet from "helmet";
import { createErrorHandler } from "./middleware/error-handler.js";
import { requestContext, writeLog } from "./middleware/request-context.js";
import { healthRouter } from "./routes/health.js";
export function createApp({ webOrigin, log = writeLog }) {
  const app = express();
  app.disable("x-powered-by");
  app.use(requestContext(log));
  app.use(helmet());
  app.use(
    cors({
      origin: (requestOrigin, callback) => {
        callback(null, requestOrigin === webOrigin ? requestOrigin : false);
      },
      credentials: false,
      methods: ["GET", "HEAD", "OPTIONS"],
      optionsSuccessStatus: 204,
    }),
  );
  app.use(express.json({ limit: "16kb", strict: true }));
  app.use("/api", healthRouter);
  app.use((_request, response) => {
    response.status(404).json({
      error: {
        code: "NOT_FOUND",
        message: "The requested resource was not found.",
      },
    });
  });
  app.use(createErrorHandler(log));
  return app;
}
