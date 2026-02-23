import { Router } from "express";
import { movieController } from "../controllers/movie.controller";
import { movieValidation } from "../validators/movie.validator";
import { validateRequest } from "../middlewares/express-validator.middleware";
import { requireAuth, authorizeRoles } from "../middlewares/auth.middleware";

const router = Router();

// Public routes
router.get("/", movieController.getAll);
router.get("/:id", movieController.getById);

// Admin-only routes
router.post(
    "/",
    requireAuth,
    authorizeRoles(["admin"]),
    movieValidation,
    validateRequest,
    movieController.create
);

router.put(
    "/:id",
    requireAuth,
    authorizeRoles(["admin"]),
    movieValidation,
    validateRequest,
    movieController.update
);

router.delete(
    "/:id",
    requireAuth,
    authorizeRoles(["admin"]),
    movieController.delete
);

export default router;
