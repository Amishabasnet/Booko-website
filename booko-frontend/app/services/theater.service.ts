import apiClient from "@/app/utils/apiClient";

export const getTheaters = () => apiClient.get("/theaters");

export const createTheater = (data: any) =>
    apiClient.post("/theaters", data);

export const updateTheater = (id: string, data: any) =>
    apiClient.put(`/theaters/${id}`, data);

export const deleteTheater = (id: string) =>
    apiClient.delete(`/theaters/${id}`);
