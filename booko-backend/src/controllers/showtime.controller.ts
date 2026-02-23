import { Request, Response } from "express";
import { showtimeService } from "../services/showtime.service";

export const showtimeController = {
    async getAll(req: Request, res: Response) {
        const movieId = req.query.movieId as string;
        const showtimes = await showtimeService.getAllShowtimes(movieId);
        return res.json({ success: true, showtimes });
    },

    async getById(req: Request, res: Response) {
        const showtime = await showtimeService.getShowtimeById(req.params.id);
        return res.json({ success: true, showtime });
    },

    async create(req: Request, res: Response) {
        const showtime = await showtimeService.createShowtime(req.body);
        return res.status(201).json({ success: true, message: "Showtime created successfully", showtime });
    },

    async update(req: Request, res: Response) {
        const showtime = await showtimeService.updateShowtime(req.params.id, req.body);
        return res.json({ success: true, message: "Showtime updated successfully", showtime });
    },

    async delete(req: Request, res: Response) {
        await showtimeService.deleteShowtime(req.params.id);
        return res.json({ success: true, message: "Showtime deleted successfully" });
    },

    async checkAvailability(req: Request, res: Response) {
        const { seats } = req.body;
        const result = await showtimeService.checkSeatAvailability(req.params.id, seats);
        return res.json({ success: true, ...result });
    }
};
