import apiClient from "@/app/utils/apiClient";

export const createBooking = (data: {
    showtimeId: string;
    selectedSeats: string[];
    totalAmount: number;
}) => apiClient.post("/bookings", data);

export const getUserBookings = () =>
    apiClient.get("/bookings/user");

export const getBookingById = (id: string) =>
    apiClient.get(`/bookings/${id}`);

export const updateBookingStatus = (id: string, bookingStatus: string, paymentStatus: string) =>
    apiClient.put(`/bookings/${id}/status`, { bookingStatus, paymentStatus });

export const updatePaymentStatus = (bookingId: string, status: string) =>
    apiClient.put(`/bookings/${bookingId}/status`, { paymentStatus: status });

export const getAllBookings = () =>
    apiClient.get("/bookings");

export const initiatePayment = (bookingId: string, paymentMethod: string) => {
    // Dummy function for now to fix build errors
    return Promise.resolve({ data: { success: true, bookingId, paymentMethod } });
};
