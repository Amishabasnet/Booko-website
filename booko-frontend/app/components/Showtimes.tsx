"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";
import { getMovieShowtimes } from "@/app/services/movie.service";

interface Theater {
    _id: string;
    name: string;
    location: string;
}

interface Showtime {
    _id: string;
    showTime: string;
    showDate: string;
    ticketPrice: number;
    theaterId: Theater;
}

interface GroupedShowtimes {
    [theaterId: string]: {
        theaterName: string;
        showtimes: Showtime[];
    };
}

export default function Showtimes({ movieId }: { movieId: string }) {
    const [groupedShowtimes, setGroupedShowtimes] = useState<GroupedShowtimes>({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchShowtimes = async () => {
            try {
                const response = await getMovieShowtimes(movieId);
                const showtimes: Showtime[] = response.data.showtimes;

                const grouped = showtimes.reduce((acc: GroupedShowtimes, curr) => {
                    const theaterId = curr.theaterId._id;
                    if (!acc[theaterId]) {
                        acc[theaterId] = {
                            theaterName: curr.theaterId.name,
                            showtimes: [],
                        };
                    }
                    acc[theaterId].showtimes.push(curr);
                    return acc;
                }, {});

                setGroupedShowtimes(grouped);
            } catch (err: unknown) {
                let message = "Failed to load showtimes.";
                if (axios.isAxiosError(err)) {
                    message = err.response?.data?.message || message;
                }
                setError(message);
            } finally {
                setLoading(false);
            }
        };

        fetchShowtimes();
    }, [movieId]);

    if (loading) return <div style={messageStyle}>Finding theaters near you... 🔍</div>;
    if (error) return <div style={errorStyle}>{error}</div>;

    const theaterIds = Object.keys(groupedShowtimes);

    if (theaterIds.length === 0) {
        return <div style={emptyStyle}>No showtimes available for this movie right now.</div>;
    }

    return (
        <div style={containerStyle}>
            {theaterIds.map((tid) => (
                <div key={tid} style={theaterCardStyle}>
                    <h3 style={theaterNameStyle}>{groupedShowtimes[tid].theaterName}</h3>
                    <div style={showtimeGridStyle}>
                        {groupedShowtimes[tid].showtimes.map((st) => (
                            <Link key={st._id} href={`/booking/${st._id}`} style={linkStyle}>
                                <div style={badgeStyle}>
                                    <span style={timeStyle}>{st.showTime}</span>
                                    <span style={priceStyle}>NPR {st.ticketPrice}</span>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
}

const containerStyle: React.CSSProperties = {
    display: "grid",
    gap: "24px",
};

const theaterCardStyle: React.CSSProperties = {
    background: "rgba(255, 255, 255, 0.03)",
    padding: "24px",
    borderRadius: "20px",
    border: "1px solid rgba(255, 255, 255, 0.08)",
};

const theaterNameStyle: React.CSSProperties = {
    fontSize: "18px",
    fontWeight: 800,
    marginBottom: "16px",
    color: "#fff",
};

const showtimeGridStyle: React.CSSProperties = {
    display: "flex",
    flexWrap: "wrap",
    gap: "12px",
};

const linkStyle: React.CSSProperties = {
    textDecoration: "none",
};

const badgeStyle: React.CSSProperties = {
    background: "rgba(255, 255, 255, 0.05)",
    border: "1px solid rgba(255, 255, 255, 0.1)",
    padding: "12px 20px",
    borderRadius: "14px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "2px",
    transition: "all 0.2s ease",
};

const timeStyle: React.CSSProperties = {
    fontSize: "16px",
    fontWeight: 800,
    color: "#fff",
};

const priceStyle: React.CSSProperties = {
    fontSize: "11px",
    fontWeight: 600,
    color: "rgba(255, 255, 255, 0.5)",
};

const messageStyle: React.CSSProperties = {
    color: "rgba(255, 255, 255, 0.6)",
    fontSize: "15px",
};

const errorStyle: React.CSSProperties = {
    color: "#ff4d4f",
    fontSize: "15px",
};

const emptyStyle: React.CSSProperties = {
    color: "rgba(255, 255, 255, 0.4)",
    fontStyle: "italic",
    fontSize: "15px",
};
