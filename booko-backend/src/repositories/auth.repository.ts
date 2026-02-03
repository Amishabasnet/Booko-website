import { UserModel } from "../models/user.model";

export const authRepository = {
  findByEmail: (email: string) => UserModel.findOne({ email }).exec(),

  createUser: (data: {
    name?: string;
    email: string;
    passwordHash: string;
    role: "user" | "admin";
  }) => UserModel.create(data),
};
