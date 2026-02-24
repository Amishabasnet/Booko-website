"use client";

import { use, useState } from "react";
import SeatSelection from "@/app/components/SeatSelection";
import Booking from "@/app/components/Booking";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function BookingPage({ params }: { params: Promise<{ showtimeId: string }> }) {
    const { showtimeId } = use(params);
    const [step, setStep] = useState<"selection" | "booking">("selection");
    const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
    const [totalAmount, setTotalAmount] = useState(0);
    const router = useRouter();

    const handleConfirmSeats = (seats: string[], amount: number) => {
        setSelectedSeats(seats);
        setTotalAmount(amount);
        setStep("booking");
    };

    const handleBackToSelection = () => {
        setStep("selection");
    };

    const handleBookingSuccess = (bookingId: string) => {
        router.push(`/booking/success?id=${bookingId}&total=${totalAmount}`);
    };

    return (
        <main style={containerStyle}>
            <header style={headerStyle}>
                <Link href="/" style={backButtonStyle}>← Cancel & Go Back</Link>
                <h1 style={titleStyle}>
                    {step === "selection" ? "Select Your Seats" : "Confirm Your Booking"}
                </h1>
            </header>

            {step === "selection" ? (
                <SeatSelection
                    showtimeId={showtimeId}
                    onConfirm={handleConfirmSeats}
                />
            ) : (
                <Booking
                    showtimeId={showtimeId}
                    selectedSeats={selectedSeats}
                    totalAmount={totalAmount}
                    onBack={handleBackToSelection}
                    onSuccess={handleBookingSuccess}
                />
            )}
        </main>
    );
}

const containerStyle: React.CSSProperties = {
    background: "#0a0a0a",
    minHeight: "100vh",
    color: "white",
    fontFamily: "'Inter', system-ui, sans-serif",
    padding: "40px 5%",
};

const headerStyle: React.CSSProperties = {
    marginBottom: "40px",
    display: "flex",
    flexDirection: "column",
    gap: "16px",
};

const backButtonStyle: React.CSSProperties = {
    color: "rgba(255, 255, 255, 0.4)",
    textDecoration: "none",
    fontSize: "14px",
    fontWeight: 600,
};

const titleStyle: React.CSSProperties = {
    fontSize: "32px",
    fontWeight: 900,
    margin: 0,
};
