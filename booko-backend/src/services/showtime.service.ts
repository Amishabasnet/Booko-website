import { showtimeRepository } from "../repositories/showtime.repository";
import { ApiError } from "../errors/ApiErrors";

export const showtimeService = {
    async getAllShowtimes(movieId?: string) {
        const filter = movieId ? { movieId } : {};
        return await showtimeRepository.findAll(filter);
    },

    async getShowtimeById(id: string) {
        const showtime = await showtimeRepository.findById(id);
        if (!showtime) throw new ApiError(404, "Showtime not found");
        return showtime;
    },

    async createShowtime(data: any) {
        return await showtimeRepository.create(data);
    },

    async updateShowtime(id: string, data: any) {
        const showtime = await showtimeRepository.updateById(id, data);
        if (!showtime) throw new ApiError(404, "Showtime not found");
        return showtime;
    },

    async deleteShowtime(id: string) {
        const showtime = await showtimeRepository.deleteById(id);
        if (!showtime) throw new ApiError(404, "Showtime not found");
        return showtime;
    },

    async checkSeatAvailability(showtimeId: string, seatsToCheck: string[]) {
        const showtime = await this.getShowtimeById(showtimeId);
        const booked = new Set(showtime.bookedSeats);
        const unavailable = seatsToCheck.filter(seat => booked.has(seat));
        return {
            allAvailable: unavailable.length === 0,
            unavailableSeats: unavailable
        };
    }
};
