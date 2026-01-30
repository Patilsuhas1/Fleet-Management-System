import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ApiService from '../../services/api';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    ArrowLeft,
    RotateCw,
    Search,
    Gauge,
    CheckCircle2,
    XCircle,
    Inbox,
    ChevronRight,
    MapPin,
    Calendar,
    IndianRupee,
    User,
    Car,
    ExternalLink,
    Filter,
    Clock,
    LayoutGrid,
    Hash
} from "lucide-react";

const AdminBookings = () => {
    const navigate = useNavigate();
    const [bookings, setBookings] = useState([]);
    const [bookingFilter, setBookingFilter] = useState('ALL');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    useEffect(() => {
        loadBookings();
    }, []);

    const loadBookings = async () => {
        setLoading(true);
        try {
            const data = await ApiService.getAllBookings();
            console.log("Loaded bookings:", data);
            setBookings(data || []);
        } catch (e) {
            console.error("Failed to load bookings:", e);
            setMessage({ type: 'danger', text: 'Failed to synchronize booking data.' });
        } finally {
            setLoading(false);
        }
    };

    const filteredBookings = bookings.filter(b => {
        if (bookingFilter === 'ALL') return true;
        if (bookingFilter === 'ACTIVE') return b.bookingStatus === 'CONFIRMED' || b.bookingStatus === 'ALLOTTED';
        return b.bookingStatus === bookingFilter;
    });

    const getStatusStyles = (status) => {
        switch (status) {
            case 'CONFIRMED': return 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20';
            case 'ALLOTTED': return 'bg-amber-500/10 text-amber-600 border-amber-500/20';
            case 'COMPLETED': return 'bg-blue-500/10 text-blue-600 border-blue-500/20';
            case 'CANCELLED': return 'bg-destructive/10 text-destructive border-destructive/20';
            default: return 'bg-slate-500/10 text-slate-600 border-slate-500/20';
        }
    };

    return (
        <div className="min-h-screen bg-muted/30 py-12">
            <div className="container mx-auto px-6">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6 animate-in fade-in slide-in-from-top-4 duration-700">
                    <div>
                        <Button
                            variant="ghost"
                            onClick={() => navigate('/admin/dashboard')}
                            className="p-0 hover:bg-transparent text-primary font-black uppercase text-[10px] tracking-widest gap-2 mb-3 h-auto"
                        >
                            <ArrowLeft className="h-3 w-3" /> Back to Console
                        </Button>
                        <h1 className="text-4xl md:text-5xl font-black tracking-tight uppercase">
                            Booking <span className="text-primary italic">Intelligence</span>
                        </h1>
                        <p className="text-muted-foreground mt-2 font-medium">Surveillance and orchestration of real-time fleet reservations.</p>
                    </div>
                    <div className="flex items-center gap-4 w-full md:w-auto">
                        <Button
                            onClick={loadBookings}
                            disabled={loading}
                            variant="outline"
                            className="rounded-xl h-12 px-6 font-black uppercase text-[10px] tracking-widest bg-background border-border/50 shadow-sm gap-2"
                        >
                            <RotateCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin text-primary' : ''}`} />
                            Sync Data
                        </Button>
                    </div>
                </div>

                {message.text && (
                    <div className="mb-8 p-4 bg-destructive/10 border border-destructive/20 text-destructive rounded-2xl flex items-center gap-3 animate-in slide-in-from-right-4 duration-500">
                        <XCircle className="h-5 w-5" />
                        <span className="font-bold text-sm tracking-tight">{message.text}</span>
                    </div>
                )}

                {/* KPI Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                    {[
                        { label: 'Total Volume', value: bookings.length, icon: LayoutGrid, color: 'primary', border: 'border-primary' },
                        { label: 'Active Tasks', value: bookings.filter(b => b.bookingStatus === 'CONFIRMED' || b.bookingStatus === 'ALLOTTED').length, icon: Gauge, color: 'amber-500', border: 'border-amber-500' },
                        { label: 'Completed', value: bookings.filter(b => b.bookingStatus === 'COMPLETED').length, icon: CheckCircle2, color: 'emerald-500', border: 'border-emerald-500' },
                        { label: 'Cancelled', value: bookings.filter(b => b.bookingStatus === 'CANCELLED').length, icon: XCircle, color: 'destructive', border: 'border-destructive' }
                    ].map((kpi, i) => (
                        <Card key={i} className={`border-none shadow-lg bg-card border-l-4 ${kpi.border} overflow-hidden hover:-translate-y-1 transition-transform`}>
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between">
                                    <div className={`h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary`}>
                                        <kpi.icon className="h-6 w-6" />
                                    </div>
                                    <div className="text-right">
                                        <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">{kpi.label}</p>
                                        <p className="text-3xl font-black tabular-nums">{kpi.value}</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* Main Table Container */}
                <Card className="border-none shadow-2xl bg-card overflow-hidden">
                    <CardHeader className="p-8 bg-muted/50 border-bottom border-border/50 flex flex-col sm:flex-row items-center justify-between gap-6">
                        <div className="flex items-center gap-3">
                            <Badge variant="secondary" className="bg-primary/10 text-primary border-none font-black text-[10px] uppercase px-4 py-1.5 h-7">
                                {filteredBookings.length} Records Detected
                            </Badge>
                        </div>
                        <div className="flex bg-background p-1.5 rounded-2xl border border-border/50 shadow-inner">
                            {['ALL', 'ACTIVE', 'COMPLETED', 'CANCELLED'].map(filter => (
                                <Button
                                    key={filter}
                                    variant={bookingFilter === filter ? "default" : "ghost"}
                                    size="sm"
                                    className={`rounded-xl px-4 font-black uppercase text-[9px] tracking-widest h-9 ${bookingFilter === filter ? 'shadow-md shadow-primary/20' : 'text-muted-foreground'}`}
                                    onClick={() => setBookingFilter(filter)}
                                >
                                    {filter}
                                </Button>
                            ))}
                        </div>
                    </CardHeader>
                    <CardContent className="p-0">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse min-w-[1000px]">
                                <thead className="bg-muted/30">
                                    <tr className="text-[10px] font-black uppercase tracking-widest text-muted-foreground border-b border-border/50">
                                        <th className="px-8 py-5">Confirmation</th>
                                        <th className="px-6 py-5">Stakeholder</th>
                                        <th className="px-6 py-5">Vehicle Deployment</th>
                                        <th className="px-6 py-5">Logistics Hubs</th>
                                        <th className="px-6 py-5 text-center">Protocol Status</th>
                                        <th className="px-8 py-5 text-right">Settlement</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredBookings.map((b) => (
                                        <tr key={b.bookingId} className="border-b border-border/50 hover:bg-muted/20 transition-colors group">
                                            <td className="px-8 py-6">
                                                <div className="flex items-center gap-3">
                                                    <div className="h-8 w-8 rounded-lg bg-primary/5 flex items-center justify-center text-primary border border-primary/10 font-mono text-xs">
                                                        #
                                                    </div>
                                                    <span className="font-mono text-sm font-black text-primary group-hover:underline underline-offset-4 cursor-pointer">{b.confirmationNumber}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-6">
                                                <div className="flex items-center gap-3">
                                                    <div className="h-9 w-9 rounded-full bg-muted flex items-center justify-center">
                                                        <User className="h-4 w-4 text-muted-foreground" />
                                                    </div>
                                                    <div>
                                                        <p className="font-black text-sm uppercase leading-tight">{b.customerName}</p>
                                                        <p className="text-[10px] text-muted-foreground font-bold">{b.email}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-6 font-medium">
                                                <div className="flex items-center gap-3">
                                                    <Car className="h-4 w-4 text-muted-foreground" />
                                                    <div>
                                                        <p className="font-bold text-sm">{b.carName}</p>
                                                        <Badge variant="outline" className="text-[9px] uppercase font-bold py-0 h-4 border-dashed border-border text-muted-foreground">
                                                            {b.numberPlate || 'ID: NOT-ALLOTTED'}
                                                        </Badge>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-6">
                                                <div className="space-y-1.5">
                                                    <div className="flex items-center gap-2 text-xs font-bold whitespace-nowrap">
                                                        <div className="h-1.5 w-1.5 rounded-full bg-emerald-500"></div>
                                                        <span className="text-muted-foreground uppercase tracking-tighter">Origin:</span>
                                                        <span className="text-foreground">{b.pickupHub}</span>
                                                    </div>
                                                    <div className="flex items-center gap-2 text-xs font-bold whitespace-nowrap">
                                                        <div className="h-1.5 w-1.5 rounded-full bg-amber-500"></div>
                                                        <span className="text-muted-foreground uppercase tracking-tighter">Dest:</span>
                                                        <span className="text-foreground">{b.returnHub}</span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-6 text-center">
                                                <Badge className={`font-black text-[9px] uppercase tracking-widest border px-3 py-1 rounded-full ${getStatusStyles(b.bookingStatus)}`}>
                                                    {b.bookingStatus}
                                                </Badge>
                                            </td>
                                            <td className="px-8 py-6 text-right">
                                                <p className="font-black text-lg flex items-center justify-end gap-1">
                                                    <IndianRupee className="h-3.5 w-3.5 text-primary" />
                                                    {b.totalAmount?.toLocaleString() || '0'}
                                                </p>
                                                <p className="text-[10px] font-bold text-muted-foreground uppercase -mt-1">Settled</p>
                                            </td>
                                        </tr>
                                    ))}
                                    {filteredBookings.length === 0 && (
                                        <tr>
                                            <td colSpan="6" className="py-24 text-center">
                                                <div className="flex flex-col items-center opacity-30">
                                                    <Inbox className="h-20 w-20 mb-6" />
                                                    <h3 className="text-3xl font-black uppercase italic tracking-tighter">Zero Data Found</h3>
                                                    <p className="text-lg font-bold">The registry is currently void for this filter.</p>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default AdminBookings;
