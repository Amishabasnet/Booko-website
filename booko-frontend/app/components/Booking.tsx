"use client";

import { useState } from "react";
import { createBooking, initiatePayment } from "@/app/services/booking.service";
import axios from "axios";

interface BookingProps {
    showtimeId: string;
    selectedSeats: string[];
    totalAmount: number;
    onBack: () => void;
    onSuccess: (bookingId: string) => void;
}

export default function Booking({ showtimeId, selectedSeats, totalAmount, onBack, onSuccess }: BookingProps) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [paymentMethod, setPaymentMethod] = useState("credit_card");

    const handleConfirmAndPay = async () => {
        setLoading(true);
        setError(null);

        try {
            // 1. Create the booking
            const bookingRes = await createBooking({
                showtimeId,
                selectedSeats,
                totalAmount
            });

            const bookingId = bookingRes.data.booking._id;

            // 2. Initiate payment
            await initiatePayment(bookingId, paymentMethod);

            // 3. If successful, call onSuccess
            onSuccess(bookingId);
        } catch (err: unknown) {
            let message = "An error occurred during booking or payment.";
            if (axios.isAxiosError(err)) {
                message = err.response?.data?.message || message;
            }
            setError(message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={containerStyle}>
            <div style={cardStyle}>
                <h2 style={titleStyle}>Booking Summary</h2>

                <div style={infoRowStyle}>
                    <span style={labelStyle}>Selected Seats:</span>
                    <span style={valueStyle}>{selectedSeats.join(", ")}</span>
                </div>

                <div style={infoRowStyle}>
                    <span style={labelStyle}>Total Amount:</span>
                    <span style={totalStyle}>NPR {totalAmount.toFixed(2)}</span>
                </div>

                <div style={paymentSectionStyle}>
                    <h3 style={sectionTitleStyle}>Payment Method</h3>
                    <select
                        value={paymentMethod}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        style={selectStyle}
                    >
                        <option value="credit_card">Credit Card</option>
                        <option value="debit_card">Debit Card</option>
                        <option value="paypal">PayPal</option>
                        <option value="digital_wallet">Digital Wallet</option>
                    </select>
                </div>

                {error && <div style={errorStyle}>{error}</div>}

                <div style={actionsStyle}>
                    <button
                        onClick={onBack}
                        style={backButtonStyle}
                        disabled={loading}
                    >
                        Back to Seating
                    </button>
                    <button
                        onClick={handleConfirmAndPay}
                        style={payButtonStyle}
                        disabled={loading}
                    >
                        {loading ? "Processing..." : "Confirm & Pay"}
                    </button>
                </div>
            </div>
        </div>
    );
}

const containerStyle: React.CSSProperties = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "20px",
};

const cardStyle: React.CSSProperties = {
    background: "rgba(255, 255, 255, 0.05)",
    borderRadius: "24px",
    padding: "40px",
    width: "100%",
    maxWidth: "500px",
    border: "1px solid rgba(255, 255, 255, 0.1)",
    boxShadow: "0 20px 40px rgba(0, 0, 0, 0.4)",
};

const titleStyle: React.CSSProperties = {
    fontSize: "24px",
    fontWeight: 800,
    marginBottom: "30px",
    textAlign: "center",
};

const infoRowStyle: React.CSSProperties = {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "15px",
    fontSize: "16px",
};

const labelStyle: React.CSSProperties = {
    color: "rgba(255, 255, 255, 0.5)",
};

const valueStyle: React.CSSProperties = {
    fontWeight: 600,
};

const totalStyle: React.CSSProperties = {
    fontSize: "20px",
    fontWeight: 800,
    color: "#e50914",
};

const paymentSectionStyle: React.CSSProperties = {
    marginTop: "30px",
    paddingTop: "30px",
    borderTop: "1px solid rgba(255, 255, 255, 0.1)",
};

const sectionTitleStyle: React.CSSProperties = {
    fontSize: "18px",
    fontWeight: 700,
    marginBottom: "15px",
};

const selectStyle: React.CSSProperties = {
    width: "100%",
    padding: "12px",
    borderRadius: "10px",
    background: "rgba(255, 255, 255, 0.1)",
    border: "1px solid rgba(255, 255, 255, 0.2)",
    color: "white",
    fontSize: "16px",
};

const errorStyle: React.CSSProperties = {
    color: "#ff4d4f",
    marginTop: "20px",
    textAlign: "center",
    fontSize: "14px",
};

const actionsStyle: React.CSSProperties = {
    display: "flex",
    gap: "15px",
    marginTop: "40px",
};

const backButtonStyle: React.CSSProperties = {
    flex: 1,
    padding: "16px",
    borderRadius: "12px",
    border: "1px solid rgba(255, 255, 255, 0.2)",
    background: "transparent",
    color: "white",
    fontSize: "15px",
    fontWeight: 600,
    cursor: "pointer",
};

const payButtonStyle: React.CSSProperties = {
    flex: 2,
    padding: "16px",
    borderRadius: "12px",
    border: "none",
    background: "#e50914",
    color: "white",
    fontSize: "16px",
    fontWeight: 800,
    cursor: "pointer",
    boxShadow: "0 10px 20px rgba(229, 9, 20, 0.2)",
};
