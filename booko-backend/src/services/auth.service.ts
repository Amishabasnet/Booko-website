import bcrypt from "bcrypt";
import { env } from "../config/env";
import { signToken } from "../config/jwt";
import { HttpError } from "../errors/http-error";
import { authRepository } from "../repositories/auth.repository";
import type { RegisterDto, LoginDto } from "../dtos/auth.dto";

export const authService = {
  register: async (dto: RegisterDto) => {
    const existing = await authRepository.findByEmail(dto.email);
    if (existing) throw new HttpError(409, "Email already in use");

    const passwordHash = await bcrypt.hash(dto.password, env.BCRYPT_SALT_ROUNDS);
    const role = dto.role ?? "user";

    const user = await authRepository.createUser({
      name: dto.name,
      email: dto.email,
      passwordHash,
      role,
    });

    return {
      id: user._id.toString(),
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
    };
  },

  login: async (dto: LoginDto) => {
    const user = await authRepository.findByEmail(dto.email);
    if (!user) throw new HttpError(401, "Invalid email or password");

    const ok = await bcrypt.compare(dto.password, user.passwordHash);
    if (!ok) throw new HttpError(401, "Invalid email or password");

    const token = signToken({
      userId: user._id.toString(),
      email: user.email,
      role: user.role,
    });

    return {
      token,
      user: { id: user._id.toString(), email: user.email, role: user.role },
    };
  },
};
