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
    return res.status(201).json({ success: true, message: "Registered", ...result });
  },

  async login(req: Request, res: Response) {
    const result = await authService.login(req.body);

    // save token in cookie
    res.cookie("token", result.token, cookieOptions);
    // optional: save user info in a non-httpOnly cookie if you want frontend to read it
    res.cookie("user", JSON.stringify(result.user), { ...cookieOptions, httpOnly: false });

    return res.json({ success: true, message: "Logged in", user: result.user, token: result.token });
  },

  async logout(_req: Request, res: Response) {
    res.clearCookie("token");
    res.clearCookie("user");
    return res.json({ success: true, message: "Logged out" });
  },
};