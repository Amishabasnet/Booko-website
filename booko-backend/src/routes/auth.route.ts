import { Router } from "express";
import { authController } from "../controllers/authController";
import { validateBody } from "../middlewares/validate";
import { registerDto, loginDto } from "../dtos/auth.dto";

export const authRouter = Router();

authRouter.post("/register", validateBody(registerDto), authController.register);
authRouter.post("/login", validateBody(loginDto), authController.login);
