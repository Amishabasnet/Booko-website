import { PaymentModel } from "../models/payment.model";

export const paymentRepository = {
    create: (data: any) => PaymentModel.create(data),
    findById: (id: string) => PaymentModel.findById(id).populate("bookingId userId"),
    findByBookingId: (bookingId: string) => PaymentModel.findOne({ bookingId }),
    findAll: () => PaymentModel.find().populate("bookingId userId"),
};
