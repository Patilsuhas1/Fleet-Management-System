import React, { useState, useEffect } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import ApiService from '../services/api';
import AuthService from '../services/authService';

const ManageBooking = () => {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const bookingId = queryParams.get('id');

    const [booking, setBooking] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [searchInput, setSearchInput] = useState('');

    const navigate = useNavigate();

    useEffect(() => {
        const user = AuthService.getCurrentUser();
        if (!user) {
            navigate('/login');
            return;
        }

        if (!bookingId) {
            setLoading(false);
            return;
        }

        const fetchBooking = async () => {
            setLoading(true);
            setError('');
            try {
                const data = await ApiService.getBooking(bookingId);
                setBooking(data);
            } catch (err) {
                // If backend fails, try to find in localStorage for demo purposes
                const saved = JSON.parse(localStorage.getItem('myBookings') || '[]');
                const localBooking = saved.find(b => String(b.bookingId) === String(bookingId));

                if (localBooking) {
                    setBooking(localBooking);
                } else {
                    setError('Failed to retrieve booking details. It might not exist or the server is down.');
                }
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchBooking();
    }, [bookingId, navigate]);

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchInput) {
            window.location.href = `/manage-booking?id=${searchInput}`;
        }
    };

    if (loading) return (
        <div className="container py-5 text-center">
            <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading Reservation Details...</span>
            </div>
        </div>
    );

    if (error || (!booking && !loading)) return (
        <div className="container py-5 text-center">
            <div className="bg-glass p-5 rounded-5 shadow-sm d-inline-block" style={{ maxWidth: '500px' }}>
                <i className="bi bi-search display-3 text-primary mb-4 d-block"></i>
                <h3 className="fw-bold mb-3">Manage Your Reservation</h3>
                <p className="text-muted mb-4">Enter your booking reference number to view details or print your invoice.</p>

                {error && <div className="alert alert-danger border-0 rounded-4 small mb-4">{error}</div>}

                <form onSubmit={handleSearch} className="mb-4">
                    <div className="input-group glass-effect rounded-pill p-1 border">
                        <input
                            type="text"
                            className="form-control bg-transparent border-0 px-4"
                            placeholder="Booking ID (e.g. 5)"
                            value={searchInput}
                            onChange={(e) => setSearchInput(e.target.value)}
                        />
                        <button className="btn btn-premium rounded-pill px-4" type="submit">Find</button>
                    </div>
                </form>

                <div className="pt-3 border-top border-light">
                    <p className="small text-muted mb-3">Or check your history</p>
                    <Link to="/my-bookings" className="btn btn-outline-premium rounded-pill px-5">My Reservations</Link>
                </div>
            </div>
        </div>
    );

    const calculateTotal = () => {
        if (booking.totalAmount) return booking.totalAmount.toLocaleString();
        return 'Calculated';
    };

    const handleCancel = async () => {
        if (!window.confirm('Are you sure you want to cancel this reservation? This action cannot be undone.')) {
            return;
        }

        setLoading(true);
        setError('');
        try {
            const updatedBooking = await ApiService.cancelBooking(booking.bookingId);
            setBooking(updatedBooking);
            alert('Your reservation has been successfully cancelled.');
        } catch (err) {
            console.error('Cancellation failed:', err);
            setError('Failed to cancel the booking. Please contact support.');
        } finally {
            setLoading(false);
        }
    };

    const isCancelled = booking.bookingStatus === 'CANCELLED';
    const isCompleted = booking.bookingStatus === 'COMPLETED';

    return (
        <div className="manage-booking-page py-5">
            <div className="container py-5">
                <div className="row justify-content-center">
                    <div className="col-lg-8">
                        <div className="d-flex justify-content-between align-items-center mb-5">
                            <Link to="/my-bookings" className="text-decoration-none text-muted fw-medium">
                                <i className="bi bi-arrow-left me-2"></i>Back to My Reservations
                            </Link>
                            <span className={`badge ${isCancelled ? 'bg-danger' : (isCompleted ? 'bg-secondary' : 'bg-success')} bg-opacity-10 ${isCancelled ? 'text-danger' : (isCompleted ? 'text-secondary' : 'text-success')} rounded-pill px-4 py-2 fw-bold`}>
                                {booking.bookingStatus || 'Confirmed'}
                            </span>
                        </div>

                        <div className="premium-card p-5 shadow-premium border-0">
                            <div className="text-center mb-5">
                                <h2 className="display-6 fw-bold text-gradient mb-2">Reservation Summary</h2>
                                <p className="text-muted">Booking Reference: #{booking.bookingId}</p>
                            </div>

                            <div className="row g-4 mb-5">
                                <div className="col-md-6">
                                    <div className="p-4 bg-light rounded-4 h-100 border-0">
                                        <h5 className="fw-bold mb-3 text-primary"><i className="bi bi-car-front me-2"></i>Vehicle Details</h5>
                                        <p className="mb-1 fw-bold fs-5">{booking.carName || 'Premium Vehicle'}</p>
                                        <p className="text-muted small">Automatic • Petrol • 5 Seats</p>
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="p-4 bg-light rounded-4 h-100 border-0">
                                        <h5 className="fw-bold mb-3 text-primary"><i className="bi bi-calendar-event me-2"></i>Trip Schedule</h5>
                                        <p className="mb-0 fw-bold">{booking.startDate}</p>
                                        <p className="text-center py-2 mb-0"><i className="bi bi-arrow-down text-muted"></i></p>
                                        <p className="mb-0 fw-bold">{booking.endDate}</p>
                                    </div>
                                </div>
                                <div className="col-12">
                                    <div className="p-4 bg-light rounded-4 border-0">
                                        <h5 className="fw-bold mb-3 text-primary"><i className="bi bi-geo-alt me-2"></i>Pickup & Return Location</h5>
                                        <p className="mb-0 fw-bold">Primary Fleet Hub - {booking.pickupHubId || 'Main City Center'}</p>
                                        <p className="text-muted small mb-0">Maharashtra, India</p>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-glass p-4 rounded-4 mb-5 border-0 shadow-sm">
                                <h5 className="fw-bold mb-4">Financial Summary</h5>
                                {(() => {
                                    const start = new Date(booking.startDate);
                                    const end = new Date(booking.endDate);
                                    const days = Math.max(1, Math.ceil(Math.abs(end - start) / (1000 * 60 * 60 * 24)));
                                    const baseRentalTotal = (booking.dailyRate || 0) * days;
                                    const addonTotal = booking.totalAddonAmount || 0;
                                    const addonDaily = days > 0 ? (addonTotal / days) : 0;

                                    return (
                                        <>
                                            <div className="d-flex justify-content-between mb-2 text-muted">
                                                <span>Rental Duration</span>
                                                <span className="fw-medium">{days} Day{days > 1 ? 's' : ''}</span>
                                            </div>
                                            <div className="d-flex justify-content-between mb-3 text-muted">
                                                <span>Base Rental ({days} Days)</span>
                                                <span>
                                                    <small className="me-2">(₹{booking.dailyRate?.toLocaleString()}/day)</small>
                                                    <span className="fw-bold text-dark">₹{baseRentalTotal.toLocaleString()}</span>
                                                </span>
                                            </div>

                                            <div className="d-flex justify-content-between mb-2 text-muted">
                                                <span>Added Services & Add-ons ({days} Days)</span>
                                                <span>
                                                    <small className="me-2">(₹{addonDaily.toLocaleString(undefined, { maximumFractionDigits: 0 })}/day)</small>
                                                    <span className="fw-bold text-dark">₹{addonTotal.toLocaleString()}</span>
                                                </span>
                                            </div>
                                        </>
                                    );
                                })()}

                                {booking.selectedAddOns && booking.selectedAddOns.length > 0 && (
                                    <div className="ms-3 mb-3">
                                        {booking.selectedAddOns.map((addon, index) => (
                                            <div key={index} className="d-flex justify-content-between x-small text-muted py-1 border-start ps-3">
                                                <span>{addon}</span>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                <hr />
                                <div className="d-flex justify-content-between align-items-center">
                                    <span className="h5 fw-bold mb-0">Total Amount Paid</span>
                                    <span className="h4 fw-bold text-primary mb-0">₹{calculateTotal()}</span>
                                </div>
                            </div>

                            <div className="d-flex gap-3 mt-4">
                                <button
                                    className={`btn ${isCancelled ? 'btn-secondary' : 'btn-outline-danger'} btn-lg w-100 rounded-pill`}
                                    onClick={handleCancel}
                                    disabled={isCancelled || isCompleted}
                                >
                                    <i className={`bi ${isCancelled ? 'bi-slash-circle' : 'bi-x-circle'} me-2`}></i>
                                    {isCancelled ? 'Cancelled' : 'Cancel Booking'}
                                </button>
                                <button className="btn btn-premium btn-lg w-100 rounded-pill" onClick={() => window.print()} disabled={isCancelled}>
                                    <i className="bi bi-printer me-2"></i>Print Invoice
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ManageBooking;
