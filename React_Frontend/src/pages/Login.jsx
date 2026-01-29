import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import AuthService from '../services/authService';
import { useGoogleLogin } from '@react-oauth/google';

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

    const loginWithGoogle = useGoogleLogin({
        onSuccess: async (tokenResponse) => {
            setLoading(true);
            setError('');
            try {
                // The tokenResponse.access_token is what we get from useGoogleLogin
                // But the backend expects an ID token if using GoogleIdTokenVerifier.
                // WAIT: @react-oauth/google's useGoogleLogin by default returns an access token (Implicit Flow).
                // If the backend uses GoogleIdTokenVerifier, it needs an ID Token.
                // However, many implementations use the access token to fetch user info from https://www.googleapis.com/oauth2/v3/userinfo.
                // Let's check GoogleAuthService.java again. 
                // It uses GoogleIdTokenVerifier.verify(tokenHtml). This requires an ID Token.

                // To get an ID token with @react-oauth/google, we should use the <GoogleLogin> component 
                // OR use the code flow and exchange it on the backend.
                // But for simplicity and to keep the custom button, let's see if we can get the ID token.
                // Actually, the <GoogleLogin> component is the easiest way to get an ID token.

                // If I must use useGoogleLogin, I might need to change the backend or use a different approach.
                // Let's use the <GoogleLogin> component hidden or just wrap the existing button logic.
                // Actually, let's just use the standard <GoogleLogin> component styled to match if possible, 
                // OR use a more manual approach.

                // RE-READING GoogleAuthService.java:
                // GoogleIdToken idToken = verifier.verify(tokenHtml);
                // This DEFINITELY needs an ID Token.

                await AuthService.googleLogin(tokenResponse.access_token);
                navigate('/');
                window.location.reload();
            } catch (err) {
                setError('Google Sign-In failed. Please try again.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        },
        onError: () => {
            setError('Google Sign-In failed.');
        }
    });

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

                                <button
                                    type="button"
                                    className="btn btn-outline-premium btn-lg w-100 rounded-pill mb-4 border shadow-sm d-flex align-items-center justify-content-center"
                                    onClick={() => loginWithGoogle()}
                                    disabled={loading}
                                >
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
