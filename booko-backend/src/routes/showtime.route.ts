import { Router } from "express";
import { showtimeController } from "../controllers/showtime.controller";
import { showtimeValidation } from "../validators/showtime.validator";
import { validateRequest } from "../middlewares/express-validator.middleware";
import { requireAuth, authorizeRoles } from "../middlewares/auth.middleware";

const router = Router();

// Public routes
router.get("/", showtimeController.getAll);
router.get("/:id", showtimeController.getById);
router.post("/:id/check-availability", showtimeController.checkAvailability);

// Admin-only routes
router.post(
    "/",
    requireAuth,
    authorizeRoles(["admin"]),
    showtimeValidation,
    validateRequest,
    showtimeController.create
);

router.put(
    "/:id",
    requireAuth,
    authorizeRoles(["admin"]),
    showtimeValidation,
    validateRequest,
    showtimeController.update
);

router.delete(
    "/:id",
    requireAuth,
    authorizeRoles(["admin"]),
    showtimeController.delete
);

export default router;
