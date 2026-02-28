"use client";

import { useState, useEffect } from "react";

interface SearchBarProps {
    onSearch: (filters: { search: string; genre: string; date: string }) => void;
}

export default function SearchBar({ onSearch }: SearchBarProps) {
    const [search, setSearch] = useState("");
    const [genre, setGenre] = useState("");
    const [date, setDate] = useState("");

    // Debounce search
    useEffect(() => {
        const timer = setTimeout(() => {
            onSearch({ search, genre, date });
        }, 500);

        return () => clearTimeout(timer);
    }, [search, genre, date]);

    return (
        <div style={containerStyle}>
            <div style={inputGroupStyle}>
                <svg
                    style={iconStyle}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                </svg>
                <input
                    type="text"
                    placeholder="Search movies by title..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    style={inputStyle}
                />
            </div>

            <div style={filterGroupStyle}>
                <select
                    value={genre}
                    onChange={(e) => setGenre(e.target.value)}
                    style={selectStyle}
                >
                    <option value="" style={{ background: 'black', color: 'white' }}>All Genres</option>
                    <option value="Action" style={{ background: 'black', color: 'white' }}>Action</option>
                    <option value="Comedy" style={{ background: 'black', color: 'white' }}>Comedy</option>
                    <option value="Drama" style={{ background: 'black', color: 'white' }}>Drama</option>
                    <option value="Sci-Fi" style={{ background: 'black', color: 'white' }}>Sci-Fi</option>
                    <option value="Horror" style={{ background: 'black', color: 'white' }}>Horror</option>
                    <option value="Romance" style={{ background: 'black', color: 'white' }}>Romance</option>
                </select>

                <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    style={dateInputStyle}
                />
            </div>
        </div>
    );
}

const containerStyle: React.CSSProperties = {
    display: "flex",
    gap: "20px",
    background: "rgba(255, 255, 255, 0.03)",
    padding: "20px",
    borderRadius: "24px",
    border: "1px solid rgba(255, 255, 255, 0.05)",
    marginBottom: "40px",
    alignItems: "center",
    flexWrap: "wrap",
};

const inputGroupStyle: React.CSSProperties = {
    position: "relative",
    flex: 1,
    minWidth: "250px",
};

const iconStyle: React.CSSProperties = {
    position: "absolute",
    left: "15px",
    top: "50%",
    transform: "translateY(-50%)",
    width: "20px",
    height: "20px",
    color: "rgba(255, 255, 255, 0.4)",
};

const inputStyle: React.CSSProperties = {
    width: "100%",
    background: "rgba(255, 255, 255, 0.05)",
    border: "1px solid rgba(255, 255, 255, 0.1)",
    borderRadius: "15px",
    padding: "12px 12px 12px 45px",
    color: "white",
    fontSize: "16px",
    outline: "none",
    transition: "border-color 0.2s",
};

const filterGroupStyle: React.CSSProperties = {
    display: "flex",
    gap: "15px",
    flexWrap: "wrap",
};

const selectStyle: React.CSSProperties = {
    background: "black",
    border: "1px solid rgba(255, 255, 255, 0.1)",
    borderRadius: "15px",
    padding: "12px 20px",
    color: "white",
    fontSize: "15px",
    cursor: "pointer",
    outline: "none",
};

const dateInputStyle: React.CSSProperties = {
    ...selectStyle,
    padding: "10px 15px",
};
