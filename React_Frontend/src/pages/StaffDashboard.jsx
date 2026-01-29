import React, { useState } from 'react';
import ApiService from '../services/api';
import StaffBookingWizard from '../components/StaffBookingWizard';

const StaffDashboard = () => {
    const [activeTab, setActiveTab] = useState('handover');
    const [bookingId, setBookingId] = useState('');
    const [message, setMessage] = useState({ type: '', text: '' });
    const [loading, setLoading] = useState(false);

    // Handover Modal State
    const [showModal, setShowModal] = useState(false);
    const [bookingDetails, setBookingDetails] = useState(null);
    const [availableCars, setAvailableCars] = useState([]);
    const [showCarSelection, setShowCarSelection] = useState(false);

    // Form State
    const [selectedCar, setSelectedCar] = useState(null);
    const [fuelStatus, setFuelStatus] = useState('Full');
    const [notes, setNotes] = useState('');

    const handleFetchBooking = async () => {
        if (!bookingId) return;
        setLoading(true);
        setMessage({ type: '', text: '' });

        try {
            const data = await ApiService.getBooking(bookingId);
            setBookingDetails(data);

            // Status Verification
            if (data.bookingStatus === 'ACTIVE') {
                setMessage({ type: 'info', text: 'This vehicle has already been handed over.' });
                setLoading(false);
                return;
            }
            if (data.bookingStatus === 'COMPLETED') {
                setMessage({ type: 'info', text: 'This booking is already completed and closed.' });
                setLoading(false);
                return;
            }
            if (data.bookingStatus === 'CANCELLED') {
                setMessage({ type: 'danger', text: 'This booking has been cancelled.' });
                setLoading(false);
                return;
            }

            setShowModal(true);
        } catch (err) {
            setMessage({ type: 'danger', text: 'Booking not found or error fetching details.' });
        } finally {
            setLoading(false);
        }
    };

    const handleLoadCars = async () => {
        if (!bookingDetails) return;
        setLoading(true);
        try {
            // We need HubID. Retrieve from somewhere? 
            // Modify Backend to return HubID? yes, that would be best.
            // BUT, for now, let's just use a hardcoded list or try to fetch without parameters if API allows (it doesn't).
            // Fallback: We'll assume Hub ID 1 for demo or standard hub if missing.
            const cars = await ApiService.getAvailableCars(1, bookingDetails.startDate, bookingDetails.endDate);
            setAvailableCars(cars || []);
            setShowCarSelection(true);
        } catch (err) {
            console.error(err);
            alert("Could not load available cars. Defaulting to current car.");
        } finally {
            setLoading(false);
        }
    };

    const handleCompleteHandover = async () => {
        setLoading(true);
        const request = {
            bookingId: bookingDetails.bookingId,
            carId: selectedCar ? selectedCar.carId : null, // If null, backend uses existing
            fuelStatus: fuelStatus,
            notes: notes
        };

        try {
            await ApiService.processHandover(request);
            setMessage({ type: 'success', text: 'Handover Completed Successfully!' });
            setShowModal(false);
            setBookingId('');
            setBookingDetails(null);
            setNotes('');
            setFuelStatus('Full');
        } catch (err) {
            setMessage({ type: 'danger', text: err.response?.data?.message || 'Handover Failed' });
        } finally {
            setLoading(false);
        }
    };

    const handleReturn = async () => {
        if (!bookingId) return;
        setLoading(true);
        setMessage({ type: '', text: '' });
        try {
            // First fetch booking to show details in modal
            const data = await ApiService.getBooking(bookingId);
            setBookingDetails(data);

            if (data.bookingStatus !== 'ACTIVE') {
                setMessage({ type: 'warning', text: `This booking is ${data.bookingStatus}. Only ACTIVE bookings can be returned.` });
                setLoading(false);
                return;
            }

            setActiveTab('return'); // Ensure we are in return tab context
            setShowModal(true);
        } catch (err) {
            setMessage({ type: 'danger', text: 'Booking not found or error fetching details.' });
        } finally {
            setLoading(false);
        }
    };

    const handleCompleteReturn = async () => {
        setLoading(true);
        const request = {
            bookingId: bookingDetails.bookingId,
            returnDate: new Date().toISOString().split('T')[0],
            fuelStatus: fuelStatus,
            notes: notes
        };

        try {
            await ApiService.returnCar(request);
            setMessage({
                type: 'success',
                text: 'Return Processed Successfully! Invoice generated.',
                downloadId: bookingDetails.bookingId
            });
            setShowModal(false);
            setBookingId('');
            setBookingDetails(null);
            setNotes('');
            setFuelStatus('Full');
        } catch (err) {
            setMessage({ type: 'danger', text: err.response?.data?.message || 'Return Failed' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container py-5">
            <div className="container py-5">
                <h2 className="mb-5 text-gradient">Operations Hub</h2>

                {!showModal && (
                    <div className="premium-card overflow-hidden">
                        <div className="bg-primary bg-opacity-10 px-4">
                            <ul className="nav nav-pills card-header-pills py-3 gap-3">
                                <li className="nav-item">
                                    <button className={`btn rounded-pill px-4 ${activeTab === 'handover' ? 'btn-premium' : 'text-muted fw-bold'}`}
                                        onClick={() => setActiveTab('handover')}>Vehicle Handover</button>
                                </li>
                                <li className="nav-item">
                                    <button className={`btn rounded-pill px-4 ${activeTab === 'return' ? 'btn-premium' : 'text-muted fw-bold'}`}
                                        onClick={() => setActiveTab('return')}>Vehicle Return</button>
                                </li>
                                <li className="nav-item">
                                    <button className={`btn rounded-pill px-4 ${activeTab === 'booking' ? 'btn-premium' : 'text-muted fw-bold'}`}
                                        onClick={() => setActiveTab('booking')}>Instant Reservation</button>
                                </li>
                            </ul>
                        </div>
                        <div className="p-5">
                            {activeTab === 'booking' ? (
                                <StaffBookingWizard onClose={() => setActiveTab('handover')} />
                            ) : (
                                <div className="text-center py-4">
                                    {/* Handover/Return Forms */}
                                    {message.text && (
                                        <div className={`alert alert-${message.type} mb-5 glass-effect border-0 rounded-4 p-3 d-flex justify-content-between align-items-center`}>
                                            <span className="fw-medium px-3">{message.text}</span>
                                            {message.downloadId && (
                                                <button className="btn btn-premium btn-sm rounded-pill"
                                                    onClick={async () => {
                                                        try {
                                                            const blob = await ApiService.downloadInvoice(message.downloadId);
                                                            const url = window.URL.createObjectURL(new Blob([blob]));
                                                            const link = document.createElement('a');
                                                            link.href = url;
                                                            link.setAttribute('download', `Invoice_${message.downloadId}.pdf`);
                                                            document.body.appendChild(link);
                                                            link.click();
                                                        } catch (e) { alert('Download failed'); }
                                                    }}>
                                                    <i className="bi bi-download me-1"></i> Get Invoice (₹)
                                                </button>
                                            )}
                                        </div>
                                    )}

                                    <div className="row justify-content-center">
                                        <div className="col-md-6">
                                            <div className="glass-effect p-5 rounded-4 border-light">
                                                <label className="form-label mb-3 text-muted small uppercase tracking-wider">
                                                    {activeTab === 'handover' ? 'Scan Pickup ID' : 'Scan Return ID'}
                                                </label>
                                                <input
                                                    type="number"
                                                    className="form-control form-control-lg bg-white border text-dark text-center mb-4 rounded-3 py-3"
                                                    placeholder="Booking Identifier"
                                                    value={bookingId}
                                                    onChange={(e) => setBookingId(e.target.value)}
                                                />
                                                <button
                                                    className={`btn btn-lg w-100 rounded-pill py-3 fw-bold ${activeTab === 'handover' ? 'btn-premium' : 'btn-success'}`}
                                                    onClick={() => activeTab === 'handover' ? handleFetchBooking() : handleReturn()}
                                                    disabled={loading}
                                                >
                                                    {loading ? 'Processing...' : (activeTab === 'handover' ? 'Initiate Handover' : 'Finalize Return')}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {showModal && (
                    // HANDOVER / RETURN MODAL
                    <div className="card shadow border-0">
                        <div className="card-header bg-primary text-white">
                            <h4 className="mb-0">{activeTab === 'handover' ? 'Vehicle Handover' : 'Vehicle Return'}</h4>
                        </div>
                        <div className="card-body p-4">
                            <div className="mb-4 p-3 bg-light rounded">
                                <div className="row">
                                    <div className="col-md-6">
                                        <p className="mb-1"><strong>Confirmation:</strong> {bookingDetails?.confirmationNumber}</p>
                                        <p className="mb-1"><strong>Customer:</strong> {bookingDetails?.customerName}</p>
                                    </div>
                                    <div className="col-md-6">
                                        <p className="mb-1"><strong>Dates:</strong> {bookingDetails?.startDate} to {bookingDetails?.endDate}</p>
                                        <p className="mb-1"><strong>Vehicle:</strong> {selectedCar ? selectedCar.carName : <span className="text-danger fw-bold">Selection Required</span>}</p>
                                    </div>
                                </div>
                            </div>

                            {activeTab === 'handover' && !showCarSelection ? (
                                <>
                                    <div className="mb-4">
                                        <label className="form-label fw-bold">Vehicle</label>
                                        <div className="input-group">
                                            <input type="text" className={`form-control ${!selectedCar ? 'is-invalid' : 'is-valid'}`} value={selectedCar ? selectedCar.carName : ''} placeholder="Please select a vehicle..." readOnly />
                                            <button className="btn btn-outline-secondary" onClick={handleLoadCars}>Select / Change Car</button>
                                        </div>
                                    </div>
                                </>
                            ) : null}

                            {!showCarSelection ? (
                                <>
                                    <div className="mb-4">
                                        <label className="form-label fw-bold">Fuel Level</label>
                                        <div className="d-flex gap-3">
                                            {['1/4', '1/2', '3/4', 'Full'].map(level => (
                                                <div key={level} className="form-check">
                                                    <input className="form-check-input" type="radio"
                                                        name="fuelStatus"
                                                        checked={fuelStatus === level}
                                                        onChange={() => setFuelStatus(level)} />
                                                    <label className="form-check-label">{level}</label>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="mb-4">
                                        <label className="form-label fw-bold">Vehicle Condition / Notes</label>
                                        <textarea className="form-control" rows="3"
                                            placeholder="Enter inspection notes (scratches, dents, clean, etc.)"
                                            value={notes} onChange={e => setNotes(e.target.value)}></textarea>
                                    </div>

                                    <div className="d-flex justify-content-between">
                                        <button className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                                        <button className={`btn px-4 ${activeTab === 'handover' ? 'btn-success' : 'btn-primary'}`}
                                            onClick={activeTab === 'handover' ? handleCompleteHandover : handleCompleteReturn}
                                            disabled={loading || (activeTab === 'handover' && !selectedCar)}>
                                            {loading ? 'Submitting...' : (activeTab === 'handover' ? 'Complete Handover' : 'Complete Return')}
                                        </button>
                                    </div>
                                </>
                            ) : (
                                // CAR SELECTION VIEW (Handover Only)
                                <div>
                                    <h5 className="mb-3">Select Available Vehicle</h5>
                                    {availableCars.length > 0 ? (
                                        <div className="list-group mb-4">
                                            {availableCars.map(car => (
                                                <button key={car.carId} type="button"
                                                    className={`list-group-item list-group-item-action ${selectedCar?.carId === car.carId ? 'active' : ''}`}
                                                    onClick={() => { setSelectedCar(car); setShowCarSelection(false); }}>
                                                    <div className="d-flex w-100 justify-content-between">
                                                        <h6 className="mb-1">{car.carName} ({car.numberPlate})</h6>
                                                        <small>{car.carType?.carTypeName}</small>
                                                    </div>
                                                </button>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="alert alert-warning">No Available cars found at this Hub for these dates.</div>
                                    )}
                                    <button className="btn btn-secondary" onClick={() => setShowCarSelection(false)}>Back</button>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default StaffDashboard;
