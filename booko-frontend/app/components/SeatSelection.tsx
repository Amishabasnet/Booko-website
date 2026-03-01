"use client";

import { useEffect, useState } from "react";
import { createBooking } from "@/app/services/booking.service";
import { getShowtimeById } from "@/app/services/showtime.service";
import Loader from "./ui/Loader";
import ErrorMessage from "./ui/ErrorMessage";
import axios from "axios";
import { useRouter } from "next/navigation";

interface Seat {
    row: string;
    col: number;
    isAvailable: boolean;
    type: "normal" | "premium" | "vip";
}

interface ShowtimeDetails {
    _id: string;
    movieId: { title: string };
    theaterId: { name: string };
    screenId: { screenName: string, seatLayout: Seat[][] };
    showTime: string;
    ticketPrice: number;
    bookedSeats: string[];
}

export default function SeatSelection({ showtimeId, onConfirm }: { showtimeId: string, onConfirm: (seats: string[], price: number) => void }) {
    const [showtime, setShowtime] = useState<ShowtimeDetails | null>(null);
    const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchShowtimeData = async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await getShowtimeById(showtimeId);
            setShowtime(res.data.showtime);
        } catch (err: unknown) {
            let message = "Failed to load seating layout.";
            if (axios.isAxiosError(err)) {
                message = err.response?.data?.message || message;
            }
            setError(message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchShowtimeData();
    }, [showtimeId]);

    const toggleSeat = (seatId: string) => {
        if (showtime?.bookedSeats.includes(seatId)) return;

        setSelectedSeats(prev =>
            prev.includes(seatId)
                ? prev.filter(s => s !== seatId)
                : [...prev, seatId]
        );
    };

    if (loading) return <Loader message="Preparing your theater seating view..." />;
    if (error) return <ErrorMessage message={error} onRetry={fetchShowtimeData} />;
    if (!showtime) return <div className="text-center py-20 text-white/50 text-lg font-medium">Showtime not found.</div>;

    const totalPrice = selectedSeats.length * showtime.ticketPrice;

    return (
        <div className="p-5 md:p-10 bg-white/5 rounded-3xl border border-white/10 shadow-2xl">
            <div className="flex justify-center mb-10 md:mb-16">
                <div className="w-[90%] md:w-[80%] h-2.5 bg-white/20 rounded-[50%_50%_0_0] flex items-center justify-center text-[8px] md:text-[10px] font-black text-white/40 shadow-[0_-20px_40px_rgba(255,255,255,0.05)] uppercase">
                    Screen
                </div>
            </div>

            <div className="overflow-x-auto pb-5 md:pb-0 mb-10">
                <div className="grid gap-2.5 justify-center min-w-max md:min-w-0">
                    {showtime.screenId.seatLayout.map((row, rowIndex) => (
                        <div key={rowIndex} className="flex gap-2.5">
                            {row.map((seat) => {
                                const seatId = `${seat.row}-${seat.col}`;
                                const isBooked = showtime.bookedSeats.includes(seatId);
                                const isSelected = selectedSeats.includes(seatId);

                                return (
                                    <button
                                        key={seatId}
                                        onClick={() => toggleSeat(seatId)}
                                        disabled={isBooked}
                                        className={`w-7 h-7 md:w-8 md:h-8 rounded-lg border-2 border-transparent transition-all duration-200 cursor-pointer disabled:bg-green-500 disabled:cursor-not-allowed ${isSelected ? "bg-primary border-primary scale-110" : "bg-white/10 hover:bg-white/20"}`}
                                        title={`${seat.row}${seat.col} (${seat.type}${isBooked ? ' - Booked' : ''})`}
                                    />
                                );
                            })}
                        </div>
                    ))}
                </div>
            </div>

            <div className="flex flex-wrap justify-center gap-6 md:gap-8 mb-10 text-xs md:text-sm text-white/50">
                <div className="flex items-center gap-2">
                    <div className="w-5 h-5 rounded bg-white/10"></div> Available
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-5 h-5 rounded bg-primary"></div> Selected
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-5 h-5 rounded bg-green-500"></div> Booked
                </div>
            </div>

            <div className="flex flex-col sm:flex-row justify-between items-center border-t border-white/10 pt-8 gap-6 sm:gap-0">
                <div className="text-center sm:text-left">
                    <p className="text-sm text-white/50 m-0 mb-1.5">{selectedSeats.length} seats selected</p>
                    <h3 className="text-2xl md:text-3xl font-black m-0 tracking-tight">Total: NPR {totalPrice.toFixed(2)}</h3>
                </div>
                <button
                    onClick={() => onConfirm(selectedSeats, totalPrice)}
                    disabled={selectedSeats.length === 0}
                    className={`bg-primary shadow-xl shadow-primary/30 text-white py-4 px-10 rounded-2xl font-extrabold text-base transition-all active:scale-95 disabled:opacity-50 disabled:shadow-none disabled:active:scale-100 uppercase tracking-wide w-full sm:w-auto`}
                >
                    Review & Pay
                </button>
            </div>
        </div>
    );
}
