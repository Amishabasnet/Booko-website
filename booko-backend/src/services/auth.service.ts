import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { ENV } from "../config/env";
import { ApiError } from "../errors/ApiErrors";
import { userRepository } from "../repositories/user.repository";
import { RegisterDto, LoginDto } from "../dtos/auth.dto";

function signToken(payload: { userId: string; email: string; role: "user" | "admin" }) {
  return jwt.sign(payload, ENV.JWT_SECRET, { expiresIn: "1h" });
}

export const authService = {
  async register(data: RegisterDto) {
    const exists = await userRepository.findByEmail(data.email);
    if (exists) throw new ApiError(409, "Email already exists");

    const passwordHash = await bcrypt.hash(data.password, 10);

    const user = await userRepository.create({
      email: data.email,
      passwordHash,
      name: data.name || "",
      phoneNumber: data.phoneNumber || "",
      dob: data.dob ? new Date(data.dob) : undefined,
      gender: data.gender || "prefer_not_to_say",
      role: data.role || "user",
    });


    return {
      user: {
        id: String(user._id),
        email: user.email,
        name: user.name,
        role: user.role,
        phoneNumber: user.phoneNumber,
        dob: user.dob,
        gender: user.gender
      },
    };
  },

  async getProfile(userId: string) {
    const user = await userRepository.findById(userId);
    if (!user) throw new ApiError(404, "User not found");

    return {
      id: String(user._id),
      email: user.email,
      name: user.name,
      role: user.role,
      phoneNumber: user.phoneNumber,
      dob: user.dob,
      gender: user.gender,
      imageUrl: user.imageUrl,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  },

  async updateProfile(userId: string, data: Partial<RegisterDto>) {
    const user = await userRepository.findById(userId);
    if (!user) throw new ApiError(404, "User not found");

    if (data.email && data.email !== user.email) {
      const exists = await userRepository.findByEmail(data.email);
      if (exists) throw new ApiError(409, "Email already exists");
      user.email = data.email;
    }

    if (data.password) user.passwordHash = await bcrypt.hash(data.password, 10);
    if (data.name) user.name = data.name;
    if (data.phoneNumber) user.phoneNumber = data.phoneNumber;
    if (data.dob) user.dob = new Date(data.dob);
    if (data.gender) user.gender = data.gender;

    await user.save();
    return this.getProfile(userId);
  },

  async login(data: LoginDto) {
    const user = await userRepository.findByEmail(data.email);
    if (!user) throw new ApiError(404, "Email not found");

    const ok = await bcrypt.compare(data.password, user.passwordHash);
    if (!ok) throw new ApiError(401, "Invalid credentials");

    const token = signToken({ userId: String(user._id), email: user.email, role: user.role });

    return {
      token,
      user: { id: String(user._id), email: user.email, name: user.name, role: user.role },
    };
  },
};