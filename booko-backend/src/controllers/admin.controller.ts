import { Request, Response } from "express";
import { adminService } from "../services/admin.service";

export const adminController = {
    async getStats(_req: Request, res: Response) {
        const stats = await adminService.getDashboardStats();
        return res.json({ success: true, stats });
    }
};
