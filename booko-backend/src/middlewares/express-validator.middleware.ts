// src/middlewares/express-validator.middleware.ts
import { Request, Response, NextFunction } from "express";
import { validationResult } from "express-validator";
import { ApiError } from "../errors/ApiErrors";

export const validateRequest = (req: Request, _res: Response, next: NextFunction) => {
    // Normalize gender before validating
    if (req.body.gender && typeof req.body.gender === "string") {
        req.body.gender = req.body.gender.toLowerCase();
    }

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const firstError = errors.array()[0].msg;
        return next(new ApiError(400, firstError, errors.array()));
    }
    next();
};