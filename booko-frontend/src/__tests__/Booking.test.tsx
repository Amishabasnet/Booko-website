import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Booking from '@/app/components/Booking';
import * as bookingService from '@/app/services/booking.service';
import { AuthProvider } from '@/app/context/AuthContext';

jest.mock('@/app/services/booking.service');

const mockCreateBooking = jest.fn();
const mockInitiatePayment = jest.fn();

beforeEach(() => {
    (bookingService.createBooking as jest.Mock).mockImplementation(mockCreateBooking);
    (bookingService.initiatePayment as jest.Mock).mockImplementation(mockInitiatePayment);
});

const renderWithAuth = (component: React.ReactElement) => {
    return render(
        <AuthProvider>
            {component}
        </AuthProvider>
    );
};

describe('Booking Component', () => {
    test('renders booking summary', () => {
        renderWithAuth(
            <Booking
                showtimeId="st1"
                selectedSeats={['A-1', 'A-2']}
                totalAmount={200}
                onBack={() => { }}
                onSuccess={() => { }}
            />
        );
        expect(screen.getByText(/Booking Summary/i)).toBeInTheDocument();
        expect(screen.getByText(/A-1, A-2/i)).toBeInTheDocument();
        expect(screen.getByText(/NPR 200.00/i)).toBeInTheDocument();
    });

    test('calls createBooking and initiatePayment on confirm', async () => {
        mockCreateBooking.mockResolvedValue({ data: { booking: { _id: 'bk1' } } });
        mockInitiatePayment.mockResolvedValue({});
        const onSuccess = jest.fn();
        renderWithAuth(
            <Booking
                showtimeId="st1"
                selectedSeats={['A-1']}
                totalAmount={100}
                onBack={() => { }}
                onSuccess={onSuccess}
            />
        );
        fireEvent.click(screen.getByText(/Confirm & Pay/i));
        await waitFor(() => expect(mockCreateBooking).toHaveBeenCalled());
        await waitFor(() => expect(mockInitiatePayment).toHaveBeenCalledWith('bk1', 'esewa'));
        expect(onSuccess).toHaveBeenCalledWith('bk1');
    });

    test('displays error on booking failure', async () => {
        mockCreateBooking.mockRejectedValue(new Error('fail'));
        renderWithAuth(
            <Booking
                showtimeId="st1"
                selectedSeats={['A-1']}
                totalAmount={100}
                onBack={() => { }}
                onSuccess={() => { }}
            />
        );
        fireEvent.click(screen.getByText(/Confirm & Pay/i));
        await waitFor(() => expect(screen.getByText(/An error occurred during booking or payment./i)).toBeInTheDocument());
    });

    test('back button triggers onBack', () => {
        const onBack = jest.fn();
        renderWithAuth(
            <Booking
                showtimeId="st1"
                selectedSeats={[]}
                totalAmount={0}
                onBack={onBack}
                onSuccess={() => { }}
            />
        );
        fireEvent.click(screen.getByText(/Back to Seating/i));
        expect(onBack).toHaveBeenCalled();
    });

    test('payment method selection works', () => {
        render(
            <Booking
                showtimeId="st1"
                selectedSeats={[]}
                totalAmount={0}
                onBack={() => { }}
                onSuccess={() => { }}
            />
        );
        const select = screen.getByRole('combobox');
        fireEvent.change(select, { target: { value: 'khalti' } });
        expect((select as HTMLSelectElement).value).toBe('khalti');
    });
});
