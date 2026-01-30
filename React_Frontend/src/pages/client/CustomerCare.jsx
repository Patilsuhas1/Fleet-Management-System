import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Mail,
    Phone,
    MapPin,
    Send,
    CheckCircle,
    Facebook,
    Twitter,
    Instagram,
    Linkedin,
    HeadphonesIcon,
    ArrowRight
} from "lucide-react";

const CustomerCare = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });
    const [submitted, setSubmitted] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Support Query:', formData);
        setSubmitted(true);
        setFormData({ name: '', email: '', subject: '', message: '' });
    };

    return (
        <div className="min-h-screen bg-background py-20">
            <div className="container mx-auto px-4">
                <div className="max-w-4xl mx-auto text-center mb-20 animate-in fade-in slide-in-from-bottom-4 duration-700">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-bold mb-6">
                        <HeadphonesIcon className="h-4 w-4" /> 24/7 Concierge Support
                    </div>
                    <h1 className="text-5xl md:text-6xl font-black tracking-tight mb-6">
                        How can we <span className="text-primary italic">help you?</span>
                    </h1>
                    <p className="text-xl text-muted-foreground leading-relaxed">
                        Our dedicated team is always on standby to ensure your journey is seamless.
                        Whether it's fleet details, booking assistance, or on-the-road support, we're just a message away.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 max-w-6xl mx-auto">
                    {/* Contact Info Sidebar */}
                    <div className="lg:col-span-5 space-y-8 animate-in fade-in slide-in-from-left-8 duration-700 delay-200">
                        <Card className="border-none shadow-2xl bg-primary text-primary-foreground overflow-hidden">
                            <CardContent className="p-10 relative">
                                <div className="absolute -right-10 -bottom-10 opacity-10">
                                    <HeadphonesIcon className="h-64 w-64" />
                                </div>
                                <h3 className="text-3xl font-black mb-10">Direct Reach</h3>

                                <div className="space-y-8">
                                    <div className="flex gap-6 items-start">
                                        <div className="h-12 w-12 rounded-2xl bg-white/20 flex items-center justify-center shrink-0 backdrop-blur-md">
                                            <MapPin className="h-6 w-6" />
                                        </div>
                                        <div>
                                            <p className="text-white/60 text-xs font-bold uppercase tracking-widest mb-1">Global HQ</p>
                                            <p className="text-lg font-bold">123 IndiaDrive Tower, MG Road, Pune, MH</p>
                                        </div>
                                    </div>

                                    <div className="flex gap-6 items-start">
                                        <div className="h-12 w-12 rounded-2xl bg-white/20 flex items-center justify-center shrink-0 backdrop-blur-md">
                                            <Phone className="h-6 w-6" />
                                        </div>
                                        <div>
                                            <p className="text-white/60 text-xs font-bold uppercase tracking-widest mb-1">Tele-Support</p>
                                            <p className="text-lg font-bold">+91 1800-456-7890</p>
                                            <p className="text-sm text-white/40 italic">Toll free within India</p>
                                        </div>
                                    </div>

                                    <div className="flex gap-6 items-start">
                                        <div className="h-12 w-12 rounded-2xl bg-white/20 flex items-center justify-center shrink-0 backdrop-blur-md">
                                            <Mail className="h-6 w-6" />
                                        </div>
                                        <div>
                                            <p className="text-white/60 text-xs font-bold uppercase tracking-widest mb-1">Electronic Mail</p>
                                            <p className="text-lg font-bold">support@indiadrive.com</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-16 pt-10 border-t border-white/10">
                                    <p className="text-white/60 text-xs font-bold uppercase tracking-widest mb-6">Social Ecosystem</p>
                                    <div className="flex gap-4">
                                        {[Facebook, Twitter, Instagram, Linkedin].map((Icon, i) => (
                                            <Button key={i} size="icon" variant="ghost" className="rounded-xl h-12 w-12 bg-white/10 hover:bg-white hover:text-primary transition-all">
                                                <Icon className="h-5 w-5" />
                                            </Button>
                                        ))}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Contact Form */}
                    <div className="lg:col-span-7 animate-in fade-in slide-in-from-right-8 duration-700 delay-200">
                        <Card className="border-none shadow-2xl bg-card border border-border/50">
                            <CardContent className="p-10 md:p-12">
                                {submitted ? (
                                    <div className="text-center py-16 animate-in zoom-in-95 duration-500">
                                        <div className="h-24 w-24 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-8">
                                            <CheckCircle className="h-12 w-12 text-primary" />
                                        </div>
                                        <h3 className="text-4xl font-black text-foreground mb-4">Transmission Successful</h3>
                                        <p className="text-muted-foreground text-lg mb-10 max-w-sm mx-auto">
                                            Your inquiry has been logged. Our dispatch team will revert within 2-4 hours.
                                        </p>
                                        <Button onClick={() => setSubmitted(false)} className="rounded-full px-10 h-14 font-bold text-lg">
                                            New Transmission <ArrowRight className="ml-2 h-5 w-5" />
                                        </Button>
                                    </div>
                                ) : (
                                    <>
                                        <div className="mb-10">
                                            <h3 className="text-3xl font-black mb-2">Initialize Inquiry</h3>
                                            <p className="text-muted-foreground text-lg">Send us a secure message encrypted via SSL.</p>
                                        </div>

                                        <form onSubmit={handleSubmit} className="space-y-8">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                                <div className="space-y-3">
                                                    <Label className="text-xs font-black uppercase text-muted-foreground flex items-center gap-2">
                                                        Identity <span className="h-1 w-1 rounded-full bg-primary"></span>
                                                    </Label>
                                                    <Input
                                                        className="h-14 rounded-2xl bg-muted/50 border-none focus-visible:ring-2 focus-visible:ring-primary transition-all text-lg font-medium"
                                                        placeholder="Siddhartha Gupta"
                                                        name="name"
                                                        value={formData.name}
                                                        onChange={handleChange}
                                                        required
                                                    />
                                                </div>
                                                <div className="space-y-3">
                                                    <Label className="text-xs font-black uppercase text-muted-foreground flex items-center gap-2">
                                                        Channel <span className="h-1 w-1 rounded-full bg-primary"></span>
                                                    </Label>
                                                    <Input
                                                        type="email"
                                                        className="h-14 rounded-2xl bg-muted/50 border-none focus-visible:ring-2 focus-visible:ring-primary transition-all text-lg font-medium"
                                                        placeholder="sid@example.com"
                                                        name="email"
                                                        value={formData.email}
                                                        onChange={handleChange}
                                                        required
                                                    />
                                                </div>
                                            </div>

                                            <div className="space-y-3">
                                                <Label className="text-xs font-black uppercase text-muted-foreground flex items-center gap-2">
                                                    Inquiry Subject <span className="h-1 w-1 rounded-full bg-primary"></span>
                                                </Label>
                                                <Input
                                                    className="h-14 rounded-2xl bg-muted/50 border-none focus-visible:ring-2 focus-visible:ring-primary transition-all text-lg font-medium"
                                                    placeholder="Regarding Premium SUV availability in Pune"
                                                    name="subject"
                                                    value={formData.subject}
                                                    onChange={handleChange}
                                                    required
                                                />
                                            </div>

                                            <div className="space-y-3">
                                                <Label className="text-xs font-black uppercase text-muted-foreground flex items-center gap-2">
                                                    Brief Transcript <span className="h-1 w-1 rounded-full bg-primary"></span>
                                                </Label>
                                                <textarea
                                                    className="w-full h-40 rounded-[2rem] bg-muted/50 border-none focus:ring-2 focus:ring-primary p-6 transition-all text-lg font-medium resize-none"
                                                    placeholder="Specify your requirements or issues here..."
                                                    name="message"
                                                    value={formData.message}
                                                    onChange={handleChange}
                                                    required
                                                />
                                            </div>

                                            <Button type="submit" className="w-full h-16 rounded-[2rem] text-xl font-black shadow-2xl shadow-primary/30 group">
                                                Relay Message
                                                <Send className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                                            </Button>
                                        </form>
                                    </>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CustomerCare;
