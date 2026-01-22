import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ApiService from '../services/api';
import AuthService from '../services/authService';

const Booking = () => {
    const navigate = useNavigate();
    const [step, setStep] = useState(1);

    // Data States
    const [states, setStates] = useState([]);
    const [cities, setCities] = useState([]);
    const [hubs, setHubs] = useState([]);
    const [cars, setCars] = useState([]);
    const [addOns, setAddOns] = useState([]);
    const [carTypes, setCarTypes] = useState([]);

    // Selection States
    const [selectedState, setSelectedState] = useState('');
    const [selectedCity, setSelectedCity] = useState('');
    const [selectedHub, setSelectedHub] = useState('');
    const [selectedCarType, setSelectedCarType] = useState('');
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
    const [error, setError] = useState('');

    useEffect(() => {
        loadStates();
        loadAddOns();
        loadCarTypes();
    }, []);

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
        try {
            const data = await ApiService.getCarTypes();
            setCarTypes(data);
        } catch (err) {
            console.error("Failed to load car types", err);
        }
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

    const handleSearchCars = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const data = await ApiService.getAvailableCars(selectedHub, dates.startDate, dates.endDate);
            if (Array.isArray(data) && data.length > 0) {
                // Filter by car type if selected
                const filteredCars = selectedCarType
                    ? data.filter(car => car.carType?.carTypeId === Number(selectedCarType))
                    : data;

                if (filteredCars.length > 0) {
                    setCars(filteredCars);
                    setStep(2);
                } else {
                    setError('No cars available specifically for this type (try "All Types").');
                }
            } else {
                setError('No cars available for selected dates.');
            }
        } catch (err) {
            setError('Failed to fetch cars. Please try again.');
            console.error(err);
        } finally {
            setLoading(false);
        }
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

            alert('Booking Confirmed! ID: ' + (response.bookingId || 'Pending'));
            navigate('/');
        } catch (err) {
            alert('Booking Failed: ' + (err.response?.data?.message || err.message));
        }
    };

    return (
        <div className="container py-5">
            <h2 className="mb-4 fw-bold">Book Your Ride</h2>

            <div className="d-flex justify-content-between mb-5 position-relative">
                <div className={`text-center ${step >= 1 ? 'text-primary' : 'text-muted'}`}>
                    <div className="fs-4 fw-bold">1</div> <small>Location</small>
                </div>
                <div className={`text-center ${step >= 2 ? 'text-primary' : 'text-muted'}`}>
                    <div className="fs-4 fw-bold">2</div> <small>Car</small>
                </div>
                <div className={`text-center ${step >= 3 ? 'text-primary' : 'text-muted'}`}>
                    <div className="fs-4 fw-bold">3</div> <small>Add-ons</small>
                </div>
                <div className={`text-center ${step >= 4 ? 'text-primary' : 'text-muted'}`}>
                    <div className="fs-4 fw-bold">4</div> <small>Confirm</small>
                </div>
            </div>

            {/* Step 1: Location & Date (Unchanged Logic, just re-render) */}
            {step === 1 && (
                <div className="card glass-card p-4">
                    <form onSubmit={handleSearchCars}>
                        <div className="row g-3">
                            <div className="col-md-4">
                                <label className="form-label">State</label>
                                <select className="form-select" onChange={handleStateChange} required>
                                    <option value="">Select State</option>
                                    {states.map(s => <option key={s.stateId} value={s.stateId}>{s.stateName}</option>)}
                                </select>
                            </div>
                            <div className="col-md-4">
                                <label className="form-label">City</label>
                                <select className="form-select" onChange={handleCityChange} disabled={!selectedCity && cities.length === 0} required>
                                    <option value="">Select City</option>
                                    {cities.map(c => <option key={c.cityId} value={c.cityId}>{c.cityName}</option>)}
                                </select>
                            </div>
                            <div className="col-md-4">
                                <label className="form-label">Hub</label>
                                <select className="form-select" onChange={(e) => setSelectedHub(e.target.value)} disabled={!hubs.length} required>
                                    <option value="">Select Hub</option>
                                    {hubs.map(h => <option key={h.hubId} value={h.hubId}>{h.hubName}</option>)}
                                </select>
                            </div>
                            <div className="col-md-4">
                                <label className="form-label">Car Type</label>
                                <select className="form-select" onChange={(e) => setSelectedCarType(e.target.value)}>
                                    <option value="">All Types</option>
                                    {carTypes.map(t => <option key={t.carTypeId} value={t.carTypeId}>{t.carTypeName}</option>)}
                                </select>
                            </div>
                            <div className="col-md-4">
                                <label className="form-label">Start Date</label>
                                <input type="date" className="form-control" onChange={e => setDates({ ...dates, startDate: e.target.value })} required />
                            </div>
                            <div className="col-md-4">
                                <label className="form-label">End Date</label>
                                <input type="date" className="form-control" onChange={e => setDates({ ...dates, endDate: e.target.value })} required />
                            </div>
                        </div>
                        <div className="mt-4 text-end">
                            <button type="submit" className="btn btn-primary px-4" disabled={loading}>
                                {loading ? 'Searching...' : 'Find Cars'}
                            </button>
                        </div>
                        {error && <div className="alert alert-danger mt-3">{error}</div>}
                    </form>
                </div>
            )}

            {/* Step 2: Choose Car */}
            {step === 2 && (
                <div className="row g-4">
                    {cars.map(car => (
                        <div className="col-md-4" key={car.carId}>
                            <div className="card h-100 shadow-sm border-0">
                                <img src={car.imagePath || 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&w=500&q=60'}
                                    className="card-img-top" alt={car.carModel} style={{ height: '200px', objectFit: 'cover' }} />
                                <div className="card-body">
                                    <h5 className="card-title fw-bold">{car.carModel}</h5>
                                    <p className="card-text text-muted">{car.carType?.carTypeName || 'Sedan'}</p>
                                    <div className="d-flex justify-content-between align-items-center mt-3">
                                        <span className="fs-5 fw-bold text-primary">${car.carType?.dailyRate || 50}/day</span>
                                        <button className="btn btn-outline-primary btn-sm" onClick={() => { setSelectedCar(car); setStep(3); }}>
                                            Select
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                    <div className="col-12 mt-3">
                        <button className="btn btn-secondary" onClick={() => setStep(1)}>Back</button>
                    </div>
                </div>
            )}

            {/* Step 3: Add-ons & Customer Info */}
            {step === 3 && (
                <div className="row">
                    {/* Add-ons Column */}
                    <div className="col-md-4 mb-4">
                        <div className="card glass-card p-4 h-100">
                            <h4 className="fw-bold mb-3">Add-ons</h4>
                            {addOns.length > 0 ? (
                                <div className="list-group">
                                    {addOns.map(addon => (
                                        <label key={addon.addOnId} className="list-group-item d-flex gap-3 align-items-center bg-transparent">
                                            <input
                                                className="form-check-input flex-shrink-0"
                                                type="checkbox"
                                                checked={selectedAddOnIds.includes(addon.addOnId)}
                                                onChange={() => toggleAddOn(addon.addOnId)}
                                            />
                                            <span className="d-flex justify-content-between w-100">
                                                <span>{addon.addOnName}</span>
                                                <span className="text-muted">${addon.addonDailyRate.toFixed(2)}</span>
                                            </span>
                                        </label>
                                    ))}
                                </div>
                            ) : <p className="text-muted">No add-ons available.</p>}
                        </div>
                    </div>

                    {/* Customer Form Column */}
                    <div className="col-md-8">
                        <div className="card glass-card p-4">
                            <h4 className="fw-bold mb-3">Customer Information</h4>

                            {/* Membership Login */}
                            <div className="input-group mb-4">
                                <input
                                    type="email"
                                    className="form-control"
                                    placeholder="Enter Email to Retrieve Details"
                                    value={customer.email}
                                    onChange={e => setCustomer({ ...customer, email: e.target.value })}
                                />
                                <button className="btn btn-outline-primary" type="button" onClick={handleFindCustomer}>
                                    Go / Auto-Fill
                                </button>
                            </div>

                            <form onSubmit={handleSaveCustomer}>
                                <div className="row g-3">
                                    <div className="col-md-6">
                                        <label className="form-label">First Name</label>
                                        <input type="text" className="form-control" value={customer.firstName} onChange={e => setCustomer({ ...customer, firstName: e.target.value })} required />
                                    </div>
                                    <div className="col-md-6">
                                        <label className="form-label">Last Name</label>
                                        <input type="text" className="form-control" value={customer.lastName} onChange={e => setCustomer({ ...customer, lastName: e.target.value })} required />
                                    </div>
                                    <div className="col-md-6">
                                        <label className="form-label">Mobile</label>
                                        <input type="text" className="form-control" value={customer.mobileNumber} onChange={e => setCustomer({ ...customer, mobileNumber: e.target.value })} required />
                                    </div>
                                    <div className="col-md-6">
                                        <label className="form-label">Date of Birth</label>
                                        <input type="date" className="form-control" value={customer.dateOfBirth} onChange={e => setCustomer({ ...customer, dateOfBirth: e.target.value })} />
                                    </div>
                                    <div className="col-md-12">
                                        <label className="form-label">Address</label>
                                        <input type="text" className="form-control" value={customer.addressLine1} onChange={e => setCustomer({ ...customer, addressLine1: e.target.value })} />
                                    </div>

                                    <h5 className="fw-bold mt-4">Documents</h5>
                                    <div className="col-md-4">
                                        <label className="form-label">Driving License No</label>
                                        <input type="text" className="form-control" value={customer.drivingLicenseNumber} onChange={e => setCustomer({ ...customer, drivingLicenseNumber: e.target.value })} />
                                    </div>
                                    <div className="col-md-4">
                                        <label className="form-label">DL Issued By</label>
                                        <input type="text" className="form-control" value={customer.issuedByDL} onChange={e => setCustomer({ ...customer, issuedByDL: e.target.value })} />
                                    </div>
                                    <div className="col-md-4">
                                        <label className="form-label">DL Valid Thru</label>
                                        <input type="date" className="form-control" value={customer.validThroughDL} onChange={e => setCustomer({ ...customer, validThroughDL: e.target.value })} />
                                    </div>
                                    <div className="col-md-6">
                                        <label className="form-label">Passport No</label>
                                        <input type="text" className="form-control" value={customer.passportNumber} onChange={e => setCustomer({ ...customer, passportNumber: e.target.value })} />
                                    </div>
                                    <div className="col-md-6">
                                        <label className="form-label">Passport Valid Thru</label>
                                        <input type="date" className="form-control" value={customer.passportValidThrough} onChange={e => setCustomer({ ...customer, passportValidThrough: e.target.value })} />
                                    </div>

                                    <h5 className="fw-bold mt-4">Payment</h5>
                                    <div className="col-md-4">
                                        <label className="form-label">Card Type</label>
                                        <select className="form-select" value={customer.creditCardType} onChange={e => setCustomer({ ...customer, creditCardType: e.target.value })}>
                                            <option value="VISA">VISA</option>
                                            <option value="MasterCard">MasterCard</option>
                                            <option value="Amex">Amex</option>
                                        </select>
                                    </div>
                                    <div className="col-md-8">
                                        <label className="form-label">Card Number</label>
                                        <input type="text" className="form-control" value={customer.creditCardNumber} onChange={e => setCustomer({ ...customer, creditCardNumber: e.target.value })} required />
                                    </div>
                                </div>

                                <div className="mt-4 d-flex justify-content-between">
                                    <button type="button" className="btn btn-secondary" onClick={() => setStep(2)}>Back</button>
                                    <button type="submit" className="btn btn-primary px-4">Continue to Confirm</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            {/* Step 4: Confirm Booking */}
            {step === 4 && (
                <div className="card glass-card p-4 mx-auto" style={{ maxWidth: '600px' }}>
                    <h3 className="card-title mb-4">Confirm Booking</h3>
                    <div className="mb-3">
                        <p><strong>Car:</strong> {selectedCar?.carModel} ({selectedCar?.carType?.carTypeName})</p>
                        <p><strong>Pickup Hub:</strong> {hubs.find(h => h.hubId === Number(selectedHub))?.hubName}</p>
                        <p><strong>Date:</strong> {dates.startDate} to {dates.endDate}</p>
                        <p><strong>Customer:</strong> {customer.firstName} {customer.lastName}</p>
                        <p><strong>Add-ons:</strong> {selectedAddOnIds.length > 0 ? selectedAddOnIds.length + ' selected' : 'None'}</p>
                    </div>

                    <div className="d-flex justify-content-between">
                        <button className="btn btn-secondary" onClick={() => setStep(3)}>Back</button>
                        <button className="btn btn-success px-4" onClick={handleConfirmBooking}>Confirm & Pay</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Booking;
