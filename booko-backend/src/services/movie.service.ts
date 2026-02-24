import { movieRepository } from "../repositories/movie.repository";
import { ApiError } from "../errors/ApiErrors";

export const movieService = {
    async getAllMovies(filters: any = {}) {
        return await movieRepository.findAll(filters);
    },

    async getMovieById(id: string) {
        const movie = await movieRepository.findById(id);
        if (!movie) throw new ApiError(404, "Movie not found");
        return movie;
    },

    async createMovie(data: any) {
        return await movieRepository.create(data);
    },

    async updateMovie(id: string, data: any) {
        const movie = await movieRepository.updateById(id, data);
        if (!movie) throw new ApiError(404, "Movie not found");
        return movie;
    },

    async deleteMovie(id: string) {
        const movie = await movieRepository.deleteById(id);
        if (!movie) throw new ApiError(404, "Movie not found");
        return movie;
    },
};
