import { BookingModel } from "../models/booking.model";

export const bookingRepository = {
    findAll: () => BookingModel.find().populate("userId showtimeId"),
    findByUserId: (userId: string) => BookingModel.find({ userId }).populate("showtimeId"),
    findById: (id: string) => BookingModel.findById(id).populate("userId showtimeId"),
    create: (data: any) => BookingModel.create(data),
    updateStatus: (id: string, bookingStatus: string, paymentStatus?: string) => {
        const update: any = { bookingStatus };
        if (paymentStatus) update.paymentStatus = paymentStatus;
        return BookingModel.findByIdAndUpdate(id, update, { new: true });
    },
};
