import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import AuthService from '../services/authService';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        setError('');
        setLoading(true);
        try {
            const response = await AuthService.forgotPassword(email);
            setMessage(response.data);
        } catch (err) {
            setError(err.response?.data || 'Failed to request password reset. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="forgot-password-page py-5">
            <div className="container py-5">
                <div className="row justify-content-center">
                    <div className="col-md-5">
                        <div className="premium-card p-5 animate-slide-up bg-glass">
                            <div className="text-center mb-5">
                                <h2 className="display-6 fw-bold text-gradient mb-2">Forgot Password</h2>
                                <p className="text-muted">Enter your email and we'll send you a reset link.</p>
                            </div>

                            {message && (
                                <div className="alert alert-success border-0 rounded-4 mb-4" role="alert">
                                    <i className="bi bi-check-circle-fill me-2"></i>
                                    {message}
                                </div>
                            )}

                            {error && (
                                <div className="alert alert-danger border-0 rounded-4 mb-4" role="alert">
                                    <i className="bi bi-exclamation-triangle-fill me-2"></i>
                                    {error}
                                </div>
                            )}

                            {!message && (
                                <form onSubmit={handleSubmit}>
                                    <div className="form-floating mb-4">
                                        <input
                                            type="email"
                                            className="form-control rounded-4 shadow-sm"
                                            id="email"
                                            placeholder="name@example.com"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            required
                                        />
                                        <label htmlFor="email">Email address</label>
                                    </div>

                                    <button
                                        type="submit"
                                        className="btn btn-premium btn-lg w-100 rounded-pill mb-4 shadow-glow"
                                        disabled={loading}
                                    >
                                        {loading ? (
                                            <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                        ) : null}
                                        Send Reset Link
                                    </button>
                                </form>
                            )}

                            <div className="text-center mt-4">
                                <Link to="/login" className="text-primary fw-bold text-decoration-none">Back to Login</Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;
