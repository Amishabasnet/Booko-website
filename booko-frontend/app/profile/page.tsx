"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { getProfile } from "@/app/services/auth.service";
import ProtectedRoute from "@/app/components/ProtectedRoute";
import { useAuth } from "@/app/context/AuthContext";

interface UserProfile {
    id: string;
    name: string;
    email: string;
    role: string;
}

export default function ProfilePage() {
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { logout } = useAuth();

    useEffect(() => {
        const fetchProfile = async () => {
            const token = localStorage.getItem("booko_token");
            if (!token) {
                setError("No authentication token found.");
                setLoading(false);
                return;
            }

            try {
                const response = await getProfile(token);
                setProfile(response.data);
            } catch (err: unknown) {
                let message = "Failed to fetch profile.";
                if (axios.isAxiosError(err)) {
                    message = err.response?.data?.message || message;
                }
                setError(message);
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, []);

    return (
        <ProtectedRoute>
            <main style={containerStyle}>
                <h1 style={titleStyle}>User Profile 👤</h1>

                {loading ? (
                    <div style={messageStyle}>Loading profile...</div>
                ) : error ? (
                    <div style={errorStyle}>{error}</div>
                ) : profile ? (
                    <div style={cardStyle}>
                        <div style={fieldGroup}>
                            <label style={labelStyle}>Full Name</label>
                            <div style={valueStyle}>{profile.name}</div>
                        </div>

                        <div style={fieldGroup}>
                            <label style={labelStyle}>Email Address</label>
                            <div style={valueStyle}>{profile.email}</div>
                        </div>

                        <div style={fieldGroup}>
                            <label style={labelStyle}>Account Role</label>
                            <div style={roleBadgeStyle}>{profile.role}</div>
                        </div>

                        <button onClick={logout} style={logoutBtnStyle}>
                            Logout
                        </button>
                    </div>
                ) : null}
            </main>
        </ProtectedRoute>
    );
}

const containerStyle: React.CSSProperties = {
    padding: 24,
    fontFamily: "Inter, system-ui, Arial, sans-serif",
    color: "white",
    maxWidth: 600,
    margin: "0 auto",
};

const titleStyle: React.CSSProperties = {
    fontSize: 28,
    fontWeight: 900,
    marginBottom: 24,
    textAlign: "center",
};

const cardStyle: React.CSSProperties = {
    background: "rgba(255, 255, 255, 0.05)",
    borderRadius: 16,
    padding: 24,
    border: "1px solid rgba(255, 255, 255, 0.1)",
    display: "grid",
    gap: 20,
};

const fieldGroup: React.CSSProperties = {
    display: "grid",
    gap: 4,
};

const labelStyle: React.CSSProperties = {
    fontSize: 13,
    fontWeight: 600,
    color: "rgba(255, 255, 255, 0.5)",
    textTransform: "uppercase",
    letterSpacing: "0.05em",
};

const valueStyle: React.CSSProperties = {
    fontSize: 18,
    fontWeight: 500,
};

const roleBadgeStyle: React.CSSProperties = {
    fontSize: 14,
    fontWeight: 700,
    background: "rgba(229, 9, 20, 0.2)",
    color: "#e50914",
    padding: "4px 12px",
    borderRadius: 20,
    width: "fit-content",
    textTransform: "capitalize",
};

const messageStyle: React.CSSProperties = {
    textAlign: "center",
    fontSize: 16,
    color: "rgba(255, 255, 255, 0.7)",
};

const errorStyle: React.CSSProperties = {
    color: "#ff4d4f",
    background: "rgba(255, 77, 79, 0.1)",
    padding: 12,
    borderRadius: 8,
    textAlign: "center",
};

const logoutBtnStyle: React.CSSProperties = {
    marginTop: 12,
    padding: "12px",
    borderRadius: 12,
    background: "transparent",
    border: "1px solid rgba(255, 255, 255, 0.2)",
    color: "white",
    fontWeight: 700,
    cursor: "pointer",
    transition: "all 0.2s",
};
