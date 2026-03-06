import { BookingModel } from "../models/booking.model";

export const bookingRepository = {
    findAll: () => BookingModel.find().populate([
        { path: "userId" },
        {
            path: "showtimeId",
            populate: [
                { path: "movieId" },
                { path: "theaterId" }
            ]
        }
    ]),
    findByUserId: (userId: string) => BookingModel.find({ userId }).populate([
        { path: "userId" },
        {
            path: "showtimeId",
            populate: [
                { path: "movieId" },
                { path: "theaterId" }
            ]
        }
    ]),
    findById: (id: string) => BookingModel.findById(id).populate([
        { path: "userId" },
        {
            path: "showtimeId",
            populate: [
                { path: "movieId" },
                { path: "theaterId" }
            ]
        }
    ]),
    create: (data: any) => BookingModel.create(data),
    updateStatus: (id: string, bookingStatus: string, paymentStatus?: string) => {
        const update: any = { bookingStatus };
        if (paymentStatus) update.paymentStatus = paymentStatus;
        return BookingModel.findByIdAndUpdate(id, update, { new: true });
    },
    deleteById: (id: string) => BookingModel.findByIdAndDelete(id),
};
