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

export default function Showtimes({ movieId, onShowtimesLoaded }: { movieId: string, onShowtimesLoaded?: (showtimes: any[]) => void }) {
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

                if (onShowtimesLoaded) {
                    onShowtimesLoaded(showtimes);
                }
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

    if (loading) return <div className="text-white/60 text-[15px]">Finding theaters near you... 🔍</div>;
    if (error) return <div className="text-[#ff4d4f] text-[15px]">{error}</div>;

    const theaterIds = Object.keys(groupedShowtimes);

    if (theaterIds.length === 0) {
        return <div className="text-white/40 italic text-[15px]">No showtimes available for this movie right now.</div>;
    }

    return (
        <div className="grid gap-6">
            {theaterIds.map((tid) => (
                <div key={tid} className="bg-white/5 p-5 md:p-6 rounded-2xl border border-white/10">
                    <h3 className="text-lg font-extrabold mb-4 text-white">{groupedShowtimes[tid].theaterName}</h3>
                    <div className="flex flex-wrap gap-3">
                        {groupedShowtimes[tid].showtimes.map((st) => (
                            <Link key={st._id} href={`/booking/${st._id}`} className="no-underline">
                                <div className="bg-white/5 border border-white/10 py-3 px-5 rounded-2xl flex flex-col items-center gap-0.5 transition-all duration-200 hover:bg-white/10 hover:border-white/20 hover:scale-105 active:scale-95">
                                    <span className="text-base font-extrabold text-white">{st.showTime}</span>
                                    <span className="text-[11px] font-semibold text-white/50">NPR {st.ticketPrice}</span>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
}


