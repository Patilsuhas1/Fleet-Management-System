import React, { useState } from 'react';
import ApiService from '../../services/api';
import StaffBookingWizard from '../../components/staff/StaffBookingWizard';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    Activity,
    Ship,
    ArrowRight,
    CheckCircle2,
    Car,
    Fuel,
    ClipboardList,
    Calendar,
    User,
    Key,
    Loader2,
    X,
    QrCode,
    Info,
    CheckCircle,
    Hash,
    MapPin
} from "lucide-react";

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
            // Extract hubId and carTypeId from bookingDetails (using new flat fields from DTO)
            const hubId = bookingDetails.pickupHubId || 1;
            const carTypeId = bookingDetails.carTypeId || null;

            const cars = await ApiService.getAvailableCars(hubId, bookingDetails.startDate, bookingDetails.endDate, carTypeId);
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
            carId: selectedCar ? selectedCar.carId : null,
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
            const data = await ApiService.getBooking(bookingId);
            setBookingDetails(data);

            if (data.bookingStatus !== 'ACTIVE') {
                setMessage({ type: 'warning', text: `This booking is ${data.bookingStatus}. Only ACTIVE bookings can be returned.` });
                setLoading(false);
                return;
            }

            setActiveTab('return');
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
        <div className="min-h-screen bg-muted/30 py-12">
            <div className="container mx-auto px-6 max-w-6xl text-center">
                <div className="mb-12 animate-in fade-in slide-in-from-top-4 duration-700">
                    <div className="flex items-center justify-center gap-2 text-primary font-black uppercase text-[10px] tracking-widest mb-3">
                        <Activity className="h-4 w-4" /> Operational Management Center
                    </div>
                    <h1 className="text-4xl md:text-5xl font-black tracking-tight uppercase">
                        Staff <span className="text-primary italic">Dashboard</span>
                    </h1>
                    <p className="text-muted-foreground mt-2 font-medium">Manage vehicle handovers, returns, and reservations.</p>
                </div>

                {!showModal && (
                    <Card className="border-none shadow-2xl bg-card overflow-hidden text-left mx-auto max-w-4xl">
                        <CardHeader className="p-0 border-b border-border/50 bg-muted/50">
                            <Tabs value={activeTab} onValueChange={(v) => { if (!loading) setActiveTab(v); }} className="w-full">
                                <TabsList className="w-full h-20 bg-transparent rounded-none p-4 gap-4">
                                    <TabsTrigger value="handover" className="flex-1 rounded-xl font-black uppercase text-[10px] tracking-widest h-12 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-lg shadow-primary/20 transition-all gap-2">
                                        <Key className="h-3.5 w-3.5" /> Handover
                                    </TabsTrigger>
                                    <TabsTrigger value="return" className="flex-1 rounded-xl font-black uppercase text-[10px] tracking-widest h-12 data-[state=active]:bg-emerald-600 data-[state=active]:text-white data-[state=active]:shadow-lg shadow-emerald-500/20 transition-all gap-2">
                                        <Ship className="h-3.5 w-3.5" /> Return
                                    </TabsTrigger>
                                    <TabsTrigger value="booking" className="flex-1 rounded-xl font-black uppercase text-[10px] tracking-widest h-12 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-lg shadow-primary/20 transition-all gap-2">
                                        <Calendar className="h-3.5 w-3.5" /> Instant Res
                                    </TabsTrigger>
                                </TabsList>
                            </Tabs>
                        </CardHeader>
                        <CardContent className="p-12">
                            {activeTab === 'booking' ? (
                                <StaffBookingWizard onClose={() => setActiveTab('handover')} />
                            ) : (
                                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
                                    {message.text && (
                                        <div className={`p-4 rounded-xl border flex items-center justify-between gap-4 ${message.type === 'success' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-600' :
                                            message.type === 'info' ? 'bg-blue-500/10 border-blue-500/20 text-blue-600' :
                                                'bg-destructive/10 border-destructive/20 text-destructive'
                                            }`}>
                                            <div className="flex items-center gap-3 font-bold text-sm">
                                                {message.type === 'success' ? <CheckCircle2 className="h-5 w-5" /> : <Info className="h-5 w-5" />}
                                                {message.text}
                                            </div>
                                            <Button variant="ghost" size="icon" onClick={() => setMessage({ type: '', text: '' })} className="hover:bg-transparent h-8 w-8">
                                                <X className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    )}

                                    <div className="max-w-md mx-auto space-y-8">
                                        <div className="text-center">
                                            <Label className="text-[10px] font-black uppercase text-muted-foreground tracking-[0.2em] mb-4 block">
                                                {activeTab === 'handover' ? 'Enter Booking ID' : 'Enter Booking ID for Return'}
                                            </Label>
                                            <div className="relative group">
                                                <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none">
                                                    <Hash className="h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                                                </div>
                                                <Input
                                                    type="number"
                                                    placeholder="e.g. 101"
                                                    value={bookingId}
                                                    onChange={(e) => setBookingId(e.target.value)}
                                                    className="h-16 pl-16 bg-muted/30 border-none rounded-2xl text-2xl font-black text-center placeholder:text-muted-foreground placeholder:text-lg focus-visible:ring-primary focus-visible:ring-offset-0 shadow-inner"
                                                />
                                            </div>
                                        </div>

                                        <Button
                                            className={`w-full h-16 rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl transition-all gap-3 ${activeTab === 'handover' ? 'bg-primary shadow-primary/20' : 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-500/20'
                                                }`}
                                            onClick={() => activeTab === 'handover' ? handleFetchBooking() : handleReturn()}
                                            disabled={loading || !bookingId}
                                        >
                                            {loading ? (
                                                <><Loader2 className="h-5 w-5 animate-spin" /> Processing...</>
                                            ) : (
                                                <>{activeTab === 'handover' ? 'Initiate Handover' : 'Finalize Return'} <ArrowRight className="h-4 w-4" /></>
                                            )}
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                )}

                {showModal && (
                    <Card className="border-none shadow-2xl bg-card overflow-hidden text-left mx-auto max-w-4xl animate-in zoom-in-95 duration-300">
                        <CardHeader className={`${activeTab === 'handover' ? 'bg-primary' : 'bg-emerald-600'} p-6 text-white`}>
                            <div className="flex justify-between items-center">
                                <h4 className="text-xl font-black uppercase tracking-tight m-0">{activeTab === 'handover' ? 'Vehicle Handover' : 'Vehicle Return'}</h4>
                                <Button variant="ghost" size="icon" onClick={() => setShowModal(false)} className="text-white hover:bg-white/10 h-8 w-8">
                                    <X className="h-5 w-5" />
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent className="p-8">
                            {!showCarSelection ? (
                                <div className="space-y-8 animate-in fade-in duration-300">
                                    {/* Booking Details Box - Consistent with original 2x2 layout */}
                                    <div className="p-6 bg-muted rounded-2xl border border-border/50">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest mb-1">Confirmation</p>
                                                <p className="font-bold text-sm"># {bookingDetails?.confirmationNumber}</p>
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest mb-1">Dates</p>
                                                <p className="font-bold text-sm">{bookingDetails?.startDate} — {bookingDetails?.endDate}</p>
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest mb-1">Customer</p>
                                                <p className="font-bold text-sm capitalize">{bookingDetails?.customerName}</p>
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest mb-1">Vehicle</p>
                                                <p className={`font-bold text-sm ${!selectedCar && activeTab === 'handover' ? 'text-destructive' : ''}`}>
                                                    {selectedCar ? selectedCar.carName : (activeTab === 'handover' ? 'Selection Required' : bookingDetails?.carName)}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Form Fields */}
                                    <div className="space-y-6">
                                        {activeTab === 'handover' && (
                                            <div className="space-y-3">
                                                <Label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Assign Vehicle</Label>
                                                <div className="flex gap-3">
                                                    <Input
                                                        readOnly
                                                        className={`h-12 bg-muted/50 border-2 font-bold ${!selectedCar ? 'border-destructive/20' : 'border-primary/20'}`}
                                                        value={selectedCar ? selectedCar.carName : ''}
                                                        placeholder="Please select a vehicle..."
                                                    />
                                                    <Button variant="outline" onClick={handleLoadCars} className="h-12 border-primary text-primary hover:bg-primary hover:text-white font-bold px-6">
                                                        Select Car
                                                    </Button>
                                                </div>
                                            </div>
                                        )}

                                        <div className="space-y-3">
                                            <Label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Fuel Status</Label>
                                            <div className="flex flex-wrap gap-4">
                                                {['1/4', '1/2', '3/4', 'Full'].map(level => (
                                                    <div key={level} className="flex items-center space-x-2">
                                                        <input
                                                            type="radio"
                                                            id={level}
                                                            name="fuelStatus"
                                                            className="w-4 h-4 text-primary accent-primary"
                                                            checked={fuelStatus === level}
                                                            onChange={() => setFuelStatus(level)}
                                                        />
                                                        <label htmlFor={level} className="text-sm font-bold cursor-pointer">{level}</label>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="space-y-3">
                                            <Label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Notes / Remarks</Label>
                                            <textarea
                                                className="w-full min-h-[100px] bg-muted/30 border border-border/50 rounded-2xl p-4 text-sm font-medium focus:ring-2 focus:ring-primary focus:outline-none"
                                                placeholder="Enter any scratches, dents, or other observations..."
                                                value={notes}
                                                onChange={e => setNotes(e.target.value)}
                                            ></textarea>
                                        </div>
                                    </div>

                                    <div className="flex justify-between items-center pt-4 border-t border-border/50">
                                        <Button variant="ghost" onClick={() => setShowModal(false)} className="font-bold text-muted-foreground">Cancel</Button>
                                        <Button
                                            className={`h-14 px-12 rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-xl gap-3 ${activeTab === 'handover' ? 'bg-primary shadow-primary/20' : 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-500/20'
                                                }`}
                                            onClick={activeTab === 'handover' ? handleCompleteHandover : handleCompleteReturn}
                                            disabled={loading || (activeTab === 'handover' && !selectedCar)}
                                        >
                                            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : (activeTab === 'handover' ? 'Complete Handover' : 'Complete Return')}
                                        </Button>
                                    </div>
                                </div>
                            ) : (
                                // CAR SELECTION VIEW (Full Content Replacement consistency)
                                <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
                                    <div className="flex items-center justify-between">
                                        <h5 className="text-lg font-black uppercase tracking-tight">Select Available Vehicle</h5>
                                        <Button variant="ghost" size="sm" onClick={() => setShowCarSelection(false)} className="h-8 px-3 text-[10px] font-black text-muted-foreground">BACK</Button>
                                    </div>
                                    <div className="grid gap-3 max-h-[400px] overflow-y-auto pr-2 scrollbar-thin">
                                        {availableCars.map(car => (
                                            <div
                                                key={car.carId}
                                                onClick={() => { setSelectedCar(car); setShowCarSelection(false); }}
                                                className={`p-4 rounded-xl border-2 transition-all cursor-pointer flex justify-between items-center ${selectedCar?.carId === car.carId
                                                    ? 'border-primary bg-primary/5'
                                                    : 'border-border/50 bg-background hover:bg-muted/30'
                                                    }`}
                                            >
                                                <div>
                                                    <p className="font-black text-sm uppercase">{car.carName} ({car.numberPlate})</p>
                                                    <p className="text-[10px] font-bold text-muted-foreground uppercase">{car.carType?.carTypeName}</p>
                                                </div>
                                                <Badge variant="outline" className="text-[10px] font-black uppercase">Available</Badge>
                                            </div>
                                        ))}
                                        {availableCars.length === 0 && (
                                            <div className="p-12 text-center bg-muted/30 rounded-2xl">
                                                <Info className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                                                <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest">No available cars found for these dates at this hub.</p>
                                            </div>
                                        )}
                                    </div>
                                    <Button variant="outline" onClick={() => setShowCarSelection(false)} className="w-full h-12 rounded-xl border-dashed border-2 font-black uppercase text-[10px] tracking-widest text-muted-foreground hover:bg-transparent">
                                        Return to Form
                                    </Button>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
    );
};

export default StaffDashboard;
