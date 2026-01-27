import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import AuthService from '../services/authService';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            await AuthService.login(username, password);
            navigate('/');
            window.location.reload();
        } catch (err) {
            setError(err.response?.data || 'Invalid credentials. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-page py-5">
            <div className="container py-5">
                <div className="row justify-content-center">
                    <div className="col-md-5">
                        <div className="premium-card p-5 animate-slide-up bg-glass">
                            <div className="text-center mb-5">
                                <h2 className="display-6 fw-bold text-gradient mb-2">Welcome Back</h2>
                                <p className="text-muted">Sign in to your IndiaDrive account</p>
                            </div>

                            {error && (
                                <div className="alert alert-danger border-0 rounded-4 mb-4" role="alert">
                                    <i className="bi bi-exclamation-triangle-fill me-2"></i>
                                    {error}
                                </div>
                            )}

                            <form onSubmit={handleLogin}>
                                <div className="form-floating mb-4">
                                    <input
                                        type="text"
                                        className="form-control rounded-4 shadow-sm"
                                        id="username"
                                        placeholder="Username"
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                        required
                                    />
                                    <label htmlFor="username">Username</label>
                                </div>

                                <div className="form-floating mb-4">
                                    <input
                                        type="password"
                                        className="form-control rounded-4 shadow-sm"
                                        id="password"
                                        placeholder="Password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                    />
                                    <label htmlFor="password">Password</label>
                                </div>

                                <div className="d-flex justify-content-between align-items-center mb-4 px-1">
                                    <div className="form-check">
                                        <input className="form-check-input" type="checkbox" id="rememberMe" />
                                        <label className="form-check-label text-muted small" htmlFor="rememberMe">
                                            Remember me
                                        </label>
                                    </div>
                                    <button type="button" className="btn btn-link p-0 text-primary small text-decoration-none fw-medium border-0 bg-transparent" onClick={() => alert('Forgot Password feature coming soon')}>Forgot Password?</button>
                                </div>

                                <button
                                    type="submit"
                                    className="btn btn-premium btn-lg w-100 rounded-pill mb-4 shadow-glow"
                                    disabled={loading}
                                >
                                    {loading ? (
                                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                    ) : null}
                                    Sign In
                                </button>

                                <div className="divider d-flex align-items-center my-4">
                                    <p className="text-center fw-medium mx-3 mb-0 text-muted">OR</p>
                                </div>

                                <button type="button" className="btn btn-outline-premium btn-lg w-100 rounded-pill mb-4 border shadow-sm d-flex align-items-center justify-content-center">
                                    <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" width="20" className="me-2" />
                                    Continue with Google
                                </button>

                                <p className="text-center text-muted mt-4">
                                    Don't have an account? <Link to="/register" className="text-primary fw-bold text-decoration-none">Sign Up</Link>
                                </p>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
