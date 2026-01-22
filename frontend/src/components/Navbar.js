import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthService from '../services/authService';

const Navbar = () => {
    const navigate = useNavigate();
    const user = AuthService.getCurrentUser();
    const role = user?.role;

    const handleLogout = () => {
        AuthService.logout();
        navigate('/login');
    };

    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
            <div className="container-fluid">
                <Link className="navbar-brand" to="/">IndiaDrive</Link>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav me-auto">
                        <li className="nav-item">
                            <Link className="nav-link" to="/">Home</Link>
                        </li>

                        {/* Customer Links */}
                        {role === 'CUSTOMER' && (
                            <>
                                <li className="nav-item">
                                    <Link className="nav-link" to="/booking">Book a Car</Link>
                                </li>
                                <li className="nav-item">
                                    <Link className="nav-link" to="/my-bookings">My Bookings</Link>
                                </li>
                            </>
                        )}

                        {/* Staff Links */}
                        {role === 'STAFF' && (
                            <>
                                <li className="nav-item">
                                    <Link className="nav-link" to="/staff/dashboard">Dashboard</Link>
                                </li>
                                <li className="nav-item">
                                    <Link className="nav-link" to="/staff/handover">Handover</Link>
                                </li>
                                <li className="nav-item">
                                    <Link className="nav-link" to="/staff/return">Return</Link>
                                </li>
                            </>
                        )}

                        {/* Admin Links */}
                        {role === 'ADMIN' && (
                            <>
                                <li className="nav-item">
                                    <Link className="nav-link" to="/admin/dashboard">Admin Panel</Link>
                                </li>
                            </>
                        )}

                        <li className="nav-item">
                            <Link className="nav-link" to="/about">About Us</Link>
                        </li>
                    </ul>

                    <div className="d-flex">
                        {user ? (
                            <div className="navbar-text text-white">
                                <span className="me-3">Welcome, {user.username} ({role})</span>
                                <button className="btn btn-outline-light btn-sm" onClick={handleLogout}>Logout</button>
                            </div>
                        ) : (
                            <div>
                                <Link className="btn btn-outline-primary me-2" to="/login">Login</Link>
                                <Link className="btn btn-primary" to="/register">Register</Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
