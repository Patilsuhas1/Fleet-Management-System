import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import ApiService from '../../services/api';
import AuthService from '../../services/authService';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
    CarFront,
    CalendarDays,
    MapPin,
    ShieldCheck,
    User,
    PlusCircle,
    ChevronLeft,
    CheckCircle2,
    Loader2
} from "lucide-react";

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
    const [errors, setErrors] = useState({});

    const validateCustomerForm = () => {
        const newErrors = {};
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if (!customer.firstName || customer.firstName.trim().length < 2) newErrors.firstName = "First name is required (min 2 chars)";
        if (!customer.lastName || customer.lastName.trim().length < 2) newErrors.lastName = "Last name is required (min 2 chars)";

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!customer.email || !emailRegex.test(customer.email)) newErrors.email = "Valid email is required";

        const mobileRegex = /^\d{10}$/;
        if (!customer.mobileNumber || !mobileRegex.test(customer.mobileNumber)) newErrors.mobileNumber = "Valid 10-digit mobile number is required";

        if (!customer.dateOfBirth) {
            newErrors.dateOfBirth = "Date of Birth is required";
        } else {
            const dob = new Date(customer.dateOfBirth);
            let age = today.getFullYear() - dob.getFullYear();
            const m = today.getMonth() - dob.getMonth();
            if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) {
                age--;
            }
            if (age < 18) newErrors.dateOfBirth = "You must be at least 18 years old";
        }

        if (!customer.drivingLicenseNumber) newErrors.drivingLicenseNumber = "License number is required";
        if (!customer.issuedByDL) newErrors.issuedByDL = "Issued By is required";

        if (!customer.validThroughDL) {
            newErrors.validThroughDL = "License expiry date is required";
        } else if (new Date(customer.validThroughDL) < today) {
            newErrors.validThroughDL = "License has expired";
        }

        if (!customer.creditCardNumber || !/^\d{16}$/.test(customer.creditCardNumber.replace(/\s/g, ''))) {
            newErrors.creditCardNumber = "Valid 16-digit card number is required";
        }

        if (!customer.addressLine1) newErrors.addressLine1 = "Address is required";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

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

    const validateSearch = () => {
        if (!dates.startDate || !dates.endDate) {
            alert("Please select both Pickup and Return dates.");
            return false;
        }

        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const start = new Date(dates.startDate);
        const end = new Date(dates.endDate);

        if (start < today) {
            alert("Pickup date cannot be in the past.");
            return false;
        }

        if (end <= start) {
            alert("Return date must be after the pickup date.");
            return false;
        }

        return true;
    };

    const searchByAirport = async () => {
        if (!validateSearch()) return;
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
        if (!validateSearch()) return;
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
        if (!validateCustomerForm()) {
            // Scroll to top of form or first error could be good, but for now just stop
            return;
        }
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
        <div className="container mx-auto px-4 py-12 max-w-7xl">
            <div className="mb-10 text-center md:text-left">
                <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-2">Book Your Ride</h2>
                <p className="text-muted-foreground">Follow the steps to secure your premium vehicle.</p>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-4 mb-12 px-2 md:px-10">
                {[1, 2, 3, 4].map(i => (
                    <div key={i} className={`flex items-center gap-3 transition-colors ${step >= i ? 'text-primary' : 'text-muted-foreground'}`}>
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold border-2 transition-all ${step >= i
                            ? 'bg-primary text-primary-foreground border-primary shadow-lg shadow-primary/20'
                            : 'bg-muted border-muted text-muted-foreground'
                            }`}>
                            {i}
                        </div>
                        <span className="font-semibold hidden sm:inline text-sm uppercase tracking-wider">
                            {['Location', 'Vehicles', 'Details', 'Confirm'][i - 1]}
                        </span>
                        {i < 4 && <div className={`hidden lg:block w-12 h-[2px] mx-2 ${step > i ? 'bg-primary' : 'bg-muted'}`} />}
                    </div>
                ))}
            </div>

            {/* Step 1: Location & Date */}
            {step === 1 && (
                <div className="grid lg:grid-cols-2 gap-8 items-stretch">
                    {/* Left Panel - Search */}
                    <Card className="border-none shadow-xl overflow-hidden bg-card/50 backdrop-blur-sm">
                        <div className="p-8">
                            <h3 className="text-2xl font-bold mb-6">Search Availability</h3>

                            {/* Dates */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                                <div className="space-y-2">
                                    <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Pick-Up Date</Label>
                                    <Input
                                        type="date"
                                        min={new Date().toISOString().split('T')[0]}
                                        value={dates.startDate}
                                        onChange={e => setDates({ ...dates, startDate: e.target.value })}
                                        className="h-12"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Return Date</Label>
                                    <Input
                                        type="date"
                                        min={dates.startDate || new Date().toISOString().split('T')[0]}
                                        value={dates.endDate}
                                        onChange={e => setDates({ ...dates, endDate: e.target.value })}
                                        className="h-12"
                                    />
                                </div>
                            </div>

                            <Separator className="my-8 opacity-50" />

                            {/* Location Section */}
                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <Label className="text-sm font-bold">Pick-Up Location (Airport Code)</Label>
                                    <div className="flex gap-2">
                                        <Input
                                            placeholder="e.g. BOM, PNQ"
                                            value={airportCode}
                                            onChange={e => setAirportCode(e.target.value.toUpperCase())}
                                            className="uppercase h-12"
                                        />
                                        <Button
                                            variant="outline"
                                            onClick={searchByAirport}
                                            disabled={loading}
                                            className="px-6 h-12 font-bold"
                                        >
                                            {loading ? <Loader2 className="animate-spin h-4 w-4" /> : 'Find'}
                                        </Button>
                                    </div>
                                </div>

                                <div className="relative py-4">
                                    <div className="absolute inset-0 flex items-center">
                                        <span className="w-full border-t" />
                                    </div>
                                    <div className="relative flex justify-center text-xs uppercase">
                                        <span className="bg-background px-4 font-bold text-muted-foreground">Or select manually</span>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <Label className="text-sm font-bold">State</Label>
                                        <select
                                            className="flex h-12 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                                            onChange={handleStateChange}
                                        >
                                            <option value="">--Select State--</option>
                                            {states.map(s => <option key={s.stateId} value={s.stateId}>{s.stateName}</option>)}
                                        </select>
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-sm font-bold">City</Label>
                                        <select
                                            className="flex h-12 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:opacity-50"
                                            onChange={handleCityChange}
                                            disabled={!selectedState || cities.length === 0}
                                        >
                                            <option value="">--Select City--</option>
                                            {cities.map(c => <option key={c.cityId} value={c.cityId}>{c.cityName}</option>)}
                                        </select>
                                    </div>
                                </div>

                                <div className="flex items-center space-x-3 pt-4">
                                    <input
                                        type="checkbox"
                                        id="differentReturn"
                                        className="w-5 h-5 rounded border-gray-300 text-primary focus:ring-primary"
                                        checked={differentReturn}
                                        onChange={() => setDifferentReturn(!differentReturn)}
                                    />
                                    <Label htmlFor="differentReturn" className="text-sm font-medium cursor-pointer">
                                        I may return the car to a different location
                                    </Label>
                                </div>

                                <Button className="w-full h-14 text-lg font-bold mt-6 shadow-lg shadow-primary/20" onClick={searchByCity}>
                                    Find Cars
                                </Button>
                            </div>
                        </div>
                    </Card>

                    {/* Right Panel - Promo */}
                    <Card className="border-none overflow-hidden relative group">
                        <div className="absolute inset-0 bg-gradient-to-br from-primary/90 to-blue-900 z-10 opacity-95 transition-transform duration-700 group-hover:scale-105" />
                        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&q=80')] bg-cover bg-center" />

                        <div className="relative z-20 h-full p-10 flex flex-col justify-center text-white text-center">
                            <div className="mb-8 flex justify-center">
                                <div className="p-4 bg-white/10 backdrop-blur-md rounded-2xl animate-bounce">
                                    <CarFront className="w-16 h-16 text-white" />
                                </div>
                            </div>

                            <Badge className="w-fit mx-auto mb-6 bg-white/20 text-white border-white/30 px-6 py-1.5 text-sm font-bold rounded-full backdrop-blur-md">
                                Priority Access
                            </Badge>

                            <h2 className="text-4xl md:text-5xl font-black mb-6 leading-tight">
                                Luxury <span className="text-blue-400">Fleet</span>
                            </h2>

                            <p className="text-xl text-white/80 mb-10 max-w-md mx-auto leading-relaxed">
                                Experience the pinnacle of automotive engineering with our premium selection.
                            </p>

                            <div className="grid grid-cols-2 gap-4 max-w-sm mx-auto">
                                <div className="p-6 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 transition-all hover:bg-white/20">
                                    <span className="block text-xs uppercase tracking-widest text-white/60 mb-2">Weekend Rate</span>
                                    <span className="text-2xl font-bold">₹1,999<small className="text-sm text-white/50">/day</small></span>
                                </div>
                                <div className="p-6 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 transition-all hover:bg-white/20">
                                    <span className="block text-xs uppercase tracking-widest text-white/60 mb-2">Insurance</span>
                                    <span className="text-2xl font-bold">Full Cover</span>
                                </div>
                            </div>

                            <Button variant="outline" className="mt-12 w-full h-14 rounded-full border-2 text-primary border-white bg-white hover:bg-white/90 font-black text-lg">
                                VIEW CATALOG
                            </Button>
                        </div>
                    </Card>
                </div>
            )}

            {/* Step 2 is now handled by CarSelection.js page */}

            {step === 3 && (
                <div className="grid lg:grid-cols-3 gap-8 items-start">
                    {/* Add-ons Column */}
                    <div className="lg:col-span-1 space-y-6">
                        <Card className="border-none shadow-xl bg-card/50 backdrop-blur-sm">
                            <div className="p-6">
                                <h4 className="text-xl font-bold mb-6 flex items-center gap-2">
                                    <PlusCircle className="w-5 h-5 text-primary" />
                                    Available Extras
                                </h4>

                                <div className="space-y-4">
                                    {addOns.length > 0 ? (
                                        addOns.map(addon => {
                                            const isChildSeat = addon.addOnName.toLowerCase().includes('child seat');
                                            const isSelected = selectedAddOnIds.includes(addon.addOnId);

                                            return (
                                                <div key={addon.addOnId} className={`p-4 rounded-xl border transition-all ${isSelected ? 'bg-primary/5 border-primary shadow-sm' : 'bg-background hover:border-primary/50'
                                                    }`}>
                                                    <div className="flex items-start gap-4">
                                                        <div className="pt-1">
                                                            <input
                                                                type="checkbox"
                                                                className="w-5 h-5 rounded border-gray-300 text-primary focus:ring-primary cursor-pointer"
                                                                checked={isSelected}
                                                                onChange={() => toggleAddOn(addon.addOnId)}
                                                            />
                                                        </div>
                                                        <div className="flex-1">
                                                            <div className="flex justify-between items-center mb-1">
                                                                <span className="font-bold text-sm">{addon.addOnName}</span>
                                                                <span className="text-primary font-bold">₹{addon.addonDailyRate.toFixed(0)}</span>
                                                            </div>
                                                            <p className="text-xs text-muted-foreground">Daily rate</p>

                                                            {isChildSeat && isSelected && (
                                                                <div className="mt-4 pt-4 border-t border-primary/20 animate-in fade-in slide-in-from-top-2 duration-300">
                                                                    <Label className="text-xs font-bold text-muted-foreground mb-2 block">QUANTITY</Label>
                                                                    <div className="flex items-center gap-4">
                                                                        <select
                                                                            className="flex h-9 w-24 items-center justify-between rounded-md border border-primary/50 bg-background px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                                                                            value={childSeatQty}
                                                                            onChange={(e) => setChildSeatQty(Number(e.target.value))}
                                                                        >
                                                                            {[1, 2, 3].map(q => <option key={q} value={q}>{q} Seat{q > 1 ? 's' : ''}</option>)}
                                                                        </select>
                                                                        <div className="text-right flex-1">
                                                                            <p className="text-xs text-muted-foreground mb-1">Total</p>
                                                                            <p className="text-sm font-bold text-primary">₹{(addon.addonDailyRate * childSeatQty).toFixed(0)}</p>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })
                                    ) : (
                                        <div className="text-center py-8 text-muted-foreground italic">No add-ons available.</div>
                                    )}
                                </div>
                            </div>
                        </Card>

                        <Card className="border-none shadow-xl bg-primary text-primary-foreground">
                            <div className="p-6">
                                <h4 className="font-bold mb-4">Reservation Summary</h4>
                                <div className="space-y-3 text-sm">
                                    <div className="flex justify-between opacity-80">
                                        <span>Vehicle Rate ({calculateRentalDays()} days)</span>
                                        <span>₹{((selectedCar?.carType?.dailyRate || 0) * calculateRentalDays()).toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between opacity-80 border-b border-white/20 pb-3">
                                        <span>Extras</span>
                                        <span>₹{(calculateTotalCost() - (selectedCar?.carType?.dailyRate || 0) * calculateRentalDays()).toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between text-lg font-black pt-2">
                                        <span>Total Amount</span>
                                        <span>₹{calculateTotalCost().toLocaleString()}</span>
                                    </div>
                                </div>
                            </div>
                        </Card>
                    </div>

                    {/* Customer Form Column */}
                    <div className="lg:col-span-2">
                        <Card className="border-none shadow-xl">
                            <CardHeader className="p-8 pb-4">
                                <CardTitle className="text-2xl font-bold">Recipient Details</CardTitle>
                                <CardDescription>Please provide the driver's information.</CardDescription>
                            </CardHeader>
                            <CardContent className="p-8">
                                <form onSubmit={handleSaveCustomer} className="space-y-8">
                                    <div className="space-y-2">
                                        <Label htmlFor="email" className="text-sm font-bold text-muted-foreground uppercase tracking-widest">Email Address</Label>
                                        <Input
                                            id="email"
                                            type="email"
                                            value={customer.email || ''}
                                            onChange={e => setCustomer(prev => ({ ...prev, email: e.target.value }))}
                                            required
                                            readOnly={!!currentUser}
                                            className="h-12 bg-muted/30"
                                        />
                                        {errors.email && <p className="text-xs text-destructive">{errors.email}</p>}
                                    </div>

                                    <div className="grid md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <Label htmlFor="firstName" className="text-sm font-bold text-muted-foreground uppercase tracking-widest">First Name</Label>
                                            <Input
                                                id="firstName"
                                                value={customer.firstName || ''}
                                                onChange={e => {
                                                    setCustomer(prev => ({ ...prev, firstName: e.target.value }));
                                                    if (errors.firstName) setErrors({ ...errors, firstName: '' });
                                                }}
                                                required
                                                className={`h-12 ${errors.firstName ? 'border-destructive' : ''}`}
                                            />
                                            {errors.firstName && <p className="text-xs text-destructive">{errors.firstName}</p>}
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="lastName" className="text-sm font-bold text-muted-foreground uppercase tracking-widest">Last Name</Label>
                                            <Input
                                                id="lastName"
                                                value={customer.lastName || ''}
                                                onChange={e => {
                                                    setCustomer(prev => ({ ...prev, lastName: e.target.value }));
                                                    if (errors.lastName) setErrors({ ...errors, lastName: '' });
                                                }}
                                                required
                                                className={`h-12 ${errors.lastName ? 'border-destructive' : ''}`}
                                            />
                                            {errors.lastName && <p className="text-xs text-destructive">{errors.lastName}</p>}
                                        </div>
                                    </div>

                                    <div className="grid md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <Label htmlFor="mobile" className="text-sm font-bold text-muted-foreground uppercase tracking-widest">Phone Number</Label>
                                            <Input
                                                id="mobile"
                                                placeholder="10-digit mobile"
                                                value={customer.mobileNumber || ''}
                                                onChange={e => {
                                                    setCustomer(prev => ({ ...prev, mobileNumber: e.target.value }));
                                                    if (errors.mobileNumber) setErrors({ ...errors, mobileNumber: '' });
                                                }}
                                                required
                                                className={`h-12 ${errors.mobileNumber ? 'border-destructive' : ''}`}
                                            />
                                            {errors.mobileNumber && <p className="text-xs text-destructive">{errors.mobileNumber}</p>}
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="dob" className="text-sm font-bold text-muted-foreground uppercase tracking-widest">Date of Birth</Label>
                                            <Input
                                                id="dob"
                                                type="date"
                                                max={new Date().toISOString().split('T')[0]}
                                                value={customer.dateOfBirth || ''}
                                                onChange={e => {
                                                    setCustomer(prev => ({ ...prev, dateOfBirth: e.target.value }));
                                                    if (errors.dateOfBirth) setErrors({ ...errors, dateOfBirth: '' });
                                                }}
                                                required
                                                className={`h-12 ${errors.dateOfBirth ? 'border-destructive' : ''}`}
                                            />
                                            {errors.dateOfBirth && <p className="text-xs text-destructive">{errors.dateOfBirth}</p>}
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="address" className="text-sm font-bold text-muted-foreground uppercase tracking-widest">Residential Address</Label>
                                        <Input
                                            id="address"
                                            value={customer.addressLine1 || ''}
                                            onChange={e => {
                                                setCustomer(prev => ({ ...prev, addressLine1: e.target.value }));
                                                if (errors.addressLine1) setErrors({ ...errors, addressLine1: '' });
                                            }}
                                            required
                                            className={`h-12 ${errors.addressLine1 ? 'border-destructive' : ''}`}
                                        />
                                        {errors.addressLine1 && <p className="text-xs text-destructive">{errors.addressLine1}</p>}
                                    </div>

                                    <div className="pt-6 border-t">
                                        <h5 className="text-lg font-bold mb-6 flex items-center gap-2 text-primary">
                                            <ShieldCheck className="w-5 h-5" />
                                            Identification & Payout
                                        </h5>
                                        <div className="grid md:grid-cols-3 gap-6">
                                            <div className="space-y-2">
                                                <Label htmlFor="license" className="text-sm font-bold text-muted-foreground">DL Number</Label>
                                                <Input
                                                    id="license"
                                                    value={customer.drivingLicenseNumber || ''}
                                                    onChange={e => {
                                                        setCustomer(prev => ({ ...prev, drivingLicenseNumber: e.target.value }));
                                                        if (errors.drivingLicenseNumber) setErrors({ ...errors, drivingLicenseNumber: '' });
                                                    }}
                                                    className={errors.drivingLicenseNumber ? 'border-destructive' : ''}
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="dlIssued" className="text-sm font-bold text-muted-foreground">Issued By</Label>
                                                <Input
                                                    id="dlIssued"
                                                    placeholder="State/RTO"
                                                    value={customer.issuedByDL || ''}
                                                    onChange={e => {
                                                        setCustomer(prev => ({ ...prev, issuedByDL: e.target.value }));
                                                        if (errors.issuedByDL) setErrors({ ...errors, issuedByDL: '' });
                                                    }}
                                                    className={errors.issuedByDL ? 'border-destructive' : ''}
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="dlValid" className="text-sm font-bold text-muted-foreground">Valid Through</Label>
                                                <Input
                                                    id="dlValid"
                                                    type="date"
                                                    min={new Date().toISOString().split('T')[0]}
                                                    value={customer.validThroughDL || ''}
                                                    onChange={e => {
                                                        setCustomer(prev => ({ ...prev, validThroughDL: e.target.value }));
                                                        if (errors.validThroughDL) setErrors({ ...errors, validThroughDL: '' });
                                                    }}
                                                    className={errors.validThroughDL ? 'border-destructive' : ''}
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="grid md:grid-cols-3 gap-6 pt-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="cardType" className="text-sm font-bold text-muted-foreground">Card Network</Label>
                                            <select
                                                id="cardType"
                                                className="flex h-12 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                                                value={customer.creditCardType || 'VISA'}
                                                onChange={e => setCustomer(prev => ({ ...prev, creditCardType: e.target.value }))}
                                            >
                                                <option value="VISA">VISA</option>
                                                <option value="MasterCard">MasterCard</option>
                                                <option value="Amex">Amex</option>
                                            </select>
                                        </div>
                                        <div className="md:col-span-2 space-y-2">
                                            <Label htmlFor="cardNumber" className="text-sm font-bold text-muted-foreground">Card Number (16-digit)</Label>
                                            <Input
                                                id="cardNumber"
                                                placeholder="0000 0000 0000 0000"
                                                value={customer.creditCardNumber || ''}
                                                onChange={e => {
                                                    const val = e.target.value.replace(/\D/g, '').slice(0, 16);
                                                    setCustomer(prev => ({ ...prev, creditCardNumber: val }));
                                                    if (errors.creditCardNumber) setErrors({ ...errors, creditCardNumber: '' });
                                                }}
                                                required
                                                className={`h-12 tracking-widest ${errors.creditCardNumber ? 'border-destructive' : ''}`}
                                            />
                                            {errors.creditCardNumber && <p className="text-xs text-destructive">{errors.creditCardNumber}</p>}
                                        </div>
                                    </div>

                                    <div className="flex justify-between items-center pt-10 border-t">
                                        <Button variant="ghost" type="button" onClick={() => setStep(2)} className="px-8 h-12 font-bold">
                                            <ChevronLeft className="mr-2 h-4 w-4" /> Back to Vehicles
                                        </Button>
                                        <Button type="submit" disabled={loading} className="px-12 h-14 text-lg font-black rounded-full shadow-xl shadow-primary/30">
                                            {loading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : null}
                                            Confirm Details
                                        </Button>
                                    </div>
                                </form>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            )}

            {/* Step 4: Confirm Booking */}
            {step === 4 && (
                <div className="max-w-3xl mx-auto animate-in zoom-in-95 duration-500">
                    <Card className="border-none shadow-2xl overflow-hidden">
                        <div className="bg-primary p-12 text-center text-primary-foreground relative">
                            <div className="absolute top-0 right-0 p-4 opacity-10">
                                <CheckCircle2 className="w-48 h-48 -mr-12 -mt-12" />
                            </div>
                            <div className="relative z-10">
                                <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6 backdrop-blur-md">
                                    <CheckCircle2 className="w-12 h-12 text-white" />
                                </div>
                                <h3 className="text-3xl font-black mb-2">Review Reservation</h3>
                                <p className="text-primary-foreground/80 font-medium">Verify your selection before final confirmation.</p>
                            </div>
                        </div>

                        <CardContent className="p-10 space-y-10">
                            <div className="grid md:grid-cols-2 gap-10">
                                <div className="space-y-6">
                                    <div>
                                        <Label className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-2 block">Vehicle Selection</Label>
                                        <div className="flex items-center gap-4 group">
                                            <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center transition-colors group-hover:bg-primary/20">
                                                <CarFront className="w-6 h-6 text-primary" />
                                            </div>
                                            <div>
                                                <p className="text-xl font-black text-foreground">{selectedCar?.carModel}</p>
                                                <p className="text-sm font-bold text-primary">₹{selectedCar?.carType?.dailyRate} / Day</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div>
                                        <Label className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-2 block">Location & Hub</Label>
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 bg-muted rounded-xl flex items-center justify-center">
                                                <MapPin className="w-6 h-6 text-muted-foreground" />
                                            </div>
                                            <div>
                                                <p className="font-bold text-foreground">{hubs.find(h => h.hubId === Number(selectedHub))?.hubName || 'Standard Hub'}</p>
                                                <p className="text-xs text-muted-foreground">{hubs.find(h => h.hubId === Number(selectedHub))?.hubAddress}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    <div>
                                        <Label className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-2 block">Rental Period</Label>
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 bg-muted rounded-xl flex items-center justify-center">
                                                <CalendarDays className="w-6 h-6 text-muted-foreground" />
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <p className="font-bold">{dates.startDate}</p>
                                                    <span className="text-muted-foreground">to</span>
                                                    <p className="font-bold">{dates.endDate}</p>
                                                </div>
                                                <p className="text-xs font-bold text-primary mt-1">{calculateRentalDays()} Full Days</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div>
                                        <Label className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-2 block">Drivers Information</Label>
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 bg-muted rounded-xl flex items-center justify-center">
                                                <User className="w-6 h-6 text-muted-foreground" />
                                            </div>
                                            <div>
                                                <p className="font-bold">{customer.firstName} {customer.lastName}</p>
                                                <p className="text-xs text-muted-foreground">{customer.email}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-muted/30 rounded-3xl p-8 border border-muted">
                                <div className="flex justify-between items-center mb-6">
                                    <h5 className="font-black text-lg">Financial Summary</h5>
                                    <div className="px-3 py-1 bg-primary/10 text-primary text-[10px] font-black uppercase rounded-full tracking-widest">Pricing in INR</div>
                                </div>

                                <div className="space-y-4">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-muted-foreground">Standard Fleet Hire ({calculateRentalDays()} days)</span>
                                        <span className="font-bold">₹{((selectedCar?.carType?.dailyRate || 0) * calculateRentalDays()).toLocaleString()}</span>
                                    </div>

                                    {selectedAddOnIds.length > 0 && (
                                        <div className="space-y-2 pt-2 border-t border-muted-foreground/10">
                                            <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Selected Extras</span>
                                            {addOns.filter(a => selectedAddOnIds.includes(a.addOnId)).map(a => (
                                                <div key={a.addOnId} className="flex justify-between text-sm px-2">
                                                    <span className="text-muted-foreground flex items-center gap-2">
                                                        <div className="w-1 h-1 bg-primary rounded-full" />
                                                        {a.addOnName} {a.addOnName.toLowerCase().includes('child seat') ? `(x${childSeatQty})` : ''}
                                                    </span>
                                                    <span className="font-medium">₹{(a.addOnName.toLowerCase().includes('child seat') ? a.addonDailyRate * childSeatQty : a.addonDailyRate).toFixed(0)}</span>
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    <div className="flex justify-between items-end pt-6 border-t-2 border-primary/20">
                                        <div>
                                            <p className="text-xs font-bold text-muted-foreground uppercase tracking-[0.2em] mb-1">Final Payment</p>
                                            <p className="text-sm text-muted-foreground">All taxes and fees included</p>
                                        </div>
                                        <div className="text-end">
                                            <p className="text-4xl font-black text-primary tracking-tight">₹{calculateTotalCost().toLocaleString()}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex gap-4 pt-4">
                                <Button variant="ghost" onClick={() => setStep(3)} className="flex-1 h-14 font-bold border-2">
                                    Modify Details
                                </Button>
                                <Button onClick={handleConfirmBooking} className="flex-[2] h-14 text-xl font-black rounded-full shadow-2xl shadow-primary/40">
                                    Complete Reservation
                                </Button>
                            </div>
                        </CardContent>

                        <div className="bg-muted/50 p-6 text-center border-t">
                            <p className="text-xs text-muted-foreground flex items-center justify-center gap-2">
                                <ShieldCheck className="w-3 h-3" />
                                Secure 256-bit encrypted checkout. By clicking Complete Reservation you agree to our terms.
                            </p>
                        </div>
                    </Card>
                </div>
            )}
        </div>
    );
};

export default Booking;
