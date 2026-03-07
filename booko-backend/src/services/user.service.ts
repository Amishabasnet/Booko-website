// src/services/user.service.ts
import { userRepository } from "../repositories/user.repository";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config";
import { ApiError } from "../errors/ApiErrors";

export class UserService {
  // Create a new user
  async createUser(data: {
    email: string;
    username?: string;
    name?: string;
    password: string;
    phoneNumber?: string;
    gender?: string;
    dob?: string | Date;
    role?: string;
  }) {
    // Validate required fields
    if (!data.email) throw new ApiError(400, "Email is required");
    if (!data.password) throw new ApiError(400, "Password is required");

    // Normalize gender
    if (data.gender && typeof data.gender === "string") {
      data.gender = data.gender.toLowerCase();
      const validGenders = ["male", "female", "other", "prefer_not_to_say"];
      if (!validGenders.includes(data.gender)) {
        throw new ApiError(400, "Invalid gender", [
          {
            type: "field",
            path: "gender",
            value: data.gender,
            msg: "Invalid gender",
            location: "body",
          },
        ]);
      }
    }

    // Convert dob to Date if provided
    if (data.dob) {
      data.dob = new Date(data.dob);
      if (isNaN(data.dob.getTime())) {
        throw new ApiError(400, "Invalid date of birth");
      }
    }

    // Duplicate checks
    if (await userRepository.getUserByEmail(data.email)) {
      throw new ApiError(403, "Email already in use");
    }

    if (data.username && (await userRepository.getUserByUsername(data.username))) {
      throw new ApiError(403, "Username already in use");
    }

    if (data.phoneNumber && (await userRepository.getUserByPhoneNumber(data.phoneNumber))) {
      throw new ApiError(403, "Phone number already in use");
    }

    // Hash password
    const passwordHash = await bcryptjs.hash(data.password, 10);

    // Create user
    const newUser = await userRepository.createUser({
      ...data,
      passwordHash,
    });

    return newUser;
  }

  // Login user
  async loginUser(data: { email: string; password: string }) {
    if (!data.email) throw new ApiError(400, "Email is required");
    if (!data.password) throw new ApiError(400, "Password is required");

    const user = await userRepository.getUserByEmail(data.email);
    if (!user) throw new ApiError(404, "User not found");

    // Compare password with passwordHash
    const validPassword = await bcryptjs.compare(data.password, user.passwordHash);
    if (!validPassword) throw new ApiError(401, "Invalid credentials");

    const payload = {
      id: user._id,
      email: user.email,
      name: user.name,
      role: user.role,
    };

    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "30d" });
    return { token, user };
  }
}