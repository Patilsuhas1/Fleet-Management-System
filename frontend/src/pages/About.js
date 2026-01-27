import React from 'react';

const About = () => {
    return (
        <div className="container py-5 animate-fade-in">
            <div className="row justify-content-center">
                <div className="col-lg-10">
                    <div className="premium-card p-5 mb-5 text-center">
                        <h1 className="display-4 fw-bold mb-4 text-gradient">Drive the Future with IndiaDrive</h1>
                        <p className="lead fs-4 text-muted mb-0">
                            India's most trusted fleet management and car rental ecosystem.
                            Built for speed, reliability, and seamless mobility.
                        </p>
                    </div>

                    <div className="row g-4">
                        <div className="col-md-6">
                            <div className="premium-card p-4 h-100">
                                <i className="bi bi-shield-check-fill display-5 text-primary mb-3"></i>
                                <h3 className="fw-bold mb-3">Our Mission</h3>
                                <p className="text-muted">
                                    To revolutionize mobility in India by providing a transparent,
                                    technology-driven platform that connects fleet owners with
                                    travelers, ensuring safety and comfort at every kilometer.
                                </p>
                            </div>
                        </div>
                        <div className="col-md-6">
                            <div className="premium-card p-4 h-100">
                                <i className="bi bi-cpu-fill display-5 text-primary mb-3"></i>
                                <h3 className="fw-bold mb-3">Advanced Technology</h3>
                                <p className="text-muted">
                                    From high-precision GPS tracking to automated handover systems,
                                    our platform leverages the latest in React and Spring Boot architectures
                                    to deliver a "Crystal Clear" user experience.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="premium-card p-5 mt-4">
                        <h3 className="fw-bold text-center mb-5">Why Choose Us?</h3>
                        <div className="row g-4 text-center">
                            <div className="col-md-4">
                                <div className="p-3 bg-primary bg-opacity-10 rounded-4">
                                    <h2 className="fw-bold text-primary mb-1">500+</h2>
                                    <p className="small text-muted mb-0">Premium Vehicles</p>
                                </div>
                            </div>
                            <div className="col-md-4">
                                <div className="p-3 bg-primary bg-opacity-10 rounded-4">
                                    <h2 className="fw-bold text-primary mb-1">20+</h2>
                                    <p className="small text-muted mb-0">Major Hubs</p>
                                </div>
                            </div>
                            <div className="col-md-4">
                                <div className="p-3 bg-primary bg-opacity-10 rounded-4">
                                    <h2 className="fw-bold text-primary mb-1">24/7</h2>
                                    <p className="small text-muted mb-0">Customer Care</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="text-center mt-5">
                        <p className="text-muted">IndiaDrive is more than a rental company; it's your partner on the road.</p>
                        <i className="bi bi-geo-alt-fill text-primary"></i> <span className="text-muted small">Headquarters: Pune, Maharashtra, India</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default About;
