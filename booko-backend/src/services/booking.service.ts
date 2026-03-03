import { bookingRepository } from "../repositories/booking.repository";
import { ShowtimeModel } from "../models/showtime.model";
import { showtimeService } from "./showtime.service";
import { ApiError } from "../errors/ApiErrors";

async function enrichBooking(booking: any) {
    const bObj = booking.toObject ? booking.toObject() : booking;
    if (bObj.showtimeId && typeof bObj.showtimeId === "object") {
        bObj.showtimeId.screenId = await showtimeService.resolveScreenDetails(bObj.showtimeId.screenId);
    }
    return bObj;
}

export const bookingService = {
    async createBooking(userId: string, data: any) {
        const { showtimeId, selectedSeats } = data;

        // 1. Fetch showtime to get ticket price
        const showtime = await showtimeService.getShowtimeById(showtimeId);

        // 2. Atomic update: Add seats to bookedSeats ONLY IF none of them are already booked
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
            bookingStatus: "confirmed",
            paymentStatus: "pending",
        });
    },

    async getUserBookings(userId: string) {
        const bookings = await bookingRepository.findByUserId(userId);
        return await Promise.all(bookings.map(enrichBooking));
    },

    async getAllBookings() {
        const bookings = await bookingRepository.findAll();
        return await Promise.all(bookings.map(enrichBooking));
    },

    async getBookingById(id: string) {
        const booking = await bookingRepository.findById(id);
        if (!booking) throw new ApiError(404, "Booking not found");
        return await enrichBooking(booking);
    },

    async updateBookingStatus(id: string, userId: string, role: string, data: any) {
        const booking = await this.getBookingById(id);

        // RBAC: Only admin or the booking owner can update status
        const bookingUserId = (booking.userId as any)._id || booking.userId;
        if (role !== "admin" && bookingUserId.toString() !== userId) {
            throw new ApiError(403, "You do not have permission to update this booking");
        }

        const { bookingStatus, paymentStatus } = data;

        // If cancelling, we should free up the seats
        if (bookingStatus === "cancelled" && booking.bookingStatus !== "cancelled") {
            const showtimeId = booking.showtimeId && booking.showtimeId._id ? booking.showtimeId._id : booking.showtimeId;
            await ShowtimeModel.findByIdAndUpdate(showtimeId, {
                $pull: { bookedSeats: { $in: booking.selectedSeats } }
            });
        }

        return await bookingRepository.updateStatus(id, bookingStatus, paymentStatus);
    },

    async deleteBooking(id: string) {
        const booking = await this.getBookingById(id);

        // If not already cancelled, free up the seats
        if (booking.bookingStatus !== "cancelled") {
            const showtimeId = booking.showtimeId && booking.showtimeId._id ? booking.showtimeId._id : booking.showtimeId;
            await ShowtimeModel.findByIdAndUpdate(showtimeId, {
                $pull: { bookedSeats: { $in: booking.selectedSeats } }
            });
        }

        return await bookingRepository.deleteById(id);
    }
};
