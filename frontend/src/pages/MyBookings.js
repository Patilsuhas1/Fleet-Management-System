import React, { useEffect, useState } from 'react';

const MyBookings = () => {
    const [bookings, setBookings] = useState([]);

    useEffect(() => {
        // Shim: Fetch from localStorage since backend endpoint is missing for customer history
        const stored = JSON.parse(localStorage.getItem('myBookings') || '[]');
        setBookings(stored);
    }, []);

    return (
        <div className="container py-5">
            <h2 className="mb-4">My Bookings</h2>
            {bookings.length === 0 ? (
                <div className="alert alert-info">You haven't made any bookings yet in this session.</div>
            ) : (
                <div className="table-responsive card p-3 shadow-sm border-0">
                    <table className="table table-hover align-middle">
                        <thead className="table-light">
                            <tr>
                                <th>Booking ID</th>
                                <th>Car</th>
                                <th>Status</th>
                                <th>Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {bookings.map((b, index) => (
                                <tr key={index}>
                                    <td>#{b.bookingId || 'PENDING'}</td>
                                    <td>{b.carName || 'Unknown Car'}</td>
                                    <td>
                                        <span className="badge bg-primary">Confirmed</span>
                                    </td>
                                    <td>{new Date().toLocaleDateString()}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default MyBookings;
