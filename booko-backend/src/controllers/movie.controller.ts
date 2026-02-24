import { Request, Response } from "express";
import { movieService } from "../services/movie.service";

export const movieController = {
    async getAll(req: Request, res: Response) {
        const { search, genre, date } = req.query;
        const movies = await movieService.getAllMovies({ search, genre, date });
        return res.json({ success: true, movies });
    },

    async getById(req: Request, res: Response) {
        const movie = await movieService.getMovieById(req.params.id);
        return res.json({ success: true, movie });
    },

    async create(req: Request, res: Response) {
        const movie = await movieService.createMovie(req.body);
        return res.status(201).json({ success: true, message: "Movie created successfully", movie });
    },

    async update(req: Request, res: Response) {
        const movie = await movieService.updateMovie(req.params.id, req.body);
        return res.json({ success: true, message: "Movie updated successfully", movie });
    },

    async delete(req: Request, res: Response) {
        await movieService.deleteMovie(req.params.id);
        return res.json({ success: true, message: "Movie deleted successfully" });
    },
};
