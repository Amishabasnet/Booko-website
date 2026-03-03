import { showtimeRepository } from "../repositories/showtime.repository";
import { ShowtimeModel } from "../models/showtime.model";
import { ApiError } from "../errors/ApiErrors";
import mongoose from "mongoose";

export const showtimeService = {
    async getAllShowtimes(movieId?: string) {
        const filter = movieId ? { movieId } : {};
        const showtimes = await showtimeRepository.findAll(filter);

        // Enrich all showtimes with screen details
        return await Promise.all(showtimes.map(async (s: any) => {
            const showtimeObj = s.toObject();
            showtimeObj.screenId = await this.resolveScreenDetails(showtimeObj.screenId);
            return showtimeObj;
        }));
    },

    async getShowtimeById(id: string) {
        const showtime = await showtimeRepository.findById(id);
        if (!showtime) throw new ApiError(404, "Showtime not found");

        const showtimeObj = showtime.toObject();
        showtimeObj.screenId = await this.resolveScreenDetails(showtimeObj.screenId);
        return showtimeObj;
    },

    async resolveScreenDetails(screenIdOrObj: any) {
        // If it's already an object with seatLayout, return it
        if (screenIdOrObj && typeof screenIdOrObj === 'object' && screenIdOrObj.seatLayout) {
            return screenIdOrObj;
        }

        const screenId = typeof screenIdOrObj === 'string' ? screenIdOrObj : screenIdOrObj?._id?.toString();

        if (screenId) {
            // Try to find in database if it looks like an ObjectId
            if (mongoose.Types.ObjectId.isValid(screenId)) {
                const screenModel = await mongoose.model("Screen").findById(screenId);
                if (screenModel) return screenModel.toObject();
            }

            // Fallback for custom labels (AUD1, etc.)
            return {
                _id: screenId,
                screenName: screenId,
                seatLayout: Array(8).fill(null).map((_, r) => {
                    return Array(10).fill(null).map((_, c) => ({
                        row: String.fromCharCode(65 + r),
                        col: c + 1,
                        type: "normal",
                        isAvailable: true
                    }));
                })
            };
        }
        return screenIdOrObj;
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

        const screen = await this.resolveScreenDetails(showtime.screenId);
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
