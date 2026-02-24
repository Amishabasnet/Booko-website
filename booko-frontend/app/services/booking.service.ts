import axios from "axios";

const API_URL = "http://localhost:5000/api";

const getAuthHeader = () => {
    const token = localStorage.getItem("booko_token");
    return token ? { Authorization: `Bearer ${token}` } : {};
};

export const getShowtimeDetails = (id: string) =>
    axios.get(`${API_URL}/showtimes/${id}`);

export const createBooking = (data: { showtimeId: string, seats: string[] }) =>
    axios.post(`${API_URL}/bookings`, data, { headers: getAuthHeader() });
