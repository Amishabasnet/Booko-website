import axios from "axios";

const API_URL = "http://localhost:5000/api";

const getAuthHeader = () => {
    const token = localStorage.getItem("booko_token");
    return token ? { Authorization: `Bearer ${token}` } : {};
};

export const getScreensByTheater = (theaterId: string) =>
    axios.get(`${API_URL}/screens/${theaterId}`);

export const createScreen = (data: any) =>
    axios.post(`${API_URL}/screens`, data, { headers: getAuthHeader() });

export const updateScreen = (id: string, data: any) =>
    axios.put(`${API_URL}/screens/${id}`, data, { headers: getAuthHeader() });

export const deleteScreen = (id: string) =>
    axios.delete(`${API_URL}/screens/${id}`, { headers: getAuthHeader() });
