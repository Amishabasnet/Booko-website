"use client";

import { useEffect, useState, use } from "react";
import axios from "axios";
import { getMovieById } from "@/app/services/movie.service";
import Link from "next/link";
import Showtimes from "@/app/components/Showtimes";
import Loader from "@/app/components/ui/Loader";
import ErrorMessage from "@/app/components/ui/ErrorMessage";

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

export default function MovieDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const [movie, setMovie] = useState<MovieDetail | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchMovieData = async () => {
            try {
                const movieRes = await getMovieById(id);
                setMovie(movieRes.data.movie);
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

    if (loading) return <Loader message="Curating details for you... ✨" />;
    if (error) return <ErrorMessage message={error} />;
    if (!movie) return <div className="text-center py-20 text-white/50 text-lg font-medium">Movie not found.</div>;

    return (
        <main className="bg-background min-h-screen text-white font-sans p-5 md:p-10 lg:p-20">
            <header className="mb-10">
                <Link href="/" className="text-white/60 hover:text-white no-underline text-sm font-semibold transition-colors flex items-center gap-2">
                    <span className="text-lg">←</span> Back to Movies
                </Link>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-10 lg:gap-20 items-start max-w-7xl mx-auto">
                <div className="lg:sticky lg:top-10">
                    {movie.posterImage ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={movie.posterImage} alt={movie.title} className="w-full rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-white/10" />
                    ) : (
                        <div className="aspect-[2/3] bg-white/5 rounded-3xl flex items-center justify-center text-white/30 text-lg font-bold border border-white/5">
                            No Poster Available
                        </div>
                    )}
                </div>

                <div className="grid gap-10 md:gap-14">
                    <div>
                        <div className="flex flex-wrap gap-2.5 mb-6">
                            {movie.genre.map((g) => (
                                <span key={g} className="bg-primary/10 text-primary py-1.5 px-5 rounded-full text-xs font-black uppercase tracking-widest border border-primary/20">
                                    {g}
                                </span>
                            ))}
                        </div>

                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-black mb-0 tracking-tight leading-[1.1]">{movie.title}</h1>
                    </div>

                    <div className="flex flex-wrap gap-10 md:gap-16 border-b border-white/10 pb-10">
                        <div className="grid gap-1">
                            <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Duration</label>
                            <span className="text-lg font-medium">{movie.duration} mins</span>
                        </div>
                        <div className="grid gap-1">
                            <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Language</label>
                            <span className="text-lg font-medium">{movie.language}</span>
                        </div>
                        <div className="grid gap-1">
                            <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Release Date</label>
                            <span className="text-lg font-medium">{new Date(movie.releaseDate).toLocaleDateString()}</span>
                        </div>
                    </div>

                    <div className="grid gap-4">
                        <h2 className="text-xl md:text-2xl font-black text-white tracking-tight">Synopsis</h2>
                        <p className="text-base md:text-lg leading-relaxed text-white/70 m-0">{movie.description}</p>
                    </div>

                    <div id="showtimes" className="bg-white/5 p-8 md:p-10 rounded-3xl border border-white/10 shadow-xl">
                        <h2 className="text-xl md:text-2xl font-black mb-8 text-white tracking-tight">Available Showtimes</h2>
                        <Showtimes movieId={id} />

                        <button
                            onClick={() => document.getElementById("showtimes")?.scrollIntoView({ behavior: "smooth" })}
                            className="w-full mt-10 py-4 md:py-5 rounded-2xl bg-primary shadow-xl shadow-primary/30 text-white border-none text-base md:text-lg font-black cursor-pointer transition-all active:scale-[0.98] uppercase tracking-wide hover:bg-primary/90"
                        >
                            Book Tickets Now
                        </button>
                    </div>
                </div>
            </div>
        </main>
    );
}
