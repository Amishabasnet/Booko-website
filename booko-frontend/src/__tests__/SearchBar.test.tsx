import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import SearchBar from '@/app/components/SearchBar';

jest.useFakeTimers();

describe('SearchBar Component', () => {
    const mockOnSearch = jest.fn();

    beforeEach(() => {
        mockOnSearch.mockClear();
    });

    test('renders input and filters', () => {
        render(<SearchBar onSearch={mockOnSearch} />);
        expect(screen.getByPlaceholderText(/Search movies by title/i)).toBeInTheDocument();
        expect(screen.getByRole('combobox')).toBeInTheDocument();
        expect(screen.getByLabelText(/date/i)).toBeInTheDocument();
    });

    test('calls onSearch after debounce', async () => {
        render(<SearchBar onSearch={mockOnSearch} />);
        fireEvent.change(screen.getByPlaceholderText(/Search movies by title/i), { target: { value: 'Matrix' } });
        fireEvent.change(screen.getByRole('combobox'), { target: { value: 'Action' } });
        fireEvent.change(screen.getByLabelText(/date/i), { target: { value: '2023-01-01' } });
        // Fast-forward debounce timer
        jest.advanceTimersByTime(500);
        await waitFor(() => expect(mockOnSearch).toHaveBeenCalledWith({ search: 'Matrix', genre: 'Action', date: '2023-01-01' }));
    });

    test('debounce resets on rapid input', async () => {
        render(<SearchBar onSearch={mockOnSearch} />);
        const input = screen.getByPlaceholderText(/Search movies by title/i);
        fireEvent.change(input, { target: { value: 'A' } });
        jest.advanceTimersByTime(300);
        fireEvent.change(input, { target: { value: 'AB' } });
        jest.advanceTimersByTime(300);
        fireEvent.change(input, { target: { value: 'ABC' } });
        jest.advanceTimersByTime(500);
        await waitFor(() => expect(mockOnSearch).toHaveBeenCalledTimes(1));
    });

    test('does not call onSearch before debounce period', () => {
        render(<SearchBar onSearch={mockOnSearch} />);
        fireEvent.change(screen.getByPlaceholderText(/Search movies by title/i), { target: { value: 'Test' } });
        jest.advanceTimersByTime(200);
        expect(mockOnSearch).not.toHaveBeenCalled();
    });
});
