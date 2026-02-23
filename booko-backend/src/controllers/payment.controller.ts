import { Request, Response } from "express";
import { paymentService } from "../services/payment.service";

export const paymentController = {
    async initiatePayment(req: Request, res: Response) {
        const userId = req.user!.userId;
        const { bookingId } = req.params;
        const { paymentMethod } = req.body;

        const result = await paymentService.processPayment(userId, bookingId, paymentMethod);
        return res.json(result);
    },

    async getById(req: Request, res: Response) {
        const payment = await paymentService.getPaymentDetails(req.params.id);
        return res.json({ success: true, payment });
    },

    async getAll(req: Request, res: Response) {
        const payments = await paymentService.getAllPayments();
        return res.json({ success: true, payments });
    },
};
