import { theaterRepository } from "../repositories/theater.repository";
import { ApiError } from "../errors/ApiErrors";

export const theaterService = {
    async getAllTheaters() {
        return await theaterRepository.findAll();
    },

    async getTheaterById(id: string) {
        const theater = await theaterRepository.findById(id);
        if (!theater) throw new ApiError(404, "Theater not found");
        return theater;
    },

    async createTheater(data: any) {
        return await theaterRepository.create(data);
    },

    async updateTheater(id: string, data: any) {
        const theater = await theaterRepository.updateById(id, data);
        if (!theater) throw new ApiError(404, "Theater not found");
        return theater;
    },

    async deleteTheater(id: string) {
        const theater = await theaterRepository.deleteById(id);
        if (!theater) throw new ApiError(404, "Theater not found");
        return theater;
    },
};
