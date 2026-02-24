"use client";

import ProtectedRoute from "@/app/components/ProtectedRoute";
import Link from "next/link";
import { useAuth } from "@/app/context/AuthContext";

export default function AdminPage() {
    const { user, logout } = useAuth();

    return (
        <ProtectedRoute role="admin">
            <main style={{ padding: 18, fontFamily: "system-ui, Arial", color: "white" }}>
                <h1 style={{ marginTop: 0 }}>Admin Dashboard 🛡️</h1>
                <p>Welcome, {user?.name}. You have admin privileges.</p>

                <div style={{ display: "grid", gap: 12, marginTop: 20 }}>
                    <Link href="/" style={{ color: "white" }}>Back to Home</Link>
                    <button
                        onClick={logout}
                        style={{
                            width: "fit-content",
                            padding: "10px 14px",
                            borderRadius: 12,
                            border: "1px solid #e50914",
                            background: "#e50914",
                            color: "white",
                            cursor: "pointer",
                            fontWeight: 800,
                        }}
                    >
                        Logout
                    </button>
                </div>
            </main>
        </ProtectedRoute>
    );
}
