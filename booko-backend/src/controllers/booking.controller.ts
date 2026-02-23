import { Request, Response } from "express";
import { bookingService } from "../services/booking.service";

export const bookingController = {
    async create(req: Request, res: Response) {
        const userId = req.user!.userId;
        const booking = await bookingService.createBooking(userId, req.body);
        return res.status(201).json({ success: true, message: "Booking created successfully", booking });
    },

    async getByUser(req: Request, res: Response) {
        const userId = req.user!.userId;
        const bookings = await bookingService.getUserBookings(userId);
        return res.json({ success: true, bookings });
    },

    async getAll(req: Request, res: Response) {
        const bookings = await bookingService.getAllBookings();
        return res.json({ success: true, bookings });
    },

    async getById(req: AuthRequest, res: Response) {
        const booking = await bookingService.getBookingById(req.params.id);
        return res.json({ success: true, booking });
    },

    async updateStatus(req: AuthRequest, res: Response) {
        const userId = req.user!.userId;
        const role = req.user!.role;
        const booking = await bookingService.updateBookingStatus(req.params.id, userId, role, req.body);
        return res.json({ success: true, message: "Booking status updated successfully", booking });
    },
};
