import { MovieModel } from "../models/movie.model";

export const movieRepository = {
    findAll: () => MovieModel.find().sort({ createdAt: -1 }),
    findById: (id: string) => MovieModel.findById(id),
    create: (data: any) => MovieModel.create(data),
    updateById: (id: string, data: any) => MovieModel.findByIdAndUpdate(id, data, { new: true }),
    deleteById: (id: string) => MovieModel.findByIdAndDelete(id),
};
