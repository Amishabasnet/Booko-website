import apiClient from "@/app/utils/apiClient";

export const getShowtimes = () => apiClient.get("/showtimes");

export const getShowtimeById = (id: string) =>
    apiClient.get(`/showtimes/${id}`);

export const createShowtime = (data: any) =>
    apiClient.post("/showtimes", data);

export const updateShowtime = (id: string, data: any) =>
    apiClient.put(`/showtimes/${id}`, data);

export const deleteShowtime = (id: string) =>
    apiClient.delete(`/showtimes/${id}`);
