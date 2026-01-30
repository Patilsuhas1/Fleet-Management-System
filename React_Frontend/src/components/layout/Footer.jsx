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
    ChevronRight
} from "lucide-react";
import "./Footer.css";

function Footer() {
    const COMPANY_NAME = "IndiaDrive";

    const socialLinks = [
        { icon: Facebook, label: "Facebook", url: "#" },
        { icon: Twitter, label: "Twitter", url: "#" },
        { icon: Instagram, label: "Instagram", url: "#" },
        { icon: Linkedin, label: "LinkedIn", url: "#" },
    ];

    return (
        <footer className="footer">
            <div className="footer-container">
                <div className="footer-grid">
                    {/* Company */}
                    <div>
                        <h3>{COMPANY_NAME}</h3>
                        <p>
                            Premium driving and fleet solutions designed for safety,
                            reliability, and seamless travel across India.
                        </p>

                        <div className="social-icons">
                            {socialLinks.map(({ icon: Icon, label, url }) => (
                                <a key={label} href={url} aria-label={label} target="_blank" rel="noopener noreferrer">
                                    <Icon size={18} />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4>Quick Links</h4>
                        <ul>
                            <li>
                                <Link to="/">
                                    <ChevronRight size={14} /> Home
                                </Link>
                            </li>
                            <li>
                                <Link to="/booking">
                                    <ChevronRight size={14} /> Book a Car
                                </Link>
                            </li>
                            <li>
                                <Link to="/about">
                                    <ChevronRight size={14} /> About Us
                                </Link>
                            </li>
                            <li>
                                <Link to="/customer-care">
                                    <ChevronRight size={14} /> Support
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Services */}
                    <div>
                        <h4>Services</h4>
                        <ul>
                            <li>
                                <Link to="/booking">
                                    <ChevronRight size={14} /> Car Rentals
                                </Link>
                            </li>
                            <li>
                                <Link to="/booking">
                                    <ChevronRight size={14} /> Airport Transfers
                                </Link>
                            </li>
                            <li>
                                <Link to="/booking">
                                    <ChevronRight size={14} /> Corporate Fleet
                                </Link>
                            </li>
                            <li>
                                <Link to="/booking">
                                    <ChevronRight size={14} /> Wedding Cars
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h4>Contact Us</h4>
                        <ul className="contact">
                            <li>
                                <MapPin size={18} className="contact-icon" />
                                <span>123 IndiaDrive Tower, MG Road, Pune, Maharashtra 411001</span>
                            </li>
                            <li>
                                <Phone size={18} className="contact-icon" />
                                <span>+91 123 456 7890</span>
                            </li>
                            <li>
                                <Mail size={18} className="contact-icon" />
                                <span>info@indiadrive.com</span>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="footer-bottom">
                    <p className="mb-0">© {new Date().getFullYear()} {COMPANY_NAME}. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
}

export default Footer;
