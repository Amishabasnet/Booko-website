import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import AdminMovieManagement from '@/app/components/AdminMovieManagement';
import * as movieService from '@/app/services/movie.service';

jest.mock('@/app/services/movie.service');

const mockMovies = [
    { _id: '1', title: 'Movie One', genre: ['Action'], duration: 120, language: 'English', releaseDate: '2023-01-01', posterImage: '' },
    { _id: '2', title: 'Movie Two', genre: ['Drama'], duration: 90, language: 'French', releaseDate: '2023-02-01', posterImage: '' },
];

describe('AdminMovieManagement Component', () => {
    beforeEach(() => {
        (movieService.getMovies as jest.Mock).mockResolvedValue({ data: { movies: mockMovies } });
        (movieService.deleteMovie as jest.Mock).mockResolvedValue({});
    });

    test('renders movie list', async () => {
        render(<AdminMovieManagement />);
        expect(screen.getByText(/Managing your cinematic library.../i)).toBeInTheDocument();
        await waitFor(() => expect(screen.getByText('Movie One')).toBeInTheDocument());
        expect(screen.getByText('Movie Two')).toBeInTheDocument();
    });

    test('opens add movie modal', async () => {
        render(<AdminMovieManagement />);
        await waitFor(() => screen.getByText('Movie One'));
        fireEvent.click(screen.getByText('+ Add New Movie'));
        expect(screen.getByRole('dialog')).toBeInTheDocument();
        expect(screen.getByLabelText(/title/i)).toBeInTheDocument();
    });

    test('edits a movie', async () => {
        render(<AdminMovieManagement />);
        await waitFor(() => screen.getByText('Movie One'));
        fireEvent.click(screen.getAllByText('Edit')[0]);
        expect(screen.getByRole('dialog')).toBeInTheDocument();
        expect(screen.getByDisplayValue('Movie One')).toBeInTheDocument();
    });

    test('deletes a movie after confirmation', async () => {
        render(<AdminMovieManagement />);
        await waitFor(() => screen.getByText('Movie One'));
        fireEvent.click(screen.getAllByText('Delete')[0]);
        // Confirm modal appears
        expect(screen.getByText(/are you sure/i)).toBeInTheDocument();
        fireEvent.click(screen.getByText('Confirm'));
        await waitFor(() => expect(movieService.deleteMovie).toHaveBeenCalledWith('1'));
    });

    test('shows error message on fetch failure', async () => {
        (movieService.getMovies as jest.Mock).mockRejectedValue(new Error('fail'));
        render(<AdminMovieManagement />);
        await waitFor(() => expect(screen.getByText(/failed to fetch movies/i)).toBeInTheDocument());
    });
});
