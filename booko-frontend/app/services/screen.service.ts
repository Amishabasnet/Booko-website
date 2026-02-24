import apiClient from "@/app/utils/apiClient";

export const getScreensByTheater = (theaterId: string) =>
    apiClient.get(`/screens/${theaterId}`);

export const createScreen = (data: any) =>
    apiClient.post("/screens", data);

export const updateScreen = (id: string, data: any) =>
    apiClient.put(`/screens/${id}`, data);

export const deleteScreen = (id: string) =>
    apiClient.delete(`/screens/${id}`);
