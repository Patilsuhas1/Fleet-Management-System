import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ApiService from '../services/api';

const AdminBookings = () => {
    const navigate = useNavigate();
    const [bookings, setBookings] = useState([]);
    const [bookingFilter, setBookingFilter] = useState('ALL');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    useEffect(() => {
        loadBookings();
    }, []);

    const loadBookings = async () => {
        setLoading(true);
        try {
            const data = await ApiService.getAllBookings();
            console.log("Loaded bookings:", data);
            setBookings(data || []);
        } catch (e) {
            console.error("Failed to load bookings:", e);
            setMessage({ type: 'danger', text: 'Failed to synchronize booking data.' });
        } finally {
            setLoading(false);
        }
    };

    const filteredBookings = bookings.filter(b => {
        if (bookingFilter === 'ALL') return true;
        if (bookingFilter === 'ACTIVE') return b.bookingStatus === 'CONFIRMED' || b.bookingStatus === 'ALLOTTED';
        return b.bookingStatus === bookingFilter;
    });

    const getStatusColor = (status) => {
        switch (status) {
            case 'CONFIRMED': return 'primary';
            case 'ALLOTTED': return 'warning';
            case 'COMPLETED': return 'success';
            case 'CANCELLED': return 'danger';
            default: return 'secondary';
        }
    };

    return (
        <div className="container-fluid px-5 py-5 bg-light min-vh-100">
            <div className="d-flex justify-content-between align-items-center mb-5">
                <div>
                    <button className="btn btn-link text-decoration-none p-0 mb-3 text-primary fw-bold" onClick={() => navigate('/admin/dashboard')}>
                        <i className="bi bi-arrow-left me-2"></i>Back to Admin Console
                    </button>
                    <h2 className="mb-1 text-gradient display-5 fw-bold">Booking Insights</h2>
                    <p className="text-muted mb-0">Monitor and manage real-time fleet reservations.</p>
                </div>
                <div className="d-flex gap-3 align-items-center">
                    <button className="btn btn-outline-primary rounded-pill px-4" onClick={loadBookings} disabled={loading}>
                        <i className={`bi bi-arrow-clockwise me-2 ${loading ? 'spin' : ''}`}></i>Refresh Data
                    </button>
                    {loading && (
                        <div className="spinner-border spinner-border-sm text-primary" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </div>
                    )}
                </div>
            </div>

            {message.text && (
                <div className={`alert alert-${message.type} mb-4 shadow-sm border-0 rounded-4 animate-fade-in py-3 d-flex align-items-center`}>
                    <i className={`bi bi-exclamation-triangle-fill me-3 fs-4`}></i>
                    <div>{message.text}</div>
                </div>
            )}

            {/* Quick Stats Grid */}
            <div className="row g-4 mb-5">
                <div className="col-md-3">
                    <div className="premium-card p-4 shadow-sm border-0 bg-white border-start border-primary border-4 rounded-4">
                        <div className="d-flex align-items-center">
                            <div className="bg-primary bg-opacity-10 rounded-circle p-3 me-3">
                                <i className="bi bi-stack text-primary fs-4"></i>
                            </div>
                            <div>
                                <h6 className="text-muted small mb-1 uppercase tracking-wider fw-bold">Total Bookings</h6>
                                <h3 className="mb-0 fw-bold">{bookings.length}</h3>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-md-3">
                    <div className="premium-card p-4 shadow-sm border-0 bg-white border-start border-warning border-4 rounded-4">
                        <div className="d-flex align-items-center">
                            <div className="bg-warning bg-opacity-10 rounded-circle p-3 me-3">
                                <i className="bi bi-speedometer2 text-warning fs-4"></i>
                            </div>
                            <div>
                                <h6 className="text-muted small mb-1 uppercase tracking-wider fw-bold">Active Bookings</h6>
                                <h3 className="mb-0 fw-bold">
                                    {bookings.filter(b => b.bookingStatus === 'CONFIRMED' || b.bookingStatus === 'ALLOTTED').length}
                                </h3>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-md-3">
                    <div className="premium-card p-4 shadow-sm border-0 bg-white border-start border-success border-4 rounded-4">
                        <div className="d-flex align-items-center">
                            <div className="bg-success bg-opacity-10 rounded-circle p-3 me-3">
                                <i className="bi bi-check-circle-fill text-success fs-4"></i>
                            </div>
                            <div>
                                <h6 className="text-muted small mb-1 uppercase tracking-wider fw-bold">Completed</h6>
                                <h3 className="mb-0 fw-bold">
                                    {bookings.filter(b => b.bookingStatus === 'COMPLETED').length}
                                </h3>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-md-3">
                    <div className="premium-card p-4 shadow-sm border-0 bg-white border-start border-danger border-4 rounded-4">
                        <div className="d-flex align-items-center">
                            <div className="bg-danger bg-opacity-10 rounded-circle p-3 me-3">
                                <i className="bi bi-x-circle-fill text-danger fs-4"></i>
                            </div>
                            <div>
                                <h6 className="text-muted small mb-1 uppercase tracking-wider fw-bold">Cancelled</h6>
                                <h3 className="mb-0 fw-bold">
                                    {bookings.filter(b => b.bookingStatus === 'CANCELLED').length}
                                </h3>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="premium-card shadow-sm border-0 mb-5 bg-white overflow-hidden">
                <div className="p-4 border-bottom d-flex justify-content-between align-items-center bg-white">
                    <div className="d-flex align-items-center">
                        <span className="badge bg-primary bg-opacity-10 text-primary rounded-pill px-3 py-2 me-3">
                            {filteredBookings.length} Bookings Found
                        </span>
                    </div>
                    <div className="btn-group btn-group-sm rounded-pill p-1 bg-light border">
                        {['ALL', 'ACTIVE', 'COMPLETED', 'CANCELLED'].map(filter => (
                            <button
                                key={filter}
                                className={`btn btn-sm rounded-pill px-3 border-0 ${bookingFilter === filter ? 'btn-primary shadow-sm' : 'text-muted'}`}
                                onClick={() => setBookingFilter(filter)}
                            >
                                {filter}
                            </button>
                        ))}
                    </div>
                </div>
                <div className="p-0">
                    <div className="table-responsive">
                        <table className="table table-hover align-middle mb-0">
                            <thead className="bg-light">
                                <tr className="text-secondary small uppercase fw-bold">
                                    <th className="px-4 py-3">Ref No</th>
                                    <th>Customer</th>
                                    <th>Vehicle</th>
                                    <th>Location</th>
                                    <th>Duration</th>
                                    <th className="text-center">Status</th>
                                    <th className="text-end px-4">Amount</th>
                                </tr>
                            </thead>
                            <tbody className="border-top-0">
                                {filteredBookings.map(b => (
                                    <tr key={b.bookingId} className="border-bottom border-light">
                                        <td className="px-4 py-3 font-monospace small fw-bold text-primary">{b.confirmationNumber}</td>
                                        <td>
                                            <div className="d-flex flex-column">
                                                <span className="fw-600">{b.customerName}</span>
                                                <span className="small text-muted">{b.email}</span>
                                            </div>
                                        </td>
                                        <td>
                                            <div className="d-flex flex-column">
                                                <span className="fw-500">{b.carName}</span>
                                                <span className="badge bg-light text-dark border w-75 mt-1">{b.numberPlate || 'Not Assigned'}</span>
                                            </div>
                                        </td>
                                        <td>
                                            <div className="small">
                                                <span className="d-block"><i className="bi bi-geo-alt-fill text-danger me-1"></i>{b.pickupHub}</span>
                                                <span className="d-block text-muted mt-1"><i className="bi bi-arrow-return-right me-1"></i>{b.returnHub}</span>
                                            </div>
                                        </td>
                                        <td className="small">
                                            {b.startDate} to <br /> {b.endDate}
                                        </td>
                                        <td className="text-center">
                                            <span className={`badge rounded-pill bg-${getStatusColor(b.bookingStatus)} bg-opacity-10 text-${getStatusColor(b.bookingStatus)} border border-${getStatusColor(b.bookingStatus)} border-opacity-25 px-3 py-2 text-uppercase`}>
                                                {b.bookingStatus}
                                            </span>
                                        </td>
                                        <td className="text-end px-4">
                                            <span className="fw-bold">₹{b.totalAmount?.toLocaleString() || '0'}</span>
                                        </td>
                                    </tr>
                                ))}
                                {filteredBookings.length === 0 && (
                                    <tr>
                                        <td colSpan="7" className="text-center py-5 text-muted bg-white">
                                            <div className="opacity-50">
                                                <i className="bi bi-inbox display-1 d-block mb-3"></i>
                                                <h5>No {bookingFilter.toLowerCase()} bookings found</h5>
                                                <p className="small">All booking records will appear here as they are created.</p>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminBookings;
