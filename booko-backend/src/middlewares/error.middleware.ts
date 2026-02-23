import { Request, Response, NextFunction } from "express";
import { ApiError } from "../errors/ApiErrors";

export function errorMiddleware(err: any, _req: Request, res: Response, _next: NextFunction) {
  const status = err instanceof ApiError ? err.statusCode : 500;

  res.status(status).json({
    success: false,
    message: err.message || "Internal Server Error",
    details: err.details || null,
  });
}