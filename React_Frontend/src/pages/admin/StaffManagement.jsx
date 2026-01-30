import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ApiService from '../../services/api';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
    Users,
    UserPlus,
    ArrowLeft,
    Trash2,
    MapPin,
    Mail,
    Lock,
    ShieldCheck,
    Loader2,
    UserCheck,
    Search,
    ShieldAlert,
    LayoutGrid
} from "lucide-react";

const StaffManagement = () => {
    const navigate = useNavigate();
    const [staffList, setStaffList] = useState([]);
    const [hubs, setHubs] = useState([]);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    const [newStaff, setNewStaff] = useState({
        username: '',
        email: '',
        password: '',
        hub: { hubId: '' }
    });

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setLoading(true);
        try {
            const [staffData, hubData] = await Promise.all([
                ApiService.getAdminStaff(),
                ApiService.getAdminHubs()
            ]);
            setStaffList(staffData || []);
            setHubs(hubData || []);
        } catch (e) {
            console.error("Failed to load staff management data:", e);
            setMessage({ type: 'danger', text: 'Failed to synchronize staff data.' });
        } finally {
            setLoading(false);
        }
    };

    const handleRegisterStaff = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await ApiService.registerStaff(newStaff);
            setMessage({ type: 'success', text: 'New staff member registered successfully!' });
            setNewStaff({ username: '', email: '', password: '', hub: { hubId: '' } });
            loadData();
        } catch (e) {
            setMessage({ type: 'danger', text: 'Registration failed: ' + (e.response?.data?.message || e.message) });
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteStaff = async (id) => {
        if (!window.confirm('Are you sure you want to remove this staff member?')) return;
        setLoading(true);
        try {
            await ApiService.deleteStaff(id);
            setMessage({ type: 'success', text: 'Staff access revoked.' });
            loadData();
        } catch (e) {
            setMessage({ type: 'danger', text: 'Failed to revoke access.' });
        } finally {
            setLoading(false);
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
                            Staff <span className="text-primary italic">Cloud</span>
                        </h1>
                        <p className="text-muted-foreground mt-2 font-medium">Provision and orchestrate secure node access for fleet operators.</p>
                    </div>
                    {loading && (
                        <div className="bg-primary/10 border border-primary/20 px-4 py-2 rounded-xl flex items-center gap-3 animate-pulse">
                            <Loader2 className="h-4 w-4 text-primary animate-spin" />
                            <span className="text-sm font-bold text-primary italic uppercase tracking-widest text-[10px]">Processing Data...</span>
                        </div>
                    )}
                </div>

                {message.text && (
                    <div className={`mb-8 p-4 rounded-2xl border flex items-center gap-4 animate-in slide-in-from-right-4 duration-500 shadow-lg ${message.type === 'success' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-600' : 'bg-destructive/10 border-destructive/20 text-destructive'
                        }`}>
                        {message.type === 'success' ? <ShieldCheck className="h-6 w-6" /> : <ShieldAlert className="h-6 w-6" />}
                        <div className="flex-grow">
                            <p className="font-black uppercase text-[10px] tracking-widest mb-0.5">{message.type === 'success' ? 'Protocol Success' : 'Security Alert'}</p>
                            <p className="font-medium text-sm">{message.text}</p>
                        </div>
                    </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                    {/* REGISTRATION FORM */}
                    <div className="lg:col-span-4 lg:sticky lg:top-8 h-fit">
                        <Card className="border-none shadow-2xl bg-card overflow-hidden">
                            <CardHeader className="bg-primary p-8 text-primary-foreground relative overflow-hidden">
                                <div className="relative z-10">
                                    <div className="h-12 w-12 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center mb-4">
                                        <UserPlus className="h-6 w-6" />
                                    </div>
                                    <CardTitle className="text-2xl font-black uppercase tracking-tighter">Onboard Node</CardTitle>
                                    <CardDescription className="text-primary-foreground/70 font-bold uppercase text-[10px] tracking-widest italic">Create Fleet Operator Access</CardDescription>
                                </div>
                                <div className="absolute -right-4 -bottom-4 opacity-10 group-hover:scale-110 transition-transform">
                                    <ShieldCheck className="h-32 w-32" />
                                </div>
                            </CardHeader>
                            <CardContent className="p-8 space-y-6">
                                <form onSubmit={handleRegisterStaff} className="space-y-6">
                                    <div className="space-y-2">
                                        <Label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Operator Identity</Label>
                                        <div className="relative">
                                            <Users className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                            <Input
                                                className="h-12 pl-12 bg-muted/50 border-none rounded-xl font-bold"
                                                placeholder="Username"
                                                value={newStaff.username}
                                                onChange={e => setNewStaff({ ...newStaff, username: e.target.value })}
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Communication Link</Label>
                                        <div className="relative">
                                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                            <Input
                                                type="email"
                                                className="h-12 pl-12 bg-muted/50 border-none rounded-xl font-bold"
                                                placeholder="Email Address"
                                                value={newStaff.email}
                                                onChange={e => setNewStaff({ ...newStaff, email: e.target.value })}
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Security Token</Label>
                                        <div className="relative">
                                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                            <Input
                                                type="password"
                                                className="h-12 pl-12 bg-muted/50 border-none rounded-xl font-bold"
                                                placeholder="Initial Password"
                                                value={newStaff.password}
                                                onChange={e => setNewStaff({ ...newStaff, password: e.target.value })}
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Logistics Hub Mapping</Label>
                                        <div className="relative">
                                            <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                            <select
                                                className="flex h-12 w-full pl-12 rounded-xl bg-muted/50 px-4 py-2 text-sm font-black border-none focus-visible:ring-2 focus-visible:ring-primary appearance-none"
                                                value={newStaff.hub.hubId}
                                                onChange={e => setNewStaff({ ...newStaff, hub: { hubId: e.target.value } })}
                                                required
                                            >
                                                <option value="">Select a Hub...</option>
                                                {hubs.map(h => (
                                                    <option key={h.hubId} value={h.hubId}>{h.hubName} ({h.city.cityName})</option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                    <Button type="submit" className="w-full h-14 rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-xl shadow-primary/30 gap-2 mt-4" disabled={loading}>
                                        Execute Onboarding <UserCheck className="h-4 w-4" />
                                    </Button>
                                </form>
                            </CardContent>
                        </Card>
                    </div>

                    {/* STAFF LIST */}
                    <div className="lg:col-span-8">
                        <Card className="border-none shadow-2xl bg-card overflow-hidden">
                            <CardHeader className="p-8 bg-muted/50 border-bottom border-border/50 flex flex-row items-center justify-between">
                                <div>
                                    <CardTitle className="text-2xl font-black uppercase tracking-tight">Node Ecosystem</CardTitle>
                                    <CardDescription className="font-bold flex items-center gap-2 mt-1">
                                        <Badge variant="secondary" className="bg-primary/10 text-primary border-none font-black text-[10px] uppercase px-3 py-1">
                                            {staffList.length} Active Operators Detected
                                        </Badge>
                                    </CardDescription>
                                </div>
                                <div className="h-12 w-12 rounded-xl bg-muted flex items-center justify-center text-muted-foreground">
                                    <Users className="h-6 w-6" />
                                </div>
                            </CardHeader>
                            <CardContent className="p-0">
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left border-collapse">
                                        <thead className="bg-muted/30">
                                            <tr className="text-[10px] font-black uppercase tracking-widest text-muted-foreground border-b border-border/50">
                                                <th className="px-8 py-5">Operator Identity</th>
                                                <th className="px-6 py-5">Communication Link</th>
                                                <th className="px-6 py-5 text-center">Hub Mapping</th>
                                                <th className="px-8 py-5 text-right">Security Protocol</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {staffList.map((s) => (
                                                <tr key={s.id} className="group hover:bg-muted/20 transition-colors border-b border-border/50">
                                                    <td className="px-8 py-6">
                                                        <div className="flex items-center gap-4">
                                                            <div className="h-10 w-10 rounded-xl bg-muted flex items-center justify-center font-black text-primary text-xs border border-border group-hover:border-primary/20 transition-all">
                                                                {s.username.substring(0, 2).toUpperCase()}
                                                            </div>
                                                            <div>
                                                                <p className="font-black text-sm uppercase leading-tight">{s.username}</p>
                                                                <p className="text-[10px] text-muted-foreground font-bold italic tracking-wider">SECURE NODE</p>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-6">
                                                        <div className="flex flex-col">
                                                            <p className="font-bold text-xs">{s.email}</p>
                                                            <Badge variant="outline" className="w-fit text-[9px] h-4 font-bold border-dashed border-primary/20 text-primary mt-1">SMTP VERIFIED</Badge>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-6 text-center">
                                                        {s.hub ? (
                                                            <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20 font-black text-[9px] uppercase px-4 py-1.5 rounded-full inline-flex gap-2">
                                                                <MapPin className="h-3 w-3" />
                                                                {s.hub.hubName}
                                                            </Badge>
                                                        ) : (
                                                            <Badge variant="outline" className="text-muted-foreground font-bold italic text-[9px] uppercase py-1 border-dashed">Floating Node</Badge>
                                                        )}
                                                    </td>
                                                    <td className="px-8 py-6 text-right">
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            onClick={() => handleDeleteStaff(s.id)}
                                                            className="h-10 w-10 rounded-xl text-destructive hover:bg-destructive/10 hover:text-destructive group-hover:bg-destructive group-hover:text-white transition-all shadow-none"
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                        </Button>
                                                    </td>
                                                </tr>
                                            ))}
                                            {staffList.length === 0 && (
                                                <tr>
                                                    <td colSpan="4" className="px-8 py-24 text-center">
                                                        <div className="flex flex-col items-center opacity-30">
                                                            <LayoutGrid className="h-20 w-20 mb-6" />
                                                            <h3 className="text-3xl font-black uppercase italic tracking-tighter">Zero Nodes Found</h3>
                                                            <p className="text-sm font-bold">Use the secure terminal on the left to onboard staff.</p>
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
            </div>
        </div>
    );
};

export default StaffManagement;
