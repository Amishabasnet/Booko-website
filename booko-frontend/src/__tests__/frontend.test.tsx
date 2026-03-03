import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';

// Components under test (adjust import paths as needed)
import AdminTheaterShowtimeManagement from '../app/components/AdminTheaterShowtimeManagement';
import AdminBookings from '../app/components/AdminBookings';
import HomePage from '../app/page';

// Mock API modules (replace with actual paths if different)
jest.mock('../app/api/showtime', () => ({
    getAllShowtimes: jest.fn().mockResolvedValue([
        { _id: 'show1', movieId: { title: 'Dune Messiah', posterUrl: '/images/dune3.jpg' }, screenId: { name: 'AUD1' }, startTime: new Date().toISOString() },
    ]),
}));

jest.mock('../app/api/booking', () => ({
    getAllBookings: jest.fn().mockResolvedValue([
        { _id: 'book1', userId: { name: 'John Doe' }, showtimeId: { movieId: { title: 'Dune Messiah' }, screenId: { name: 'AUD1' }, startTime: new Date().toISOString() }, selectedSeats: ['A1'], totalAmount: 100 },
    ]),
}));

describe('Frontend component tests (20 cases)', () => {
    // 1. Hero image renders with correct alt text
    test('renders hero image with alt text Dune Messiah', () => {
        render(<HomePage />);
        const img = screen.getByAltText('Dune Messiah');
        expect(img).toBeInTheDocument();
    });

    // 2. Schedule button is enabled after selecting required fields
    test('Schedule button becomes enabled when screen and time are selected', async () => {
        render(<AdminTheaterShowtimeManagement />);
        const screenSelect = await screen.findByLabelText(/Screen/i);
        fireEvent.change(screenSelect, { target: { value: 'AUD1' } });
        const timeInput = screen.getByPlaceholderText(/Time/i);
        fireEvent.change(timeInput, { target: { value: '2023-12-01T20:00' } });
        const scheduleBtn = screen.getByRole('button', { name: /Schedule/i });
        expect(scheduleBtn).toBeEnabled();
    });

    // 3. Schedule button shows loading state when clicked
    test('Schedule button shows loading spinner on click', async () => {
        render(<AdminTheaterShowtimeManagement />);
        const scheduleBtn = await screen.findByRole('button', { name: /Schedule/i });
        fireEvent.click(scheduleBtn);
        expect(scheduleBtn).toHaveClass('loading');
    });

    // 4. Screen dropdown contains AUD1, AUD2, AUD3
    test('Screen dropdown contains custom labels', async () => {
        render(<AdminTheaterShowtimeManagement />);
        const dropdown = await screen.findByLabelText(/Screen/i);
        fireEvent.mouseDown(dropdown);
        const options = screen.getAllByRole('option');
        const labels = options.map(o => o.textContent);
        expect(labels).toEqual(expect.arrayContaining(['AUD1', 'AUD2', 'AUD3']));
    });

    // 5. Admin bookings table displays movie title
    test('Admin bookings table shows movie title', async () => {
        render(<AdminBookings />);
        const titleCell = await screen.findByText('Dune Messiah');
        expect(titleCell).toBeInTheDocument();
    });

    // 6. Booking row shows correct seat list
    test('Booking row lists selected seats', async () => {
        render(<AdminBookings />);
        const seatCell = await screen.findByText('A1');
        expect(seatCell).toBeInTheDocument();
    });

    // 7. Deleting a booking calls API and removes row
    test('Delete booking button triggers delete API', async () => {
        const mockDelete = jest.fn().mockResolvedValue({ success: true });
        jest.mock('../app/api/booking', () => ({ deleteBooking: mockDelete }));
        render(<AdminBookings />);
        const deleteBtn = await screen.findByRole('button', { name: /Delete/i });
        fireEvent.click(deleteBtn);
        await waitFor(() => expect(mockDelete).toHaveBeenCalled());
    });

    // 8. Validation error appears when required fields missing
    test('Shows validation error if screen not selected', async () => {
        render(<AdminTheaterShowtimeManagement />);
        const scheduleBtn = await screen.findByRole('button', { name: /Schedule/i });
        fireEvent.click(scheduleBtn);
        const errorMsg = await screen.findByText(/Please select a screen/i);
        expect(errorMsg).toBeInTheDocument();
    });

    // 9. Hero section has correct background gradient class
    test('Hero section has gradient class applied', () => {
        render(<HomePage />);
        const hero = screen.getByTestId('hero-section');
        expect(hero).toHaveClass('bg-gradient-to-r');
    });

    // 10. Schedule modal is scrollable on small screens
    test('Schedule modal enables scrolling on mobile viewport', async () => {
        // Set viewport width to mobile size
        window.innerWidth = 375;
        window.dispatchEvent(new Event('resize'));
        render(<AdminTheaterShowtimeManagement />);
        const openModalBtn = await screen.findByRole('button', { name: /Add Showtime/i });
        fireEvent.click(openModalBtn);
        const modal = await screen.findByTestId('schedule-modal');
        expect(modal).toHaveStyle('overflow-y: auto');
    });

    // 11. Clicking cancel on schedule modal closes it
    test('Cancel button closes schedule modal', async () => {
        render(<AdminTheaterShowtimeManagement />);
        const openBtn = await screen.findByRole('button', { name: /Add Showtime/i });
        fireEvent.click(openBtn);
        const cancelBtn = await screen.findByRole('button', { name: /Cancel/i });
        fireEvent.click(cancelBtn);
        await waitFor(() => expect(screen.queryByTestId('schedule-modal')).not.toBeInTheDocument());
    });

    // 12. Booking creation shows success toast
    test('Shows success toast after creating booking', async () => {
        render(<AdminBookings />);
        const createBtn = await screen.findByRole('button', { name: /Create Booking/i });
        fireEvent.click(createBtn);
        const toast = await screen.findByText(/Booking created successfully/i);
        expect(toast).toBeInTheDocument();
    });

    // 13. Image fallback works when poster URL is missing
    test('Displays placeholder image when poster URL is empty', () => {
        render(<HomePage />);
        const img = screen.getByAltText('Dune Messiah');
        expect(img).toHaveAttribute('src', expect.stringContaining('placeholder.jpg'));
    });

    // 14. Admin login form validates email format
    test('Login form shows error on invalid email', async () => {
        render(<AdminBookings />); // assuming login component is part of same tree for test simplicity
        const emailInput = screen.getByPlaceholderText(/Email/i);
        fireEvent.change(emailInput, { target: { value: 'invalid-email' } });
        const submitBtn = screen.getByRole('button', { name: /Login/i });
        fireEvent.click(submitBtn);
        const error = await screen.findByText(/Enter a valid email/i);
        expect(error).toBeInTheDocument();
    });

    // 15. Showtimes list renders correct number of rows
    test('Showtimes table renders correct row count', async () => {
        render(<AdminTheaterShowtimeManagement />);
        const rows = await screen.findAllByTestId('showtime-row');
        expect(rows).toHaveLength(1); // based on mocked data
    });

    // 16. Updating a booking status reflects new status in UI
    test('Updating booking status updates UI', async () => {
        render(<AdminBookings />);
        const statusSelect = await screen.findByLabelText(/Status/i);
        fireEvent.change(statusSelect, { target: { value: 'cancelled' } });
        const updateBtn = screen.getByRole('button', { name: /Update/i });
        fireEvent.click(updateBtn);
        const statusBadge = await screen.findByText(/Cancelled/i);
        expect(statusBadge).toBeInTheDocument();
    });

    // 17. Pagination component navigates pages
    test('Pagination next button loads next page', async () => {
        render(<AdminBookings />);
        const nextBtn = screen.getByRole('button', { name: /Next/i });
        fireEvent.click(nextBtn);
        await waitFor(() => expect(screen.getByText(/Page 2/i)).toBeInTheDocument());
    });

    // 18. Search input filters bookings list
    test('Search filters bookings by user name', async () => {
        render(<AdminBookings />);
        const searchInput = screen.getByPlaceholderText(/Search/i);
        fireEvent.change(searchInput, { target: { value: 'John' } });
        const result = await screen.findByText('John Doe');
        expect(result).toBeInTheDocument();
    });

    // 19. Tooltip appears on hover over seat icon
    test('Hovering seat icon shows tooltip', async () => {
        render(<AdminBookings />);
        const seatIcon = screen.getByTestId('seat-icon-A1');
        fireEvent.mouseOver(seatIcon);
        const tooltip = await screen.findByText(/Seat A1/i);
        expect(tooltip).toBeInTheDocument();
    });

    // 20. Dark mode toggle switches theme class
    test('Dark mode toggle adds dark-theme class to body', async () => {
        render(<HomePage />);
        const toggle = screen.getByLabelText(/Dark Mode/i);
        fireEvent.click(toggle);
        expect(document.body).toHaveClass('dark-theme');
    });
});
