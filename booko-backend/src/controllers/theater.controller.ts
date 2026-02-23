import { Request, Response } from "express";
import { theaterService } from "../services/theater.service";

export const theaterController = {
    async getAll(req: Request, res: Response) {
        const theaters = await theaterService.getAllTheaters();
        return res.json({ success: true, theaters });
    },

    async getById(req: Request, res: Response) {
        const theater = await theaterService.getTheaterById(req.params.id);
        return res.json({ success: true, theater });
    },

    async create(req: Request, res: Response) {
        const theater = await theaterService.createTheater(req.body);
        return res.status(201).json({ success: true, message: "Theater created successfully", theater });
    },

    async update(req: Request, res: Response) {
        const theater = await theaterService.updateTheater(req.params.id, req.body);
        return res.json({ success: true, message: "Theater updated successfully", theater });
    },

    async delete(req: Request, res: Response) {
        await theaterService.deleteTheater(req.params.id);
        return res.json({ success: true, message: "Theater deleted successfully" });
    },
};
