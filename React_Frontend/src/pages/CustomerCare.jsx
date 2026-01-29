import React, { useState } from 'react';

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
        // In a real app, you'd send this to an API
        console.log('Support Query:', formData);
        setSubmitted(true);
        setFormData({ name: '', email: '', subject: '', message: '' });
    };

    return (
        <div className="customer-care-page py-5">
            <div className="container py-5">
                <div className="text-center mb-5 animate-fade-in">
                    <h1 className="display-4 fw-bold text-gradient mb-3">Customer Support</h1>
                    <p className="lead text-muted mx-auto" style={{ maxWidth: '700px' }}>
                        We're here to help you 24/7. Whether you have a question about our fleet, booking process, or need assistance during your journey, our team is just a message away.
                    </p>
                </div>

                <div className="row g-5">
                    <div className="col-lg-5 animate-slide-right">
                        <div className="premium-card p-5 h-100 shadow-lg border-0 rounded-4">
                            <h3 className="h4 fw-bold mb-4 text-primary">Contact Information</h3>

                            <div className="d-flex align-items-center mb-4">
                                <div className="bg-primary bg-opacity-10 p-3 rounded-circle me-3">
                                    <i className="bi bi-geo-alt fs-4 text-primary"></i>
                                </div>
                                <div>
                                    <h6 className="mb-0 fw-bold">Headquarters</h6>
                                    <p className="text-muted mb-0">123 IndiaDrive Tower, MG Road, Pune, Maharashtra</p>
                                </div>
                            </div>

                            <div className="d-flex align-items-center mb-4">
                                <div className="bg-primary bg-opacity-10 p-3 rounded-circle me-3">
                                    <i className="bi bi-telephone fs-4 text-primary"></i>
                                </div>
                                <div>
                                    <h6 className="mb-0 fw-bold">Phone Support</h6>
                                    <p className="text-muted mb-0">+91 1800-456-7890 (Toll Free)</p>
                                </div>
                            </div>

                            <div className="d-flex align-items-center mb-4">
                                <div className="bg-primary bg-opacity-10 p-3 rounded-circle me-3">
                                    <i className="bi bi-envelope fs-4 text-primary"></i>
                                </div>
                                <div>
                                    <h6 className="mb-0 fw-bold">Email Us</h6>
                                    <p className="text-muted mb-0">support@indiadrive.com</p>
                                </div>
                            </div>

                            <div className="mt-5">
                                <h6 className="fw-bold mb-3">Follow Us</h6>
                                <div className="d-flex gap-3">
                                    <button className="btn btn-outline-primary rounded-circle p-2" style={{ width: '45px', height: '45px' }}><i className="bi bi-facebook"></i></button>
                                    <button className="btn btn-outline-primary rounded-circle p-2" style={{ width: '45px', height: '45px' }}><i className="bi bi-twitter-x"></i></button>
                                    <button className="btn btn-outline-primary rounded-circle p-2" style={{ width: '45px', height: '45px' }}><i className="bi bi-instagram"></i></button>
                                    <button className="btn btn-outline-primary rounded-circle p-2" style={{ width: '45px', height: '45px' }}><i className="bi bi-linkedin"></i></button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="col-lg-7 animate-slide-left">
                        <div className="premium-card p-5 shadow-lg border-0 rounded-4 bg-adaptive">
                            {submitted ? (
                                <div className="text-center py-5">
                                    <div className="bg-success bg-opacity-10 p-4 rounded-circle d-inline-block mb-4">
                                        <i className="bi bi-check-circle fs-1 text-success"></i>
                                    </div>
                                    <h3 className="fw-bold text-success mb-3">Message Sent!</h3>
                                    <p className="text-muted mb-4">Thank you for reaching out. Our support team will respond to your query at your email address within 2-4 hours.</p>
                                    <button className="btn btn-premium rounded-pill px-5" onClick={() => setSubmitted(false)}>Send Another Message</button>
                                </div>
                            ) : (
                                <>
                                    <h3 className="h4 fw-bold mb-4">Send us a Message</h3>
                                    <form onSubmit={handleSubmit}>
                                        <div className="row">
                                            <div className="col-md-6 mb-4">
                                                <label className="form-label small fw-bold text-muted">Your Name</label>
                                                <input type="text" className="form-control rounded-3" name="name" value={formData.name} onChange={handleChange} required />
                                            </div>
                                            <div className="col-md-6 mb-4">
                                                <label className="form-label small fw-bold text-muted">Email Address</label>
                                                <input type="email" className="form-control rounded-3" name="email" value={formData.email} onChange={handleChange} required />
                                            </div>
                                        </div>

                                        <div className="mb-4">
                                            <label className="form-label small fw-bold text-muted">Subject</label>
                                            <input type="text" className="form-control rounded-3" name="subject" value={formData.subject} onChange={handleChange} required />
                                        </div>

                                        <div className="mb-4">
                                            <label className="form-label small fw-bold text-muted">Your Message</label>
                                            <textarea className="form-control rounded-3" rows="5" name="message" value={formData.message} onChange={handleChange} required></textarea>
                                        </div>

                                        <button type="submit" className="btn btn-premium btn-lg w-100 rounded-pill shadow-glow">
                                            <i className="bi bi-send-fill me-2"></i> Submit Inquiry
                                        </button>
                                    </form>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CustomerCare;
