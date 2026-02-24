"use client";

import { useEffect, useState } from "react";
import { getMovies, createMovie, updateMovie, deleteMovie } from "@/app/services/movie.service";
import Loader from "./ui/Loader";
import ErrorMessage from "./ui/ErrorMessage";
import axios from "axios";

interface Movie {
    _id: string;
    title: string;
    description: string;
    genre: string[];
    duration: number;
    language: string;
    releaseDate: string;
    posterImage?: string;
}

export default function AdminMovieManagement() {
    const [movies, setMovies] = useState<Movie[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    // Form State
    const [isEditing, setIsEditing] = useState(false);
    const [currentMovieId, setCurrentMovieId] = useState<string | null>(null);
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        genre: "",
        duration: 0,
        language: "",
        releaseDate: "",
        posterImage: "",
    });

    const [modalOpen, setModalOpen] = useState(false);

    useEffect(() => {
        fetchMovies();
    }, []);

    const fetchMovies = async () => {
        try {
            const res = await getMovies();
            setMovies(res.data.movies);
        } catch (err) {
            setError("Failed to fetch movies.");
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const resetForm = () => {
        setFormData({
            title: "",
            description: "",
            genre: "",
            duration: 0,
            language: "",
            releaseDate: "",
            posterImage: "",
        });
        setIsEditing(false);
        setCurrentMovieId(null);
    };

    const openModal = (movie?: Movie) => {
        if (movie) {
            setIsEditing(true);
            setCurrentMovieId(movie._id);
            setFormData({
                title: movie.title,
                description: movie.description,
                genre: movie.genre.join(", "),
                duration: movie.duration,
                language: movie.language,
                releaseDate: new Date(movie.releaseDate).toISOString().split("T")[0],
                posterImage: movie.posterImage || "",
            });
        } else {
            resetForm();
        }
        setModalOpen(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);

        const movieData = {
            ...formData,
            genre: formData.genre.split(",").map(g => g.trim()),
            duration: Number(formData.duration),
        };

        try {
            if (isEditing && currentMovieId) {
                await updateMovie(currentMovieId, movieData);
                setSuccess("Movie updated successfully!");
            } else {
                await createMovie(movieData);
                setSuccess("Movie created successfully!");
            }
            fetchMovies();
            setModalOpen(false);
            resetForm();
        } catch (err: any) {
            setError(err.response?.data?.message || "Operation failed.");
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this movie?")) return;

        try {
            await deleteMovie(id);
            setSuccess("Movie deleted successfully!");
            fetchMovies();
        } catch (err) {
            setError("Failed to delete movie.");
        }
    };

    if (loading) return <Loader message="Managing your cinematic library..." />;
    if (error) return <ErrorMessage message={error} onRetry={fetchMovies} />;

    return (
        <section className="mt-10 bg-white/5 rounded-3xl p-6 md:p-8 border border-white/5 shadow-inner">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                <h2 className="text-2xl font-black m-0 tracking-tight">Movie Management</h2>
                <button onClick={() => openModal()} className="bg-green-500 hover:bg-green-600 text-sm py-2.5 px-6 rounded-xl font-bold cursor-pointer text-white border-none shadow-lg shadow-green-500/20 transition-all active:scale-95">
                    + Add New Movie
                </button>
            </div>

            {error && <div className="bg-red-500/10 text-red-500 p-4 rounded-xl mb-6 text-sm border border-red-500/10">{error}</div>}
            {success && <div className="bg-green-500/10 text-green-500 p-4 rounded-xl mb-6 text-sm border border-green-500/10">{success}</div>}

            <div className="overflow-x-auto -mx-6 md:mx-0">
                <table className="w-full border-collapse text-left min-w-[600px]">
                    <thead>
                        <tr className="border-b border-white/10">
                            <th className="p-4 text-white/40 font-bold text-xs uppercase tracking-widest">Title</th>
                            <th className="p-4 text-white/40 font-bold text-xs uppercase tracking-widest">Genre</th>
                            <th className="p-4 text-white/40 font-bold text-xs uppercase tracking-widest">Duration</th>
                            <th className="p-4 text-white/40 font-bold text-xs uppercase tracking-widest">Language</th>
                            <th className="p-4 text-white/40 font-bold text-xs uppercase tracking-widest text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {movies.map(movie => (
                            <tr key={movie._id} className="hover:bg-white/[0.02] transition-colors group">
                                <td className="p-4 text-sm font-semibold">{movie.title}</td>
                                <td className="p-4 text-xs text-white/60">{movie.genre.join(", ")}</td>
                                <td className="p-4 text-xs text-white/60">{movie.duration} min</td>
                                <td className="p-4 text-xs text-white/60">{movie.language}</td>
                                <td className="p-4 text-right">
                                    <div className="flex justify-end gap-2 group-hover:translate-x-0 transition-transform">
                                        <button onClick={() => openModal(movie)} className="bg-white/5 hover:bg-white/10 text-white/70 hover:text-white py-1.5 px-4 rounded-lg text-xs font-bold border border-white/10 transition-colors">Edit</button>
                                        <button onClick={() => handleDelete(movie._id)} className="bg-primary/10 hover:bg-primary/20 text-primary py-1.5 px-4 rounded-lg text-xs font-bold border border-primary/20 transition-colors">Delete</button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {modalOpen && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex justify-center items-center z-[1000] p-5 animate-in fade-in duration-300">
                    <div className="bg-[#0a0a0a] border border-white/10 rounded-[32px] p-8 md:p-10 w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl animate-in zoom-in-95 duration-300">
                        <div className="flex justify-between items-center mb-8">
                            <h3 className="text-2xl font-black tracking-tight">{isEditing ? "Edit Movie" : "Add New Movie"}</h3>
                            <button onClick={() => setModalOpen(false)} className="text-white/40 hover:text-white text-2xl font-light">×</button>
                        </div>
                        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                            <div className="grid gap-2">
                                <label className="text-[10px] uppercase font-bold text-white/40 tracking-widest ml-1">Title</label>
                                <input name="title" value={formData.title} onChange={handleInputChange} className="bg-white/5 border border-white/10 rounded-2xl p-4 text-white text-sm focus:border-primary/50 focus:outline-none transition-colors" required />
                            </div>
                            <div className="grid gap-2">
                                <label className="text-[10px] uppercase font-bold text-white/40 tracking-widest ml-1">Description</label>
                                <textarea name="description" value={formData.description} onChange={handleInputChange} className="bg-white/5 border border-white/10 rounded-2xl p-4 text-white text-sm min-h-[120px] resize-vertical focus:border-primary/50 focus:outline-none transition-colors" required />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="grid gap-2">
                                    <label className="text-[10px] uppercase font-bold text-white/40 tracking-widest ml-1">Genre (comma separated)</label>
                                    <input name="genre" value={formData.genre} onChange={handleInputChange} className="bg-white/5 border border-white/10 rounded-2xl p-4 text-white text-sm focus:border-primary/50 focus:outline-none transition-colors" required />
                                </div>
                                <div className="grid gap-2">
                                    <label className="text-[10px] uppercase font-bold text-white/40 tracking-widest ml-1">Duration (mins)</label>
                                    <input type="number" name="duration" value={formData.duration} onChange={handleInputChange} className="bg-white/5 border border-white/10 rounded-2xl p-4 text-white text-sm focus:border-primary/50 focus:outline-none transition-colors" required />
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="grid gap-2">
                                    <label className="text-[10px] uppercase font-bold text-white/40 tracking-widest ml-1">Language</label>
                                    <input name="language" value={formData.language} onChange={handleInputChange} className="bg-white/5 border border-white/10 rounded-2xl p-4 text-white text-sm focus:border-primary/50 focus:outline-none transition-colors" required />
                                </div>
                                <div className="grid gap-2">
                                    <label className="text-[10px] uppercase font-bold text-white/40 tracking-widest ml-1">Release Date</label>
                                    <input type="date" name="releaseDate" value={formData.releaseDate} onChange={handleInputChange} className="bg-white/5 border border-white/10 rounded-2xl p-4 text-white text-sm focus:border-primary/50 focus:outline-none transition-colors" required />
                                </div>
                            </div>
                            <div className="grid gap-2">
                                <label className="text-[10px] uppercase font-bold text-white/40 tracking-widest ml-1">Poster URL</label>
                                <input name="posterImage" value={formData.posterImage} onChange={handleInputChange} className="bg-white/5 border border-white/10 rounded-2xl p-4 text-white text-sm focus:border-primary/50 focus:outline-none transition-colors" />
                            </div>

                            <div className="flex justify-end gap-4 mt-4 pt-10 border-t border-white/5">
                                <button type="button" onClick={() => setModalOpen(false)} className="text-white/60 hover:text-white py-3 px-6 text-sm font-bold transition-colors">Cancel</button>
                                <button type="submit" className="bg-primary hover:bg-primary/90 text-white py-4 px-10 rounded-2xl font-black text-sm shadow-xl shadow-primary/20 transition-all active:scale-95 uppercase tracking-widest">
                                    {isEditing ? "Update Movie" : "Create Movie"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </section>
    );
}
