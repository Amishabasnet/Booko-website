"use client";

import React from "react";

interface LoaderProps {
    message?: string;
    fullscreen?: boolean;
}

export default function Loader({ message = "Loading...", fullscreen = false }: LoaderProps) {
    const containerStyle: React.CSSProperties = {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "40px",
        minHeight: fullscreen ? "100vh" : "200px",
        width: "100%",
        background: fullscreen ? "#0a0a0a" : "transparent",
        color: "white",
        zIndex: fullscreen ? 9999 : 1,
        position: fullscreen ? "fixed" : "relative",
        top: 0,
        left: 0,
    };

    const spinnerStyle: React.CSSProperties = {
        width: "50px",
        height: "50px",
        border: "4px solid rgba(229, 9, 20, 0.1)",
        borderTop: "4px solid #e50914",
        borderRadius: "50%",
        animation: "spin 1s linear infinite",
        marginBottom: "20px",
    };

    const messageStyle: React.CSSProperties = {
        fontSize: "18px",
        fontWeight: 600,
        color: "rgba(255, 255, 255, 0.7)",
        letterSpacing: "0.02em",
    };

    return (
        <div style={containerStyle}>
            <style>
                {`
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
                `}
            </style>
            <div style={spinnerStyle}></div>
            {message && <p style={messageStyle}>{message}</p>}
        </div>
    );
}
