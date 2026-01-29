import React, { useState } from 'react';
import ApiService from '../services/api';

const StaffBookingWizard = ({ onClose }) => {
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    // Booking Data
    const [pickupHubId] = useState(1); // Default to 1 for now, ideally logged-in staff hub
    const [dates, setDates] = useState({
        rentalDate: new Date().toISOString().slice(0, 16),
        returnDate: new Date(new Date().getTime() + 24 * 60 * 60 * 1000).toISOString().slice(0, 16) // Default 24h
    });

    const [availableCars, setAvailableCars] = useState([]);
    const [selectedCar, setSelectedCar] = useState(null);
    const [addOns, setAddOns] = useState([]);
    const [selectedAddOns, setSelectedAddOns] = useState([]);
    const [childSeatQty, setChildSeatQty] = useState(1);

    // Cost Calculation Helpers
    const calculateRentalDays = () => {
        const start = new Date(dates.rentalDate);
        const end = new Date(dates.returnDate);
        const diffTime = Math.abs(end - start);
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) || 1;
    };

    const calculateTotalCost = () => {
        if (!selectedCar) return 0;
        const days = calculateRentalDays();
        const carRate = selectedCar.carType?.dailyRate || 0;
        const addonDaily = addOns
            .filter(a => selectedAddOns.includes(a.addOnId))
            .reduce((sum, a) => {
                const isChildSeat = a.addOnName.toLowerCase().includes('child seat');
                const rate = a.addonDailyRate || a.addOnRate || 0;
                return sum + (isChildSeat ? rate * childSeatQty : rate);
            }, 0);
        return days * (carRate + addonDaily);
    };

    // Customer Data
    const [customerEmail, setCustomerEmail] = useState('');
    const [customerDetails, setCustomerDetails] = useState(null);
    const [isNewCustomer, setIsNewCustomer] = useState(false);
    const [newCustomerData, setNewCustomerData] = useState({
        firstName: '', lastName: '', address: '', state: '', city: '',
        email: '', mobileNumber: '', creditCardType: 'VISA', creditCardNumber: '',
        drivingLicenseNumber: '', idPassportNumber: ''
    });

    // Step 1: Find Cars (Auto-triggered or Manual confirm of dates)
    const handleFindCars = async () => {
        setLoading(true);
        try {
            // Backend expects LocalDate (YYYY-MM-DD), slice the datetime-local string
            const start = dates.rentalDate.slice(0, 10);
            const end = dates.returnDate.slice(0, 10);
            const cars = await ApiService.getAvailableCars(pickupHubId, start, end);
            setAvailableCars(cars);
            const addonsData = await ApiService.getAddOns(); // Pre-fetch addons
            setAddOns(addonsData);
            setStep(2);
        } catch (err) {
            setMessage('Error finding cars: ' + err.message);
        } finally {
            setLoading(false);
        }
    };

    // Step 3: Find Customer
    const handleFindCustomer = async () => {
        if (!customerEmail) return;
        setLoading(true);
        try {
            const cust = await ApiService.findCustomer(customerEmail);
            if (cust) {
                setCustomerDetails(cust);
                setIsNewCustomer(false);
            } else {
                setCustomerDetails(null);
                setIsNewCustomer(true);
                setNewCustomerData({ ...newCustomerData, email: customerEmail });
                alert('Member not found. Proceeding with registration.');
            }
        } catch (err) {
            setCustomerDetails(null);
            setIsNewCustomer(true);
            setNewCustomerData({ ...newCustomerData, email: customerEmail });
            alert('Error occurred or Member not found. Proceeding with registration.');
        } finally {
            setLoading(false);
        }
    };

    // Step 4: Create Booking
    const handleCreateBooking = async () => {
        setLoading(true);
        try {
            let custId = customerDetails?.customerId;

            // If new customer, save first
            if (isNewCustomer) {
                const savedCust = await ApiService.saveCustomer(newCustomerData);
                custId = savedCust.customerId;
            }

            if (!custId) throw new Error("Invalid Customer ID");

            const bookingRequest = {
                customerId: custId,
                carId: selectedCar.carId,
                pickupHubId: pickupHubId,
                returnHubId: pickupHubId, // Return to same hub for on-spot
                rentalDate: dates.rentalDate,
                returnDate: dates.returnDate,
                addOnIds: []
            };

            // Process Add-ons with Quantity
            const finalAddOnIds = [...selectedAddOns];
            const childSeatAddOn = addOns.find(a => a.addOnName.toLowerCase().includes('child seat'));
            if (childSeatAddOn && selectedAddOns.includes(childSeatAddOn.addOnId)) {
                const baseIds = selectedAddOns.filter(id => id !== childSeatAddOn.addOnId);
                for (let i = 0; i < childSeatQty; i++) {
                    baseIds.push(childSeatAddOn.addOnId);
                }
                bookingRequest.addOnIds = baseIds;
            } else {
                bookingRequest.addOnIds = finalAddOnIds;
            }

            const booking = await ApiService.createBooking(bookingRequest);

            // Auto-Handover
            await ApiService.handoverCar(booking.bookingId);
            const handoverRequest = {
                bookingId: booking.bookingId,
                carId: selectedCar.carId,
                fuelStatus: 'Full',
                notes: 'On-Spot Booking - Auto Handover'
            };
            await ApiService.processHandover(handoverRequest);

            alert(`Booking Created and Handed Over! Confirmation: ${booking.confirmationNumber}`);
            onClose(); // Close wizard

        } catch (err) {
            setMessage('Booking Failed: ' + (err.response?.data?.message || err.message));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="premium-card shadow-lg mb-4 border-primary border-opacity-25">
            <div className="bg-primary bg-opacity-10 p-4 border-bottom border-light border-opacity-10 d-flex justify-content-between align-items-center">
                <h5 className="mb-0 fw-bold">Instant Reservation (Step {step}/3)</h5>
                <button className="btn btn-sm btn-link text-primary text-decoration-none fw-bold" onClick={onClose}>✕ Close</button>
            </div>
            <div className="p-4">
                {message && <div className="alert alert-danger glass-effect border-0 rounded-4">{message}</div>}

                {/* STEP 1: DATES & CAR SEARCH */}
                {step === 1 && (
                    <div className="py-3">
                        <div className="row g-4 mb-4">
                            <div className="col-md-6">
                                <label className="form-label text-muted small uppercase">Pickup Date (Now)</label>
                                <input type="datetime-local" className="form-control bg-white border rounded-3 py-3" value={dates.rentalDate}
                                    onChange={(e) => setDates({ ...dates, rentalDate: e.target.value })} />
                            </div>
                            <div className="col-md-6">
                                <label className="form-label text-muted small uppercase">Return Date</label>
                                <input type="datetime-local" className="form-control bg-white border rounded-3 py-3" value={dates.returnDate}
                                    onChange={(e) => setDates({ ...dates, returnDate: e.target.value })} />
                            </div>
                        </div>
                        <button className="btn btn-premium w-100 py-3 rounded-pill fs-5" onClick={handleFindCars} disabled={loading}>
                            {loading ? 'Searching Fleet...' : 'Check Available Vehicles'}
                        </button>
                    </div>
                )}

                {/* STEP 2: SELECT CAR & ADDONS */}
                {step === 2 && (
                    <div>
                        <h6 className="mb-3 uppercase small tracking-wider text-primary">Available Fleet</h6>
                        <div className="list-group list-group-flush gap-2 mb-4" style={{ maxHeight: '300px', overflowY: 'auto' }}>
                            {availableCars.map(car => (
                                <button key={car.carId}
                                    className={`list-group-item list-group-item-action rounded-4 border p-4 glass-effect mb-2 ${selectedCar?.carId === car.carId ? 'border-primary ring-1 animate-pulse' : ''}`}
                                    onClick={() => setSelectedCar(car)}>
                                    <div className="d-flex justify-content-between align-items-center">
                                        <div>
                                            <strong className="d-block fs-5 text-dark">{car.carModel}</strong>
                                            <span className="text-muted small">{car.carType?.carTypeName} • {car.numberPlate}</span>
                                        </div>
                                        <span className="h5 fw-bold text-primary mb-0">₹{car.carType?.dailyRate}</span>
                                    </div>
                                </button>
                            ))}
                        </div>

                        <h6 className="mb-3 uppercase small tracking-wider text-primary">Available Extras</h6>
                        <div className="row g-3 mb-4">
                            {addOns.map(addon => {
                                const isChildSeat = addon.addOnName.toLowerCase().includes('child seat');
                                const isSelected = selectedAddOns.includes(addon.addOnId);

                                return (
                                    <div key={addon.addOnId} className="col-md-6">
                                        <div className={`p-3 rounded-4 glass-effect border h-100 ${isSelected ? 'border-primary' : ''}`}>
                                            <div className="d-flex align-items-center gap-3">
                                                <input className="form-check-input" type="checkbox"
                                                    checked={isSelected}
                                                    onChange={(e) => {
                                                        if (e.target.checked) setSelectedAddOns([...selectedAddOns, addon.addOnId]);
                                                        else setSelectedAddOns(selectedAddOns.filter(id => id !== addon.addOnId));
                                                    }}
                                                />
                                                <div className="w-100">
                                                    <div className="d-flex justify-content-between">
                                                        <span className="fw-bold">{addon.addOnName}</span>
                                                        <span className="text-primary small">₹{addon.addonDailyRate || addon.addOnRate}</span>
                                                    </div>

                                                    {isChildSeat && isSelected && (
                                                        <div className="mt-2 animate-fade-in">
                                                            <select
                                                                className="form-select form-select-sm rounded-pill w-auto border-primary"
                                                                value={childSeatQty}
                                                                onChange={(e) => setChildSeatQty(Number(e.target.value))}
                                                            >
                                                                {[1, 2, 3].map(n => <option key={n} value={n}>{n} Seats</option>)}
                                                            </select>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        <div className="d-flex justify-content-between pt-3">
                            <button className="btn btn-link text-muted text-decoration-none" onClick={() => setStep(1)}>← Back</button>
                            <button className="btn btn-premium rounded-pill px-5" disabled={!selectedCar} onClick={() => setStep(3)}>Next: Renter Details</button>
                        </div>
                    </div>
                )}

                {/* STEP 3: CUSTOMER & CONFIRM */}
                {step === 3 && (
                    <div className="py-2">
                        {!customerDetails && !isNewCustomer ? (
                            <div className="text-center py-4">
                                <label className="form-label text-muted small uppercase mb-3">Customer Email</label>
                                <div className="glass-effect rounded-pill p-1 border">
                                    <input
                                        type="email"
                                        className="form-control bg-transparent border-0 px-4 py-2"
                                        placeholder="customer@example.com"
                                        value={customerEmail}
                                        onChange={e => setCustomerEmail(e.target.value)}
                                        onBlur={handleFindCustomer}
                                        onKeyDown={e => e.key === 'Enter' && handleFindCustomer()}
                                    />
                                </div>
                                <div className="mt-4">
                                    <span className="text-muted small">Customer not found? </span>
                                    <button className="btn btn-link text-primary text-decoration-none p-0" onClick={() => setIsNewCustomer(true)}>Register New Customer</button>
                                </div>
                            </div>
                        ) : (
                            <div className="mb-4">
                                <h6 className="mb-3 uppercase small tracking-wider text-primary">Renter Information</h6>
                                {isNewCustomer ? (
                                    <div className="row g-3 glass-effect p-4 rounded-4 border">
                                        <div className="col-6">
                                            <label className="small text-muted mb-1">First Name</label>
                                            <input className="form-control bg-white border" placeholder="First Name" onChange={e => setNewCustomerData({ ...newCustomerData, firstName: e.target.value })} />
                                        </div>
                                        <div className="col-6">
                                            <label className="small text-muted mb-1">Last Name</label>
                                            <input className="form-control bg-white border" placeholder="Last Name" onChange={e => setNewCustomerData({ ...newCustomerData, lastName: e.target.value })} />
                                        </div>
                                        <div className="col-12">
                                            <label className="small text-muted mb-1">Permanent Address</label>
                                            <input className="form-control bg-white border" placeholder="Address" onChange={e => setNewCustomerData({ ...newCustomerData, address: e.target.value })} />
                                        </div>
                                        <div className="col-6">
                                            <label className="small text-muted mb-1">DL Number</label>
                                            <input className="form-control bg-white border" placeholder="DL Number" onChange={e => setNewCustomerData({ ...newCustomerData, drivingLicenseNumber: e.target.value })} />
                                        </div>
                                        <div className="col-6">
                                            <label className="small text-muted mb-1">Mobile</label>
                                            <input className="form-control bg-white border" placeholder="Phone" onChange={e => setNewCustomerData({ ...newCustomerData, mobileNumber: e.target.value })} />
                                        </div>
                                    </div>
                                ) : (
                                    <div className="glass-effect p-4 rounded-4 border-success border-opacity-25 d-flex align-items-center">
                                        <div className="bg-success bg-opacity-10 rounded-circle p-3 me-4">
                                            <i className="bi bi-person-check-fill text-success fs-3"></i>
                                        </div>
                                        <div>
                                            <strong className="fs-5 d-block text-dark">{customerDetails.firstName} {customerDetails.lastName}</strong>
                                            <span className="text-muted small">{customerDetails.email} • Verified Member</span>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        <div className="d-flex justify-content-between mt-4">
                            <button className="btn btn-link text-muted text-decoration-none" onClick={() => setStep(2)}>← Back</button>
                            <button className="btn btn-premium rounded-pill px-5 py-3 fw-bold"
                                disabled={loading || (!customerDetails && !isNewCustomer && !newCustomerData.firstName)}
                                onClick={handleCreateBooking}>
                                {loading ? 'Finalizing...' : `Confirm & Handover (₹${calculateTotalCost().toLocaleString()})`}
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default StaffBookingWizard;
