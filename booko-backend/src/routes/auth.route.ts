import { Router } from "express";
import { authController } from "../controllers/authController";
import { registerValidation, loginValidation } from "../validators/auth.validator";
import { validateRequest } from "../middlewares/express-validator.middleware";
import { requireAuth, authorizeRoles } from "../middlewares/auth.middleware";

const router = Router();

router.post("/register", registerValidation, validateRequest, authController.register);
router.post("/login", loginValidation, validateRequest, authController.login);
router.post("/logout", authController.logout);

export default router;
