import axios from "axios";

const API_URL = "http://localhost:5000/api";

const getAuthHeader = () => {
    const token = localStorage.getItem("booko_token");
    return token ? { Authorization: `Bearer ${token}` } : {};
};

export const getShowtimes = () => axios.get(`${API_URL}/showtimes`);

export const createShowtime = (data: any) =>
    axios.post(`${API_URL}/showtimes`, data, { headers: getAuthHeader() });

export const updateShowtime = (id: string, data: any) =>
    axios.put(`${API_URL}/showtimes/${id}`, data, { headers: getAuthHeader() });

export const deleteShowtime = (id: string) =>
    axios.delete(`${API_URL}/showtimes/${id}`, { headers: getAuthHeader() });
