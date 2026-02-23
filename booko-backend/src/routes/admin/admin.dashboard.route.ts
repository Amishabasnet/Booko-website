import { Router } from "express";
import { adminController } from "../../controllers/admin.controller";
import { requireAuth } from "../../middlewares/auth.middleware";
import { requireAdmin } from "../../middlewares/admin/admin.middleware";

const router = Router();

router.get("/stats", requireAuth, requireAdmin, adminController.getStats);

export default router;
