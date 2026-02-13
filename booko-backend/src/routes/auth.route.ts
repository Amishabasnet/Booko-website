import { Router } from "express";
import { authController } from "../controllers/authController";
import { validateBody } from "../middlewares/validate.middleware";
import { registerDto, loginDto } from "../dtos/auth.dto";

const router = Router();

router.post("/register", validateBody(registerDto), authController.register);
router.post("/login", validateBody(loginDto), authController.login);
router.post("/logout", authController.logout);

export default router;