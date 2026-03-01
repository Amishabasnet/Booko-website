import { Request, Response } from "express";
import { authService } from "../services/auth.service";
import { ENV } from "../config/env";

const cookieOptions = {
  httpOnly: true,
  sameSite: "lax" as const,
  secure: ENV.NODE_ENV === "production",
  maxAge: 7 * 24 * 60 * 60 * 1000,
};

export const authController = {
  async register(req: Request, res: Response) {
    const result = await authService.register(req.body);
    return res.status(201).json({ success: true, message: "User registered successfully", ...result });
  },

  async login(req: Request, res: Response) {
    const result = await authService.login(req.body);

    // save token in cookie
    res.cookie("token", result.token, cookieOptions);
    // optional: save user info in a non-httpOnly cookie if you want frontend to read it
    res.cookie("user", JSON.stringify(result.user), { ...cookieOptions, httpOnly: false });

    return res.json({ success: true, message: "Logged in", user: result.user, token: result.token });
  },

  async getProfile(req: Request, res: Response) {
    if (!req.user) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }
    const user = await authService.getProfile(req.user.userId);
    return res.json({ success: true, user });
  },

  async updateProfile(req: Request, res: Response) {
    if (!req.user) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }
    const user = await authService.updateProfile(req.user.userId, req.body);
    return res.json({ success: true, message: "Profile updated successfully", user });
  },

  async logout(_req: Request, res: Response) {
    res.clearCookie("token");
    res.clearCookie("user");
    return res.json({ success: true, message: "Logged out" });
  },
};