import Link from "next/link";

export default function HomePage() {
  return (
    <main style={{ padding: 18, fontFamily: "system-ui, Arial" }}>
      <h1 style={{ marginTop: 0 }}>Booko 🎬</h1>
      <p>Dummy Home page (later show movies, now playing, categories).</p>

      <div style={{ display: "flex", gap: 12 }}>
        <Link href="/login">Login</Link>
        <Link href="/register">Register</Link>
        <Link href="/auth/dashboard">Dashboard</Link>
      </div>
    </main>
  );
}
