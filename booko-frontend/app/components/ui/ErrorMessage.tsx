"use client";

import React from "react";

interface ErrorMessageProps {
    title?: string;
    message?: string;
    onRetry?: () => void;
}

export default function ErrorMessage({
    title = "Oops! Something went wrong",
    message = "We encountered an error while processing your request.",
    onRetry
}: ErrorMessageProps) {
    const containerStyle: React.CSSProperties = {
        background: "rgba(255, 77, 79, 0.05)",
        border: "1px solid rgba(255, 77, 79, 0.2)",
        borderRadius: "20px",
        padding: "40px 30px",
        textAlign: "center",
        maxWidth: "600px",
        margin: "40px auto",
        color: "white",
    };

    const iconStyle: React.CSSProperties = {
        fontSize: "48px",
        marginBottom: "20px",
        display: "block",
    };

    const titleStyle: React.CSSProperties = {
        fontSize: "22px",
        fontWeight: 800,
        margin: "0 0 10px 0",
        color: "#ff4d4f",
    };

    const textStyle: React.CSSProperties = {
        fontSize: "16px",
        color: "rgba(255, 255, 255, 0.6)",
        margin: "0 0 25px 0",
        lineHeight: 1.6,
    };

    const buttonStyle: React.CSSProperties = {
        background: "#e50914",
        color: "white",
        border: "none",
        padding: "12px 30px",
        borderRadius: "12px",
        fontWeight: 700,
        cursor: "pointer",
        fontSize: "15px",
        transition: "transform 0.2s ease",
    };

    return (
        <div style={containerStyle}>
            <span style={iconStyle}>⚠️</span>
            <h3 style={titleStyle}>{title}</h3>
            <p style={textStyle}>{message}</p>
            {onRetry && (
                <button
                    onClick={onRetry}
                    style={buttonStyle}
                    onMouseOver={(e) => e.currentTarget.style.transform = "scale(1.05)"}
                    onMouseOut={(e) => e.currentTarget.style.transform = "scale(1)"}
                >
                    Try Again
                </button>
            )}
        </div>
    );
}
