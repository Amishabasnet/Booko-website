import { z } from "zod";

export const registerDto = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").optional(),
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  phoneNumber: z.string().optional(),
  dob: z.string().optional(), // Received as string, can be parsed to Date
  gender: z.enum(["male", "female", "other", "prefer_not_to_say"]).optional(),
  role: z.enum(["user", "admin"]).optional(),
});
export type RegisterDto = z.infer<typeof registerDto>;

export const loginDto = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});
export type LoginDto = z.infer<typeof loginDto>;
