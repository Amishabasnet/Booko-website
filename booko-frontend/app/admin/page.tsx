"use client";

import ProtectedRoute from "@/app/components/ProtectedRoute";
import Link from "next/link";
import { useAuth } from "@/app/context/AuthContext";
import AdminMovieManagement from "@/app/components/AdminMovieManagement";
import AdminTheaterShowtimeManagement from "@/app/components/AdminTheaterShowtimeManagement";

export default function AdminPage() {
    const { user, logout } = useAuth();

    return (
        <ProtectedRoute role="admin">
            <main style={{ padding: "40px 5%", fontFamily: "'Inter', system-ui, sans-serif", color: "white", background: "#0a0a0a", minHeight: "100vh" }}>
                <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "40px" }}>
                    <div>
                        <h1 style={{ margin: 0, fontSize: "32px", fontWeight: 900 }}>Admin Dashboard 🛡️</h1>
                        <p style={{ color: "rgba(255, 255, 255, 0.5)", marginTop: "8px" }}>Welcome, {user?.name}. You have admin privileges.</p>
                    </div>
                    <div style={{ display: "flex", gap: "15px", alignItems: "center" }}>
                        <Link href="/" style={{ color: "rgba(255, 255, 255, 0.4)", textDecoration: "none", fontWeight: 600 }}>Back to Home</Link>
                        <button
                            onClick={logout}
                            style={{
                                padding: "12px 24px",
                                borderRadius: "12px",
                                border: "none",
                                background: "#e50914",
                                color: "white",
                                cursor: "pointer",
                                fontWeight: 800,
                                boxShadow: "0 4px 12px rgba(229, 9, 20, 0.2)",
                            }}
                        >
                            Logout
                        </button>
                    </div>
                </header>

                <div style={{ display: "grid", gap: "60px" }}>
                    <AdminMovieManagement />
                    <AdminTheaterShowtimeManagement />
                </div>
            </main>
        </ProtectedRoute>
    );
}
