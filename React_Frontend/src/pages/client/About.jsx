import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { ShieldCheck, Cpu, MapPin } from "lucide-react";

const About = () => {
    return (
        <div className="container mx-auto px-4 py-12 animate-in fade-in duration-500">
            <div className="flex justify-center">
                <div className="max-w-4xl w-full">
                    <Card className="mb-8 overflow-hidden border-none shadow-lg bg-card/50 backdrop-blur-sm">
                        <CardContent className="p-8 md:p-12 text-center">
                            <h1 className="text-4xl md:text-5xl font-bold mb-6 text-foreground">
                                Drive the Future with <span className="text-primary">IndiaDrive</span>
                            </h1>
                            <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                                India's most trusted fleet management and car rental ecosystem.
                                Built for speed, reliability, and seamless mobility.
                            </p>
                        </CardContent>
                    </Card>

                    <div className="grid md:grid-cols-2 gap-6">
                        <Card className="border-none shadow-md hover:shadow-lg transition-shadow h-full">
                            <CardContent className="p-8">
                                <div className="bg-primary/10 w-16 h-16 rounded-2xl flex items-center justify-center mb-6">
                                    <ShieldCheck className="w-8 h-8 text-primary" />
                                </div>
                                <h3 className="text-2xl font-bold mb-4">Our Mission</h3>
                                <p className="text-muted-foreground leading-relaxed">
                                    To revolutionize mobility in India by providing a transparent,
                                    technology-driven platform that connects fleet owners with
                                    travelers, ensuring safety and comfort at every kilometer.
                                </p>
                            </CardContent>
                        </Card>

                        <Card className="border-none shadow-md hover:shadow-lg transition-shadow h-full">
                            <CardContent className="p-8">
                                <div className="bg-primary/10 w-16 h-16 rounded-2xl flex items-center justify-center mb-6">
                                    <Cpu className="w-8 h-8 text-primary" />
                                </div>
                                <h3 className="text-2xl font-bold mb-4">Advanced Technology</h3>
                                <p className="text-muted-foreground leading-relaxed">
                                    From high-precision GPS tracking to automated handover systems,
                                    our platform leverages the latest in React and Spring Boot architectures
                                    to deliver a "Crystal Clear" user experience.
                                </p>
                            </CardContent>
                        </Card>
                    </div>

                    <Card className="mt-8 border-none shadow-lg bg-muted/30">
                        <CardContent className="p-8 md:p-12">
                            <h3 className="text-2xl font-bold text-center mb-8">Why Choose Us?</h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                                <div className="space-y-2">
                                    <div className="bg-background rounded-2xl p-6 shadow-sm">
                                        <h2 className="text-4xl font-bold text-primary mb-1">500+</h2>
                                        <p className="text-sm font-medium text-muted-foreground uppercase tracking-wide">Premium Vehicles</p>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <div className="bg-background rounded-2xl p-6 shadow-sm">
                                        <h2 className="text-4xl font-bold text-primary mb-1">20+</h2>
                                        <p className="text-sm font-medium text-muted-foreground uppercase tracking-wide">Major Hubs</p>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <div className="bg-background rounded-2xl p-6 shadow-sm">
                                        <h2 className="text-4xl font-bold text-primary mb-1">24/7</h2>
                                        <p className="text-sm font-medium text-muted-foreground uppercase tracking-wide">Customer Care</p>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <div className="text-center mt-12 pb-8">
                        <p className="text-lg text-muted-foreground mb-4">IndiaDrive is more than a rental company; it's your partner on the road.</p>
                        <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                            <MapPin className="w-4 h-4 text-primary" />
                            <span>Headquarters: Pune, Maharashtra, India</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default About;
