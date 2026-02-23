import { Router } from "express";
import { screenController } from "../controllers/screen.controller";
import { screenValidation } from "../validators/screen.validator";
import { validateRequest } from "../middlewares/express-validator.middleware";
import { requireAuth, authorizeRoles } from "../middlewares/auth.middleware";

const router = Router();

// Public route: Get all screens for a specific theater
router.get("/:theaterId", screenController.getByTheater);

// Admin-only routes
router.post(
    "/",
    requireAuth,
    authorizeRoles(["admin"]),
    screenValidation,
    validateRequest,
    screenController.create
);

router.put(
    "/:id",
    requireAuth,
    authorizeRoles(["admin"]),
    screenValidation,
    validateRequest,
    screenController.update
);

router.delete(
    "/:id",
    requireAuth,
    authorizeRoles(["admin"]),
    screenController.delete
);

export default router;
