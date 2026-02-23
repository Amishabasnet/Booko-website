import { Router } from "express";
import { theaterController } from "../controllers/theater.controller";
import { theaterValidation } from "../validators/theater.validator";
import { validateRequest } from "../middlewares/express-validator.middleware";
import { requireAuth, authorizeRoles } from "../middlewares/auth.middleware";

const router = Router();

// Public route
router.get("/", theaterController.getAll);

// Admin-only routes
router.post(
    "/",
    requireAuth,
    authorizeRoles(["admin"]),
    theaterValidation,
    validateRequest,
    theaterController.create
);

router.put(
    "/:id",
    requireAuth,
    authorizeRoles(["admin"]),
    theaterValidation,
    validateRequest,
    theaterController.update
);

router.delete(
    "/:id",
    requireAuth,
    authorizeRoles(["admin"]),
    theaterController.delete
);

export default router;
