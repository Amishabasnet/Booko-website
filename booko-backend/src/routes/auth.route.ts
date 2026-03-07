import { Router } from "express";
import { authController } from "../controllers/auth.controller";
import { registerValidation, loginValidation } from "../validators/auth.validator";
import { validateRequest } from "../middlewares/express-validator.middleware";
import { requireAuth, authorizeRoles } from "../middlewares/auth.middleware";

// New middleware to normalize gender
import { Request, Response, NextFunction } from "express";

const normalizeGender = (req: Request, _res: Response, next: NextFunction) => {
  if (req.body.gender && typeof req.body.gender === "string") {
    req.body.gender = req.body.gender.toLowerCase(); // normalize to lowercase
  }
  next();
};

const router = Router();

// Registration route with gender normalization before validation
router.post(
  "/register",
  normalizeGender,     
  registerValidation,
  validateRequest,
  authController.register
);

router.post("/login", loginValidation, validateRequest, authController.login);
router.post("/logout", authController.logout);

router.get("/profile", requireAuth, authController.getProfile);
router.put("/profile", requireAuth, authController.updateProfile);

export default router;