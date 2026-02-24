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
        <section style={sectionStyle}>
            <div style={headerStyle}>
                <h2 style={titleStyle}>Movie Management</h2>
                <button onClick={() => openModal()} style={addBtnStyle}>+ Add New Movie</button>
            </div>

            {error && <div style={errorStyle}>{error}</div>}
            {success && <div style={successStyle}>{success}</div>}

            <div style={tableContainerStyle}>
                <table style={tableStyle}>
                    <thead>
                        <tr>
                            <th style={thStyle}>Title</th>
                            <th style={thStyle}>Genre</th>
                            <th style={thStyle}>Duration</th>
                            <th style={thStyle}>Language</th>
                            <th style={thStyle}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {movies.map(movie => (
                            <tr key={movie._id} style={trStyle}>
                                <td style={tdStyle}>{movie.title}</td>
                                <td style={tdStyle}>{movie.genre.join(", ")}</td>
                                <td style={tdStyle}>{movie.duration} min</td>
                                <td style={tdStyle}>{movie.language}</td>
                                <td style={tdStyle}>
                                    <div style={actionGroupStyle}>
                                        <button onClick={() => openModal(movie)} style={editBtnStyle}>Edit</button>
                                        <button onClick={() => handleDelete(movie._id)} style={deleteBtnStyle}>Delete</button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {modalOpen && (
                <div style={modalOverlayStyle}>
                    <div style={modalContentStyle}>
                        <h3 style={{ margin: "0 0 20px 0" }}>{isEditing ? "Edit Movie" : "Add New Movie"}</h3>
                        <form onSubmit={handleSubmit} style={formStyle}>
                            <div style={formGroupStyle}>
                                <label style={labelStyle}>Title</label>
                                <input name="title" value={formData.title} onChange={handleInputChange} style={inputStyle} required />
                            </div>
                            <div style={formGroupStyle}>
                                <label style={labelStyle}>Description</label>
                                <textarea name="description" value={formData.description} onChange={handleInputChange} style={textareaStyle} required />
                            </div>
                            <div style={formGridStyle}>
                                <div style={formGroupStyle}>
                                    <label style={labelStyle}>Genre (comma separated)</label>
                                    <input name="genre" value={formData.genre} onChange={handleInputChange} style={inputStyle} required />
                                </div>
                                <div style={formGroupStyle}>
                                    <label style={labelStyle}>Duration (mins)</label>
                                    <input type="number" name="duration" value={formData.duration} onChange={handleInputChange} style={inputStyle} required />
                                </div>
                            </div>
                            <div style={formGridStyle}>
                                <div style={formGroupStyle}>
                                    <label style={labelStyle}>Language</label>
                                    <input name="language" value={formData.language} onChange={handleInputChange} style={inputStyle} required />
                                </div>
                                <div style={formGroupStyle}>
                                    <label style={labelStyle}>Release Date</label>
                                    <input type="date" name="releaseDate" value={formData.releaseDate} onChange={handleInputChange} style={inputStyle} required />
                                </div>
                            </div>
                            <div style={formGroupStyle}>
                                <label style={labelStyle}>Poster URL</label>
                                <input name="posterImage" value={formData.posterImage} onChange={handleInputChange} style={inputStyle} />
                            </div>

                            <div style={modalActionsStyle}>
                                <button type="button" onClick={() => setModalOpen(false)} style={cancelBtnStyle}>Cancel</button>
                                <button type="submit" style={submitBtnStyle}>{isEditing ? "Update" : "Create"}</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </section>
    );
}

// Styles
const sectionStyle: React.CSSProperties = {
    marginTop: "40px",
    background: "rgba(255, 255, 255, 0.03)",
    borderRadius: "24px",
    padding: "30px",
    border: "1px solid rgba(255, 255, 255, 0.05)",
};

const headerStyle: React.CSSProperties = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "30px",
};

const titleStyle: React.CSSProperties = {
    fontSize: "24px",
    fontWeight: 800,
    margin: 0,
};

const addBtnStyle: React.CSSProperties = {
    background: "#22c55e",
    color: "white",
    border: "none",
    padding: "10px 20px",
    borderRadius: "12px",
    fontWeight: 700,
    cursor: "pointer",
    boxShadow: "0 4px 12px rgba(34, 197, 94, 0.2)",
};

const tableContainerStyle: React.CSSProperties = {
    overflowX: "auto",
};

const tableStyle: React.CSSProperties = {
    width: "100%",
    borderCollapse: "collapse",
    textAlign: "left",
};

const thStyle: React.CSSProperties = {
    padding: "15px",
    borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
    color: "rgba(255, 255, 255, 0.5)",
    fontWeight: 600,
    fontSize: "14px",
};

const tdStyle: React.CSSProperties = {
    padding: "15px",
    borderBottom: "1px solid rgba(255, 255, 255, 0.05)",
    fontSize: "15px",
};

const trStyle: React.CSSProperties = {
    transition: "background 0.2s",
};

const actionGroupStyle: React.CSSProperties = {
    display: "flex",
    gap: "10px",
};

const editBtnStyle: React.CSSProperties = {
    background: "rgba(255, 255, 255, 0.05)",
    color: "white",
    border: "1px solid rgba(255, 255, 255, 0.1)",
    padding: "6px 12px",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "13px",
};

const deleteBtnStyle: React.CSSProperties = {
    background: "rgba(229, 9, 20, 0.1)",
    color: "#e50914",
    border: "1px solid rgba(229, 9, 20, 0.2)",
    padding: "6px 12px",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "13px",
};

const modalOverlayStyle: React.CSSProperties = {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: "rgba(0, 0, 0, 0.8)",
    backdropFilter: "blur(8px)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
    padding: "20px",
};

const modalContentStyle: React.CSSProperties = {
    background: "#0a0a0a",
    border: "1px solid rgba(255, 255, 255, 0.1)",
    borderRadius: "24px",
    padding: "40px",
    width: "100%",
    maxWidth: "600px",
    maxHeight: "90vh",
    overflowY: "auto",
};

const formStyle: React.CSSProperties = {
    display: "flex",
    flexDirection: "column",
    gap: "20px",
};

const formGroupStyle: React.CSSProperties = {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
};

const formGridStyle: React.CSSProperties = {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "15px",
};

const labelStyle: React.CSSProperties = {
    fontSize: "13px",
    color: "rgba(255, 255, 255, 0.4)",
    fontWeight: 600,
};

const inputStyle: React.CSSProperties = {
    background: "rgba(255, 255, 255, 0.05)",
    border: "1px solid rgba(255, 255, 255, 0.1)",
    borderRadius: "10px",
    padding: "12px",
    color: "white",
    fontSize: "15px",
};

const textareaStyle: React.CSSProperties = {
    ...inputStyle,
    minHeight: "100px",
    resize: "vertical",
};

const modalActionsStyle: React.CSSProperties = {
    display: "flex",
    justifyContent: "flex-end",
    gap: "15px",
    marginTop: "10px",
};

const cancelBtnStyle: React.CSSProperties = {
    background: "transparent",
    color: "rgba(255, 255, 255, 0.6)",
    border: "none",
    padding: "12px 24px",
    cursor: "pointer",
    fontWeight: 600,
};

const submitBtnStyle: React.CSSProperties = {
    background: "#e50914",
    color: "white",
    border: "none",
    padding: "12px 30px",
    borderRadius: "12px",
    fontWeight: 700,
    cursor: "pointer",
    boxShadow: "0 6px 16px rgba(229, 9, 20, 0.2)",
};

const errorStyle: React.CSSProperties = {
    background: "rgba(229, 9, 20, 0.1)",
    color: "#e50914",
    padding: "12px 20px",
    borderRadius: "12px",
    marginBottom: "20px",
    fontSize: "14px",
};

const successStyle: React.CSSProperties = {
    background: "rgba(34, 197, 94, 0.1)",
    color: "#22c55e",
    padding: "12px 20px",
    borderRadius: "12px",
    marginBottom: "20px",
    fontSize: "14px",
};

const loadingStyle: React.CSSProperties = {
    textAlign: "center",
    padding: "40px",
    color: "rgba(255, 255, 255, 0.4)",
};
