"use client";

import { useEffect, useState, use } from "react";
import axios from "axios";
import { getMovieById, getMovieShowtimes } from "@/app/services/movie.service";
import Link from "next/link";

interface MovieDetail {
    _id: string;
    title: string;
    description: string;
    genre: string[];
    duration: number;
    language: string;
    releaseDate: string;
    posterImage: string;
}

interface Showtime {
    _id: string;
    showTime: string;
    showDate: string;
    ticketPrice: number;
}

export default function MovieDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const [movie, setMovie] = useState<MovieDetail | null>(null);
    const [showtimes, setShowtimes] = useState<Showtime[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchMovieData = async () => {
            try {
                const [movieRes, showtimesRes] = await Promise.all([
                    getMovieById(id),
                    getMovieShowtimes(id)
                ]);

                setMovie(movieRes.data.movie);
                setShowtimes(showtimesRes.data.showtimes);
            } catch (err: unknown) {
                let message = "Failed to load movie details.";
                if (axios.isAxiosError(err)) {
                    message = err.response?.data?.message || message;
                }
                setError(message);
            } finally {
                setLoading(false);
            }
        };

        fetchMovieData();
    }, [id]);

    if (loading) return <div style={messageStyle}>Curating details for you... ✨</div>;
    if (error) return <div style={errorStyle}>{error}</div>;
    if (!movie) return <div style={messageStyle}>Movie not found.</div>;

    return (
        <main style={containerStyle}>
            <header style={headerStyle}>
                <Link href="/" style={backButtonStyle}>← Back to Movies</Link>
            </header>

            <div style={detailGridStyle}>
                <div style={posterSectionStyle}>
                    {movie.posterImage ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={movie.posterImage} alt={movie.title} style={posterStyle} />
                    ) : (
                        <div style={posterPlaceholderStyle}>No Poster Available</div>
                    )}
                </div>

                <div style={infoSectionStyle}>
                    <div style={badgeContainerStyle}>
                        {movie.genre.map((g) => (
                            <span key={g} style={genreBadgeStyle}>{g}</span>
                        ))}
                    </div>

                    <h1 style={titleStyle}>{movie.title}</h1>

                    <div style={metaGridStyle}>
                        <div style={metaItemStyle}>
                            <label style={metaLabelStyle}>Duration</label>
                            <span>{movie.duration} mins</span>
                        </div>
                        <div style={metaItemStyle}>
                            <label style={metaLabelStyle}>Language</label>
                            <span>{movie.language}</span>
                        </div>
                        <div style={metaItemStyle}>
                            <label style={metaLabelStyle}>Release Date</label>
                            <span>{new Date(movie.releaseDate).toLocaleDateString()}</span>
                        </div>
                    </div>

                    <div style={descriptionSectionStyle}>
                        <h2 style={subTitleStyle}>Synopsis</h2>
                        <p style={descriptionStyle}>{movie.description}</p>
                    </div>

                    <div style={bookingSectionStyle}>
                        <h2 style={subTitleStyle}>Available Showtimes</h2>
                        <div style={showtimeGridStyle}>
                            {showtimes.length > 0 ? (
                                showtimes.map((st) => (
                                    <Link
                                        key={st._id}
                                        href={`/booking/${st._id}`}
                                        style={showtimeLinkStyle}
                                    >
                                        <div style={showtimeBadgeStyle}>
                                            <span style={timeStyle}>{st.showTime}</span>
                                            <span style={priceStyle}>${st.ticketPrice}</span>
                                        </div>
                                    </Link>
                                ))
                            ) : (
                                <p style={noShowtimeStyle}>Stay tuned! New showtimes coming soon.</p>
                            )}
                        </div>

                        {showtimes.length > 0 && (
                            <button
                                onClick={() => document.getElementById('showtimes')?.scrollIntoView({ behavior: 'smooth' })}
                                style={bookNowBtnStyle}
                            >
                                Book Tickets Now
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </main>
    );
}

const containerStyle: React.CSSProperties = {
    background: "#0a0a0a",
    minHeight: "100vh",
    color: "white",
    fontFamily: "'Inter', system-ui, sans-serif",
    padding: "40px 5%",
};

const headerStyle: React.CSSProperties = {
    marginBottom: "40px",
};

const backButtonStyle: React.CSSProperties = {
    color: "rgba(255, 255, 255, 0.6)",
    textDecoration: "none",
    fontSize: "14px",
    fontWeight: 600,
    transition: "color 0.2s",
};

