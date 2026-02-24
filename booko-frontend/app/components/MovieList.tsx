"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import axios from "axios";
import { getMovies, getMovieShowtimes } from "@/app/services/movie.service";
import Loader from "./ui/Loader";
import ErrorMessage from "./ui/ErrorMessage";

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

    const fetchData = async () => {
        setLoading(true);
        setError(null);
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

    useEffect(() => {
        fetchData();
    }, [filters]);

    if (loading) return <Loader message="Searching for blockbusters..." />;
    if (error) return <ErrorMessage message={error} onRetry={fetchData} />;

    if (movies.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center p-20 text-center text-white/40">
                <div className="text-6xl mb-6 grayscale opacity-50">🔍</div>
                <h3 className="text-2xl font-bold text-white mb-2">No movies found</h3>
                <p className="text-sm">Try adjusting your search or filters</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 py-5">
            {movies.map((movie) => (
                <div key={movie._id} className="bg-white/5 rounded-2xl overflow-hidden border border-white/10 hover:border-white/20 transition-all cursor-pointer group flex flex-col h-full">
                    <Link href={`/movies/${movie._id}`} className="no-underline text-inherit flex flex-col h-full">
                        <div className="relative aspect-[2/3] overflow-hidden bg-[#1a1a1a]">
                            {movie.posterImage ? (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img src={movie.posterImage} alt={movie.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-white/30 text-sm font-semibold">No Poster Available</div>
                            )}
                            <div className="absolute bottom-3 left-3 flex flex-wrap gap-1.5">
                                {movie.genre.map((g) => (
                                    <span key={g} className="bg-black/60 backdrop-blur-md text-white py-1 px-2.5 rounded-lg text-[10px] font-bold uppercase tracking-wider border border-white/10">
                                        {g}
                                    </span>
                                ))}
                            </div>
                        </div>

                        <div className="p-5 flex-1 flex flex-col">
                            <h3 className="text-xl font-extrabold mb-1.5 text-white">{movie.title}</h3>
                            <p className="text-xs text-white/50 mb-5">⏱️ {movie.duration} mins</p>

                            <div className="mt-auto">
                                <p className="text-[10px] font-bold text-white/30 uppercase mb-2.5 tracking-wider">Today's Showtimes</p>
                                <div className="flex flex-wrap gap-2">
                                    {movie.showtimes && movie.showtimes.length > 0 ? (
                                        movie.showtimes.slice(0, 4).map((st) => (
                                            <span key={st._id} className="bg-white/10 text-primary py-1.5 px-3 rounded-xl text-xs font-extrabold border border-primary/20">
                                                {st.showTime}
                                            </span>
                                        ))
                                    ) : (
                                        <span className="text-xs text-white/30 italic">No shows today</span>
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
