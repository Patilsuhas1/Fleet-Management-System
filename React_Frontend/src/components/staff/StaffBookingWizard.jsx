import React, { useState } from 'react';
import ApiService from '../../services/api';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
    Calendar,
    Car,
    User,
    CheckCircle2,
    ArrowRight,
    ArrowLeft,
    IndianRupee,
    Search,
    ShieldCheck,
    Plus,
    Minus,
    Zap,
    MapPin,
    Mail,
    Phone,
    CreditCard,
    FileCheck,
    Loader2,
    X,
    AlertCircle
} from "lucide-react";

const StaffBookingWizard = ({ onClose }) => {
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    // Booking Data
    const [pickupHubId] = useState(1);
    const [dates, setDates] = useState({
        rentalDate: new Date().toISOString().slice(0, 16),
        returnDate: new Date(new Date().getTime() + 24 * 60 * 60 * 1000).toISOString().slice(0, 16)
    });

    const [availableCars, setAvailableCars] = useState([]);
    const [selectedCar, setSelectedCar] = useState(null);
    const [addOns, setAddOns] = useState([]);
    const [selectedAddOns, setSelectedAddOns] = useState([]);
    const [childSeatQty, setChildSeatQty] = useState(1);

    // Cost Calculation
    const calculateRentalDays = () => {
        const start = new Date(dates.rentalDate);
        const end = new Date(dates.returnDate);
        return Math.ceil(Math.abs(end - start) / (1000 * 60 * 60 * 24)) || 1;
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

    const handleFindCars = async () => {
        setLoading(true);
        try {
            const start = dates.rentalDate.slice(0, 10);
            const end = dates.returnDate.slice(0, 10);
            const cars = await ApiService.getAvailableCars(pickupHubId, start, end);
            setAvailableCars(cars);
            const addonsData = await ApiService.getAddOns();
            setAddOns(addonsData);
            setStep(2);
        } catch (err) {
            setMessage('Error finding cars: ' + err.message);
        } finally {
            setLoading(false);
        }
    };

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
            }
        } catch (err) {
            setCustomerDetails(null);
            setIsNewCustomer(true);
            setNewCustomerData({ ...newCustomerData, email: customerEmail });
        } finally {
            setLoading(false);
        }
    };

    const handleCreateBooking = async () => {
        setLoading(true);
        try {
            let custId = customerDetails?.customerId;
            if (isNewCustomer) {
                const savedCust = await ApiService.saveCustomer(newCustomerData);
                custId = savedCust.customerId;
            }

            if (!custId) throw new Error("Invalid Customer ID");

            const bookingRequest = {
                customerId: custId, carId: selectedCar.carId, pickupHubId, returnHubId: pickupHubId,
                rentalDate: dates.rentalDate, returnDate: dates.returnDate, addOnIds: []
            };

            const finalAddOnIds = [...selectedAddOns];
            const childSeatAddOn = addOns.find(a => a.addOnName.toLowerCase().includes('child seat'));
            if (childSeatAddOn && selectedAddOns.includes(childSeatAddOn.addOnId)) {
                const baseIds = selectedAddOns.filter(id => id !== childSeatAddOn.addOnId);
                for (let i = 0; i < childSeatQty; i++) baseIds.push(childSeatAddOn.addOnId);
                bookingRequest.addOnIds = baseIds;
            } else {
                bookingRequest.addOnIds = finalAddOnIds;
            }

            const booking = await ApiService.createBooking(bookingRequest);
            await ApiService.handoverCar(booking.bookingId);
            await ApiService.processHandover({
                bookingId: booking.bookingId, carId: selectedCar.carId, fuelStatus: 'Full', notes: 'Instant Reservation - Automated Handover'
            });

            alert(`Reservation Successful! Confirmation: ${booking.confirmationNumber}`);
            onClose();
        } catch (err) {
            setMessage('Booking Failed: ' + (err.response?.data?.message || err.message));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-8 max-w-4xl mx-auto text-left">
            <div className="flex items-center justify-between">
                <div>
                    <Badge variant="secondary" className="bg-primary/10 text-primary border-none font-black text-[10px] uppercase px-3 py-1 mb-2">
                        Step {step} of 3
                    </Badge>
                    <h2 className="text-2xl font-black uppercase tracking-tight">Instant Reservation</h2>
                </div>
                <Button variant="ghost" size="icon" onClick={onClose} className="h-10 w-10"><X className="h-5 w-5" /></Button>
            </div>

            {message && (
                <div className="p-4 bg-destructive/10 border border-destructive/20 text-destructive rounded-xl flex items-center gap-3 animate-in fade-in duration-300">
                    <AlertCircle className="h-5 w-5" />
                    <span className="font-bold text-xs">{message}</span>
                </div>
            )}

            {/* STEP 1: DURATION */}
            {step === 1 && (
                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-3">
                            <Label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest pl-1">Pickup Date & Time</Label>
                            <Input
                                type="datetime-local"
                                className="h-14 rounded-2xl bg-muted/50 border-none font-bold text-center"
                                value={dates.rentalDate}
                                onChange={(e) => setDates({ ...dates, rentalDate: e.target.value })}
                            />
                        </div>
                        <div className="space-y-3">
                            <Label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest pl-1">Return Date & Time</Label>
                            <Input
                                type="datetime-local"
                                className="h-14 rounded-2xl bg-muted/50 border-none font-bold text-center"
                                value={dates.returnDate}
                                onChange={(e) => setDates({ ...dates, returnDate: e.target.value })}
                            />
                        </div>
                    </div>
                    <Button onClick={handleFindCars} disabled={loading} className="w-full h-16 rounded-2xl bg-primary font-black uppercase tracking-widest text-xs shadow-xl shadow-primary/20 gap-3">
                        {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <><Car className="h-5 w-5" /> Check Available Cars</>}
                    </Button>
                </div>
            )}

            {/* STEP 2: CAR & ADDONS */}
            {step === 2 && (
                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="space-y-4">
                        <Label className="text-[10px] font-black uppercase text-primary tracking-widest">Select Vehicle</Label>
                        <div className="grid gap-3 max-h-[300px] overflow-y-auto pr-2 scrollbar-thin">
                            {availableCars.map(car => (
                                <div
                                    key={car.carId}
                                    onClick={() => setSelectedCar(car)}
                                    className={`p-5 rounded-2xl border-2 transition-all cursor-pointer flex justify-between items-center group ${selectedCar?.carId === car.carId
                                            ? 'border-primary bg-primary/5 shadow-lg shadow-primary/10'
                                            : 'border-border/50 bg-muted/20 hover:border-primary/30'
                                        }`}
                                >
                                    <div className="flex items-center gap-4">
                                        <div className={`h-12 w-12 rounded-xl flex items-center justify-center transition-colors ${selectedCar?.carId === car.carId ? 'bg-primary text-white' : 'bg-background text-muted-foreground'}`}>
                                            <Car className="h-6 w-6" />
                                        </div>
                                        <div>
                                            <p className="font-black uppercase text-sm">{car.carModel}</p>
                                            <p className="text-[10px] font-bold text-muted-foreground uppercase">{car.carType?.carTypeName} • {car.numberPlate}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-2xl font-black text-primary flex items-center gap-1"><IndianRupee className="h-4 w-4" />{car.carType?.dailyRate}</p>
                                        <p className="text-[10px] font-bold text-muted-foreground uppercase italic">Daily Rate</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-4">
                        <Label className="text-[10px] font-black uppercase text-primary tracking-widest">Available Extras</Label>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {addOns.map(addon => {
                                const isSelected = selectedAddOns.includes(addon.addOnId);
                                const isChildSeat = addon.addOnName.toLowerCase().includes('child seat');
                                return (
                                    <div
                                        key={addon.addOnId}
                                        className={`p-4 rounded-2xl border-2 transition-all flex items-center gap-4 ${isSelected ? 'border-primary/50 bg-primary/5' : 'border-border/50 bg-muted/10'
                                            }`}
                                    >
                                        <div
                                            onClick={() => {
                                                if (isSelected) setSelectedAddOns(selectedAddOns.filter(id => id !== addon.addOnId));
                                                else setSelectedAddOns([...selectedAddOns, addon.addOnId]);
                                            }}
                                            className={`h-6 w-6 rounded-md border-2 flex items-center justify-center cursor-pointer transition-all ${isSelected ? 'bg-primary border-primary text-white' : 'border-muted-foreground/30'}`}
                                        >
                                            {isSelected && <CheckCircle2 className="h-4 w-4" />}
                                        </div>
                                        <div className="flex-grow">
                                            <div className="flex justify-between items-center">
                                                <p className="font-bold text-sm uppercase">{addon.addOnName}</p>
                                                <p className="text-primary font-black text-sm">₹{addon.addonDailyRate || addon.addOnRate}</p>
                                            </div>
                                            {isChildSeat && isSelected && (
                                                <div className="mt-2 flex items-center gap-4 animate-in slide-in-from-left-2 duration-300">
                                                    <div className="flex items-center bg-background rounded-lg border border-primary/20 p-1">
                                                        <Button variant="ghost" size="icon" onClick={() => setChildSeatQty(Math.max(1, childSeatQty - 1))} className="h-8 w-8 text-primary"><Minus className="h-3 w-3" /></Button>
                                                        <span className="w-8 text-center font-black text-sm">{childSeatQty}</span>
                                                        <Button variant="ghost" size="icon" onClick={() => setChildSeatQty(Math.min(3, childSeatQty + 1))} className="h-8 w-8 text-primary"><Plus className="h-3 w-3" /></Button>
                                                    </div>
                                                    <span className="text-[10px] font-bold text-muted-foreground uppercase">Qty</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    <div className="flex justify-between pt-6">
                        <Button variant="ghost" onClick={() => setStep(1)} className="font-black uppercase text-[10px] tracking-widest gap-2">
                            <ArrowLeft className="h-3 w-3" /> Back to Dates
                        </Button>
                        <Button
                            disabled={!selectedCar}
                            onClick={() => setStep(3)}
                            className="bg-primary px-8 h-14 rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-xl shadow-primary/20 gap-3"
                        >
                            Next: Customer Details <ArrowRight className="h-3 w-3" />
                        </Button>
                    </div>
                </div>
            )}

            {/* STEP 3: CUSTOMER */}
            {step === 3 && (
                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    {!customerDetails && !isNewCustomer ? (
                        <div className="max-w-md mx-auto space-y-6 text-center py-12">
                            <div className="space-y-4">
                                <Label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest block">Customer Email Authentication</Label>
                                <div className="relative">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                                    <Input
                                        className="h-16 pl-12 bg-muted/50 border-none rounded-2xl text-lg font-bold placeholder:text-muted-foreground"
                                        placeholder="customer@example.com"
                                        value={customerEmail}
                                        onChange={e => setCustomerEmail(e.target.value)}
                                        onKeyDown={e => e.key === 'Enter' && handleFindCustomer()}
                                    />
                                </div>
                            </div>
                            <Button onClick={handleFindCustomer} disabled={loading} className="w-full h-14 rounded-2xl bg-secondary text-secondary-foreground font-black uppercase tracking-widest text-[10px] gap-3">
                                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <><Search className="h-4 w-4" /> Find Customer</>}
                            </Button>
                            <Button variant="ghost" onClick={() => setIsNewCustomer(true)} className="text-primary font-black uppercase text-[10px] tracking-widest">
                                New Customer: Register Now
                            </Button>
                        </div>
                    ) : (
                        <div className="space-y-8">
                            {isNewCustomer ? (
                                <Card className="p-8 bg-muted/30 rounded-3xl border border-border/50 relative overflow-hidden">
                                    <div className="flex items-center gap-3 mb-6">
                                        <Plus className="h-5 w-5 text-primary" />
                                        <h3 className="text-lg font-black uppercase tracking-tight">New Customer Registration</h3>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <Label className="text-[10px] font-black uppercase text-muted-foreground">First Name</Label>
                                            <Input placeholder="First Name" className="h-12 border-none bg-background/50 font-bold" onChange={e => setNewCustomerData({ ...newCustomerData, firstName: e.target.value })} />
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="text-[10px] font-black uppercase text-muted-foreground">Last Name</Label>
                                            <Input placeholder="Last Name" className="h-12 border-none bg-background/50 font-bold" onChange={e => setNewCustomerData({ ...newCustomerData, lastName: e.target.value })} />
                                        </div>
                                        <div className="md:col-span-2 space-y-2">
                                            <Label className="text-[10px] font-black uppercase text-muted-foreground">Address</Label>
                                            <Input placeholder="Current Address" className="h-12 border-none bg-background/50 font-bold" onChange={e => setNewCustomerData({ ...newCustomerData, address: e.target.value })} />
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="text-[10px] font-black uppercase text-muted-foreground">DL Number</Label>
                                            <Input placeholder="Driving License #" className="h-12 border-none bg-background/50 font-bold" onChange={e => setNewCustomerData({ ...newCustomerData, drivingLicenseNumber: e.target.value })} />
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="text-[10px] font-black uppercase text-muted-foreground">Mobile Number</Label>
                                            <Input placeholder="Phone Number" className="h-12 border-none bg-background/50 font-bold" onChange={e => setNewCustomerData({ ...newCustomerData, mobileNumber: e.target.value })} />
                                        </div>
                                    </div>
                                    <ShieldCheck className="absolute -right-8 -bottom-8 h-48 w-48 text-primary/5 pointer-events-none" />
                                </Card>
                            ) : (
                                <div className="p-8 bg-emerald-500/5 rounded-3xl border border-emerald-500/20 flex items-center gap-6 animate-in zoom-in-95 duration-500">
                                    <div className="h-20 w-20 rounded-2xl bg-emerald-500 text-white flex items-center justify-center shadow-lg shadow-emerald-500/20">
                                        <User className="h-10 w-10" />
                                    </div>
                                    <div>
                                        <p className="text-2xl font-black uppercase tracking-tight text-emerald-600">{customerDetails.firstName} {customerDetails.lastName}</p>
                                        <div className="flex items-center gap-4 mt-1">
                                            <Badge className="bg-emerald-500 text-white border-none font-black text-[9px] uppercase tracking-widest">VERIFIED MEMBER</Badge>
                                            <span className="text-xs font-bold text-muted-foreground italic">{customerDetails.email}</span>
                                        </div>
                                    </div>
                                </div>
                            )}

                            <div className="flex flex-col md:flex-row items-center justify-between gap-6 pt-6 bg-muted/20 p-8 rounded-3xl border border-border/50">
                                <div className="text-center md:text-left">
                                    <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest mb-1">Estimated Total</p>
                                    <p className="text-4xl font-black text-primary flex items-center gap-2">
                                        <IndianRupee className="h-6 w-6" />
                                        {calculateTotalCost().toLocaleString()}
                                    </p>
                                </div>
                                <div className="flex gap-4 w-full md:w-auto">
                                    <Button variant="ghost" onClick={() => setStep(2)} className="h-16 px-6 font-black uppercase text-[10px] tracking-widest">← Back</Button>
                                    <Button
                                        className="flex-grow md:flex-none h-16 px-12 rounded-2xl bg-emerald-500 hover:bg-emerald-600 font-black uppercase tracking-widest text-[10px] shadow-xl shadow-emerald-500/20 gap-3"
                                        disabled={loading || (!customerDetails && !isNewCustomer && !newCustomerData.firstName)}
                                        onClick={handleCreateBooking}
                                    >
                                        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <><FileCheck className="h-5 w-5" /> Confirm & Handover</>}
                                    </Button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default StaffBookingWizard;
