import { Router } from "express";
import { paymentController } from "../controllers/payment.controller";
import { requireAuth, authorizeRoles } from "../middlewares/auth.middleware";

const router = Router();

// User payment route
router.post("/:bookingId", requireAuth, paymentController.initiatePayment);

// Admin routes
router.get("/", requireAuth, authorizeRoles(["admin"]), paymentController.getAll);
router.get("/:id", requireAuth, authorizeRoles(["admin"]), paymentController.getById);

export default router;
