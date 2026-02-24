"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import axios from "axios";
import { getMovies, getMovieShowtimes } from "@/app/services/movie.service";

interface Movie {
    _id: string;
    title: string;
    description: string;
    genre: string[];
    duration: number;
    posterImage: string;
    showtimes?: Showtime[];
}

interface Showtime {
    _id: string;
    showTime: string;
    showDate: string;
    ticketPrice: number;
}

interface MovieListProps {
    filters?: any;
}

export default function MovieList({ filters }: MovieListProps) {
    const [movies, setMovies] = useState<Movie[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const moviesRes = await getMovies(filters);
                const moviesData: Movie[] = moviesRes.data.movies;

                // Fetch showtimes for each movie
                const moviesWithShowtimes = await Promise.all(
                    moviesData.map(async (movie) => {
                        try {
                            const showtimesRes = await getMovieShowtimes(movie._id);
                            return { ...movie, showtimes: showtimesRes.data.showtimes };
                        } catch (err) {
                            console.error(`Failed to fetch showtimes for movie ${movie._id}`, err);
                            return { ...movie, showtimes: [] };
                        }
                    })
                );

                setMovies(moviesWithShowtimes);
            } catch (err: unknown) {
                let message = "Failed to load movies.";
                if (axios.isAxiosError(err)) {
                    message = err.response?.data?.message || message;
                }
                setError(message);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [filters]);

    if (loading) return <div style={messageStyle}>Searching for blockbusters... 🍿</div>;
    if (error) return <div style={errorStyle}>{error}</div>;

    if (movies.length === 0) {
        return (
            <div style={messageStyle}>
                <div style={{ fontSize: "48px", marginBottom: "20px" }}>🔍</div>
                <h3>No movies found</h3>
                <p style={{ color: "rgba(255,255,255,0.4)" }}>Try adjusting your search or filters</p>
            </div>
        );
    }

    return (
        <div style={gridStyle}>
            {movies.map((movie) => (
                <div key={movie._id} style={cardStyle}>
                    <Link href={`/movies/${movie._id}`} style={linkWrapperStyle}>
                        <div style={imageContainerStyle}>
                            {movie.posterImage ? (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img src={movie.posterImage} alt={movie.title} style={imageStyle} />
                            ) : (
                                <div style={placeholderStyle}>No Poster Available</div>
                            )}
                            <div style={genreContainerStyle}>
                                {movie.genre.map((g) => (
                                    <span key={g} style={genreBadgeStyle}>{g}</span>
                                ))}
                            </div>
                        </div>

                        <div style={contentStyle}>
                            <h3 style={movieTitleStyle}>{movie.title}</h3>
                            <p style={durationStyle}>⏱️ {movie.duration} mins</p>

                            <div style={showtimesSectionStyle}>
                                <p style={sectionLabelStyle}>Today's Showtimes</p>
                                <div style={showtimeGridStyle}>
                                    {movie.showtimes && movie.showtimes.length > 0 ? (
                                        movie.showtimes.slice(0, 4).map((st) => (
                                            <span key={st._id} style={showtimeBadgeStyle}>
                                                {st.showTime}
                                            </span>
                                        ))
                                    ) : (
                                        <span style={noShowtimeStyle}>No shows today</span>
                                    )}
                                </div>
                            </div>
                        </div>
                    </Link>
                </div>
            ))}
        </div>
    );
}

const gridStyle: React.CSSProperties = {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
    gap: "32px",
    padding: "20px 0",
};

const cardStyle: React.CSSProperties = {
    background: "rgba(255, 255, 255, 0.03)",
    borderRadius: "20px",
    overflow: "hidden",
    border: "1px solid rgba(255, 255, 255, 0.08)",
    transition: "transform 0.3s ease, box-shadow 0.3s ease",
    cursor: "pointer",
};

const linkWrapperStyle: React.CSSProperties = {
    textDecoration: "none",
    color: "inherit",
    height: "100%",
    display: "flex",
    flexDirection: "column",
};

const imageContainerStyle: React.CSSProperties = {
    position: "relative",
    aspectRatio: "2/3",
    overflow: "hidden",
    background: "#1a1a1a",
};

const imageStyle: React.CSSProperties = {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    transition: "scale 0.5s ease",
};

const placeholderStyle: React.CSSProperties = {
    width: "100%",
    height: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "rgba(255, 255, 255, 0.3)",
    fontSize: "14px",
    fontWeight: 600,
};

const genreContainerStyle: React.CSSProperties = {
    position: "absolute",
    bottom: "12px",
    left: "12px",
    display: "flex",
    flexWrap: "wrap",
    gap: "6px",
};

const genreBadgeStyle: React.CSSProperties = {
    background: "rgba(0, 0, 0, 0.6)",
    backdropFilter: "blur(8px)",
    color: "#fff",
    padding: "4px 10px",
    borderRadius: "8px",
    fontSize: "11px",
    fontWeight: 700,
    textTransform: "uppercase",
    letterSpacing: "0.03em",
    border: "1px solid rgba(255, 255, 255, 0.1)",
};

const contentStyle: React.CSSProperties = {
    padding: "20px",
    flex: 1,
    display: "flex",
    flexDirection: "column",
};

const movieTitleStyle: React.CSSProperties = {
    fontSize: "20px",
    fontWeight: 800,
    margin: "0 0 6px 0",
    color: "#fff",
};

const durationStyle: React.CSSProperties = {
    fontSize: "13px",
    color: "rgba(255, 255, 255, 0.5)",
    margin: "0 0 20px 0",
};

const showtimesSectionStyle: React.CSSProperties = {
    marginTop: "auto",
};

const sectionLabelStyle: React.CSSProperties = {
    fontSize: "12px",
    fontWeight: 700,
    color: "rgba(255, 255, 255, 0.3)",
    textTransform: "uppercase",
    marginBottom: "10px",
    letterSpacing: "0.05em",
};

const showtimeGridStyle: React.CSSProperties = {
    display: "flex",
    flexWrap: "wrap",
    gap: "8px",
};

const showtimeBadgeStyle: React.CSSProperties = {
    background: "rgba(255, 255, 255, 0.05)",
    color: "#e50914",
    padding: "6px 12px",
    borderRadius: "10px",
    fontSize: "13px",
    fontWeight: 800,
    border: "1px solid rgba(229, 9, 20, 0.2)",
};

const noShowtimeStyle: React.CSSProperties = {
    fontSize: "13px",
    color: "rgba(255, 255, 255, 0.3)",
    fontStyle: "italic",
};

const messageStyle: React.CSSProperties = {
    textAlign: "center",
    padding: "60px",
    fontSize: "18px",
    color: "rgba(255, 255, 255, 0.6)",
    fontWeight: 500,
};

const errorStyle: React.CSSProperties = {
    background: "rgba(255, 77, 79, 0.1)",
    color: "#ff4d4f",
    padding: "20px",
    borderRadius: "12px",
    textAlign: "center",
    margin: "20px 0",
    border: "1px solid rgba(255, 77, 79, 0.2)",
};
