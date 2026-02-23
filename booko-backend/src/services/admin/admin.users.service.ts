import bcrypt from "bcryptjs";
import { userRepository } from "../../repositories/user.repository";
import { ApiError } from "../../errors/ApiErrors";

export const adminUsersService = {
  async createUser(body: any, imageUrl?: string) {
    const exists = await userRepository.findByEmail(body.email);
    if (exists) throw new ApiError(409, "Email already exists");

    const passwordHash = await bcrypt.hash(body.password, 10);

    const user = await userRepository.create({
      email: body.email,
      passwordHash,
      name: body.name || "",
      role: body.role || "user",
      imageUrl: imageUrl || "",
    });

    return user;
  },

  async getUsers(page: number, limit: number) {
    return userRepository.findAllPaged(page, limit);
  },

  async getUser(id: string) {
    const user = await userRepository.findById(id);
    if (!user) throw new ApiError(404, "User not found");
    return user;
  },

  async updateUser(id: string, body: any, imageUrl?: string) {
    const update: any = { ...body };
    if (body.password) {
      update.passwordHash = await bcrypt.hash(body.password, 10);
      delete update.password;
    }
    if (imageUrl) update.imageUrl = imageUrl;

    const updated = await userRepository.updateById(id, update);
    if (!updated) throw new ApiError(404, "User not found");
    return updated;
  },

  async deleteUser(id: string) {
    const deleted = await userRepository.deleteById(id);
    if (!deleted) throw new ApiError(404, "User not found");
    return deleted;
  },
};