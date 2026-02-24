import axios from "axios";

const API_URL = "http://localhost:5000/api";

const getAuthHeader = () => {
    const token = localStorage.getItem("booko_token");
    return token ? { Authorization: `Bearer ${token}` } : {};
};

export const getTheaters = () => axios.get(`${API_URL}/theaters`);

export const createTheater = (data: any) =>
    axios.post(`${API_URL}/theaters`, data, { headers: getAuthHeader() });

export const updateTheater = (id: string, data: any) =>
    axios.put(`${API_URL}/theaters/${id}`, data, { headers: getAuthHeader() });

export const deleteTheater = (id: string) =>
    axios.delete(`${API_URL}/theaters/${id}`, { headers: getAuthHeader() });
