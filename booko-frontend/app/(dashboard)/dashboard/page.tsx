"use client";

import ProtectedRoute from "@/app/components/ProtectedRoute";
import { useAuth } from "@/app/context/AuthContext";

export default function DashboardPage() {
  const { logout } = useAuth();

  return (
    <ProtectedRoute>
      <main style={{ padding: 18, fontFamily: "system-ui, Arial", color: "white" }}>
        <h1 style={{ marginTop: 0 }}>Booko Dashboard 🎟️</h1>
        <p>This is a dummy page after login. (Later show bookings, movies, seats.)</p>

        <button
          onClick={logout}
          style={{
            padding: "10px 14px",
            borderRadius: 12,
            border: "1px solid #111",
            background: "#111",
            color: "white",
            cursor: "pointer",
            fontWeight: 800,
          }}
        >
          Logout
        </button>
      </main>
    </ProtectedRoute>
  );
}
