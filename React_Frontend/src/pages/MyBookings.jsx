import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ApiService from '../services/api';
import AuthService from '../services/authService';

const MyBookings = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchUserBookings = async () => {
            const user = AuthService.getCurrentUser();
            if (!user || (!user.email && !user.username)) {
                setError('Please log in to view your reservations.');
                setLoading(false);
                return;
            }

            try {
                // Try to get by email (preferred) or username
                const email = user.email || user.username;
                const data = await ApiService.getBookingsByUser(email);
                setBookings(data);
            } catch (err) {
                console.error('Failed to fetch bookings:', err);
                setError('Could not load your reservations from the server.');
                // Fallback to local storage if API fails
                const savedBookings = JSON.parse(localStorage.getItem('myBookings') || '[]');
                if (savedBookings.length > 0) {
                    setBookings(savedBookings);
                }
            } finally {
                setLoading(false);
            }
        };

        fetchUserBookings();
    }, []);

    const getStatusColor = (status) => {
        switch (status?.toLowerCase()) {
            case 'confirmed': return 'text-success bg-success bg-opacity-10';
            case 'pending': return 'text-warning bg-warning bg-opacity-10';
            case 'cancelled': return 'text-danger bg-danger bg-opacity-10';
            case 'completed': return 'text-secondary bg-secondary bg-opacity-10';
            default: return 'text-primary bg-primary bg-opacity-10';
        }
    };

    const calculateTotal = (booking) => {
        if (booking.totalAmount) return booking.totalAmount.toLocaleString();

        // Fallback for manual calculation if not in backend response (unlikely now)
        try {
            const start = new Date(booking.startDate);
            const end = new Date(booking.endDate);
            const diffTime = Math.abs(end - start);
            const diffDays = Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
            const rate = booking.dailyRate || 2500;
            return (diffDays * rate).toLocaleString();
        } catch (e) {
            return (booking.dailyRate || 2500).toLocaleString();
        }
    };

    return (
        <div className="my-bookings-page py-5">
            <div className="container py-5">
                <div className="d-flex justify-content-between align-items-end mb-5">
                    <div>
                        <h2 className="display-5 fw-bold text-gradient mb-2">My Reservations</h2>
                        <p className="text-muted mb-0">View and manage your upcoming and past journeys.</p>
                    </div>
                    <Link to="/booking" className="btn btn-premium rounded-pill px-4">New Booking</Link>
                </div>

                {loading ? (
                    <div className="text-center py-5">
                        <div className="spinner-border text-primary" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </div>
                    </div>
                ) : error ? (
                    <div className="text-center py-5">
                        <div className="alert alert-danger rounded-4 d-inline-block px-5">
                            <i className="bi bi-exclamation-triangle me-2"></i>{error}
                        </div>
                        <div className="mt-4">
                            <Link to="/login" className="btn btn-premium rounded-pill px-5">Go to Login</Link>
                        </div>
                    </div>
                ) : bookings.length > 0 ? (
                    <div className="row g-4">
                        {bookings.map((booking, index) => (
                            <div className="col-lg-6" key={booking.bookingId ? `id-${booking.bookingId}-${index}` : `idx-${index}`}>
                                <div className="premium-card p-4 shadow-premium border-0">
                                    <div className="d-flex justify-content-between align-items-start mb-4">
                                        <div className="d-flex gap-3 align-items-center">
                                            <div className="bg-primary bg-opacity-10 p-3 rounded-4">
                                                <i className="bi bi-calendar-check fs-4 text-primary"></i>
                                            </div>
                                            <div>
                                                <h4 className="fw-bold mb-0">Booking #{booking.bookingId}</h4>
                                                <p className="text-muted small mb-0">Confirmation: {booking.confirmationNumber}</p>
                                            </div>
                                        </div>
                                        <span className={`badge rounded-pill px-3 py-2 ${getStatusColor(booking.bookingStatus || 'Confirmed')}`}>{booking.bookingStatus || 'Confirmed'}</span>
                                    </div>

                                    <div className="row g-3 mb-4">
                                        <div className="col-6">
                                            <div className="p-3 bg-glass rounded-4 h-100">
                                                <label className="text-muted small d-block mb-1">Vehicle</label>
                                                <span className="fw-bold">{booking.carName || 'Premium Vehicle'}</span>
                                            </div>
                                        </div>
                                        <div className="col-6">
                                            <div className="p-3 bg-glass rounded-4 h-100">
                                                <label className="text-muted small d-block mb-1">Duration</label>
                                                <span className="fw-bold">{booking.startDate} - {booking.endDate}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="d-flex justify-content-between align-items-center pt-3 border-top border-light mt-3">
                                        <div className="text-primary fw-bold fs-5">
                                            Total: ₹{calculateTotal(booking)}
                                            <span className="text-muted small fw-normal ms-1">({booking.dailyRate || '2500'}/day)</span>
                                        </div>
                                        <Link
                                            to={`/manage-booking?id=${booking.bookingId}`}
                                            className="btn btn-outline-premium btn-sm rounded-pill px-4"
                                        >
                                            Manage Reservation
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-5">
                        <div className="bg-light p-5 rounded-5 d-inline-block shadow-sm">
                            <i className="bi bi-journal-x display-1 text-muted opacity-25 mb-4"></i>
                            <h3 className="fw-bold mb-3">No Bookings Found</h3>
                            <p className="text-muted mb-4">We couldn't find any reservations associated with your account.</p>
                            <Link to="/booking" className="btn btn-premium rounded-pill px-5">Start Exploring</Link>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MyBookings;
