import { UserModel } from "../models/user.model";
import { BookingModel } from "../models/booking.model";

export const userRepository = {
  findByEmail: (email: string) => UserModel.findOne({ email }),
  findById: (id: string) => UserModel.findById(id),
  create: (data: any) => UserModel.create(data),
  updateById: (id: string, data: any) => UserModel.findByIdAndUpdate(id, data, { new: true }),
  deleteById: (id: string) => UserModel.findByIdAndDelete(id),

  findAllPaged: async (page: number, limit: number) => {
    const skip = (page - 1) * limit;

    // Aggregation to get users with their booking counts
    const aggregationResults = await UserModel.aggregate([
      { $sort: { createdAt: -1 } },
      { $skip: skip },
      { $limit: limit },
      {
        $lookup: {
          from: "bookings", // collection name in MongoDB
          localField: "_id",
          foreignField: "userId",
          as: "bookings"
        }
      },
      {
        $addFields: {
          bookingCount: { $size: "$bookings" }
        }
      },
      {
        $project: {
          bookings: 0,
          passwordHash: 0 // security
        }
      }
    ]);

    const total = await UserModel.countDocuments();

    return {
      users: aggregationResults, // Changed 'items' to 'users' to match frontend expectation
      total,
      page,
      limit,
      pages: Math.ceil(total / limit)
    };
  },
};