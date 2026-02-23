import jwt from "jsonwebtoken";
import { ENV } from "./env";

export type JwtPayload = {
  userId: string;
  email: string;
  role: "user" | "admin";
};

export function signToken(payload: JwtPayload) {
  return jwt.sign(payload, ENV.JWT_SECRET, { expiresIn: "7d" });
}
