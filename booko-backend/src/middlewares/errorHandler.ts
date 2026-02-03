import { Request, Response, NextFunction } from "express";
import { HttpError } from "../errors/http-error";

export function errorHandler(err: any, _req: Request, res: Response, _next: NextFunction) {
  if (err instanceof HttpError) {
    return res.status(err.status).json({ ok: false, message: err.message, details: err.details });
  }

  if (err?.status) {
    return res.status(err.status).json({
      ok: false,
      message: err.message || "Error",
      details: err.details,
    });
  }

  // Mongoose duplicate email fallback
  if (err?.code === 11000) {
    return res.status(409).json({ ok: false, message: "Email already in use" });
  }

  console.error("Unhandled error:", err);
  return res.status(500).json({ ok: false, message: "Internal server error" });
}
