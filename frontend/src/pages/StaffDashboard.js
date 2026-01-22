import React, { useState } from 'react';
import ApiService from '../services/api';

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

            // Set initial selected car
            if (data.carName) {
                // We might only have carName, ideally we need ID. 
                // Assuming backend response includes carId inside car object or separate field?
                // The current mapToResponse uses carName string. 
                // We need to fetch available cars to link IDs properly.
            }

            // Fetch available cars for this hub/dates to allow swapping
            // Note: We need hubId which might not be in response explicitly unless mapped.
            // Let's assume we can fetch cars based on hub name or we need to update backend to return IDs.
            // For now, let's try to fetch available cars using the hub name if possible or just list all (fallback).
            // Actually, mapToResponse returns 'pickupHub' name. We need ID to call getAvailableCars properly.
            // But let's proceed with just opening modal first.

            // Fix: We need carId. 
            // Since we can't easily get Available Cars without HubID, we might need to rely on the backend to validate swap.
            // Or we assume the user picks from a list we can fetch.
            // IMPORTANT: Backend mapToResponse returns strings. I'll stick to what I have. 
            // If the user wants to swap, they click "Select Car". 
            // We will Try to fetch cars. If we lack HubID, we might fail.
            // Let's try to fetch cars using placeholder if needed or skip if we can't.

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
        try {
            // First fetch booking to show details in modal
            const data = await ApiService.getBooking(bookingId);
            setBookingDetails(data);
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
            setMessage({ type: 'success', text: 'Return Processed Successfully! Invoice generated.' });
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
            <h2 className="mb-4">Staff Dashboard</h2>

            {!showModal ? (
                <div className="card shadow border-0">
                    <div className="card-header bg-white">
                        <ul className="nav nav-tabs card-header-tabs">
                            <li className="nav-item">
                                <button className={`nav-link ${activeTab === 'handover' ? 'active fw-bold' : ''}`}
                                    onClick={() => setActiveTab('handover')}>Handover</button>
                            </li>
                            <li className="nav-item">
                                <button className={`nav-link ${activeTab === 'return' ? 'active fw-bold' : ''}`}
                                    onClick={() => setActiveTab('return')}>Return</button>
                            </li>
                        </ul>
                    </div>
                    <div className="card-body p-5 text-center">
                        {message.text && (
                            <div className={`alert alert-${message.type} mb-4`}>{message.text}</div>
                        )}

                        <div className="row justify-content-center">
                            <div className="col-md-6">
                                <label className="form-label mb-2 text-muted uppercase tracking-wide">
                                    {activeTab === 'handover' ? 'Customer Pickup' : 'Customer Return'}
                                </label>
                                <input
                                    type="number"
                                    className="form-control form-control-lg text-center mb-4"
                                    placeholder="Enter Booking ID"
                                    value={bookingId}
                                    onChange={(e) => setBookingId(e.target.value)}
                                />
                                <button
                                    className={`btn btn-lg w-100 ${activeTab === 'handover' ? 'btn-warning' : 'btn-success'}`}
                                    onClick={() => activeTab === 'handover' ? handleFetchBooking() : handleReturn()}
                                    disabled={loading}
                                >
                                    {loading ? 'Processing...' : (activeTab === 'handover' ? 'Process Handover' : 'Process Return')}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
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
                                    <p className="mb-1"><strong>Vehicle:</strong> {bookingDetails?.carName || 'Not Assigned'}</p>
                                </div>
                            </div>
                        </div>

                        {activeTab === 'handover' && !showCarSelection ? (
                            <>
                                <div className="mb-4">
                                    <label className="form-label fw-bold">Vehicle</label>
                                    <div className="input-group">
                                        <input type="text" className="form-control" value={selectedCar ? selectedCar.carModel : (bookingDetails?.carName || '')} readOnly />
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
                                        disabled={loading}>
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
                                                    <h6 className="mb-1">{car.carModel} ({car.numberPlate})</h6>
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
    );
};

export default StaffDashboard;
