import { Request, Response, NextFunction } from "express";
import { ApiError } from "../../errors/ApiErrors";
// import { ApiError } from "../errors/ApiErrors";

export const requireAdmin = (req: Request, _res: Response, next: NextFunction) => {
  if (!req.user) return next(new ApiError(401, "Unauthorized"));
  if (req.user.role !== "admin") return next(new ApiError(403, "Forbidden: Admin only"));
  next();
};