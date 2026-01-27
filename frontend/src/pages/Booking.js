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

    // Pre-fill email from logged-in user (Run only once on mount/user change)
    useEffect(() => {
        if (currentUser && (currentUser.email || currentUser.username)) {
            setCustomer(prev => {
                // Only pre-fill if email is currently empty
                if (!prev.email) {
                    return { ...prev, email: currentUser.email || currentUser.username };
                }
                return prev;
            });
        }
    }, [currentUser]); // Remove customer.email dependency to prevent snap-back

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

    const handleFindCustomer = async () => {
        if (!customer.email) {
            alert('Please enter an email to search.');
            return;
        }
        try {
            setLoading(true);
            const data = await ApiService.findCustomer(customer.email);
            if (data) {
                setCustomer(prev => ({ ...prev, ...data }));
                alert('Member found! Details auto-filled.');
            }
        } catch (err) {
            if (err.response && err.response.status === 404) {
                alert('Member not found. Please fill in details.');
            } else {
                console.error(err);
                alert('Error fetching member details.');
            }
        } finally {
            setLoading(false);
        }
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

        const bookingRequest = {
            carId: selectedCar.carId,
            customerId: customer.custId, // Using the ID from saved customer
            pickupHubId: selectedHub,
            returnHubId: selectedHub,
            startDate: dates.startDate,
            endDate: dates.endDate,
            addOnIds: selectedAddOnIds,
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
                                    {addOns.map(addon => (
                                        <label key={addon.addOnId} className="list-group-item d-flex gap-3 align-items-center bg-transparent border-0 p-3 rounded-4 glass-effect">
                                            <input
                                                className="form-check-input flex-shrink-0"
                                                type="checkbox"
                                                checked={selectedAddOnIds.includes(addon.addOnId)}
                                                onChange={() => toggleAddOn(addon.addOnId)}
                                            />
                                            <div className="d-flex justify-content-between w-100 align-items-center">
                                                <span className="fw-medium">{addon.addOnName}</span>
                                                <span className="text-primary fw-bold">₹{addon.addonDailyRate.toFixed(0)}</span>
                                            </div>
                                        </label>
                                    ))}
                                </div>
                            ) : <p className="text-muted">No add-ons available at this time.</p>}
                        </div>
                    </div>

                    {/* Customer Form Column */}
                    <div className="col-md-8">
                        <div className="premium-card p-5">
                            <h4 className="fw-bold mb-4">Customer Details</h4>

                            {/* Membership Login */}
                            <div className="input-group mb-5 glass-effect rounded-pill p-1">
                                <input
                                    type="email"
                                    className="form-control bg-transparent border-0 px-4"
                                    placeholder="Enter Email to Retrieve Details"
                                    value={customer.email}
                                    onChange={e => {
                                        const val = e.target.value;
                                        setCustomer(prev => ({ ...prev, email: val }));
                                    }}
                                    onKeyDown={e => e.key === 'Enter' && handleFindCustomer()}
                                />
                                <button className="btn btn-premium rounded-pill px-4" type="button" onClick={handleFindCustomer}>
                                    Find Member
                                </button>
                            </div>

                            <form onSubmit={handleSaveCustomer}>
                                <div className="row g-4">
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
