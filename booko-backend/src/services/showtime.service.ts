import { showtimeRepository } from "../repositories/showtime.repository";
import { ShowtimeModel } from "../models/showtime.model";
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
    },

    async getAvailableSeats(showtimeId: string) {
        const showtime = await ShowtimeModel.findById(showtimeId).populate("screenId");
        if (!showtime) throw new ApiError(404, "Showtime not found");

        const screen = showtime.screenId as any; // Populated screen
        const booked = new Set(showtime.bookedSeats);
        const availableSeats: string[] = [];

        if (screen && screen.seatLayout) {
            screen.seatLayout.forEach((row: any[]) => {
                row.forEach((seat: any) => {
                    const seatId = `${seat.row}-${seat.col}`;
                    if (!booked.has(seatId)) {
                        availableSeats.push(seatId);
                    }
                });
            });
        }

        return {
            showtimeId,
            bookedSeats: showtime.bookedSeats,
            availableSeats,
            totalAvailable: availableSeats.length
        };
    }
};
