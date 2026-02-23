import { ShowtimeModel } from "../models/showtime.model";

export const showtimeRepository = {
    findAll: (filter: any = {}) => ShowtimeModel.find(filter).populate("movieId theaterId screenId"),
    findById: (id: string) => ShowtimeModel.findById(id).populate("movieId theaterId screenId"),
    create: (data: any) => ShowtimeModel.create(data),
    updateById: (id: string, data: any) => ShowtimeModel.findByIdAndUpdate(id, data, { new: true }),
    deleteById: (id: string) => ShowtimeModel.findByIdAndDelete(id),
};
