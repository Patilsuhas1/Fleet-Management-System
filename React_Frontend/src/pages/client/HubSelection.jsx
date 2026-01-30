import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import ApiService from '../../services/api';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    MapPin,
    Clock,
    ArrowLeft,
    Navigation,
    Search,
    Loader2,
    CheckCircle2,
    Building2,
    PlaneTakeoff
} from "lucide-react";

const HubSelection = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [hubs, setHubs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const { pickupDateTime, returnDateTime, locationData, searchType } = location.state || {};

    useEffect(() => {
        if (!location.state) {
            navigate('/booking');
            return;
        }

        const fetchHubs = async () => {
            try {
                let data = [];
                if (searchType === 'airport') {
                    data = locationData;
                } else if (searchType === 'city') {
                    data = await ApiService.getHubs(locationData.stateName, locationData.cityName);
                }
                setHubs(data);
            } catch (err) {
                setError('Failed to load hubs. Please try again.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchHubs();
    }, [location.state, navigate, searchType, locationData]);

    const handleHubSelect = (hub) => {
        navigate('/select-car', {
            state: {
                pickupHub: hub,
                pickupDateTime,
                returnDateTime
            }
        });
    };

    if (loading) return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
            <Loader2 className="h-10 w-10 text-primary animate-spin" />
            <p className="text-muted-foreground animate-pulse font-medium">Scanning for operational hubs...</p>
        </div>
    );

    return (
        <div className="min-h-screen bg-background py-16">
            <div className="container mx-auto px-4">
                <div className="max-w-4xl mx-auto text-center mb-16 animate-in fade-in slide-in-from-bottom-4 duration-700">
                    <Link to="/booking">
                        <Button variant="ghost" className="mb-6 gap-2 text-muted-foreground hover:text-foreground">
                            <ArrowLeft className="h-4 w-4" /> Change Search Criteria
                        </Button>
                    </Link>
                    <h1 className="text-4xl md:text-5xl font-black mb-4 tracking-tight">
                        Select your <span className="text-primary italic">Departure Hub</span>
                    </h1>
                    <p className="text-xl text-muted-foreground">
                        {searchType === 'airport' ? 'Direct terminal access for seamless arrivals.' : `Fleet centers identified in ${locationData?.cityName || 'your area'}.`}
                    </p>
                </div>

                {error && (
                    <div className="max-w-md mx-auto bg-destructive/10 text-destructive p-4 rounded-2xl mb-12 text-center flex items-center justify-center gap-2">
                        <Search className="h-5 w-5" /> {error}
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
                    {hubs.length > 0 ? (
                        hubs.map((hub, index) => (
                            <Card key={hub.hubId} className="group border-none shadow-xl hover:shadow-2xl transition-all duration-500 bg-card overflow-hidden hover:-translate-y-1">
                                <CardContent className="p-0">
                                    <div className="p-8">
                                        <div className="flex justify-between items-start mb-6">
                                            <div className="h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground duration-500">
                                                {searchType === 'airport' ? <PlaneTakeoff className="h-7 w-7" /> : <Building2 className="h-7 w-7" />}
                                            </div>
                                            <Badge variant="secondary" className="bg-emerald-500/10 text-emerald-600 border-none px-3 py-1 font-bold text-[10px] tracking-widest uppercase">
                                                Active
                                            </Badge>
                                        </div>

                                        <h3 className="text-xl font-black mb-2 group-hover:text-primary transition-colors">{hub.hubName}</h3>
                                        <p className="text-sm text-muted-foreground mb-6 line-clamp-2 min-h-[2.5rem]">
                                            {hub.hubAddress}
                                        </p>

                                        <div className="space-y-4 pt-6 border-t border-border/50 text-sm">
                                            <div className="flex items-center justify-between text-muted-foreground">
                                                <div className="flex items-center gap-2">
                                                    <Clock className="h-4 w-4" />
                                                    <span>Open 24/7</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <Navigation className="h-4 w-4" />
                                                    <span>Instant Check-in</span>
                                                </div>
                                            </div>

                                            <Button
                                                className="w-full h-12 rounded-xl font-bold bg-primary group-hover:shadow-lg group-hover:shadow-primary/20 transition-all"
                                                onClick={() => handleHubSelect(hub)}
                                            >
                                                Initiate Selection <ArrowLeft className="ml-2 h-4 w-4 rotate-180" />
                                            </Button>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))
                    ) : (
                        <div className="col-span-full py-20 text-center animate-in zoom-in-95 duration-500">
                            <div className="bg-muted/30 rounded-[3rem] p-12 border border-dashed border-border flex flex-col items-center">
                                <Search className="h-20 w-20 text-muted-foreground/30 mb-6" />
                                <h3 className="text-3xl font-black mb-4">No Stations Found</h3>
                                <p className="text-muted-foreground text-lg mb-10 max-w-md">
                                    Our fleet centers are expanding rapidly. Currently, no hubs match your specific search criteria.
                                </p>
                                <Button onClick={() => navigate('/booking')} className="rounded-full px-10 h-14 font-bold text-lg">
                                    Redefine Search Area
                                </Button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default HubSelection;
