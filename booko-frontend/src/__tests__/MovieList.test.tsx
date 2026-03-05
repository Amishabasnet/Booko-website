import { render, screen, waitFor } from '@testing-library/react';
import MovieList from '@/app/components/MovieList';
import * as movieService from '@/app/services/movie.service';
import '@testing-library/jest-dom';

jest.mock('@/app/services/movie.service');

const mockMovies = [
    {
        _id: 'm1',
        title: 'Movie One',
        description: 'Desc',
        genre: ['Action'],
        duration: 120,
        posterImage: 'poster1.jpg',
        showtimes: [
            { _id: 's1', showTime: '10:00', showDate: '2023-01-01', ticketPrice: 100 },
        ],
    },
    {
        _id: 'm2',
        title: 'Movie Two',
        description: 'Desc',
        genre: ['Drama'],
        duration: 90,
        posterImage: '',
        showtimes: [],
    },
];

describe('MovieList Component', () => {
    beforeEach(() => {
        (movieService.getMovies as jest.Mock).mockResolvedValue({ data: { movies: mockMovies } });
        (movieService.getMovieShowtimes as jest.Mock).mockImplementation((id) => {
            const movie = mockMovies.find((m) => m._id === id);
            return Promise.resolve({ data: { showtimes: movie?.showtimes || [] } });
        });
    });

    test('shows loader while fetching', async () => {
        (movieService.getMovies as jest.Mock).mockImplementation(() => new Promise(() => { }));
        render(<MovieList />);
        expect(screen.getByText(/Searching for blockbusters.../i)).toBeInTheDocument();
    });

    test('displays error message on fetch failure', async () => {
        (movieService.getMovies as jest.Mock).mockRejectedValue(new Error('fail'));
        render(<MovieList />);
        await waitFor(() => expect(screen.getByText(/Failed to load movies./i)).toBeInTheDocument());
    });

    test('renders no movies message when empty', async () => {
        (movieService.getMovies as jest.Mock).mockResolvedValue({ data: { movies: [] } });
        render(<MovieList />);
        await waitFor(() => expect(screen.getByText(/No movies found/i)).toBeInTheDocument());
    });

    test('renders movie cards with poster and genres', async () => {
        render(<MovieList />);
        await waitFor(() => expect(screen.getByText('Movie One')).toBeInTheDocument());
        expect(screen.getByText('Movie Two')).toBeInTheDocument();
        // genre badge
        expect(screen.getAllByText('Action')[0]).toBeInTheDocument();
        expect(screen.getAllByText('Drama')[0]).toBeInTheDocument();
    });

    test('shows showtimes when available', async () => {
        render(<MovieList />);
        await waitFor(() => expect(screen.getByText('Movie One')).toBeInTheDocument());
        expect(screen.getByText('10:00')).toBeInTheDocument();
    });

    test('shows placeholder when poster missing', async () => {
        render(<MovieList />);
        await waitFor(() => expect(screen.getByText('Movie Two')).toBeInTheDocument());
        expect(screen.getByText('No Poster Available')).toBeInTheDocument();
    });
});
