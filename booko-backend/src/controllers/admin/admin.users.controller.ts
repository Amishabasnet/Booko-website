import { Request, Response } from "express";
import { ApiError } from "../../errors/ApiErrors";
import { adminUsersService } from "../../services/admin/admin.users.service";

export const adminUsersController = {
  async create(req: Request, res: Response) {
    const file = req.file;
    const imageUrl = file ? `/uploads/${file.filename}` : "";
    const user = await adminUsersService.createUser(req.body, imageUrl);
    res.status(201).json({ success: true, message: "User created", user });
  },

  async getAll(req: Request, res: Response) {
    const page = Number(req.query.page || 1);
    const limit = Number(req.query.limit || 10);
    const data = await adminUsersService.getUsers(page, limit);
    res.json({ success: true, ...data });
  },

  async getById(req: Request, res: Response) {
    const user = await adminUsersService.getUser(req.params.id);
    res.json({ success: true, user });
  },

  async update(req: Request, res: Response) {
    const file = req.file;
    const imageUrl = file ? `/uploads/${file.filename}` : undefined;
    const user = await adminUsersService.updateUser(req.params.id, req.body, imageUrl);
    res.json({ success: true, message: "User updated", user });
  },

  async remove(req: Request, res: Response) {
    await adminUsersService.deleteUser(req.params.id);
    res.json({ success: true, message: "User deleted" });
  },
};