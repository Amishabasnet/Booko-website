import { Request, Response } from "express";
import { ZodError } from "zod";

import { UserService } from "../services/user.service";
import { CreateUserDTO, LoginDto, LoginUserDTO, RegisterDto } from "../dtos/user.dto";

const userService = new UserService();

export class AuthController {
  async register(req: Request, res: Response) {
    try {
      const parsed = RegisterDto.safeParse(req.body);

      if (!parsed.success) {
        return res.status(400).json({
          success: false,
          message: "Validation error",
          errors: parsed.error.flatten(), // ✅ clean DTO validation response
        });
      }

      const userData = parsed.data;
      const newUser = await userService.createUser(userData);

      return res.status(201).json({
        success: true,
        message: "User Created",
        data: newUser,
      });
    } catch (error: any) {
      return this.handleError(res, error);
    }
  }

  async login(req: Request, res: Response) {
    try {
      const parsed = LoginDto.safeParse(req.body);

      if (!parsed.success) {
        return res.status(400).json({
          success: false,
          message: "Validation error",
          errors: parsed.error.flatten(),
        });
      }

      const loginData = parsed.data;
      const { token, user } = await userService.loginUser(loginData);

      return res.status(200).json({
        success: true,
        message: "Login successful",
        data: user,
        token,
      });
    } catch (error: any) {
      return this.handleError(res, error);
    }
  }

  private handleError(res: Response, error: any) {
    // If you throw ZodError somewhere else in the app
    if (error instanceof ZodError) {
      return res.status(400).json({
        success: false,
        message: "Validation error",
        errors: error.flatten(),
      });
    }

    return res.status(error?.statusCode ?? error?.status ?? 500).json({
      success: false,
      message: error?.message || "Internal Server Error",
    });
  }
}
