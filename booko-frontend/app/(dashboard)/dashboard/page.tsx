"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function DashboardPage() {
  const router = useRouter();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("booko_token");
    if (!token) {
      router.replace("/login");
      return;
    }
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setReady(true);
  }, [router]);

  if (!ready) return null;

  const logout = () => {
    localStorage.removeItem("booko_token");
    router.push("/login");
  };

  return (
    <main style={{ padding: 18, fontFamily: "system-ui, Arial" }}>
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
  );
}
