import { UserModel } from "../models/user.model";
import { MovieModel } from "../models/movie.model";
import { BookingModel } from "../models/booking.model";

export const adminService = {
    async getDashboardStats() {
        const [totalUsers, totalMovies, totalBookings, revenueData] = await Promise.all([
            UserModel.countDocuments(),
            MovieModel.countDocuments(),
            BookingModel.countDocuments(),
            BookingModel.aggregate([
                { $match: { bookingStatus: { $ne: "cancelled" } } },
                { $group: { _id: null, totalRevenue: { $sum: "$totalAmount" } } }
            ])
        ]);

        const totalRevenue = revenueData.length > 0 ? revenueData[0].totalRevenue : 0;

        return {
            totalUsers,
            totalMovies,
            totalBookings,
            totalRevenue
        };
    }
};
