import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { ENV } from "../config/env";
import { ApiError } from "../errors/ApiErrors";
import { userRepository } from "../repositories/user.repository";
import { RegisterDto, LoginDto } from "../dtos/auth.dto";

// Allowed genders
const allowedGenders = ["male", "female", "other", "prefer_not_to_say"] as const;

// Helper function to sign JWT
function signToken(payload: { userId: string; email: string; role: "user" | "admin" }) {
  return jwt.sign(payload, ENV.JWT_SECRET, { expiresIn: "1h" });
}

// Parse and validate date safely
function parseDateOfBirth(dob?: string | Date): Date | undefined {
  if (!dob) return undefined;
  const date = dob instanceof Date ? dob : new Date(dob);
  if (isNaN(date.getTime())) return undefined;
  return date;
}

// Parse and validate gender safely
function parseGender(gender?: string): typeof allowedGenders[number] {
  if (!gender) return "prefer_not_to_say";
  const genderLower = gender.toLowerCase();
  if (!allowedGenders.includes(genderLower as any)) {
    throw new ApiError(400, "Invalid gender");
  }
  return genderLower as typeof allowedGenders[number];
}

export const authService = {
  // REGISTER
  async register(data: RegisterDto) {
    const exists = await userRepository.getUserByEmail(data.email);
    if (exists) throw new ApiError(409, "Email already exists");

    const passwordHash = await bcrypt.hash(data.password, 10);

    const user = await userRepository.createUser({
      email: data.email,
      passwordHash,
      name: data.name || "",
      phoneNumber: data.phoneNumber || "",
      dob: parseDateOfBirth(data.dob),
      gender: parseGender(data.gender),
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
        gender: user.gender,
      },
    };
  },

  // LOGIN
  async login(data: LoginDto) {
    const user = await userRepository.getUserByEmail(data.email);
    if (!user) throw new ApiError(404, "Email not found");

    const ok = await bcrypt.compare(data.password, user.passwordHash);
    if (!ok) throw new ApiError(401, "Invalid credentials");

    const token = signToken({ userId: String(user._id), email: user.email, role: user.role });

    return {
      token,
      user: {
        id: String(user._id),
        email: user.email,
        name: user.name,
        role: user.role,
      },
    };
  },

  // GET PROFILE
  async getProfile(userId: string) {
    const user = await userRepository.getUserById(userId);
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

  // UPDATE PROFILE
  async updateProfile(userId: string, data: Partial<RegisterDto>) {
    const user = await userRepository.getUserById(userId);
    if (!user) throw new ApiError(404, "User not found");

    if (data.email && data.email !== user.email) {
      const exists = await userRepository.getUserByEmail(data.email);
      if (exists) throw new ApiError(409, "Email already exists");
      user.email = data.email;
    }

    if (data.password) user.passwordHash = await bcrypt.hash(data.password, 10);
    if (data.name) user.name = data.name;
    if (data.phoneNumber) user.phoneNumber = data.phoneNumber;

    if (data.dob) {
      const dob = parseDateOfBirth(data.dob);
      if (!dob) throw new ApiError(400, "Invalid date of birth");
      user.dob = dob;
    }

    if (data.gender) user.gender = parseGender(data.gender);

    await user.save();
    return this.getProfile(userId);
  },
};