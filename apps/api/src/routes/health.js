import { Router } from "express";
import { healthResponseSchema } from "@dentora/contracts";
export const healthRouter = Router();
healthRouter.get("/health", (_request, response) => {
  const body = healthResponseSchema.parse({ status: "ok" });
  response.status(200).json(body);
});
