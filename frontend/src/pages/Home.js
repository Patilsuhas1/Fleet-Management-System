import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
    return (
        <div>
            {/* Hero Section */}
            <div className="hero-section text-center">
                <div className="container">
                    <h1 className="display-3 fw-bold mb-4">Drive Your Dreams</h1>
                    <p className="lead mb-5 fs-4">Premium Fleet Management Solutions. Rent luxury, drive comfort.</p>
                    <Link to="/booking" className="btn btn-primary btn-lg px-5 py-3 rounded-pill fw-bold">
                        Book Now
                    </Link>
                </div>
            </div>

            {/* Features Section */}
            <div className="container py-5">
                <div className="row g-4">
                    <div className="col-md-4">
                        <div className="card h-100 feature-card p-4 text-center">
                            <i className="bi bi-shield-check fs-1 text-primary mb-3"></i>
                            <h3 className="h4">Safe & Secure</h3>
                            <p className="text-muted">Verified cars and secure payment gateways for your peace of mind.</p>
                        </div>
                    </div>
                    <div className="col-md-4">
                        <div className="card h-100 feature-card p-4 text-center">
                            <i className="bi bi-clock-history fs-1 text-primary mb-3"></i>
                            <h3 className="h4">24/7 Support</h3>
                            <p className="text-muted">Our team is always available to assist you with your journey.</p>
                        </div>
                    </div>
                    <div className="col-md-4">
                        <div className="card h-100 feature-card p-4 text-center">
                            <i className="bi bi-tag fs-1 text-primary mb-3"></i>
                            <h3 className="h4">Best Rates</h3>
                            <p className="text-muted">Affordable daily, weekly, and monthly rates for all car types.</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <footer className="bg-dark text-white py-4 mt-5">
                <div className="container text-center">
                    <p className="mb-0">&copy; 2026 IndiaDrive. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
};

export default Home;
