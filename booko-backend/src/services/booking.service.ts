import { bookingRepository } from "../repositories/booking.repository";
import { ShowtimeModel } from "../models/showtime.model";
import { showtimeService } from "./showtime.service";
import { ApiError } from "../errors/ApiErrors";
import { userRepository } from "../repositories/user.repository"; // for customer snapshots

async function enrichBooking(booking: any) {
    const bObj = booking.toObject ? booking.toObject() : booking;
    if (bObj.showtimeId && typeof bObj.showtimeId === "object") {
        bObj.showtimeId.screenId = await showtimeService.resolveScreenDetails(bObj.showtimeId.screenId);
    }
    // ensure backward compatibility: if customerName/email missing but userId populated,
    // copy over values from the populated user document
    if (!bObj.customerName && bObj.userId && typeof bObj.userId === "object") {
        bObj.customerName = bObj.userId.name;
        bObj.customerEmail = bObj.userId.email;
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

        // determine snapshot fields
        let customerName = "";
        let customerEmail = "";
        const user = await userRepository.findById(userId);
        if (user) {
            customerName = user.name;
            customerEmail = user.email;
        }

        // 4. Create booking record
        const created = await bookingRepository.create({
            userId,
            customerName,
            customerEmail,
            showtimeId,
            selectedSeats,
            totalAmount,
            bookingStatus: "confirmed",
            paymentStatus: "pending",
        });

        // populate before returning so frontend can immediately display the customer info
        // `findById` already takes care of populating userId and showtime details
        // convert the ObjectId to string for the repository helper
        return await bookingRepository.findById(created._id.toString());
    },

    async getUserBookings(userId: string) {
        // also populate the user reference in case a consumer needs name/email
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
