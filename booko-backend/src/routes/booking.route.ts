import { Router } from "express";
import { bookingController } from "../controllers/booking.controller";
import { createBookingValidation, updateBookingStatusValidation } from "../validators/booking.validator";
import { validateRequest } from "../middlewares/express-validator.middleware";
import { requireAuth, authorizeRoles } from "../middlewares/auth.middleware";

const router = Router();

// Protect all booking routes
router.use(requireAuth);

// User routes
router.post("/", createBookingValidation, validateRequest, bookingController.create);
router.get("/user", bookingController.getByUser);
router.get("/:id", bookingController.getById);
router.put("/:id/status", updateBookingStatusValidation, validateRequest, bookingController.updateStatus);

// Admin routes
router.get("/", authorizeRoles(["admin"]), bookingController.getAll);

export default router;
