import jwt from "jsonwebtoken";
import { env } from "./env";

export type JwtPayload = {
  userId: string;
  email: string;
  role: "user" | "admin";
};

export function signToken(payload: JwtPayload) {
  return jwt.sign(payload, env.JWT_SECRET, { expiresIn: env.JWT_EXPIRES_IN });
}
