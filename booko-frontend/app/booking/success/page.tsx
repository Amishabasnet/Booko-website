"use client";

import { use, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

function SuccessContent() {
    const searchParams = useSearchParams();
    const bookingId = searchParams.get("id");
    const total = searchParams.get("total");

    return (
        <div style={cardStyle}>
            <div style={iconStyle}>✓</div>
            <h1 style={titleStyle}>Booking Confirmed!</h1>
            <p style={subtitleStyle}>Your tickets have been successfully booked and paid for.</p>

            <div style={detailsStyle}>
                <div style={detailRowStyle}>
                    <span style={labelStyle}>Booking ID:</span>
                    <span style={valueStyle}>{bookingId}</span>
                </div>
                <div style={detailRowStyle}>
                    <span style={labelStyle}>Amount Paid:</span>
                    <span style={totalStyle}>NPR {total}</span>
                </div>
            </div>

            <div style={actionsStyle}>
                <Link href="/" style={homeButtonStyle}>
                    Go to Home
                </Link>
                <Link href="/profile" style={profileButtonStyle}>
                    View My Bookings
                </Link>
            </div>
        </div>
    );
}

export default function SuccessPage() {
    return (
        <main style={containerStyle}>
            <Suspense fallback={<div style={{ color: "white" }}>Loading...</div>}>
                <SuccessContent />
            </Suspense>
        </main>
    );
}

const containerStyle: React.CSSProperties = {
    background: "#0a0a0a",
    minHeight: "100vh",
    color: "white",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "20px",
    fontFamily: "'Inter', system-ui, sans-serif",
};

const cardStyle: React.CSSProperties = {
    background: "rgba(255, 255, 255, 0.03)",
    borderRadius: "32px",
    padding: "60px 40px",
    width: "100%",
    maxWidth: "450px",
    textAlign: "center",
    border: "1px solid rgba(255, 255, 255, 0.08)",
    boxShadow: "0 30px 60px rgba(0, 0, 0, 0.5)",
};

const iconStyle: React.CSSProperties = {
    width: "80px",
    height: "80px",
    background: "#22c55e",
    borderRadius: "50%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontSize: "40px",
    margin: "0 auto 30px",
    boxShadow: "0 10px 25px rgba(34, 197, 94, 0.3)",
};

const titleStyle: React.CSSProperties = {
    fontSize: "32px",
    fontWeight: 900,
    marginBottom: "12px",
};

const subtitleStyle: React.CSSProperties = {
    color: "rgba(255, 255, 255, 0.5)",
    fontSize: "16px",
    marginBottom: "40px",
    lineHeight: 1.5,
};

const detailsStyle: React.CSSProperties = {
    background: "rgba(255, 255, 255, 0.03)",
    borderRadius: "16px",
    padding: "24px",
    marginBottom: "40px",
};

const detailRowStyle: React.CSSProperties = {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "12px",
    fontSize: "15px",
};

const labelStyle: React.CSSProperties = {
    color: "rgba(255, 255, 255, 0.4)",
};

const valueStyle: React.CSSProperties = {
    fontWeight: 600,
    fontFamily: "monospace",
};

const totalStyle: React.CSSProperties = {
    fontWeight: 800,
    color: "#22c55e",
};

const actionsStyle: React.CSSProperties = {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
};

const homeButtonStyle: React.CSSProperties = {
    background: "white",
    color: "black",
    padding: "16px",
    borderRadius: "12px",
    textDecoration: "none",
    fontWeight: 700,
    transition: "transform 0.2s",
};

const profileButtonStyle: React.CSSProperties = {
    background: "rgba(255, 255, 255, 0.05)",
    color: "white",
    padding: "16px",
    borderRadius: "12px",
    textDecoration: "none",
    fontWeight: 600,
    border: "1px solid rgba(255, 255, 255, 0.1)",
};
