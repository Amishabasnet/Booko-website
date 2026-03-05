import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import SeatSelection from '@/app/components/SeatSelection';
import * as showtimeService from '@/app/services/showtime.service';
import * as bookingService from '@/app/services/booking.service';

jest.mock('@/app/services/showtime.service');
jest.mock('@/app/services/booking.service');

const mockShowtime = {
    data: {
        showtime: {
            _id: 'st1',
            movieId: { title: 'Test Movie' },
            theaterId: { name: 'Main' },
            screenId: {
                screenName: 'Screen 1',
                seatLayout: [
                    [
                        { row: 'A', col: 1, isAvailable: true, type: 'normal' },
                        { row: 'A', col: 2, isAvailable: false, type: 'normal' },
                    ],
                ],
            },
            showTime: '18:00',
            ticketPrice: 100,
            bookedSeats: ['A-2'],
        },
    },
};

describe('SeatSelection Component', () => {
    beforeEach(() => {
        (showtimeService.getShowtimeById as jest.Mock).mockResolvedValue(mockShowtime);
        (bookingService.createBooking as jest.Mock).mockResolvedValue({});
    });

    test('renders loading state', async () => {
        (showtimeService.getShowtimeById as jest.Mock).mockImplementation(() => new Promise(() => { }));
        render(<SeatSelection showtimeId="st1" onConfirm={jest.fn()} />);
        expect(screen.getByText(/Preparing your theater seating view.../i)).toBeInTheDocument();
    });

    test('displays seats and allows selection', async () => {
        const onConfirm = jest.fn();
        render(<SeatSelection showtimeId="st1" onConfirm={onConfirm} />);
        await waitFor(() => expect(screen.getByText('Screen')).toBeInTheDocument());
        const seatButton = screen.getByTitle('A1 (normal)');
        fireEvent.click(seatButton);
        expect(seatButton).toHaveClass('bg-primary');
        const confirmBtn = screen.getByText(/Review & Pay/i);
        fireEvent.click(confirmBtn);
        await waitFor(() => expect(onConfirm).toHaveBeenCalledWith(['A-1'], 100));
    });

    test('booked seats are disabled', async () => {
        render(<SeatSelection showtimeId="st1" onConfirm={jest.fn()} />);
        await waitFor(() => screen.getByTitle('A2 (normal - Booked)'));
        const bookedSeat = screen.getByTitle('A2 (normal - Booked)');
        expect(bookedSeat).toBeDisabled();
    });
});
