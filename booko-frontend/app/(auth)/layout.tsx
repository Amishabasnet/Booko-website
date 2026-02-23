import type { ReactNode } from "react";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "grid",
        placeItems: "center",
        padding: 16,
        background:
          "radial-gradient(circle at top, rgba(229,9,20,0.14), transparent 45%), linear-gradient(135deg, #0b0b0f, #111827)",
        color: "white",
      }}
    >
      <div style={{ width: "100%", maxWidth: 420 }}>
        {/* Brand Header */}
        <div style={{ marginBottom: 18 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              marginBottom: 8,
            }}
          >
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: 12,
                background: "rgba(229,9,20,0.95)",
                display: "grid",
                placeItems: "center",
                fontWeight: 900,
              }}
            >
              B
            </div>
            <div>
              <div style={{ fontSize: 20, fontWeight: 900 }}>Booko</div>
              <div style={{ fontSize: 13, color: "rgba(255,255,255,0.72)" }}>
                Movie ticketing • Quick booking
              </div>
            </div>
          </div>
        </div>

        {/* Card */}
        <div
          style={{
            border: "1px solid rgba(255,255,255,0.10)",
            borderRadius: 18,
            padding: 18,
            background: "rgba(255,255,255,0.06)",
            boxShadow: "0 18px 50px rgba(0,0,0,0.45)",
            backdropFilter: "blur(10px)",
          }}
        >
          {children}
        </div>

        <p
          style={{
            marginTop: 14,
            fontSize: 12,
            color: "rgba(255,255,255,0.65)",
            textAlign: "center",
          }}
        >
          By continuing, you agree to Booko Terms & Privacy (dummy).
        </p>
      </div>
    </div>
  );
}
