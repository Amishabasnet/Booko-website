import axios from "axios";

const API_URL = "http://localhost:5000/api";

const getAuthHeader = () => {
    const token = localStorage.getItem("booko_token");
    return token ? { Authorization: `Bearer ${token}` } : {};
};

export const getMovies = () => axios.get(`${API_URL}/movies`);

export const getMovieShowtimes = (movieId: string) =>
    axios.get(`${API_URL}/showtimes`, { params: { movieId } });

export const getMovieById = (id: string) => axios.get(`${API_URL}/movies/${id}`);

export const createMovie = (data: any) =>
    axios.post(`${API_URL}/movies`, data, { headers: getAuthHeader() });

export const updateMovie = (id: string, data: any) =>
    axios.put(`${API_URL}/movies/${id}`, data, { headers: getAuthHeader() });

export const deleteMovie = (id: string) =>
    axios.delete(`${API_URL}/movies/${id}`, { headers: getAuthHeader() });
