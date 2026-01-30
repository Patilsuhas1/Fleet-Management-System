import React from "react";
import { Link } from "react-router-dom";
import {
    Facebook,
    Twitter,
    Instagram,
    Linkedin,
    Mail,
    Phone,
    MapPin,
    ChevronRight,
    Shield
} from "lucide-react";

function Footer() {
    const COMPANY_NAME = "IndiaDrive";

    const socialLinks = [
        { icon: Facebook, label: "Facebook", url: "#" },
        { icon: Twitter, label: "Twitter", url: "#" },
        { icon: Instagram, label: "Instagram", url: "#" },
        { icon: Linkedin, label: "LinkedIn", url: "#" },
    ];

    return (
        <footer className="w-full border-t bg-card text-card-foreground py-12">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {/* Company */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 font-bold text-xl">
                            <Shield className="h-6 w-6 text-primary" />
                            <span className="text-primary">{COMPANY_NAME}</span>
                        </div>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                            Premium driving and fleet solutions designed for safety,
                            reliability, and seamless travel across India.
                        </p>

                        <div className="flex gap-4">
                            {socialLinks.map(({ icon: Icon, label, url }) => (
                                <a
                                    key={label}
                                    href={url}
                                    aria-label={label}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-muted-foreground hover:text-primary transition-colors"
                                >
                                    <Icon className="h-5 w-5" />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div className="space-y-4">
                        <h4 className="font-semibold text-foreground">Quick Links</h4>
                        <ul className="space-y-2">
                            {[
                                { to: "/", label: "Home" },
                                { to: "/booking", label: "Book a Car" },
                                { to: "/about", label: "About Us" },
                                { to: "/customer-care", label: "Support" }
                            ].map((link) => (
                                <li key={link.to}>
                                    <Link to={link.to} className="group flex items-center text-sm text-muted-foreground hover:text-primary transition-colors">
                                        <ChevronRight className="mr-2 h-3 w-3 transition-transform group-hover:translate-x-1" />
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Services */}
                    <div className="space-y-4">
                        <h4 className="font-semibold text-foreground">Services</h4>
                        <ul className="space-y-2">
                            {[
                                "Car Rentals",
                                "Airport Transfers",
                                "Corporate Fleet",
                                "Wedding Cars"
                            ].map((service) => (
                                <li key={service}>
                                    <Link to="/booking" className="group flex items-center text-sm text-muted-foreground hover:text-primary transition-colors">
                                        <ChevronRight className="mr-2 h-3 w-3 transition-transform group-hover:translate-x-1" />
                                        {service}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact */}
                    <div className="space-y-4">
                        <h4 className="font-semibold text-foreground">Contact Us</h4>
                        <ul className="space-y-3">
                            <li className="flex items-start text-sm text-muted-foreground">
                                <MapPin className="mr-3 h-5 w-5 text-primary shrink-0" />
                                <span>123 IndiaDrive Tower, MG Road, Pune, Maharashtra 411001</span>
                            </li>
                            <li className="flex items-center text-sm text-muted-foreground">
                                <Phone className="mr-3 h-5 w-5 text-primary shrink-0" />
                                <span>+91 123 456 7890</span>
                            </li>
                            <li className="flex items-center text-sm text-muted-foreground">
                                <Mail className="mr-3 h-5 w-5 text-primary shrink-0" />
                                <span>info@indiadrive.com</span>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="mt-12 pt-8 border-t text-center text-sm text-muted-foreground">
                    <p className="mb-0">© {new Date().getFullYear()} {COMPANY_NAME}. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
}

export default Footer;
