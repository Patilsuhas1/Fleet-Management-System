import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import ApiService from '../../services/api';
import AuthService from '../../services/authService';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import {
    CalendarCheck,
    Car,
    Clock,
    ArrowRight,
    AlertCircle,
    Loader2,
    Plus,
    FileSearch,
    IndianRupee
} from "lucide-react";

const MyBookings = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserBookings = async () => {
            const user = AuthService.getCurrentUser();
            if (!user || (!user.email && !user.username)) {
                setError('Please log in to view your reservations.');
                setLoading(false);
                return;
            }

            try {
                const email = user.email || user.username;
                const data = await ApiService.getBookingsByUser(email);
                setBookings(data);
            } catch (err) {
                console.error('Failed to fetch bookings:', err);
                setError('Could not load your reservations from the server.');
                const savedBookings = JSON.parse(localStorage.getItem('myBookings') || '[]');
                if (savedBookings.length > 0) {
                    setBookings(savedBookings);
                }
            } finally {
                setLoading(false);
            }
        };

        fetchUserBookings();
    }, []);

    const getStatusVariant = (status) => {
        switch (status?.toLowerCase()) {
            case 'confirmed': return 'default';
            case 'active': return 'secondary';
            case 'completed': return 'outline';
            case 'cancelled': return 'destructive';
            default: return 'outline';
        }
    };

    const calculateTotal = (booking) => {
        if (booking.totalAmount) return booking.totalAmount.toLocaleString();
        try {
            const start = new Date(booking.startDate);
            const end = new Date(booking.endDate);
            const diffTime = Math.abs(end - start);
            const diffDays = Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
            const rate = booking.dailyRate || 2500;
            return (diffDays * rate).toLocaleString();
        } catch (e) {
            return (booking.dailyRate || 2500).toLocaleString();
        }
    };

    return (
        <div className="min-h-screen bg-background py-12">
            <div className="container mx-auto px-4">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-6">
                    <div>
                        <h1 className="text-4xl font-extrabold tracking-tight mb-2 text-foreground">
                            My <span className="text-primary">Reservations</span>
                        </h1>
                        <p className="text-muted-foreground">Manage your upcoming and past journeys in one place.</p>
                    </div>
                    <Link to="/booking">
                        <Button className="rounded-full px-6 gap-2">
                            <Plus className="h-4 w-4" /> New Booking
                        </Button>
                    </Link>
                </div>

                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20 gap-4">
                        <Loader2 className="h-10 w-10 text-primary animate-spin" />
                        <p className="text-muted-foreground animate-pulse">Fetching your itineraries...</p>
                    </div>
                ) : error ? (
                    <div className="max-w-md mx-auto text-center py-20">
                        <div className="bg-destructive/10 p-6 rounded-3xl mb-6">
                            <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
                            <h3 className="text-xl font-bold mb-2">{error}</h3>
                            <p className="text-muted-foreground mb-6">There was a problem syncing with our fleet servers.</p>
                            <Link to="/login">
                                <Button variant="outline" className="rounded-full px-8">Return to Login</Button>
                            </Link>
                        </div>
                    </div>
                ) : bookings.length > 0 ? (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {bookings.map((booking, index) => (
                            <Card key={booking.bookingId || index} className="group border-none shadow-lg hover:shadow-xl transition-all duration-300 bg-card overflow-hidden">
                                <CardContent className="p-0">
                                    <div className="p-6 md:p-8">
                                        <div className="flex justify-between items-start mb-6">
                                            <div className="flex gap-4 items-center">
                                                <div className="h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                                                    <CalendarCheck className="h-7 w-7" />
                                                </div>
                                                <div>
                                                    <h3 className="text-xl font-bold">Booking #{booking.bookingId}</h3>
                                                    <p className="text-sm text-muted-foreground font-mono">Ref: {booking.confirmationNumber}</p>
                                                </div>
                                            </div>
                                            <Badge variant={getStatusVariant(booking.bookingStatus || 'Confirmed')} className="px-3 py-1 rounded-full uppercase text-[10px] tracking-wider font-bold">
                                                {booking.bookingStatus || 'Confirmed'}
                                            </Badge>
                                        </div>

                                        <div className="grid grid-cols-2 gap-4 mb-8">
                                            <div className="space-y-1.5 p-4 rounded-2xl bg-muted/50 border border-border/50">
                                                <Label className="text-xs text-muted-foreground uppercase flex items-center gap-1.5">
                                                    <Car className="h-3 w-3" /> Vehicle
                                                </Label>
                                                <p className="font-bold text-foreground truncate">{booking.carName || 'Premium Vehicle'}</p>
                                            </div>
                                            <div className="space-y-1.5 p-4 rounded-2xl bg-muted/50 border border-border/50">
                                                <Label className="text-xs text-muted-foreground uppercase flex items-center gap-1.5">
                                                    <Clock className="h-3 w-3" /> Duration
                                                </Label>
                                                <p className="font-bold text-foreground whitespace-nowrap overflow-hidden text-ellipsis">
                                                    {booking.startDate} - {booking.endDate}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between pt-6 border-t">
                                            <div className="flex flex-col">
                                                <span className="text-xs text-muted-foreground uppercase tracking-widest font-bold mb-1">Total Paid</span>
                                                <div className="flex items-center text-2xl font-black text-primary">
                                                    <IndianRupee className="h-5 w-5" />
                                                    {calculateTotal(booking)}
                                                </div>
                                            </div>
                                            <Link to={`/manage-booking?id=${booking.bookingId}`}>
                                                <Button variant="ghost" className="rounded-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                                                    Manage <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                                                </Button>
                                            </Link>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                ) : (
                    <div className="max-w-2xl mx-auto text-center py-24">
                        <div className="bg-muted/30 rounded-[3rem] p-12 border border-dashed">
                            <FileSearch className="h-20 w-20 text-muted-foreground/30 mx-auto mb-6" />
                            <h3 className="text-3xl font-bold mb-4">No Bookings Found</h3>
                            <p className="text-muted-foreground mb-10 text-lg">
                                You haven't made any reservations yet. Start your journey by exploring our premium fleet.
                            </p>
                            <Link to="/booking">
                                <Button size="lg" className="rounded-full px-12 h-14 text-lg font-bold shadow-xl shadow-primary/20">
                                    Browse Cars
                                </Button>
                            </Link>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MyBookings;
