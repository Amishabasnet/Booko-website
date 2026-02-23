import { UserModel } from "../models/user.model";

export const userRepository = {
  findByEmail: (email: string) => UserModel.findOne({ email }),
  findById: (id: string) => UserModel.findById(id),
  create: (data: any) => UserModel.create(data),
  updateById: (id: string, data: any) => UserModel.findByIdAndUpdate(id, data, { new: true }),
  deleteById: (id: string) => UserModel.findByIdAndDelete(id),

  findAllPaged: async (page: number, limit: number) => {
    const skip = (page - 1) * limit;
    const [items, total] = await Promise.all([
      UserModel.find().sort({ createdAt: -1 }).skip(skip).limit(limit),
      UserModel.countDocuments(),
    ]);
    return { items, total, page, limit, pages: Math.ceil(total / limit) };
  },
};