const detailGridStyle: React.CSSProperties = {
    display: "grid",
    gridTemplateColumns: "1fr 2fr",
    gap: "60px",
    alignItems: "start",
};

const posterSectionStyle: React.CSSProperties = {
    position: "sticky",
    top: "40px",
};

const posterStyle: React.CSSProperties = {
    width: "100%",
    borderRadius: "24px",
    boxShadow: "0 20px 50px rgba(0,0,0,0.5)",
    border: "1px solid rgba(255, 255, 255, 0.1)",
};

const posterPlaceholderStyle: React.CSSProperties = {
    aspectRatio: "2/3",
    background: "rgba(255, 255, 255, 0.05)",
    borderRadius: "24px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "rgba(255, 255, 255, 0.3)",
};

const infoSectionStyle: React.CSSProperties = {
    display: "grid",
    gap: "32px",
};

const badgeContainerStyle: React.CSSProperties = {
    display: "flex",
    gap: "10px",
};

const genreBadgeStyle: React.CSSProperties = {
    background: "rgba(229, 9, 20, 0.1)",
    color: "#e50914",
    padding: "6px 16px",
    borderRadius: "100px",
    fontSize: "12px",
    fontWeight: 800,
    textTransform: "uppercase",
    letterSpacing: "0.05em",
};

const titleStyle: React.CSSProperties = {
    fontSize: "48px",
    fontWeight: 900,
    margin: 0,
    letterSpacing: "-0.03em",
};

const metaGridStyle: React.CSSProperties = {
    display: "flex",
    gap: "40px",
    borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
    paddingBottom: "32px",
};

const metaItemStyle: React.CSSProperties = {
    display: "grid",
    gap: "4px",
};

const metaLabelStyle: React.CSSProperties = {
    fontSize: "12px",
    fontWeight: 700,
    color: "rgba(255, 255, 255, 0.4)",
    textTransform: "uppercase",
};

const descriptionSectionStyle: React.CSSProperties = {};

const subTitleStyle: React.CSSProperties = {
    fontSize: "20px",
    fontWeight: 800,
    marginBottom: "16px",
    color: "#fff",
};

const descriptionStyle: React.CSSProperties = {
    fontSize: "16px",
    lineHeight: 1.8,
    color: "rgba(255, 255, 255, 0.7)",
    margin: 0,
};

const bookingSectionStyle: React.CSSProperties = {
    background: "rgba(255, 255, 255, 0.03)",
    padding: "32px",
    borderRadius: "24px",
    border: "1px solid rgba(255, 255, 255, 0.08)",
};

const showtimeGridStyle: React.CSSProperties = {
    display: "flex",
    flexWrap: "wrap",
    gap: "12px",
    marginBottom: "32px",
};

const showtimeLinkStyle: React.CSSProperties = {
    textDecoration: "none",
};

const showtimeBadgeStyle: React.CSSProperties = {
    background: "rgba(255, 255, 255, 0.05)",
    border: "1px solid rgba(255, 255, 255, 0.1)",
    padding: "16px 24px",
    borderRadius: "16px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "4px",
    transition: "all 0.2s ease",
};

const timeStyle: React.CSSProperties = {
    fontSize: "18px",
    fontWeight: 800,
    color: "#fff",
};

const priceStyle: React.CSSProperties = {
    fontSize: "12px",
    fontWeight: 600,
    color: "rgba(255, 255, 255, 0.5)",
};

const noShowtimeStyle: React.CSSProperties = {
    color: "rgba(255, 255, 255, 0.4)",
    fontStyle: "italic",
};

const bookNowBtnStyle: React.CSSProperties = {
    width: "100%",
    padding: "18px",
    borderRadius: "16px",
    background: "#e50914",
    color: "white",
    border: "none",
    fontSize: "16px",
    fontWeight: 800,
    cursor: "pointer",
    boxShadow: "0 10px 30px rgba(229, 9, 20, 0.3)",
};

const messageStyle: React.CSSProperties = {
    textAlign: "center",
    padding: "100px",
    color: "white",
    fontSize: "20px",
};

const errorStyle: React.CSSProperties = {
    background: "rgba(255, 77, 79, 0.1)",
    color: "#ff4d4f",
    padding: "24px",
    borderRadius: "16px",
    textAlign: "center",
    margin: "40px auto",
    maxWidth: "600px",
    border: "1px solid rgba(255, 77, 79, 0.2)",
};
