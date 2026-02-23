import { Request, Response } from "express";
import { screenService } from "../services/screen.service";

export const screenController = {
    async getByTheater(req: Request, res: Response) {
        const screens = await screenService.getScreensByTheater(req.params.theaterId);
        return res.json({ success: true, screens });
    },

    async create(req: Request, res: Response) {
        const screen = await screenService.createScreen(req.body);
        return res.status(201).json({ success: true, message: "Screen created successfully", screen });
    },

    async update(req: Request, res: Response) {
        const screen = await screenService.updateScreen(req.params.id, req.body);
        return res.json({ success: true, message: "Screen updated successfully", screen });
    },

    async delete(req: Request, res: Response) {
        await screenService.deleteScreen(req.params.id);
        return res.json({ success: true, message: "Screen deleted successfully" });
    },
};
