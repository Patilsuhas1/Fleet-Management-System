import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import ApiService from '../services/api';
import AuthService from '../services/authService';

const Booking = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [step, setStep] = useState(1);


    // Data States
    const [states, setStates] = useState([]);
    const [cities, setCities] = useState([]);
    const [hubs, setHubs] = useState([]);
    const [addOns, setAddOns] = useState([]);

    // Selection States
    const [selectedState, setSelectedState] = useState('');
    const [selectedCity, setSelectedCity] = useState('');
    const [selectedHub, setSelectedHub] = useState('');
    const [dates, setDates] = useState({ startDate: '', endDate: '' });
    const [selectedCar, setSelectedCar] = useState(null);
    const [selectedAddOnIds, setSelectedAddOnIds] = useState([]);
    const [childSeatQty, setChildSeatQty] = useState(1);

    // Calculate Rental Days
    const calculateRentalDays = () => {
        if (!dates.startDate || !dates.endDate) return 1;
        const start = new Date(dates.startDate);
        const end = new Date(dates.endDate);
        const diffTime = Math.abs(end - start);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays || 1;
    };

    // Calculate Total Cost
    const calculateTotalCost = () => {
        if (!selectedCar) return 0;
        const days = calculateRentalDays();
        const carRate = selectedCar.carType?.dailyRate || 0;

        const addonTotalDaily = addOns
            .filter(a => selectedAddOnIds.includes(a.addOnId))
            .reduce((sum, a) => {
                const isChildSeat = a.addOnName.toLowerCase().includes('child seat');
                return sum + (isChildSeat ? a.addonDailyRate * childSeatQty : a.addonDailyRate);
            }, 0);

        return days * (carRate + addonTotalDaily);
    };

    // Customer States
    const [customer, setCustomer] = useState({
        email: '',
        firstName: '',
        lastName: '',
        mobileNumber: '',
        dateOfBirth: '',
        addressLine1: '',
        city: '',
        drivingLicenseNumber: '',
        issuedByDL: '',
        validThroughDL: '',
        passportNumber: '',
        passportIssuedBy: '',
        passportIssueDate: '',
        passportValidThrough: '',
        creditCardType: 'VISA',
        creditCardNumber: ''
    });

    // UI States
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        loadStates();
        loadAddOns();
        loadCarTypes();

        // Handle pre-filled data from redirects (New Flow)
        if (location.state) {
            // Case: Returning from Car Selection
            if (location.state.selectedCar) {
                const { selectedCar: selCar, pickupHub, startDate, endDate } = location.state;
                setDates({ startDate, endDate });
                setSelectedHub(pickupHub.hubId);
                // Pre-fill hubs to ensure dropdown shows something if list not loaded
                setHubs([pickupHub]);

                setSelectedCar(selCar);
                setStep(3); // Jump to Add-ons
            }

            // Handle pre-filled data from redirects
            const { pickupHub } = location.state;

            if (pickupHub) {
                // Pre-fill hub selection
                setHubs([pickupHub]);
                setSelectedHub(pickupHub.hubId);
            }
        }
    }, [location.state]);

    // Get current user session
    const currentUser = React.useMemo(() => AuthService.getCurrentUser(), []);

    // Pre-fill email and auto-fetch data from logged-in user
    useEffect(() => {
        const prefillData = async () => {
            if (currentUser && (currentUser.email || currentUser.username)) {
                const userEmail = currentUser.email || currentUser.username;

                // Set email initially
                setCustomer(prev => ({ ...prev, email: userEmail }));

                try {
                    setLoading(true);
                    const data = await ApiService.findCustomer(userEmail);
                    if (data) {
                        setCustomer(prev => ({ ...prev, ...data }));
                        console.log('Member data auto-filled for:', userEmail);
                    }
                } catch (err) {
                    console.error("Auto-fill failed", err);
                } finally {
                    setLoading(false);
                }
            }
        };

        prefillData();
    }, [currentUser]);

    const loadStates = async () => {
        try {
            const data = await ApiService.getAllStates();
            setStates(data);
        } catch (err) {
            console.error("Failed to load states", err);
        }
    };

    const loadAddOns = async () => {
        try {
            const data = await ApiService.getAddOns();
            setAddOns(data);
        } catch (err) {
            console.error("Failed to load add-ons", err);
        }
    };

    const loadCarTypes = async () => {
        // Car types are now handled in CarSelection.js page
    };

    const handleStateChange = async (e) => {
        const stateId = e.target.value;
        const stateName = e.target.options[e.target.selectedIndex].text;
        setSelectedState({ id: stateId, name: stateName });
        setSelectedCity('');
        setHubs([]);

        try {
            const data = await ApiService.getCitiesByState(stateId);
            setCities(data);
        } catch (err) {
            console.error(err);
            setCities([{ cityId: 1, cityName: 'Pune' }, { cityId: 2, cityName: 'Mumbai' }]);
        }
    };

    const handleCityChange = async (e) => {
        const cityId = e.target.value;
        const cityName = e.target.options[e.target.selectedIndex].text;
        setSelectedCity({ id: cityId, name: cityName });

        try {
            const data = await ApiService.getHubs(selectedState.name, cityName);
            setHubs(data);
        } catch (err) {
            console.error(err);
            setHubs([{ hubId: 1, hubName: 'Pune Airport Hub', hubAddress: 'Pune Airport' }]);
        }
    };

    const [airportCode, setAirportCode] = useState('');
    const [differentReturn, setDifferentReturn] = useState(false);

    // const [hubs, setHubs] = useState([]); // Kept if used
    // const [cars, setCars] = useState([]); // Removed unused setter

    // const handleSearchLocation = async (e) => { ... } // Removed unused function

    const searchByAirport = async () => {
        if (!airportCode) {
            alert("Enter airport code");
            return;
        }
        setLoading(true);
        try {
            const data = await ApiService.searchLocations(airportCode); // Returns Hub list
            navigate('/select-hub', {
                state: {
                    pickupDateTime: dates.startDate,
                    returnDateTime: dates.endDate,
                    differentReturn,
                    locationData: data, // Passing array of hubs
                    searchType: 'airport'
                }
            });
        } catch (err) {
            alert('Airport search failed');
        } finally {
            setLoading(false);
        }
    };

    const searchByCity = (e) => {
        e.preventDefault();
        if (!selectedState || (!selectedCity && cities.length > 0)) {
            alert('Please select state and city');
            return;
        }

        navigate('/select-hub', {
            state: {
                pickupDateTime: dates.startDate,
                returnDateTime: dates.endDate,
                differentReturn,
                locationData: {
                    stateName: selectedState.name,
                    cityName: selectedCity.name
                },
                searchType: 'city'
            }
        });
    };

    const toggleAddOn = (id) => {
        setSelectedAddOnIds(prev =>
            prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
        );
    };


    const handleSaveCustomer = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            const response = await ApiService.saveCustomer(customer);
            if (response.success && response.data) {
                setCustomer(prev => ({ ...prev, ...response.data })); // Update with ID
                setStep(4);
            } else {
                alert('Failed to save customer info.');
            }
        } catch (err) {
            console.error(err);
            alert('Error saving customer info: ' + (err.response?.data?.message || err.message));
        } finally {
            setLoading(false);
        }
    };

    const handleConfirmBooking = async () => {
        // Customer is already saved/retrieved in step 3
        if (!customer.custId) {
            alert("Customer ID missing. Please save customer details first.");
            return;
        }

        // Process Add-ons with Quantity
        const finalAddOnIds = [...selectedAddOnIds];
        const childSeatAddOn = addOns.find(a => a.addOnName.toLowerCase().includes('child seat'));
        let addOnIdsToSubmit = finalAddOnIds;

        if (childSeatAddOn && selectedAddOnIds.includes(childSeatAddOn.addOnId)) {
            const baseIds = selectedAddOnIds.filter(id => id !== childSeatAddOn.addOnId);
            for (let i = 0; i < childSeatQty; i++) {
                baseIds.push(childSeatAddOn.addOnId);
            }
            addOnIdsToSubmit = baseIds;
        }

        const bookingRequest = {
            carId: selectedCar.carId,
            customerId: customer.custId,
            pickupHubId: selectedHub,
            returnHubId: selectedHub,
            startDate: dates.startDate,
            endDate: dates.endDate,
            addOnIds: addOnIdsToSubmit,
            email: customer.email
        };

        try {
            const response = await ApiService.createBooking(bookingRequest);
            const existing = JSON.parse(localStorage.getItem('myBookings') || '[]');
            existing.push({ ...response, carName: selectedCar.carModel });
            localStorage.setItem('myBookings', JSON.stringify(existing));

            alert('Booking Confirmed! Booking ID: ' + response.bookingId);
            navigate('/');
        } catch (err) {
            alert('Booking Failed: ' + (err.response?.data?.message || err.message));
        }
    };

    return (
        <div className="container py-5">
            <h2 className="mb-4 fw-bold">Book Your Ride</h2>

            <div className="d-flex justify-content-between mb-5 px-lg-5">
                {[1, 2, 3, 4].map(i => (
                    <div key={i} className={`d-flex align-items-center gap-2 ${step >= i ? 'text-primary' : 'text-muted'}`}>
                        <div className={`rounded-circle d-flex align-items-center justify-content-center fw-bold ${step >= i ? 'bg-primary text-white' : 'bg-secondary bg-opacity-25'}`} style={{ width: '32px', height: '32px' }}>{i}</div>
                        <span className="fw-600 d-none d-md-inline">{['Location', 'Vehicles', 'Add-ons', 'Confirm'][i - 1]}</span>
                    </div>
                ))}
            </div>

            {/* Step 1: Location & Date (Unchanged Logic, just re-render) */}
            {/* Step 1: Location & Date (Refactored to MakeReservation style) */}
            {step === 1 && (
                <div className="row g-4">
                    {/* Left Panel */}
                    <div className="col-md-6">
                        <div className="premium-card p-5 h-100">
                            <h3 className="mb-4">Search Availability</h3>

                            {/* Dates */}
                            <div className="row g-3 mb-4">
                                <div className="col-md-6">
                                    <label className="form-label text-muted small uppercase">Pick-Up Date</label>
                                    <input type="date" className="form-control" onChange={e => setDates({ ...dates, startDate: e.target.value })} required />
                                </div>
                                <div className="col-md-6">
                                    <label className="form-label text-muted small uppercase">Return Date</label>
                                    <input type="date" className="form-control" onChange={e => setDates({ ...dates, endDate: e.target.value })} required />
                                </div>
                            </div>

                            <hr />

                            {/* Airport Section */}
                            <h5 className="mt-3">Pick-Up Location</h5>
                            <div className="mb-3">
                                <label className="form-label fw-bold">Enter Airport Code</label>
                                <div className="input-group">
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={airportCode}
                                        onChange={e => setAirportCode(e.target.value.toUpperCase())}
                                        placeholder="e.g. BOM"
                                    />
                                    <button className="btn btn-outline-primary" type="button" onClick={searchByAirport} disabled={loading}>
                                        {loading ? '...' : 'Find Airport'}
                                    </button>
                                </div>
                            </div>

                            <div className="text-center fw-bold my-2">OR</div>

                            {/* City Section */}
                            <div className="mb-3">
                                <label className="form-label fw-bold">Enter State</label>
                                <select className="form-select" onChange={handleStateChange}>
                                    <option value="">--Select State--</option>
                                    {states.map(s => <option key={s.stateId} value={s.stateId}>{s.stateName}</option>)}
                                </select>
                            </div>
                            <div className="mb-3">
                                <label className="form-label fw-bold">City</label>
                                <select className="form-select" onChange={handleCityChange} disabled={!selectedCity && cities.length === 0}>
                                    <option value="">--Select City--</option>
                                    {cities.map(c => <option key={c.cityId} value={c.cityId}>{c.cityName}</option>)}
                                </select>
                            </div>

                            {/* Return Checkbox */}
                            <div className="form-check mb-4">
                                <input
                                    className="form-check-input"
                                    type="checkbox"
                                    checked={differentReturn}
                                    onChange={() => setDifferentReturn(!differentReturn)}
                                />
                                <label className="form-check-label">
                                    I may return the car to different location
                                </label>
                            </div>

                            <button className="btn btn-primary w-100 py-2 fs-5" onClick={searchByCity}>
                                Continue Booking
                            </button>
                        </div>
                    </div>

                    {/* Right Panel - Hyper-Premium Live Ad */}
                    <div className="col-md-6">
                        <div className="premium-card h-100 p-0 overflow-hidden shadow-premium border-0 position-relative mesh-gradient">
                            {/* Reflective Overlay */}
                            <div className="position-absolute top-0 start-0 w-100 h-100" style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, transparent 50%)' }}></div>

                            <div className="position-relative z-1 p-5 h-100 d-flex flex-column justify-content-center text-center">
                                <div className="floating-element mb-5">
                                    <div className="d-inline-block position-relative">
                                        <div className="position-absolute top-50 start-50 translate-middle w-100 h-100 blur-3xl opacity-30 bg-primary rounded-circle"></div>
                                        <i className="bi bi-car-front-fill text-white display-1 shine-text"></i>
                                    </div>
                                </div>

                                <div className="glass-card-premium p-4 rounded-5 mb-4 border-0 animate-fade-in">
                                    <span className="badge ad-badge rounded-pill px-4 py-2 mb-3">Priority Access</span>
                                    <h2 className="fw-extrabold display-4 mb-3 text-white">Luxury <span className="text-primary">Fleet</span></h2>
                                    <p className="fs-5 text-white opacity-75 mb-4">Experience the pinnacle of automotive engineering with our premium selection.</p>

                                    <div className="row g-3">
                                        <div className="col-6">
                                            <div className="p-3 bg-white bg-opacity-10 rounded-4">
                                                <span className="d-block small text-white opacity-50">Weekend Rate</span>
                                                <span className="fw-bold text-white fs-5">₹1,999<small className="opacity-50">/day</small></span>
                                            </div>
                                        </div>
                                        <div className="col-6">
                                            <div className="p-3 bg-white bg-opacity-10 rounded-4">
                                                <span className="d-block small text-white opacity-50">Insurance</span>
                                                <span className="fw-bold text-white fs-5">Included</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <button className="btn btn-ad-action btn-lg rounded-pill px-5 py-3 shadow-lg mt-3 fw-black">
                                    BOOK THE EXPERIENCE
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Step 2 is now handled by CarSelection.js page */}

            {step === 3 && (
                <div className="row">
                    {/* Add-ons Column */}
                    <div className="col-md-4 mb-4">
                        <div className="premium-card p-4 h-100 shadow-sm">
                            <h4 className="fw-bold mb-4">Available Extras</h4>
                            {addOns.length > 0 ? (
                                <div className="list-group list-group-flush gap-3 bg-transparent">
                                    {addOns.map(addon => {
                                        const isChildSeat = addon.addOnName.toLowerCase().includes('child seat');
                                        const isSelected = selectedAddOnIds.includes(addon.addOnId);

                                        return (
                                            <div key={addon.addOnId} className="list-group-item bg-transparent border-0 p-3 rounded-4 glass-effect mb-2">
                                                <div className="d-flex gap-3 align-items-center mb-2">
                                                    <input
                                                        className="form-check-input flex-shrink-0"
                                                        type="checkbox"
                                                        checked={isSelected}
                                                        onChange={() => toggleAddOn(addon.addOnId)}
                                                    />
                                                    <div className="d-flex justify-content-between w-100 align-items-center">
                                                        <span className="fw-medium">{addon.addOnName}</span>
                                                        <span className="text-primary fw-bold">₹{addon.addonDailyRate.toFixed(0)}</span>
                                                    </div>
                                                </div>

                                                {isChildSeat && isSelected && (
                                                    <div className="ms-5 mt-2 animate-fade-in">
                                                        <label className="small text-muted mb-1 d-block">Quantity</label>
                                                        <select
                                                            className="form-select form-select-sm rounded-pill w-auto px-3 border-primary"
                                                            value={childSeatQty}
                                                            onChange={(e) => setChildSeatQty(Number(e.target.value))}
                                                        >
                                                            <option value="1">1 Seat</option>
                                                            <option value="2">2 Seats</option>
                                                            <option value="3">3 Seats</option>
                                                        </select>
                                                        <small className="text-primary mt-1 d-block fw-bold">
                                                            Total: ₹{(addon.addonDailyRate * childSeatQty).toFixed(0)}
                                                        </small>
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            ) : <p className="text-muted">No add-ons available at this time.</p>}
                        </div>
                    </div>

                    {/* Customer Form Column */}
                    <div className="col-md-8">
                        <div className="premium-card p-5">
                            <h4 className="fw-bold mb-4">Customer Details</h4>


                            <form onSubmit={handleSaveCustomer}>
                                <div className="row g-4">
                                    <div className="col-md-12">
                                        <label className="form-label text-muted small">Email Address</label>
                                        <input
                                            type="email"
                                            className="form-control"
                                            value={customer.email || ''}
                                            onChange={e => {
                                                const val = e.target.value;
                                                setCustomer(prev => ({ ...prev, email: val }));
                                            }}
                                            required
                                            readOnly={!!currentUser}
                                        />
                                    </div>
                                    <div className="col-md-6">
                                        <label className="form-label text-muted small">First Name</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            value={customer.firstName || ''}
                                            onChange={e => {
                                                const val = e.target.value;
                                                setCustomer(prev => ({ ...prev, firstName: val }));
                                            }}
                                            required
                                        />
                                    </div>
                                    <div className="col-md-6">
                                        <label className="form-label text-muted small">Last Name</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            value={customer.lastName || ''}
                                            onChange={e => {
                                                const val = e.target.value;
                                                setCustomer(prev => ({ ...prev, lastName: val }));
                                            }}
                                            required
                                        />
                                    </div>
                                    <div className="col-md-6">
                                        <label className="form-label text-muted small">Mobile</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            value={customer.mobileNumber || ''}
                                            onChange={e => {
                                                const val = e.target.value;
                                                setCustomer(prev => ({ ...prev, mobileNumber: val }));
                                            }}
                                            required
                                        />
                                    </div>
                                    <div className="col-md-6">
                                        <label className="form-label text-muted small">Date of Birth</label>
                                        <input
                                            type="date"
                                            className="form-control"
                                            value={customer.dateOfBirth || ''}
                                            onChange={e => {
                                                const val = e.target.value;
                                                setCustomer(prev => ({ ...prev, dateOfBirth: val }));
                                            }}
                                        />
                                    </div>
                                    <div className="col-md-12">
                                        <label className="form-label text-muted small">Address</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            value={customer.addressLine1 || ''}
                                            onChange={e => {
                                                const val = e.target.value;
                                                setCustomer(prev => ({ ...prev, addressLine1: val }));
                                            }}
                                        />
                                    </div>

                                    <h5 className="fw-bold mt-5 mb-2 text-primary">Identification</h5>
                                    <div className="col-md-4">
                                        <label className="form-label text-muted small">License No</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            value={customer.drivingLicenseNumber || ''}
                                            onChange={e => {
                                                const val = e.target.value;
                                                setCustomer(prev => ({ ...prev, drivingLicenseNumber: val }));
                                            }}
                                        />
                                    </div>
                                    <div className="col-md-4">
                                        <label className="form-label text-muted small">Issued By</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            value={customer.issuedByDL || ''}
                                            onChange={e => {
                                                const val = e.target.value;
                                                setCustomer(prev => ({ ...prev, issuedByDL: val }));
                                            }}
                                        />
                                    </div>
                                    <div className="col-md-4">
                                        <label className="form-label text-muted small">Valid Thru</label>
                                        <input
                                            type="date"
                                            className="form-control"
                                            value={customer.validThroughDL || ''}
                                            onChange={e => {
                                                const val = e.target.value;
                                                setCustomer(prev => ({ ...prev, validThroughDL: val }));
                                            }}
                                        />
                                    </div>

                                    <h5 className="fw-bold mt-5 mb-2 text-primary">Payment Information</h5>
                                    <div className="col-md-4">
                                        <label className="form-label text-muted small">Card Type</label>
                                        <select
                                            className="form-select"
                                            value={customer.creditCardType || 'VISA'}
                                            onChange={e => {
                                                const val = e.target.value;
                                                setCustomer(prev => ({ ...prev, creditCardType: val }));
                                            }}
                                        >
                                            <option value="VISA">VISA</option>
                                            <option value="MasterCard">MasterCard</option>
                                            <option value="Amex">Amex</option>
                                        </select>
                                    </div>
                                    <div className="col-md-8">
                                        <label className="form-label text-muted small">Card Number</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            value={customer.creditCardNumber || ''}
                                            onChange={e => {
                                                const val = e.target.value;
                                                setCustomer(prev => ({ ...prev, creditCardNumber: val }));
                                            }}
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="mt-5 d-flex justify-content-between">
                                    <button type="button" className="btn btn-outline-secondary rounded-pill px-4" onClick={() => setStep(2)}>Back</button>
                                    <button type="submit" className="btn btn-premium rounded-pill px-5">Continue to Confirm</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            {/* Step 4: Confirm Booking */}
            {step === 4 && (
                <div className="premium-card p-5 mx-auto shadow-lg" style={{ maxWidth: '700px' }}>
                    <div className="text-center mb-4">
                        <i className="bi bi-check-circle-fill display-4 text-success mb-3"></i>
                        <h3 className="fw-bold">Review Reservation</h3>
                        <p className="text-muted">Almost there! Please verify your details.</p>
                    </div>

                    <div className="glass-effect p-4 rounded-4 mb-4 border-0">
                        <div className="row g-3">
                            <div className="col-6">
                                <label className="small text-muted mb-0">Vehicle</label>
                                <p className="fw-bold mb-0">{selectedCar?.carModel}</p>
                            </div>
                            <div className="col-6">
                                <label className="small text-muted mb-0">Rate</label>
                                <p className="fw-bold mb-0 text-primary">₹{selectedCar?.carType?.dailyRate} / day</p>
                            </div>
                            <div className="col-6">
                                <label className="small text-muted mb-0">Pickup</label>
                                <p className="fw-bold mb-0">{hubs.find(h => h.hubId === Number(selectedHub))?.hubName}</p>
                            </div>
                            <div className="col-6">
                                <label className="small text-muted mb-0">Duration</label>
                                <p className="fw-bold mb-0">{dates.startDate} → {dates.endDate}</p>
                            </div>
                            <div className="col-12 border-top border-light pt-3 mt-3">
                                <label className="small text-muted mb-0">Renter</label>
                                <p className="fw-bold mb-0">{customer.firstName} {customer.lastName} ({customer.email})</p>
                            </div>

                            {/* Add-ons Recap */}
                            {selectedAddOnIds.length > 0 && (
                                <div className="col-12 mt-3 p-3 bg-primary bg-opacity-10 rounded-4">
                                    <label className="small text-muted d-block mb-2">Selected Extras</label>
                                    {addOns.filter(a => selectedAddOnIds.includes(a.addOnId)).map(a => (
                                        <div key={a.addOnId} className="d-flex justify-content-between small">
                                            <span>
                                                {a.addOnName}
                                                {a.addOnName.toLowerCase().includes('child seat') && ` (x${childSeatQty})`}
                                            </span>
                                            <span className="fw-bold">
                                                ₹{a.addOnName.toLowerCase().includes('child seat') ? (a.addonDailyRate * childSeatQty) : a.addonDailyRate}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            )}
                            {/* Total Cost Display */}
                            <div className="col-12 mt-4 pt-3 border-top border-light">
                                <div className="d-flex justify-content-between align-items-center bg-primary bg-opacity-10 p-4 rounded-4">
                                    <div>
                                        <label className="small text-muted d-block mb-1 uppercase tracking-wider">Estimated Total</label>
                                        <h2 className="fw-bold mb-0 text-primary">₹{calculateTotalCost().toLocaleString()}</h2>
                                    </div>
                                    <div className="text-end">
                                        <span className="badge bg-primary rounded-pill px-3 py-2">
                                            {calculateRentalDays()} Day{calculateRentalDays() > 1 ? 's' : ''} Rental
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="d-flex justify-content-between">
                        <button className="btn btn-outline-secondary rounded-pill px-4" onClick={() => setStep(3)}>Back</button>
                        <button className="btn btn-premium rounded-pill px-5 py-3 fs-5" onClick={handleConfirmBooking}>Confirm & Reserve</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Booking;
