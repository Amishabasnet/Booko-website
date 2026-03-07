import { UserModel } from "../models/user.model";

export const userRepository = {
  // Find user by email
  getUserByEmail: (email: string) => UserModel.findOne({ email }),

  // Find user by username
  getUserByUsername: (username: string) => UserModel.findOne({ username }),

  // Find user by phone number
  getUserByPhoneNumber: (phoneNumber: string) => UserModel.findOne({ phoneNumber }),

  // Find user by gender
  getUserByGender: (gender: string) => UserModel.findOne({ gender }),

  // Find user by date of birth
  getUserByDateOfBirth: (dob: Date) => UserModel.findOne({ dob }),

  // Find user by ID
  getUserById: (id: string) => UserModel.findById(id),

  // Create a new user
  createUser: (data: any) => UserModel.create(data),

  // Update user by ID
  updateById: (id: string, data: any) => UserModel.findByIdAndUpdate(id, data, { new: true }),

  // Delete user by ID
  deleteById: (id: string) => UserModel.findByIdAndDelete(id),

  // Paginated list of users with booking count
  findAllPaged: async (page: number, limit: number) => {
    const skip = (page - 1) * limit;

    const aggregationResults = await UserModel.aggregate([
      { $sort: { createdAt: -1 } },
      { $skip: skip },
      { $limit: limit },
      {
        $lookup: {
          from: "bookings",
          localField: "_id",
          foreignField: "userId",
          as: "bookings",
        },
      },
      { $addFields: { bookingCount: { $size: "$bookings" } } },
      { $project: { bookings: 0, passwordHash: 0 } }, // hide sensitive info
    ]);

    const total = await UserModel.countDocuments();

    return {
      users: aggregationResults,
      total,
      page,
      limit,
      pages: Math.ceil(total / limit),
    };
  },
};