import React, { useState, useEffect } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import ApiService from '../../services/api';
import AuthService from '../../services/authService';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
    Calendar,
    Car,
    MapPin,
    IndianRupee,
    Printer,
    XCircle,
    ArrowLeft,
    Search,
    ChevronDown,
    ShieldCheck,
    Loader2
} from "lucide-react";

const ManageBooking = () => {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const bookingId = queryParams.get('id');

    const [booking, setBooking] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [searchInput, setSearchInput] = useState('');

    const navigate = useNavigate();

    useEffect(() => {
        const user = AuthService.getCurrentUser();
        if (!user) {
            navigate('/login');
            return;
        }

        if (!bookingId) {
            setLoading(false);
            return;
        }

        const fetchBooking = async () => {
            setLoading(true);
            setError('');
            try {
                const data = await ApiService.getBooking(bookingId);
                setBooking(data);
            } catch (err) {
                const saved = JSON.parse(localStorage.getItem('myBookings') || '[]');
                const localBooking = saved.find(b => String(b.bookingId) === String(bookingId));

                if (localBooking) {
                    setBooking(localBooking);
                } else {
                    setError('Failed to retrieve booking details. It might not exist or the server is down.');
                }
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchBooking();
    }, [bookingId, navigate]);

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchInput) {
            navigate(`/manage-booking?id=${searchInput}`);
        }
    };

    const calculateTotal = () => {
        if (booking?.totalAmount) return booking.totalAmount.toLocaleString();
        return 'Calculated';
    };

    const handleCancel = async () => {
        if (!window.confirm('Are you sure you want to cancel this reservation? This action cannot be undone.')) {
            return;
        }

        setLoading(true);
        setError('');
        try {
            const updatedBooking = await ApiService.cancelBooking(booking.bookingId);
            setBooking(updatedBooking);
            alert('Your reservation has been successfully cancelled.');
        } catch (err) {
            console.error('Cancellation failed:', err);
            setError('Failed to cancel the booking. Please contact support.');
        } finally {
            setLoading(false);
        }
    };

    if (loading) return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
            <Loader2 className="h-10 w-10 text-primary animate-spin" />
            <p className="text-muted-foreground animate-pulse">Syncing reservation details...</p>
        </div>
    );

    if (error || (!booking && !loading)) {
        return (
            <div className="container mx-auto px-4 py-20 flex justify-center">
                <Card className="max-w-md w-full border-none shadow-2xl bg-card/50 backdrop-blur-xl">
                    <CardHeader className="text-center pb-2">
                        <div className="h-20 w-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Search className="h-10 w-10 text-primary" />
                        </div>
                        <CardTitle className="text-3xl font-black">Manage <span className="text-primary">Trip</span></CardTitle>
                        <CardDescription>Enter your reference number to view status or print invoice.</CardDescription>
                    </CardHeader>
                    <CardContent className="pt-6">
                        {error && (
                            <div className="bg-destructive/10 text-destructive text-sm p-4 rounded-2xl mb-6 flex items-start gap-3">
                                <XCircle className="h-5 w-5 shrink-0" />
                                <span>{error}</span>
                            </div>
                        )}
                        <form onSubmit={handleSearch} className="space-y-6">
                            <div className="relative">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                                <input
                                    type="text"
                                    className="w-full bg-muted/50 border-none rounded-2xl py-4 pl-12 pr-4 focus:ring-2 focus:ring-primary transition-all text-lg font-medium"
                                    placeholder="Reservation ID (e.g. 1024)"
                                    value={searchInput}
                                    onChange={(e) => setSearchInput(e.target.value)}
                                />
                            </div>
                            <Button className="w-full h-14 rounded-2xl text-lg font-bold shadow-lg shadow-primary/25">
                                Search Itinerary
                            </Button>
                        </form>
                        <div className="mt-10 pt-8 border-t text-center">
                            <p className="text-sm text-muted-foreground mb-4">Can't find your ID?</p>
                            <Link to="/my-bookings">
                                <Button variant="outline" className="rounded-full px-8">View History</Button>
                            </Link>
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }

    const isCancelled = booking.bookingStatus === 'CANCELLED';
    const isCompleted = booking.bookingStatus === 'COMPLETED';

    return (
        <div className="min-h-screen bg-background py-16">
            <div className="container mx-auto px-4">
                <div className="max-w-4xl mx-auto">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
                        <Link to="/my-bookings">
                            <Button variant="ghost" className="gap-2 text-muted-foreground hover:text-foreground">
                                <ArrowLeft className="h-4 w-4" /> Back to Reservations
                            </Button>
                        </Link>
                        <Badge variant={isCancelled ? "destructive" : (isCompleted ? "secondary" : "default")} className="px-6 py-2 rounded-full font-bold uppercase tracking-widest text-xs">
                            {booking.bookingStatus || 'Confirmed'}
                        </Badge>
                    </div>

                    <Card className="border-none shadow-2xl overflow-hidden bg-card/80 backdrop-blur-md">
                        <div className="bg-primary/5 p-8 md:p-12 text-center border-b border-primary/10">
                            <h1 className="text-4xl md:text-5xl font-black mb-2 tracking-tight">Trip <span className="text-primary">Summary</span></h1>
                            <p className="text-muted-foreground font-mono text-lg">REFERENCE: #{booking.bookingId}</p>
                        </div>

                        <CardContent className="p-8 md:p-12">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                                <div className="space-y-6">
                                    <div className="flex gap-5">
                                        <div className="h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
                                            <Car className="h-7 w-7" />
                                        </div>
                                        <div>
                                            <Label className="text-xs text-muted-foreground uppercase tracking-widest font-bold mb-1 block">Selected Fleet</Label>
                                            <h3 className="text-2xl font-black">{booking.carName || 'Premium Vehicle'}</h3>
                                            <p className="text-sm text-muted-foreground">Automatic • {booking.fuelType || 'Petrol'} • {booking.seatingCapacity || '5'} Seats</p>
                                        </div>
                                    </div>

                                    <div className="flex gap-5">
                                        <div className="h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
                                            <MapPin className="h-7 w-7" />
                                        </div>
                                        <div>
                                            <Label className="text-xs text-muted-foreground uppercase tracking-widest font-bold mb-1 block">Operation Hub</Label>
                                            <h3 className="text-xl font-bold">{booking.pickupHubId || 'Gateway Hub'}</h3>
                                            <p className="text-sm text-muted-foreground">Main Terminal, IndiaDrive Plaza</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-muted/30 p-8 rounded-[2rem] border border-border/50">
                                    <Label className="text-xs text-muted-foreground uppercase tracking-widest font-bold mb-6 block text-center">Rental Schedule</Label>
                                    <div className="flex flex-col items-center gap-4">
                                        <div className="text-center">
                                            <p className="text-sm text-muted-foreground mb-1">Pickup</p>
                                            <p className="text-xl font-black">{booking.startDate}</p>
                                        </div>
                                        <ChevronDown className="text-primary/40 h-6 w-6" />
                                        <div className="text-center">
                                            <p className="text-sm text-muted-foreground mb-1">Return</p>
                                            <p className="text-xl font-black">{booking.endDate}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-card border-2 border-primary/10 rounded-[2.5rem] p-8 md:p-10 mb-12 shadow-sm relative overflow-hidden">
                                <div className="absolute top-0 right-0 p-8 opacity-5">
                                    <ShieldCheck className="h-32 w-32" />
                                </div>

                                <h3 className="text-2xl font-black mb-8 flex items-center gap-3">
                                    <IndianRupee className="h-6 w-6 text-primary" /> Financial Overview
                                </h3>

                                <div className="space-y-5">
                                    {(() => {
                                        const start = new Date(booking.startDate);
                                        const end = new Date(booking.endDate);
                                        const days = Math.max(1, Math.ceil(Math.abs(end - start) / (1000 * 60 * 60 * 24)));
                                        const baseRentalTotal = (booking.dailyRate || 0) * days;
                                        const addonTotal = booking.totalAddonAmount || 0;

                                        return (
                                            <>
                                                <div className="flex justify-between items-center text-muted-foreground">
                                                    <span className="text-sm uppercase tracking-wider">Duration</span>
                                                    <span className="font-bold text-foreground">{days} Day{days > 1 ? 's' : ''}</span>
                                                </div>
                                                <div className="flex justify-between items-center">
                                                    <div>
                                                        <span className="text-sm uppercase tracking-wider text-muted-foreground block">Base Rental ({days}D)</span>
                                                        <span className="text-xs text-muted-foreground">₹{booking.dailyRate?.toLocaleString()}/day</span>
                                                    </div>
                                                    <span className="text-xl font-bold">₹{baseRentalTotal.toLocaleString()}</span>
                                                </div>
                                                <div className="flex justify-between items-center">
                                                    <span className="text-sm uppercase tracking-wider text-muted-foreground">Add-on Services</span>
                                                    <span className="text-xl font-bold">₹{addonTotal.toLocaleString()}</span>
                                                </div>
                                            </>
                                        );
                                    })()}

                                    <Separator className="my-6 bg-primary/10" />

                                    <div className="flex justify-between items-center">
                                        <span className="text-xl font-black uppercase tracking-tighter">Amount Paid</span>
                                        <span className="text-4xl font-black text-primary flex items-center tracking-tighter">
                                            <IndianRupee className="h-8 w-8" />
                                            {calculateTotal()}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <Button
                                    className="h-16 rounded-2xl bg-destructive/10 text-destructive hover:bg-destructive hover:text-destructive-foreground transition-all font-bold text-lg"
                                    onClick={handleCancel}
                                    disabled={isCancelled || isCompleted}
                                >
                                    <XCircle className="mr-2 h-5 w-5" />
                                    {isCancelled ? 'Booking Reference Nullified' : 'Abort Reservation'}
                                </Button>
                                <Button
                                    className="h-16 rounded-2xl bg-primary text-primary-foreground shadow-lg shadow-primary/25 font-bold text-lg"
                                    onClick={() => window.print()}
                                    disabled={isCancelled}
                                >
                                    <Printer className="mr-2 h-5 w-5" />
                                    Generate Invoice
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default ManageBooking;
