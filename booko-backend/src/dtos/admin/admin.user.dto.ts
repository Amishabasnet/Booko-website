import { z } from "zod";

export const AdminCreateUserDTO = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  name: z.string().min(2).optional(),
  role: z.enum(["user", "admin"]).optional(),
});

export const AdminUpdateUserDTO = z.object({
  email: z.string().email().optional(),
  password: z.string().min(6).optional(),
  name: z.string().min(2).optional(),
  role: z.enum(["user", "admin"]).optional(),
});