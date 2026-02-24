"use client";

import { useState } from "react";
import Link from "next/link";
import MovieList from "./components/MovieList";
import SearchBar from "./components/SearchBar";

export default function HomePage() {
  const [filters, setFilters] = useState({});

  return (
    <main style={mainStyle}>
      <header style={headerStyle}>
        <div style={navStyle}>
          <h1 style={logoStyle}>BOOKO<span>.</span></h1>
          <div style={linkGroupStyle}>
            <Link href="/dashboard" style={navLinkStyle}>Dashboard</Link>
            <Link href="/profile" style={navLinkStyle}>Profile</Link>
            <Link href="/login" style={authBtnStyle}>Sign In</Link>
          </div>
        </div>

        <div style={heroSectionStyle}>
          <h2 style={heroTitleStyle}>Experience Cinema Like Never Before</h2>
          <p style={heroSubStyle}>Book your tickets for the latest blockbusters in just a few clicks.</p>
        </div>
      </header>

      <section style={sectionStyle}>
        <SearchBar onSearch={setFilters} />
        <h3 style={sectionTitleStyle}>Now Showing</h3>
        <MovieList filters={filters} />
      </section>
    </main>
  );
}

const mainStyle: React.CSSProperties = {
  background: "#0a0a0a",
  minHeight: "100vh",
  color: "white",
  fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
};

const headerStyle: React.CSSProperties = {
  padding: "40px 5%",
  background: "linear-gradient(to bottom, rgba(229, 9, 20, 0.1) 0%, transparent 100%)",
};

const navStyle: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: "80px",
};

const logoStyle: React.CSSProperties = {
  fontSize: "28px",
  fontWeight: 900,
  letterSpacing: "-0.02em",
  margin: 0,
};

const linkGroupStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: "30px",
};

const navLinkStyle: React.CSSProperties = {
  color: "rgba(255, 255, 255, 0.7)",
  textDecoration: "none",
  fontSize: "14px",
  fontWeight: 600,
  transition: "color 0.2s",
};

const authBtnStyle: React.CSSProperties = {
  background: "#e50914",
  color: "white",
  padding: "10px 24px",
  borderRadius: "12px",
  textDecoration: "none",
  fontWeight: 700,
  fontSize: "14px",
  boxShadow: "0 4px 15px rgba(229, 9, 20, 0.3)",
};

const heroSectionStyle: React.CSSProperties = {
  maxWidth: "800px",
};

const heroTitleStyle: React.CSSProperties = {
  fontSize: "56px",
  fontWeight: 900,
  lineHeight: 1.1,
  margin: "0 0 20px 0",
  letterSpacing: "-0.03em",
};

const heroSubStyle: React.CSSProperties = {
  fontSize: "18px",
  color: "rgba(255, 255, 255, 0.6)",
  margin: 0,
};

const sectionStyle: React.CSSProperties = {
  padding: "0 5% 80px 5%",
};

const sectionTitleStyle: React.CSSProperties = {
  fontSize: "24px",
  fontWeight: 800,
  marginBottom: "30px",
};
