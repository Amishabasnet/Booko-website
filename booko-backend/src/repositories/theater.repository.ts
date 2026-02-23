import { TheaterModel } from "../models/theater.model";

export const theaterRepository = {
    findAll: () => TheaterModel.find().sort({ createdAt: -1 }),
    findById: (id: string) => TheaterModel.findById(id),
    create: (data: any) => TheaterModel.create(data),
    updateById: (id: string, data: any) => TheaterModel.findByIdAndUpdate(id, data, { new: true }),
    deleteById: (id: string) => TheaterModel.findByIdAndDelete(id),
};
