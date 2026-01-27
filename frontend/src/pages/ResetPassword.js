import React, { useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import AuthService from '../services/authService';

const ResetPassword = () => {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const location = useLocation();
    const navigate = useNavigate();
    const queryParams = new URLSearchParams(location.search);
    const token = queryParams.get('token');

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            setError('Passwords do not match.');
            return;
        }

        setMessage('');
        setError('');
        setLoading(true);
        try {
            await AuthService.resetPassword(token, password);
            setMessage('Your password has been successfully reset.');
            setTimeout(() => {
                navigate('/login');
            }, 3000);
        } catch (err) {
            setError(err.response?.data || 'Failed to reset password. The link might be expired or invalid.');
        } finally {
            setLoading(false);
        }
    };

    if (!token) {
        return (
            <div className="container py-5 text-center">
                <div className="alert alert-warning d-inline-block">Invalid or missing reset token.</div>
                <div className="mt-3"><Link to="/login">Back to Login</Link></div>
            </div>
        );
    }

    return (
        <div className="reset-password-page py-5">
            <div className="container py-5">
                <div className="row justify-content-center">
                    <div className="col-md-5">
                        <div className="premium-card p-5 animate-slide-up bg-glass">
                            <div className="text-center mb-5">
                                <h2 className="display-6 fw-bold text-gradient mb-2">Reset Password</h2>
                                <p className="text-muted">Enter your new password below.</p>
                            </div>

                            {message && (
                                <div className="alert alert-success border-0 rounded-4 mb-4" role="alert">
                                    <i className="bi bi-check-circle-fill me-2"></i>
                                    {message} Redirecting to login...
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
                                            type="password"
                                            className="form-control rounded-4 shadow-sm"
                                            id="password"
                                            placeholder="New Password"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            required
                                        />
                                        <label htmlFor="password">New Password</label>
                                    </div>

                                    <div className="form-floating mb-4">
                                        <input
                                            type="password"
                                            className="form-control rounded-4 shadow-sm"
                                            id="confirmPassword"
                                            placeholder="Confirm New Password"
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                            required
                                        />
                                        <label htmlFor="confirmPassword">Confirm New Password</label>
                                    </div>

                                    <button
                                        type="submit"
                                        className="btn btn-premium btn-lg w-100 rounded-pill mb-4 shadow-glow"
                                        disabled={loading}
                                    >
                                        {loading ? (
                                            <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                        ) : null}
                                        Reset Password
                                    </button>
                                </form>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ResetPassword;
