import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import AuthService from '../../services/authService';

const Register = () => {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
        role: 'CUSTOMER'
    });
    const [error, setError] = useState('');
    const [fieldErrors, setFieldErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        // Clear error for this field when user types
        if (fieldErrors[e.target.name]) {
            setFieldErrors({ ...fieldErrors, [e.target.name]: '' });
        }
    };

    const validateForm = () => {
        const newErrors = {};
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        // Password: At least 8 chars, at least one special character
        const passwordRegex = /^(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,}$/;

        if (!formData.username || formData.username.trim().length < 3) {
            newErrors.username = "Username must be at least 3 characters long.";
        }

        if (!formData.email || !emailRegex.test(formData.email)) {
            newErrors.email = "Please enter a valid email address.";
        }

        if (!formData.password) {
            newErrors.password = "Password is required.";
        } else if (!passwordRegex.test(formData.password)) {
            newErrors.password = "Password must be at least 8 characters and contain at least one special character (!@#$%^&*).";
        }

        if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = "Passwords do not match.";
        }

        setFieldErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        setError('');

        if (!validateForm()) {
            return;
        }

        setLoading(true);
        try {
            await AuthService.register({
                username: formData.username,
                email: formData.email,
                password: formData.password,
                role: formData.role
            });
            navigate('/login', { state: { message: 'Registration successful! Please login.' } });
        } catch (err) {
            setError(err.response?.data || 'Failed to register. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="register-page py-5">
            <div className="container py-5">
                <div className="row justify-content-center">
                    <div className="col-md-6">
                        <div className="premium-card p-5 animate-slide-up bg-glass">
                            <div className="text-center mb-5">
                                <h2 className="display-6 fw-bold text-gradient mb-2">Create Account</h2>
                                <p className="text-muted">Start your premium journey with IndiaDrive</p>
                            </div>

                            {error && (
                                <div className="alert alert-danger border-0 rounded-4 mb-4" role="alert">
                                    <i className="bi bi-exclamation-triangle-fill me-2"></i>
                                    {error}
                                </div>
                            )}

                            <form onSubmit={handleRegister}>
                                <div className="row">
                                    <div className="col-md-6 mb-4">
                                        <div className="form-floating">
                                            <input
                                                type="text"
                                                className="form-control rounded-4 shadow-sm"
                                                name="username"
                                                placeholder="Username"
                                                value={formData.username}
                                                onChange={handleChange}
                                                required
                                            />
                                            <label htmlFor="username">Username</label>
                                        </div>
                                        {fieldErrors.username && <small className="text-danger ps-2 animate-fade-in">{fieldErrors.username}</small>}
                                    </div>
                                    <div className="col-md-6 mb-4">
                                        <div className="form-floating">
                                            <input
                                                type="email"
                                                className="form-control rounded-4 shadow-sm"
                                                name="email"
                                                placeholder="Email Address"
                                                value={formData.email}
                                                onChange={handleChange}
                                                required
                                            />
                                            <label htmlFor="email">Email Address</label>
                                        </div>
                                        {fieldErrors.email && <small className="text-danger ps-2 animate-fade-in">{fieldErrors.email}</small>}
                                    </div>
                                </div>

                                <div className="row">
                                    <div className="col-md-6 mb-4">
                                        <div className="form-floating">
                                            <input
                                                type="password"
                                                className="form-control rounded-4 shadow-sm"
                                                name="password"
                                                placeholder="Password"
                                                value={formData.password}
                                                onChange={handleChange}
                                                required
                                            />
                                            <label htmlFor="password">Password</label>
                                        </div>
                                        {fieldErrors.password && <small className="text-danger ps-2 animate-fade-in">{fieldErrors.password}</small>}
                                    </div>
                                    <div className="col-md-6 mb-4">
                                        <div className="form-floating">
                                            <input
                                                type="password"
                                                className="form-control rounded-4 shadow-sm"
                                                name="confirmPassword"
                                                placeholder="Confirm Password"
                                                value={formData.confirmPassword}
                                                onChange={handleChange}
                                                required
                                            />
                                            <label htmlFor="confirmPassword">Confirm Password</label>
                                        </div>
                                        {fieldErrors.confirmPassword && <small className="text-danger ps-2 animate-fade-in">{fieldErrors.confirmPassword}</small>}
                                    </div>
                                </div>


                                <div className="form-check mb-4 px-1 ms-3">
                                    <input className="form-check-input" type="checkbox" id="terms" required />
                                    <label className="form-check-label text-muted small" htmlFor="terms">
                                        I agree to the <button type="button" className="btn btn-link p-0 text-decoration-none small text-primary border-0 bg-transparent align-baseline" onClick={() => alert('Terms & Conditions feature coming soon')}>Terms & Conditions</button>
                                    </label>
                                </div>

                                <button
                                    type="submit"
                                    className="btn btn-premium btn-lg w-100 rounded-pill mb-4 shadow-glow"
                                    disabled={loading}
                                >
                                    {loading ? (
                                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                    ) : null}
                                    Register Now
                                </button>

                                <p className="text-center text-muted mt-4">
                                    Already have an account? <Link to="/login" className="text-primary fw-bold text-decoration-none">Sign In</Link>
                                </p>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;
