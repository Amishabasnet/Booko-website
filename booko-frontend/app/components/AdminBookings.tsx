"use client";

import { useEffect, useState } from "react";
import { getAllBookings, updateBookingStatus } from "@/app/services/booking.service";
import Loader from "./ui/Loader";
import ErrorMessage from "./ui/ErrorMessage";
import axios from "axios";

interface Booking {
    _id: string;
    userId: { name: string, email: string };
    showtimeId: {
        movieId: { title: string },
        theaterId: { name: string },
        screenId: { screenName: string },
        showDate: string,
        showTime: string
    };
    selectedSeats: string[];
    totalAmount: number;
    bookingStatus: "confirmed" | "cancelled" | "pending";
    paymentStatus: "completed" | "failed" | "pending";
}

export default function AdminBookings() {
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    useEffect(() => {
        fetchBookings();
    }, []);

    const fetchBookings = async () => {
        setLoading(true);
        try {
            const res = await getAllBookings();
            setBookings(res.data.bookings);
        } catch (err) {
            setError("Failed to fetch bookings.");
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateStatus = async (id: string, bookingStatus: string, paymentStatus: string) => {
        setError(null);
        setSuccess(null);
        try {
            // Reusing updatePaymentStatus but the backend updateBookingStatus accepts both
            // Let's check the service name in backend... it was updateBookingStatus(id, userId, role, data)
            // And route PUT /:id/status 
            await updateBookingStatus(id, bookingStatus, paymentStatus);

            setSuccess("Booking updated successfully!");
            fetchBookings();
        } catch (err: any) {
            setError(err.response?.data?.message || "Failed to update booking.");
        }
    };

    const getStatusStyle = (status: string) => {
        switch (status) {
            case "confirmed":
            case "completed":
                return { background: "rgba(34, 197, 94, 0.1)", color: "#22c55e" };
            case "cancelled":
            case "failed":
                return { background: "rgba(229, 9, 20, 0.1)", color: "#e50914" };
            default:
                return { background: "rgba(255, 193, 7, 0.1)", color: "#ffc107" };
        }
    };

    if (loading) return <Loader message="Accessing booking records..." />;
    if (error && bookings.length === 0) return <ErrorMessage message={error} onRetry={fetchBookings} />;

    return (
        <section style={sectionStyle}>
            <div style={headerStyle}>
                <h2 style={titleStyle}>Customer Bookings</h2>
                <button onClick={fetchBookings} style={refreshBtnStyle}>Refresh</button>
            </div>

            {error && <div style={errorStyle}>{error}</div>}
            {success && <div style={successStyle}>{success}</div>}

            <div style={tableContainerStyle}>
                <table style={tableStyle}>
                    <thead>
                        <tr>
                            <th style={thStyle}>Customer</th>
                            <th style={thStyle}>Movie & Show</th>
                            <th style={thStyle}>Seats</th>
                            <th style={thStyle}>Total</th>
                            <th style={thStyle}>Booking</th>
                            <th style={thStyle}>Payment</th>
                            <th style={thStyle}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {bookings.map(b => (
                            <tr key={b._id} style={trStyle}>
                                <td style={tdStyle}>
                                    <div style={{ fontWeight: 600 }}>{b.userId?.name}</div>
                                    <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.4)" }}>{b.userId?.email}</div>
                                </td>
                                <td style={tdStyle}>
                                    <div style={{ fontWeight: 600 }}>{b.showtimeId?.movieId?.title}</div>
                                    <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.4)" }}>
                                        {b.showtimeId?.theaterId?.name} - {b.showtimeId?.screenId?.screenName}<br />
                                        {new Date(b.showtimeId?.showDate).toLocaleDateString()} {b.showtimeId?.showTime}
                                    </div>
                                </td>
                                <td style={tdStyle}>{b.selectedSeats.join(", ")}</td>
                                <td style={tdStyle}>${b.totalAmount}</td>
                                <td style={tdStyle}>
                                    <span style={{ ...pillStyle, ...getStatusStyle(b.bookingStatus) }}>
                                        {b.bookingStatus}
                                    </span>
                                </td>
                                <td style={tdStyle}>
                                    <span style={{ ...pillStyle, ...getStatusStyle(b.paymentStatus) }}>
                                        {b.paymentStatus}
                                    </span>
                                </td>
                                <td style={tdStyle}>
                                    <div style={actionGroupStyle}>
                                        {b.bookingStatus !== "confirmed" && (
                                            <button onClick={() => handleUpdateStatus(b._id, "confirmed", "completed")} style={approveBtnStyle}>Approve</button>
                                        )}
                                        {b.bookingStatus !== "cancelled" && (
                                            <button onClick={() => handleUpdateStatus(b._id, "cancelled", b.paymentStatus)} style={cancelBtnStyle}>Cancel</button>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </section>
    );
}

const sectionStyle: React.CSSProperties = {
    background: "rgba(255, 255, 255, 0.03)",
    borderRadius: "24px",
    padding: "30px",
    border: "1px solid rgba(255, 255, 255, 0.05)",
};

const headerStyle: React.CSSProperties = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "30px",
};

const titleStyle: React.CSSProperties = { fontSize: "24px", fontWeight: 800, margin: 0 };
const refreshBtnStyle: React.CSSProperties = { background: "rgba(255,255,255,0.05)", color: "white", border: "1px solid rgba(255,255,255,0.1)", padding: "8px 16px", borderRadius: "10px", cursor: "pointer", fontWeight: 600 };

const tableContainerStyle: React.CSSProperties = { overflowX: "auto" };
const tableStyle: React.CSSProperties = { width: "100%", borderCollapse: "collapse", textAlign: "left" };
const thStyle: React.CSSProperties = { padding: "15px", borderBottom: "1px solid rgba(255, 255, 255, 0.1)", color: "rgba(255, 255, 255, 0.5)", fontSize: "14px" };
const tdStyle: React.CSSProperties = { padding: "15px", borderBottom: "1px solid rgba(255, 255, 255, 0.05)", fontSize: "14px" };
const trStyle: React.CSSProperties = { transition: "background 0.2s" };

const pillStyle: React.CSSProperties = { padding: "4px 10px", borderRadius: "20px", fontSize: "12px", fontWeight: 700, textTransform: "capitalize" };

const actionGroupStyle: React.CSSProperties = { display: "flex", gap: "8px" };
const approveBtnStyle: React.CSSProperties = { background: "#22c55e", color: "white", border: "none", padding: "6px 12px", borderRadius: "8px", cursor: "pointer", fontSize: "12px", fontWeight: 700 };
const cancelBtnStyle: React.CSSProperties = { background: "rgba(229, 9, 20, 0.1)", color: "#e50914", border: "1px solid rgba(229, 9, 20, 0.2)", padding: "6px 12px", borderRadius: "8px", cursor: "pointer", fontSize: "12px", fontWeight: 700 };

const errorStyle: React.CSSProperties = { background: "rgba(229, 9, 20, 0.1)", color: "#e50914", padding: "12px 20px", borderRadius: "12px", marginBottom: "20px" };
const successStyle: React.CSSProperties = { background: "rgba(34, 197, 94, 0.1)", color: "#22c55e", padding: "12px 20px", borderRadius: "12px", marginBottom: "20px" };
const msgStyle: React.CSSProperties = { textAlign: "center", padding: "40px", color: "rgba(255,255,255,0.4)" };
