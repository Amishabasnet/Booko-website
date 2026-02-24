"use client";

import { useEffect, useState } from "react";
import { getTheaters, createTheater, updateTheater, deleteTheater } from "@/app/services/theater.service";
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

    if (loading) return <div style={msgStyle}>Loading...</div>;

    return (
        <section style={containerStyle}>
            <div style={tabGroupStyle}>
                <button
                    onClick={() => setActiveTab("theaters")}
                    style={activeTab === "theaters" ? activeTabStyle : tabStyle}
                >
                    Theaters & Screens
                </button>
                <button
                    onClick={() => setActiveTab("showtimes")}
                    style={activeTab === "showtimes" ? activeTabStyle : tabStyle}
                >
                    Showtimes
                </button>
            </div>

            {error && <div style={errorStyle}>{error}</div>}
            {success && <div style={successStyle}>{success}</div>}

            {activeTab === "theaters" ? (
                <div style={paneStyle}>
                    <div style={paneHeaderStyle}>
                        <h3>All Theaters</h3>
                        <button onClick={() => { setIsEditing(false); setTheaterForm({ name: "", location: "", totalScreens: 1 }); setTheaterModalOpen(true); }} style={addBtnStyle}>+ Add Theater</button>
                    </div>
                    <table style={tableStyle}>
                        <thead>
                            <tr>
                                <th style={thStyle}>Name</th>
                                <th style={thStyle}>Location</th>
                                <th style={thStyle}>Screens</th>
                                <th style={thStyle}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {theaters.map(t => (
                                <tr key={t._id} style={trStyle}>
                                    <td style={tdStyle}>{t.name}</td>
                                    <td style={tdStyle}>{t.location}</td>
                                    <td style={tdStyle}>{t.totalScreens}</td>
                                    <td style={tdStyle}>
                                        <div style={btnGroupStyle}>
                                            <button onClick={() => openScreenModal(t._id)} style={smallBtnStyle}>Manage Screens</button>
                                            <button onClick={() => { setIsEditing(true); setCurrentId(t._id); setTheaterForm({ name: t.name, location: t.location, totalScreens: t.totalScreens }); setTheaterModalOpen(true); }} style={smallBtnStyle}>Edit</button>
                                            <button onClick={() => handleDeleteTheater(t._id)} style={deleteBtnSmallStyle}>Delete</button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <div style={paneStyle}>
                    <div style={paneHeaderStyle}>
                        <h3>Showtime Schedules</h3>
                        <button onClick={() => { setIsEditing(false); setShowtimeForm({ movieId: "", theaterId: "", screenId: "", showDate: "", showTime: "", ticketPrice: 0 }); setShowtimeModalOpen(true); }} style={addBtnStyle}>+ Schedule Movie</button>
                    </div>
                    <table style={tableStyle}>
                        <thead>
                            <tr>
                                <th style={thStyle}>Movie</th>
                                <th style={thStyle}>Theater</th>
                                <th style={thStyle}>Screen</th>
                                <th style={thStyle}>Time</th>
                                <th style={thStyle}>Price</th>
                                <th style={thStyle}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {showtimes.map(s => (
                                <tr key={s._id} style={trStyle}>
                                    <td style={tdStyle}>{s.movieId?.title}</td>
                                    <td style={tdStyle}>{s.theaterId?.name}</td>
                                    <td style={tdStyle}>{s.screenId?.screenName}</td>
                                    <td style={tdStyle}>{new Date(s.showDate).toLocaleDateString()} {s.showTime}</td>
                                    <td style={tdStyle}>${s.ticketPrice}</td>
                                    <td style={tdStyle}>
                                        <div style={btnGroupStyle}>
                                            <button onClick={() => handleDeleteShowtime(s._id)} style={deleteBtnSmallStyle}>Delete</button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Theater Modal */}
            {theaterModalOpen && (
                <div style={modalOverlayStyle}>
                    <div style={modalContentStyle}>
                        <h3>{isEditing ? "Edit Theater" : "Add Theater"}</h3>
                        <form onSubmit={handleTheaterSubmit} style={formStyle}>
                            <input placeholder="Name" value={theaterForm.name} onChange={e => setTheaterForm({ ...theaterForm, name: e.target.value })} style={inputStyle} required />
                            <input placeholder="Location" value={theaterForm.location} onChange={e => setTheaterForm({ ...theaterForm, location: e.target.value })} style={inputStyle} required />
                            <input type="number" placeholder="Total Screens" value={theaterForm.totalScreens} onChange={e => setTheaterForm({ ...theaterForm, totalScreens: parseInt(e.target.value) })} style={inputStyle} required />
                            <div style={modalActionsStyle}>
                                <button type="button" onClick={() => setTheaterModalOpen(false)} style={cancelBtnStyle}>Cancel</button>
                                <button type="submit" style={submitBtnStyle}>Save</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Screens Modal */}
            {screenModalOpen && (
                <div style={modalOverlayStyle}>
                    <div style={modalContentStyle}>
                        <h3>Screens for Theater</h3>
                        <form onSubmit={handleAddScreen} style={inlineFormStyle}>
                            <input placeholder="Screen Name (e.g. IMAX 1)" value={screenForm.screenName} onChange={e => setScreenForm({ ...screenForm, screenName: e.target.value })} style={inputStyle} required />
                            <button type="submit" style={addBtnStyle}>Add</button>
                        </form>
                        <div style={{ maxHeight: "300px", overflowY: "auto", marginTop: "20px" }}>
                            {screens.map(sc => (
                                <div key={sc._id} style={listItemStyle}>
                                    <span>{sc.screenName} ({sc.totalSeats} seats)</span>
                                    <button onClick={async () => { await deleteScreen(sc._id); setSelectedTheaterId(sc.theaterId); openScreenModal(sc.theaterId); }} style={deleteBtnSmallStyle}>Remove</button>
                                </div>
                            ))}
                        </div>
                        <button onClick={() => setScreenModalOpen(false)} style={{ ...cancelBtnStyle, width: "100%", marginTop: "20px" }}>Close</button>
                    </div>
                </div>
            )}

            {/* Showtime Modal */}
            {showtimeModalOpen && (
                <div style={modalOverlayStyle}>
                    <div style={modalContentStyle}>
                        <h3>Schedule Showtime</h3>
                        <form onSubmit={handleShowtimeSubmit} style={formStyle}>
                            <select value={showtimeForm.movieId} onChange={e => setShowtimeForm({ ...showtimeForm, movieId: e.target.value })} style={inputStyle} required>
                                <option value="">Select Movie</option>
                                {movies.map(m => <option key={m._id} value={m._id}>{m.title}</option>)}
                            </select>
                            <select value={showtimeForm.theaterId} onChange={async (e) => {
                                const tid = e.target.value;
                                setShowtimeForm({ ...showtimeForm, theaterId: tid, screenId: "" });
                                const res = await getScreensByTheater(tid);
                                setScreens(res.data.screens);
                            }} style={inputStyle} required>
                                <option value="">Select Theater</option>
                                {theaters.map(t => <option key={t._id} value={t._id}>{t.name}</option>)}
                            </select>
                            <select value={showtimeForm.screenId} onChange={e => setShowtimeForm({ ...showtimeForm, screenId: e.target.value })} style={inputStyle} required disabled={!showtimeForm.theaterId}>
                                <option value="">Select Screen</option>
                                {screens.map(sc => <option key={sc._id} value={sc._id}>{sc.screenName}</option>)}
                            </select>
                            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                                <input type="date" value={showtimeForm.showDate} onChange={e => setShowtimeForm({ ...showtimeForm, showDate: e.target.value })} style={inputStyle} required />
                                <input type="time" value={showtimeForm.showTime} onChange={e => setShowtimeForm({ ...showtimeForm, showTime: e.target.value })} style={inputStyle} required />
                            </div>
                            <input type="number" placeholder="Ticket Price" value={showtimeForm.ticketPrice} onChange={e => setShowtimeForm({ ...showtimeForm, ticketPrice: parseFloat(e.target.value) })} style={inputStyle} required />
                            <div style={modalActionsStyle}>
                                <button type="button" onClick={() => setShowtimeModalOpen(false)} style={cancelBtnStyle}>Cancel</button>
                                <button type="submit" style={submitBtnStyle}>Schedule</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </section>
    );
}

// Styles
const containerStyle: React.CSSProperties = {
    marginTop: "40px",
};

const tabGroupStyle: React.CSSProperties = {
    display: "flex",
    gap: "10px",
    marginBottom: "30px",
};

const tabStyle: React.CSSProperties = {
    background: "rgba(255, 255, 255, 0.05)",
    color: "rgba(255, 255, 255, 0.6)",
    border: "1px solid rgba(255, 255, 255, 0.1)",
    padding: "12px 24px",
    borderRadius: "12px",
    cursor: "pointer",
    fontWeight: 600,
};

const activeTabStyle: React.CSSProperties = {
    ...tabStyle,
    background: "#e50914",
    color: "white",
    border: "none",
};

const paneStyle: React.CSSProperties = {
    background: "rgba(255, 255, 255, 0.03)",
    borderRadius: "24px",
    padding: "30px",
    border: "1px solid rgba(255, 255, 255, 0.05)",
};

const paneHeaderStyle: React.CSSProperties = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "20px",
};

const tableStyle: React.CSSProperties = { width: "100%", borderCollapse: "collapse" };
const thStyle: React.CSSProperties = { padding: "15px", textAlign: "left", borderBottom: "1px solid rgba(255, 255, 255, 0.1)", color: "rgba(255, 255, 255, 0.5)", fontSize: "14px" };
const tdStyle: React.CSSProperties = { padding: "15px", borderBottom: "1px solid rgba(255, 255, 255, 0.05)" };
const trStyle: React.CSSProperties = { transition: "background 0.2s" };

const btnGroupStyle: React.CSSProperties = { display: "flex", gap: "8px" };
const smallBtnStyle: React.CSSProperties = { background: "rgba(255, 255, 255, 0.05)", color: "white", border: "1px solid rgba(255, 255, 255, 0.1)", padding: "6px 12px", borderRadius: "8px", cursor: "pointer", fontSize: "13px" };
const deleteBtnSmallStyle: React.CSSProperties = { ...smallBtnStyle, background: "rgba(229, 9, 20, 0.1)", color: "#e50914", border: "1px solid rgba(229, 9, 20, 0.2)" };
const addBtnStyle: React.CSSProperties = { background: "#22c55e", color: "white", border: "none", padding: "10px 20px", borderRadius: "10px", fontWeight: 700, cursor: "pointer" };

const modalOverlayStyle: React.CSSProperties = { position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.8)", backdropFilter: "blur(8px)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 1000 };
const modalContentStyle: React.CSSProperties = { background: "#0a0a0a", border: "1px solid rgba(255, 255, 255, 0.1)", borderRadius: "24px", padding: "40px", width: "100%", maxWidth: "500px" };
const formStyle: React.CSSProperties = { display: "flex", flexDirection: "column", gap: "20px" };
const inputStyle: React.CSSProperties = { background: "rgba(255, 255, 255, 0.05)", border: "1px solid rgba(255, 255, 255, 0.1)", borderRadius: "10px", padding: "12px", color: "white", fontSize: "15px" };
const modalActionsStyle: React.CSSProperties = { display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "10px" };
const cancelBtnStyle: React.CSSProperties = { background: "transparent", color: "rgba(255, 255, 255, 0.5)", border: "none", padding: "12px 20px", cursor: "pointer", fontWeight: 600 };
const submitBtnStyle: React.CSSProperties = { background: "#e50914", color: "white", border: "none", padding: "12px 24px", borderRadius: "10px", fontWeight: 700, cursor: "pointer" };

const listItemStyle: React.CSSProperties = { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px", background: "rgba(255, 255, 255, 0.02)", borderRadius: "10px", marginBottom: "8px" };
const inlineFormStyle: React.CSSProperties = { display: "flex", gap: "10px" };

const errorStyle: React.CSSProperties = { background: "rgba(229, 9, 20, 0.1)", color: "#e50914", padding: "12px 20px", borderRadius: "12px", marginBottom: "20px" };
const successStyle: React.CSSProperties = { background: "rgba(34, 197, 94, 0.1)", color: "#22c55e", padding: "12px 20px", borderRadius: "12px", marginBottom: "20px" };
const msgStyle: React.CSSProperties = { textAlign: "center", padding: "40px", color: "rgba(255,255,255,0.4)" };
