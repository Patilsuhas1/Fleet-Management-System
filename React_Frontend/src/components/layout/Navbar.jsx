import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthService from '../../services/authService';

const Navbar = ({ theme, toggleTheme }) => {
    const navigate = useNavigate();
    const user = AuthService.getCurrentUser();
    const role = user?.role;

    const handleLogout = () => {
        AuthService.logout();
        navigate('/login');
    };

    return (
        <nav className="navbar navbar-expand-lg border-bottom border-light sticky-top">
            <div className="container">
                <Link className="navbar-brand d-flex align-items-center" to="/">
                    <i className="bi bi-shield-shaded me-2 text-primary"></i>
                    <span className="text-gradient">IndiaDrive</span>
                </Link>
                <button className="navbar-toggler border-0 shadow-none" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav mx-auto">
                        <li className="nav-item">
                            <Link className="nav-link px-3" to="/">Home</Link>
                        </li>

                        {(!user || role === 'CUSTOMER') && (
                            <li className="nav-item">
                                <Link className="nav-link px-3" to="/booking">Book a Car</Link>
                            </li>
                        )}

                        {/* Customer Links */}
                        {role === 'CUSTOMER' && (
                            <>
                                <li className="nav-item">
                                    <Link className="nav-link px-3" to="/my-bookings">My Bookings</Link>
                                </li>
                            </>
                        )}

                        {/* Staff Links */}
                        {role === 'STAFF' && (
                            <>
                                <li className="nav-item">
                                    <Link className="nav-link px-3" to="/staff/dashboard">Dashboard</Link>
                                </li>
                            </>
                        )}

                        {/* Admin Links */}
                        {role === 'ADMIN' && (
                            <>
                                <li className="nav-item">
                                    <Link className="nav-link px-3" to="/admin/dashboard">Admin Panel</Link>
                                </li>
                            </>
                        )}

                        <li className="nav-item">
                            <Link className="nav-link px-3" to="/about">About Us</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link px-3" to="/customer-care">Support</Link>
                        </li>
                    </ul>

                    <div className="d-flex align-items-center gap-2">
                        {/* Theme Toggle Button */}
                        <button
                            className="btn btn-link text-muted p-2 me-2 fs-5 hover-scale"
                            onClick={toggleTheme}
                            title={`Switch to ${theme === 'dark-theme' ? 'Light' : 'Dark'} Mode`}
                        >
                            <i className={`bi bi-${theme === 'dark-theme' ? 'sun' : 'moon-stars'}-fill`}></i>
                        </button>

                        {user ? (
                            <div className="d-flex align-items-center gap-3">
                                <span className="text-muted small d-none d-lg-block">Welcome, <span className="text-adaptive fw-medium">{user.username}</span></span>
                                <button className="btn btn-outline-danger btn-sm rounded-pill px-4" onClick={handleLogout}>Logout</button>
                            </div>
                        ) : (
                            <div className="gap-3 d-flex align-items-center">
                                <Link className="text-adaptive text-decoration-none fw-600 hover-opacity" to="/login">Login</Link>
                                <Link className="btn btn-premium rounded-pill px-4" to="/register">Join Now</Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
