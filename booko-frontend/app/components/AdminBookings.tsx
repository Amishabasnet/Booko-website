"use client";

import { useEffect, useState } from "react";
import { getAllBookings, updateBookingStatus } from "@/app/services/booking.service";
import Loader from "./ui/Loader";
import ErrorMessage from "./ui/ErrorMessage";
import axios from "axios";
import ConfirmDialog from "./ConfirmDialog";
import { deleteBooking } from "@/app/services/booking.service";
import { getImageUrl } from "@/app/utils/apiClient";

interface Booking {
    _id: string;
    userId: { name: string, email: string };
    showtimeId: {
        movieId: { title: string, posterImage: string },
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
    const [deleteId, setDeleteId] = useState<string | null>(null);
    const [showConfirm, setShowConfirm] = useState(false);

    useEffect(() => {
        fetchBookings();
    }, []);

    const fetchBookings = async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await getAllBookings();
            setBookings(res.data.bookings || []);
        } catch (err) {
            setBookings([]);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateStatus = async (id: string, bookingStatus: string, paymentStatus: string) => {
        setError(null);
        setSuccess(null);
        try {
            await updateBookingStatus(id, bookingStatus, paymentStatus);

            setSuccess("Booking updated successfully!");
            fetchBookings();
        } catch (err: any) {
            setError(err.response?.data?.message || "Failed to update booking.");
        }
    };

    const handleDeleteClick = (id: string) => {
        setDeleteId(id);
        setShowConfirm(true);
    };

    const handleConfirmDelete = async () => {
        if (!deleteId) return;
        setError(null);
        setSuccess(null);
        try {
            await deleteBooking(deleteId);
            setSuccess("Booking deleted successfully!");
            fetchBookings();
        } catch (err: any) {
            setError(err.response?.data?.message || "Failed to delete booking.");
        } finally {
            setShowConfirm(false);
            setDeleteId(null);
        }
    };

    const getStatusClasses = (status: string) => {
        switch (status) {
            case "confirmed":
            case "completed":
                return "bg-green-500/10 text-green-500 border-green-500/20";
            case "cancelled":
            case "failed":
                return "bg-primary/10 text-primary border-primary/20";
            default:
                return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20";
        }
    };

    if (loading) return <Loader message="Accessing booking records..." />;

    return (
        <section className="mt-10 bg-white/5 rounded-3xl p-6 md:p-8 border border-white/5 shadow-inner">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                <h2 className="text-2xl font-black m-0 tracking-tight">Customer Bookings</h2>
                <button onClick={fetchBookings} className="bg-white/5 hover:bg-white/10 text-white/70 hover:text-white py-2.5 px-6 rounded-xl text-sm font-bold border border-white/10 transition-colors active:scale-95">Refresh</button>
            </div>

            {error && <div className="bg-red-500/10 text-red-500 p-4 rounded-xl mb-6 text-sm border border-red-500/10">{error}</div>}
            {success && <div className="bg-green-500/10 text-green-500 p-4 rounded-xl mb-6 text-sm border border-green-500/10">{success}</div>}

            {bookings.length === 0 ? (
                <div className="text-center py-16">
                    <div className="text-5xl mb-4">🎟️</div>
                    <h3 className="text-lg font-bold text-white/50 mb-2">No Bookings Found</h3>
                    <p className="text-white/30 text-sm">When users book movies, their booking details will appear here.</p>
                </div>
            ) : (
                <div className="overflow-x-auto -mx-6 md:mx-0">
                    <table className="w-full border-collapse text-left min-w-[900px]">
                        <thead>
                            <tr className="border-b border-white/10">
                                <th className="p-4 text-white/40 font-bold text-xs uppercase tracking-widest">Customer</th>
                                <th className="p-4 text-white/40 font-bold text-xs uppercase tracking-widest">Movie & Show</th>
                                <th className="p-4 text-white/40 font-bold text-xs uppercase tracking-widest">Seats</th>
                                <th className="p-4 text-white/40 font-bold text-xs uppercase tracking-widest">Total</th>
                                <th className="p-4 text-white/40 font-bold text-xs uppercase tracking-widest text-center">Booking</th>
                                <th className="p-4 text-white/40 font-bold text-xs uppercase tracking-widest text-center">Payment</th>
                                <th className="p-4 text-white/40 font-bold text-xs uppercase tracking-widest text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {bookings.map(b => (
                                <tr key={b._id} className="hover:bg-white/[0.02] transition-colors group">
                                    <td className="p-4">
                                        <div className="text-sm font-semibold">{b.userId?.name}</div>
                                        <div className="text-[10px] text-white/40 font-medium uppercase tracking-wider mt-0.5">{b.userId?.email}</div>
                                    </td>
                                    <td className="p-4">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-16 rounded-lg bg-white/10 overflow-hidden border border-white/10 flex-shrink-0">
                                                {b.showtimeId?.movieId?.posterImage ? (
                                                    <img src={getImageUrl(b.showtimeId.movieId.posterImage)} alt={b.showtimeId.movieId.title} className="w-full h-full object-cover" />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-[8px] font-black uppercase text-white/20 text-center">No img</div>
                                                )}
                                            </div>
                                            <div>
                                                <div className="text-sm font-semibold text-white/90">{b.showtimeId?.movieId?.title}</div>
                                                <div className="text-[10px] text-white/40 font-medium mt-1">
                                                    {b.showtimeId?.theaterId?.name} • {typeof b.showtimeId?.screenId === 'string' ? b.showtimeId.screenId : b.showtimeId?.screenId?.screenName}<br />
                                                    {new Date(b.showtimeId?.showDate).toLocaleDateString()} @ {b.showtimeId?.showTime}
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-4 text-xs font-bold text-white/70">{b.selectedSeats.join(", ")}</td>
                                    <td className="p-4 text-sm font-black text-primary">NPR {b.totalAmount}</td>
                                    <td className="p-4 text-center">
                                        <span className={`inline-block py-1 pr-3 pl-3.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${getStatusClasses(b.bookingStatus)}`}>
                                            {b.bookingStatus}
                                        </span>
                                    </td>
                                    <td className="p-4 text-center">
                                        <span className={`inline-block py-1 pr-3 pl-3.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${getStatusClasses(b.paymentStatus)}`}>
                                            {b.paymentStatus}
                                        </span>
                                    </td>
                                    <td className="p-4 text-right">
                                        <div className="flex justify-end gap-2 group-hover:translate-x-0 transition-transform">
                                            {b.bookingStatus !== "confirmed" && (
                                                <button onClick={() => handleUpdateStatus(b._id, "confirmed", "completed")} className="bg-green-500 hover:bg-green-600 text-white py-1.5 px-4 rounded-lg text-xs font-bold transition-all active:scale-95 shadow-lg shadow-green-500/20">Approve</button>
                                            )}
                                            {b.bookingStatus !== "cancelled" && (
                                                <button onClick={() => handleUpdateStatus(b._id, "cancelled", b.paymentStatus)} className="bg-primary/10 hover:bg-primary/20 text-primary py-1.5 px-4 rounded-lg text-xs font-bold border border-primary/20 transition-all active:scale-95">Cancel</button>
                                            )}
                                            <button onClick={() => handleDeleteClick(b._id)} className="bg-red-500 hover:bg-red-600 text-white py-1.5 px-4 rounded-lg text-xs font-bold transition-all active:scale-95 shadow-lg shadow-red-500/20">Delete</button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
            <ConfirmDialog
                open={showConfirm}
                title="Delete Booking"
                message="Are you sure you want to delete this booking? This will permanently remove the record and free up the seats if not already cancelled."
                onConfirm={handleConfirmDelete}
                onCancel={() => setShowConfirm(false)}
            />
        </section>
    );
}

const actionGroupStyle: React.CSSProperties = { display: "flex", gap: "8px" };

const errorStyle: React.CSSProperties = { background: "rgba(229, 9, 20, 0.1)", color: "#e50914", padding: "12px 20px", borderRadius: "12px", marginBottom: "20px" };
const successStyle: React.CSSProperties = { background: "rgba(34, 197, 94, 0.1)", color: "#22c55e", padding: "12px 20px", borderRadius: "12px", marginBottom: "20px" };
const msgStyle: React.CSSProperties = { textAlign: "center", padding: "40px", color: "rgba(255,255,255,0.4)" };
