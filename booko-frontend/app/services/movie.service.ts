import axios from "axios";

const API_URL = "http://localhost:5000/api";

export const getMovies = () => axios.get(`${API_URL}/movies`);

export const getMovieShowtimes = (movieId: string) =>
    axios.get(`${API_URL}/showtimes`, { params: { movieId } });
