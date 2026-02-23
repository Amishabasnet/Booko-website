import { paymentRepository } from "../repositories/payment.repository";
import { bookingService } from "./booking.service";
import { BookingModel } from "../models/booking.model";
import { ApiError } from "../errors/ApiErrors";
import { v4 as uuidv4 } from "uuid";

export const paymentService = {
    async processPayment(userId: string, bookingId: string, paymentMethod: string) {
        // 1. Fetch booking
        const booking = await bookingService.getBookingById(bookingId);

        // 2. Check if booking belongs to user or if user is admin
        const bookingUserId = (booking.userId as any)._id || booking.userId;
        if (bookingUserId.toString() !== userId) {
            throw new ApiError(403, "You do not have permission to pay for this booking");
        }

        // 3. Check if already paid
        if (booking.paymentStatus === "completed" || booking.paymentStatus === "paid") {
            throw new ApiError(400, "Booking already paid");
        }

        // 4. Simulate Payment Gateway (90% success rate)
        console.log(`Processing payment for booking ${bookingId}...`);
        await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate network lag

        const isSuccess = Math.random() < 0.9;
        const transactionId = `TXN_${uuidv4().split("-")[0].toUpperCase()}`;

        // 5. Create payment record
        const payment = await paymentRepository.create({
            bookingId,
            userId,
            amount: booking.totalAmount,
            paymentMethod,
            transactionId,
            status: isSuccess ? "completed" : "failed",
        });

        // 6. Update booking status
        if (isSuccess) {
            await BookingModel.findByIdAndUpdate(bookingId, {
                paymentStatus: "completed",
                bookingStatus: "confirmed",
            });
            return {
                success: true,
                message: "Payment successful",
                transactionId,
                paymentStatus: "completed"
            };
        } else {
            await BookingModel.findByIdAndUpdate(bookingId, {
                paymentStatus: "failed",
            });
            throw new ApiError(400, "Payment failed at gateway", { transactionId });
        }
    },

    async getPaymentDetails(id: string) {
        const payment = await paymentRepository.findById(id);
        if (!payment) throw new ApiError(404, "Payment record not found");
        return payment;
    },

    async getAllPayments() {
        return await paymentRepository.findAll();
    },
};
