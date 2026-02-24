import { MovieModel } from "../models/movie.model";

export const movieRepository = {
    findAll: (filters: any = {}) => {
        const query: any = {};
        if (filters.search) {
            query.title = { $regex: filters.search, $options: "i" };
        }
        if (filters.genre) {
            query.genre = filters.genre;
        }
        if (filters.date) {
            const startOfDay = new Date(filters.date);
            startOfDay.setHours(0, 0, 0, 0);
            const endOfDay = new Date(filters.date);
            endOfDay.setHours(23, 59, 59, 999);
            query.releaseDate = { $gte: startOfDay, $lte: endOfDay };
        }
        return MovieModel.find(query).sort({ createdAt: -1 });
    },
    findById: (id: string) => MovieModel.findById(id),
    create: (data: any) => MovieModel.create(data),
    updateById: (id: string, data: any) => MovieModel.findByIdAndUpdate(id, data, { new: true }),
    deleteById: (id: string) => MovieModel.findByIdAndDelete(id),
};
