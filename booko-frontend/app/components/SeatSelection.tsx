"use client";

import { useEffect, useState } from "react";
import { getShowtimeDetails, createBooking } from "@/app/services/booking.service";
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

export default function SeatSelection({ showtimeId }: { showtimeId: string }) {
    const [showtime, setShowtime] = useState<ShowtimeDetails | null>(null);
    const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [bookingLoading, setBookingLoading] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await getShowtimeDetails(showtimeId);
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
        fetchData();
    }, [showtimeId]);

    const toggleSeat = (seatId: string) => {
        if (showtime?.bookedSeats.includes(seatId)) return;

        setSelectedSeats(prev =>
            prev.includes(seatId)
                ? prev.filter(s => s !== seatId)
                : [...prev, seatId]
        );
    };

    const handleBooking = async () => {
        if (selectedSeats.length === 0) return;
        setBookingLoading(true);
        try {
            await createBooking({ showtimeId, seats: selectedSeats });
            router.push("/dashboard?booking=success");
        } catch (err: unknown) {
            let message = "Booking failed.";
            if (axios.isAxiosError(err)) {
                message = err.response?.data?.message || message;
            }
            setError(message);
        } finally {
            setBookingLoading(false);
        }
    };

    if (loading) return <div style={messageStyle}>Loading seat map... 🛋️</div>;
    if (error) return <div style={errorStyle}>{error}</div>;
    if (!showtime) return <div style={messageStyle}>Showtime not found.</div>;

    const totalPrice = selectedSeats.length * showtime.ticketPrice;

    return (
        <div style={containerStyle}>
            <div style={screenContainerStyle}>
                <div style={screenVisualStyle}>SCREEN</div>
            </div>

            <div style={seatGridStyle}>
                {showtime.screenId.seatLayout.map((row, rowIndex) => (
                    <div key={rowIndex} style={rowStyle}>
                        {row.map((seat) => {
                            const seatId = `${seat.row}-${seat.col}`;
                            const isBooked = showtime.bookedSeats.includes(seatId);
                            const isSelected = selectedSeats.includes(seatId);

                            return (
                                <button
                                    key={seatId}
                                    onClick={() => toggleSeat(seatId)}
                                    disabled={isBooked}
                                    style={{
                                        ...seatBaseStyle,
                                        background: isBooked ? "#333" : isSelected ? "#e50914" : "rgba(255,255,255,0.1)",
                                        cursor: isBooked ? "not-allowed" : "pointer",
                                        borderColor: isSelected ? "#e50914" : "transparent",
                                    }}
                                    title={`${seat.row}${seat.col} (${seat.type})`}
                                />
                            );
                        })}
                    </div>
                ))}
            </div>

            <div style={legendStyle}>
                <div style={legendItem}><div style={{ ...legendBox, background: "rgba(255,255,255,0.1)" }}></div> Available</div>
                <div style={legendItem}><div style={{ ...legendBox, background: "#e50914" }}></div> Selected</div>
                <div style={legendItem}><div style={{ ...legendBox, background: "#333" }}></div> Booked</div>
            </div>

            <div style={summaryStyle}>
                <div style={summaryInfoStyle}>
                    <p style={selectedCountStyle}>{selectedSeats.length} seats selected</p>
                    <h3 style={totalPriceStyle}>Total: ${totalPrice.toFixed(2)}</h3>
                </div>
                <button
                    onClick={handleBooking}
                    disabled={selectedSeats.length === 0 || bookingLoading}
                    style={{
                        ...bookingBtnStyle,
                        opacity: selectedSeats.length === 0 || bookingLoading ? 0.5 : 1,
                    }}
                >
                    {bookingLoading ? "Processing..." : "Confirm Booking"}
                </button>
            </div>
        </div>
    );
}

const containerStyle: React.CSSProperties = {
    padding: "40px",
    background: "rgba(255, 255, 255, 0.03)",
    borderRadius: "24px",
    border: "1px solid rgba(255, 255, 255, 0.08)",
};

const screenContainerStyle: React.CSSProperties = {
    display: "flex",
    justifyContent: "center",
    marginBottom: "60px",
};

const screenVisualStyle: React.CSSProperties = {
    width: "80%",
    height: "10px",
    background: "rgba(255, 255, 255, 0.2)",
    borderRadius: "50% 50% 0 0",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "10px",
    fontWeight: 900,
    color: "rgba(255, 255, 255, 0.4)",
    boxShadow: "0 -20px 40px rgba(255, 255, 255, 0.05)",
};

const seatGridStyle: React.CSSProperties = {
    display: "grid",
    gap: "10px",
    justifyContent: "center",
    marginBottom: "40px",
};

const rowStyle: React.CSSProperties = {
    display: "flex",
    gap: "10px",
};

const seatBaseStyle: React.CSSProperties = {
    width: "30px",
    height: "30px",
    borderRadius: "6px",
    border: "2px solid transparent",
    transition: "all 0.2s",
};

const legendStyle: React.CSSProperties = {
    display: "flex",
    justifyContent: "center",
    gap: "30px",
    marginBottom: "40px",
    fontSize: "13px",
    color: "rgba(255, 255, 255, 0.5)",
};

const legendItem: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    gap: "8px",
};

const legendBox: React.CSSProperties = {
    width: "20px",
    height: "20px",
    borderRadius: "4px",
};

const summaryStyle: React.CSSProperties = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    borderTop: "1px solid rgba(255, 255, 255, 0.1)",
    paddingTop: "30px",
};

const summaryInfoStyle: React.CSSProperties = {
    display: "grid",
    gap: "4px",
};

const selectedCountStyle: React.CSSProperties = {
    fontSize: "14px",
    color: "rgba(255, 255, 255, 0.5)",
    margin: 0,
};

const totalPriceStyle: React.CSSProperties = {
    fontSize: "24px",
    fontWeight: 900,
    margin: 0,
};

const bookingBtnStyle: React.CSSProperties = {
    background: "#e50914",
    color: "white",
    padding: "16px 40px",
    borderRadius: "16px",
    border: "none",
    fontSize: "16px",
    fontWeight: 800,
    cursor: "pointer",
    boxShadow: "0 10px 30px rgba(229, 9, 20, 0.3)",
};

const messageStyle: React.CSSProperties = {
    textAlign: "center",
    padding: "60px",
    color: "rgba(255, 255, 255, 0.5)",
};

const errorStyle: React.CSSProperties = {
    color: "#ff4d4f",
    padding: "20px",
    textAlign: "center",
};
