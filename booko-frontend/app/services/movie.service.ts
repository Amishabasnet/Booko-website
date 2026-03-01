import apiClient from "@/app/utils/apiClient";

export const getMovies = (params: any = {}) => {
    return apiClient.get("/movies", { params });
};

export const getMovieShowtimes = (movieId: string) =>
    apiClient.get("/showtimes", { params: { movieId } });

export const getMovieById = (id: string) => apiClient.get(`/movies/${id}`);

export const createMovie = (data: any) =>
    apiClient.post("/movies", data, { headers: { "Content-Type": "multipart/form-data" } });

export const updateMovie = (id: string, data: any) =>
    apiClient.put(`/movies/${id}`, data, { headers: { "Content-Type": "multipart/form-data" } });

export const deleteMovie = (id: string) =>
    apiClient.delete(`/movies/${id}`);
