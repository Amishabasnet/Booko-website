import { bookingRepository } from "../repositories/booking.repository";
import { ShowtimeModel } from "../models/showtime.model";
import { showtimeService } from "./showtime.service";
import { ApiError } from "../errors/ApiErrors";

export const bookingService = {
    async createBooking(userId: string, data: any) {
        const { showtimeId, selectedSeats } = data;

        // 1. Fetch showtime to get ticket price
        const showtime = await showtimeService.getShowtimeById(showtimeId);

        // 2. Atomic update: Add seats to bookedSeats ONLY IF none of them are already booked
        // We use $nin to ensure none of the selectedSeats are currently in bookedSeats
        const updatedShowtime = await ShowtimeModel.findOneAndUpdate(
            {
                _id: showtimeId,
                bookedSeats: { $nin: selectedSeats },
            },
            {
                $push: { bookedSeats: { $each: selectedSeats } },
            },
            { new: true }
        );

        if (!updatedShowtime) {
            throw new ApiError(400, "One or more selected seats are already booked");
        }

        // 3. Calculate total amount
        const totalAmount = showtime.ticketPrice * selectedSeats.length;

        // 4. Create booking record
        return await bookingRepository.create({
            userId,
            showtimeId,
            selectedSeats,
            totalAmount,
            bookingStatus: "confirmed", // Automatically confirm for now, payment logic would go here
            paymentStatus: "pending",
        });
    },

    async getUserBookings(userId: string) {
        return await bookingRepository.findByUserId(userId);
    },

    async getAllBookings() {
        return await bookingRepository.findAll();
    },

    async getBookingById(id: string) {
        const booking = await bookingRepository.findById(id);
        if (!booking) throw new ApiError(404, "Booking not found");
        return booking;
    },

    async updateBookingStatus(id: string, userId: string, role: string, data: any) {
        const booking = await this.getBookingById(id);

        // RBAC: Only admin or the booking owner can update status
        if (role !== "admin" && booking.userId.toString() !== userId) {
            throw new ApiError(403, "You do not have permission to update this booking");
        }

        const { bookingStatus, paymentStatus } = data;

        // If cancelling, we should free up the seats
        if (bookingStatus === "cancelled" && booking.bookingStatus !== "cancelled") {
            await ShowtimeModel.findByIdAndUpdate(booking.showtimeId, {
                $pull: { bookedSeats: { $in: booking.selectedSeats } }
            });
        }

        return await bookingRepository.updateStatus(id, bookingStatus, paymentStatus);
    }
};
