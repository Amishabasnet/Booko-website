import { ZodAny } from "zod";
import { Request, Response, NextFunction } from "express";

export const validateBody =
  (schema: ZodAny) => (req: Request, _res: Response, next: NextFunction) => {
    const parsed = schema.safeParse(req.body);
    if (!parsed.success) {
      return next({
        status: 400,
        message: "Validation error",
        details: parsed.error.flatten(),
      });
    }
    req.body = parsed.data;
    next();
  };
