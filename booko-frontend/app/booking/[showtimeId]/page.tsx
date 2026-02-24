"use client";

import { use } from "react";
import SeatSelection from "@/app/components/SeatSelection";
import Link from "next/link";

export default function BookingPage({ params }: { params: Promise<{ showtimeId: string }> }) {
    const { showtimeId } = use(params);

    return (
        <main style={containerStyle}>
            <header style={headerStyle}>
                <Link href="/" style={backButtonStyle}>← Cancel & Go Back</Link>
                <h1 style={titleStyle}>Select Your Seats</h1>
            </header>

            <SeatSelection showtimeId={showtimeId} />
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
