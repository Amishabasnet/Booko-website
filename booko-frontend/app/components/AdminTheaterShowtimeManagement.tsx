"use client";

import { useEffect, useState } from "react";
import { getTheaters, createTheater, updateTheater, deleteTheater } from "@/app/services/theater.service";
import Loader from "./ui/Loader";
import ErrorMessage from "./ui/ErrorMessage";
import { getScreensByTheater, createScreen, updateScreen, deleteScreen } from "@/app/services/screen.service";
import { getShowtimes, createShowtime, updateShowtime, deleteShowtime } from "@/app/services/showtime.service";
import { getMovies } from "@/app/services/movie.service";
import axios from "axios";

interface Theater {
    _id: string;
    name: string;
    location: string;
    totalScreens: number;
}

interface Screen {
    _id: string;
    theaterId: string;
    screenName: string;
    totalSeats: number;
    seatLayout: any[][];
}

interface Showtime {
    _id: string;
    movieId: { _id: string, title: string };
    theaterId: { _id: string, name: string };
    screenId: { _id: string, screenName: string };
    showDate: string;
    showTime: string;
    ticketPrice: number;
}

interface Movie {
    _id: string;
    title: string;
}

export default function AdminTheaterShowtimeManagement() {
    const [activeTab, setActiveTab] = useState<"theaters" | "showtimes">("theaters");
    const [theaters, setTheaters] = useState<Theater[]>([]);
    const [screens, setScreens] = useState<Screen[]>([]);
    const [showtimes, setShowtimes] = useState<Showtime[]>([]);
    const [movies, setMovies] = useState<Movie[]>([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    // Form States
    const [theaterModalOpen, setTheaterModalOpen] = useState(false);
    const [screenModalOpen, setScreenModalOpen] = useState(false);
    const [showtimeModalOpen, setShowtimeModalOpen] = useState(false);

    const [isEditing, setIsEditing] = useState(false);
    const [currentId, setCurrentId] = useState<string | null>(null);
    const [selectedTheaterId, setSelectedTheaterId] = useState<string | null>(null);

    const [theaterForm, setTheaterForm] = useState({ name: "", location: "", totalScreens: 1 });
    const [screenForm, setScreenForm] = useState({ screenName: "", totalSeats: 0 });
    const [showtimeForm, setShowtimeForm] = useState({
        movieId: "",
        theaterId: "",
        screenId: "",
        showDate: "",
        showTime: "",
        ticketPrice: 0
    });

    useEffect(() => {
        fetchInitialData();
    }, []);

    const fetchInitialData = async () => {
        setLoading(true);
        try {
            const [tRes, sRes, mRes] = await Promise.all([
                getTheaters(),
                getShowtimes(),
                getMovies()
            ]);
            setTheaters(tRes.data.theaters);
            setShowtimes(sRes.data.showtimes);
            setMovies(mRes.data.movies);
        } catch (err) {
            setError("Failed to fetch data.");
        } finally {
            setLoading(false);
        }
    };

    // --- Theater Handlers ---
    const handleTheaterSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (isEditing && currentId) {
                await updateTheater(currentId, theaterForm);
                setSuccess("Theater updated!");
            } else {
                await createTheater(theaterForm);
                setSuccess("Theater created!");
            }
            const res = await getTheaters();
            setTheaters(res.data.theaters);
            setTheaterModalOpen(false);
        } catch (err) {
            setError("Operation failed.");
        }
    };

    const handleDeleteTheater = async (id: string) => {
        if (!confirm("Delete theater and its screens?")) return;
        try {
            await deleteTheater(id);
            setTheaters(prev => prev.filter(t => t._id !== id));
            setSuccess("Theater deleted!");
        } catch (err) {
            setError("Failed to delete.");
        }
    };

    // --- Screen Handlers ---
    const openScreenModal = async (theaterId: string) => {
        setSelectedTheaterId(theaterId);
        try {
            const res = await getScreensByTheater(theaterId);
            setScreens(res.data.screens);
            setScreenModalOpen(true);
        } catch (err) {
            setError("Failed to fetch screens.");
        }
    };

    const handleAddScreen = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedTheaterId) return;
        try {
            // Default layout for new screens
            const defaultLayout = Array(5).fill(null).map((_, r) =>
                Array(10).fill(null).map((_, c) => ({
                    row: String.fromCharCode(65 + r),
                    col: c + 1,
                    type: "normal",
                    isAvailable: true
                }))
            );

            await createScreen({
                ...screenForm,
                theaterId: selectedTheaterId,
                totalSeats: 50,
                seatLayout: defaultLayout
            });
            const res = await getScreensByTheater(selectedTheaterId);
            setScreens(res.data.screens);
            setScreenForm({ screenName: "", totalSeats: 0 });
            setSuccess("Screen added!");
        } catch (err) {
            setError("Failed to add screen.");
        }
    };

    // --- Showtime Handlers ---
    const handleShowtimeSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (isEditing && currentId) {
                await updateShowtime(currentId, showtimeForm);
                setSuccess("Showtime updated!");
            } else {
                await createShowtime(showtimeForm);
                setSuccess("Showtime created!");
            }
            const res = await getShowtimes();
            setShowtimes(res.data.showtimes);
            setShowtimeModalOpen(false);
        } catch (err) {
            setError("Operation failed.");
        }
    };

    const handleDeleteShowtime = async (id: string) => {
        if (!confirm("Are you sure?")) return;
        try {
            await deleteShowtime(id);
            setShowtimes(prev => prev.filter(s => s._id !== id));
            setSuccess("Showtime deleted!");
        } catch (err) {
            setError("Delete failed.");
        }
    };

    if (loading) return <Loader message="Synchronizing theater and showtime data..." />;
    if (error) return <ErrorMessage message={error} onRetry={fetchInitialData} />;

    return (
        <section className="mt-10">
            <div className="flex flex-wrap gap-2.5 mb-8">
                <button
                    onClick={() => setActiveTab("theaters")}
                    className={`py-3 px-6 rounded-2xl font-bold cursor-pointer transition-all border ${activeTab === "theaters" ? "bg-primary text-white border-primary shadow-lg shadow-primary/20" : "bg-white/5 text-white/50 border-white/10 hover:bg-white/10"}`}
                >
                    Theaters & Screens
                </button>
                <button
                    onClick={() => setActiveTab("showtimes")}
                    className={`py-3 px-6 rounded-2xl font-bold cursor-pointer transition-all border ${activeTab === "showtimes" ? "bg-primary text-white border-primary shadow-lg shadow-primary/20" : "bg-white/5 text-white/50 border-white/10 hover:bg-white/10"}`}
                >
                    Showtimes
                </button>
            </div>

            {error && <div className="bg-red-500/10 text-red-500 p-4 rounded-xl mb-6 text-sm border border-red-500/10">{error}</div>}
            {success && <div className="bg-green-500/10 text-green-500 p-4 rounded-xl mb-6 text-sm border border-green-500/10">{success}</div>}

            {activeTab === "theaters" ? (
                <div className="bg-white/5 rounded-3xl p-6 md:p-8 border border-white/5 shadow-inner animate-in slide-in-from-left duration-300">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                        <h3 className="text-xl font-black m-0 tracking-tight">All Theaters</h3>
                        <button onClick={() => { setIsEditing(false); setTheaterForm({ name: "", location: "", totalScreens: 1 }); setTheaterModalOpen(true); }} className="bg-green-500 hover:bg-green-600 text-sm py-2.5 px-6 rounded-xl font-bold cursor-pointer text-white border-none shadow-lg shadow-green-500/20 transition-all active:scale-95">+ Add Theater</button>
                    </div>
                    <div className="overflow-x-auto -mx-6 md:mx-0">
                        <table className="w-full border-collapse text-left min-w-[600px]">
                            <thead>
                                <tr className="border-b border-white/10">
                                    <th className="p-4 text-white/40 font-bold text-xs uppercase tracking-widest">Name</th>
                                    <th className="p-4 text-white/40 font-bold text-xs uppercase tracking-widest">Location</th>
                                    <th className="p-4 text-white/40 font-bold text-xs uppercase tracking-widest">Screens</th>
                                    <th className="p-4 text-white/40 font-bold text-xs uppercase tracking-widest text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {theaters.map(t => (
                                    <tr key={t._id} className="hover:bg-white/[0.02] transition-colors group">
                                        <td className="p-4 text-sm font-semibold">{t.name}</td>
                                        <td className="p-4 text-xs text-white/60">{t.location}</td>
                                        <td className="p-4 text-xs text-white/60">{t.totalScreens}</td>
                                        <td className="p-4 text-right">
                                            <div className="flex justify-end gap-2 group-hover:translate-x-0 transition-transform">
                                                <button onClick={() => openScreenModal(t._id)} className="bg-white/5 hover:bg-white/10 text-white/70 hover:text-white py-1.5 px-3 rounded-lg text-xs font-bold border border-white/10 transition-colors">Manage Screens</button>
                                                <button onClick={() => { setIsEditing(true); setCurrentId(t._id); setTheaterForm({ name: t.name, location: t.location, totalScreens: t.totalScreens }); setTheaterModalOpen(true); }} className="bg-white/5 hover:bg-white/10 text-white/70 hover:text-white py-1.5 px-3 rounded-lg text-xs font-bold border border-white/10 transition-colors">Edit</button>
                                                <button onClick={() => handleDeleteTheater(t._id)} className="bg-primary/10 hover:bg-primary/20 text-primary py-1.5 px-3 rounded-lg text-xs font-bold border border-primary/20 transition-colors">Delete</button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            ) : (
                <div className="bg-white/5 rounded-3xl p-6 md:p-8 border border-white/5 shadow-inner animate-in slide-in-from-right duration-300">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                        <h3 className="text-xl font-black m-0 tracking-tight">Showtime Schedules</h3>
                        <button onClick={() => { setIsEditing(false); setShowtimeForm({ movieId: "", theaterId: "", screenId: "", showDate: "", showTime: "", ticketPrice: 0 }); setShowtimeModalOpen(true); }} className="bg-green-500 hover:bg-green-600 text-sm py-2.5 px-6 rounded-xl font-bold cursor-pointer text-white border-none shadow-lg shadow-green-500/20 transition-all active:scale-95">+ Schedule Movie</button>
                    </div>
                    <div className="overflow-x-auto -mx-6 md:mx-0">
                        <table className="w-full border-collapse text-left min-w-[800px]">
                            <thead>
                                <tr className="border-b border-white/10">
                                    <th className="p-4 text-white/40 font-bold text-xs uppercase tracking-widest">Movie</th>
                                    <th className="p-4 text-white/40 font-bold text-xs uppercase tracking-widest">Theater</th>
                                    <th className="p-4 text-white/40 font-bold text-xs uppercase tracking-widest">Screen</th>
                                    <th className="p-4 text-white/40 font-bold text-xs uppercase tracking-widest">Time</th>
                                    <th className="p-4 text-white/40 font-bold text-xs uppercase tracking-widest">Price</th>
                                    <th className="p-4 text-white/40 font-bold text-xs uppercase tracking-widest text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {showtimes.map(s => (
                                    <tr key={s._id} className="hover:bg-white/[0.02] transition-colors">
                                        <td className="p-4 text-sm font-semibold">{s.movieId?.title}</td>
                                        <td className="p-4 text-xs text-white/60">{s.theaterId?.name}</td>
                                        <td className="p-4 text-xs text-white/60">{s.screenId?.screenName}</td>
                                        <td className="p-4 text-xs text-white/60">{new Date(s.showDate).toLocaleDateString()} {s.showTime}</td>
                                        <td className="p-4 text-xs text-white/60">${s.ticketPrice}</td>
                                        <td className="p-4 text-right">
                                            <button onClick={() => handleDeleteShowtime(s._id)} className="bg-primary/10 hover:bg-primary/20 text-primary py-1.5 px-4 rounded-lg text-xs font-bold border border-primary/20 transition-colors">Delete</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Theater Modal */}
            {theaterModalOpen && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex justify-center items-center z-[1000] p-5 animate-in fade-in duration-300">
                    <div className="bg-[#0a0a0a] border border-white/10 rounded-[32px] p-8 md:p-10 w-full max-w-md shadow-2xl animate-in zoom-in-95 duration-300">
                        <h3 className="text-2xl font-black mb-8 tracking-tight">{isEditing ? "Edit Theater" : "Add Theater"}</h3>
                        <form onSubmit={handleTheaterSubmit} className="flex flex-col gap-5">
                            <input placeholder="Name" value={theaterForm.name} onChange={e => setTheaterForm({ ...theaterForm, name: e.target.value })} className="bg-white/5 border border-white/10 rounded-2xl p-4 text-white text-sm focus:border-primary/50 focus:outline-none transition-colors" required />
                            <input placeholder="Location" value={theaterForm.location} onChange={e => setTheaterForm({ ...theaterForm, location: e.target.value })} className="bg-white/5 border border-white/10 rounded-2xl p-4 text-white text-sm focus:border-primary/50 focus:outline-none transition-colors" required />
                            <input type="number" placeholder="Total Screens" value={theaterForm.totalScreens} onChange={e => setTheaterForm({ ...theaterForm, totalScreens: parseInt(e.target.value) })} className="bg-white/5 border border-white/10 rounded-2xl p-4 text-white text-sm focus:border-primary/50 focus:outline-none transition-colors" required />
                            <div className="flex justify-end gap-3 mt-4">
                                <button type="button" onClick={() => setTheaterModalOpen(false)} className="text-white/50 hover:text-white py-3 px-6 text-sm font-bold transition-colors">Cancel</button>
                                <button type="submit" className="bg-primary hover:bg-primary/90 text-white py-3 px-8 rounded-xl font-bold text-sm shadow-xl shadow-primary/20 transition-all active:scale-95 uppercase tracking-wide">Save</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Screens Modal */}
            {screenModalOpen && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex justify-center items-center z-[1000] p-5 animate-in fade-in duration-300">
                    <div className="bg-[#0a0a0a] border border-white/10 rounded-[32px] p-8 md:p-10 w-full max-w-lg shadow-2xl animate-in zoom-in-95 duration-300">
                        <h3 className="text-2xl font-black mb-6 tracking-tight">Screens for Theater</h3>
                        <form onSubmit={handleAddScreen} className="flex gap-3 mb-8">
                            <input placeholder="Screen Name (e.g. IMAX 1)" value={screenForm.screenName} onChange={e => setScreenForm({ ...screenForm, screenName: e.target.value })} className="flex-1 bg-white/5 border border-white/10 rounded-xl p-3 text-white text-sm focus:border-primary/50 focus:outline-none transition-colors" required />
                            <button type="submit" className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-xl font-bold text-sm transition-all active:scale-95">Add</button>
                        </form>
                        <div className="max-h-[300px] overflow-y-auto pr-2 grid gap-3 mb-8">
                            {screens.length > 0 ? screens.map(sc => (
                                <div key={sc._id} className="flex justify-between items-center p-4 bg-white/[0.03] border border-white/5 rounded-2xl hover:bg-white/[0.05] transition-colors">
                                    <span className="text-sm font-medium">{sc.screenName} <span className="text-white/30 ml-2">({sc.totalSeats} seats)</span></span>
                                    <button onClick={async () => { await deleteScreen(sc._id); setSelectedTheaterId(sc.theaterId); openScreenModal(sc.theaterId); }} className="text-primary hover:text-primary/80 text-xs font-bold uppercase tracking-widest px-3 py-1.5 rounded-lg bg-primary/10 transition-colors">Remove</button>
                                </div>
                            )) : (
                                <p className="text-center py-10 text-white/30 text-sm italic">No screens added yet.</p>
                            )}
                        </div>
                        <button onClick={() => setScreenModalOpen(false)} className="w-full text-white/50 hover:text-white py-4 border border-white/10 rounded-2xl text-sm font-bold transition-all hover:bg-white/5">Close</button>
                    </div>
                </div>
            )}

            {/* Showtime Modal */}
            {showtimeModalOpen && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex justify-center items-center z-[1000] p-5 animate-in fade-in duration-300">
                    <div className="bg-[#0a0a0a] border border-white/10 rounded-[32px] p-8 md:p-10 w-full max-w-md shadow-2xl animate-in zoom-in-95 duration-300">
                        <h3 className="text-2xl font-black mb-8 tracking-tight">Schedule Showtime</h3>
                        <form onSubmit={handleShowtimeSubmit} className="flex flex-col gap-5">
                            <select value={showtimeForm.movieId} onChange={e => setShowtimeForm({ ...showtimeForm, movieId: e.target.value })} className="bg-white/5 border border-white/10 rounded-2xl p-4 text-white text-sm focus:border-primary/50 focus:outline-none transition-colors appearance-none" required>
                                <option value="" className="bg-background">Select Movie</option>
                                {movies.map(m => <option key={m._id} value={m._id} className="bg-background">{m.title}</option>)}
                            </select>
                            <select value={showtimeForm.theaterId} onChange={async (e) => {
                                const tid = e.target.value;
                                setShowtimeForm({ ...showtimeForm, theaterId: tid, screenId: "" });
                                const res = await getScreensByTheater(tid);
                                setScreens(res.data.screens);
                            }} className="bg-white/5 border border-white/10 rounded-2xl p-4 text-white text-sm focus:border-primary/50 focus:outline-none transition-colors appearance-none" required>
                                <option value="" className="bg-background">Select Theater</option>
                                {theaters.map(t => <option key={t._id} value={t._id} className="bg-background">{t.name}</option>)}
                            </select>
                            <select value={showtimeForm.screenId} onChange={e => setShowtimeForm({ ...showtimeForm, screenId: e.target.value })} className="bg-white/5 border border-white/10 rounded-2xl p-4 text-white text-sm focus:border-primary/50 focus:outline-none transition-colors appearance-none disabled:opacity-30 disabled:cursor-not-allowed" required disabled={!showtimeForm.theaterId}>
                                <option value="" className="bg-background">Select Screen</option>
                                {screens.map(sc => <option key={sc._id} value={sc._id} className="bg-background">{sc.screenName}</option>)}
                            </select>
                            <div className="grid grid-cols-2 gap-4">
                                <input type="date" value={showtimeForm.showDate} onChange={e => setShowtimeForm({ ...showtimeForm, showDate: e.target.value })} className="bg-white/5 border border-white/10 rounded-2xl p-4 text-white text-sm focus:border-primary/50 focus:outline-none transition-colors" required />
                                <input type="time" value={showtimeForm.showTime} onChange={e => setShowtimeForm({ ...showtimeForm, showTime: e.target.value })} className="bg-white/5 border border-white/10 rounded-2xl p-4 text-white text-sm focus:border-primary/50 focus:outline-none transition-colors" required />
                            </div>
                            <input type="number" placeholder="Ticket Price" value={showtimeForm.ticketPrice} onChange={e => setShowtimeForm({ ...showtimeForm, ticketPrice: parseFloat(e.target.value) })} className="bg-white/5 border border-white/10 rounded-2xl p-4 text-white text-sm focus:border-primary/50 focus:outline-none transition-colors" required />
                            <div className="flex justify-end gap-3 mt-4">
                                <button type="button" onClick={() => setShowtimeModalOpen(false)} className="text-white/50 hover:text-white py-3 px-6 text-sm font-bold transition-colors">Cancel</button>
                                <button type="submit" className="bg-primary hover:bg-primary/90 text-white py-3 px-8 rounded-xl font-bold text-sm shadow-xl shadow-primary/20 transition-all active:scale-95 uppercase tracking-wide">Schedule</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </section>
    );
}
