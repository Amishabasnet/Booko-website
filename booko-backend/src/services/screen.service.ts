import { screenRepository } from "../repositories/screen.repository";
import { ApiError } from "../errors/ApiErrors";

export const screenService = {
    async getScreensByTheater(theaterId: string) {
        return await screenRepository.findByTheaterId(theaterId);
    },

    async getScreenById(id: string) {
        const screen = await screenRepository.findById(id);
        if (!screen) throw new ApiError(404, "Screen not found");
        return screen;
    },

    async createScreen(data: any) {
        return await screenRepository.create(data);
    },

    async updateScreen(id: string, data: any) {
        const screen = await screenRepository.updateById(id, data);
        if (!screen) throw new ApiError(404, "Screen not found");
        return screen;
    },

    async deleteScreen(id: string) {
        const screen = await screenRepository.deleteById(id);
        if (!screen) throw new ApiError(404, "Screen not found");
        return screen;
    },
};
