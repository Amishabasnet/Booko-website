import { Router } from "express";
import { requireAuth } from "../../middlewares/auth.middleware";
import { requireAdmin } from "../../middlewares/admin/admin.middleware";
import { upload } from "../../middlewares/upload.middleware";
import { adminUsersController } from "../../controllers/admin/admin.users.controller";


const router = Router();

// all admin routes protected
router.use(requireAuth, requireAdmin);

router.post("/", upload.single("image"), adminUsersController.create);
router.get("/", adminUsersController.getAll);
router.get("/:id", adminUsersController.getById);
router.put("/:id", upload.single("image"), adminUsersController.update);
router.delete("/:id", adminUsersController.remove);

export default router;