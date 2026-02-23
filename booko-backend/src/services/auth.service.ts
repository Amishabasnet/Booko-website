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
      role: data.role || "user",
    });


    return {
      user: { id: String(user._id), email: user.email, name: user.name, role: user.role },
    };
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