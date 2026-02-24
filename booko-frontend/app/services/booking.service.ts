import axios from "axios";

const API_URL = "http://localhost:5000/api";

const getAuthHeader = () => {
    const token = localStorage.getItem("booko_token");
    return token ? { Authorization: `Bearer ${token}` } : {};
};

export const getShowtimeDetails = (id: string) =>
    axios.get(`${API_URL}/showtimes/${id}`);

export const createBooking = (data: { showtimeId: string, selectedSeats: string[] }) =>
    axios.post(`${API_URL}/bookings`, data, { headers: getAuthHeader() });

export const initiatePayment = (bookingId: string, paymentMethod: string) =>
    axios.post(`${API_URL}/payments/${bookingId}`, { paymentMethod }, { headers: getAuthHeader() });

export const updatePaymentStatus = (bookingId: string, status: string) =>
    axios.put(`${API_URL}/bookings/${bookingId}/status`, { paymentStatus: status }, { headers: getAuthHeader() });
