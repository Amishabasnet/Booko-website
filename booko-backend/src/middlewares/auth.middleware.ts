import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { ENV } from "../config/env";
import { ApiError } from "../errors/ApiErrors";
import { JwtPayloadUser } from "../types/auth.types";

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayloadUser;
    }
  }
}

export const requireAuth = (req: Request, _res: Response, next: NextFunction) => {
  const token =
    req.cookies?.token ||
    (req.headers.authorization?.startsWith("Bearer ")
      ? req.headers.authorization.split(" ")[1]
      : null);

  if (!token) return next(new ApiError(401, "Unauthorized: token missing"));

  try {
    const payload = jwt.verify(token, ENV.JWT_SECRET) as JwtPayloadUser;
    req.user = payload;
    next();
  } catch {
    return next(new ApiError(401, "Unauthorized: invalid token"));
  }
};

export const authorizeRoles = (roles: string[]) => {
  return (req: Request, _res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(new ApiError(401, "Unauthorized: user not authenticated"));
    }

    if (!roles.includes(req.user.role)) {
      return next(new ApiError(403, "Forbidden: insufficient permissions"));
    }

    next();
  };
};