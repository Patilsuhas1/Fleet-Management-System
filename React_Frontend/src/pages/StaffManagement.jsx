import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ApiService from '../services/api';

const StaffManagement = () => {
    const navigate = useNavigate();
    const [staffList, setStaffList] = useState([]);
    const [hubs, setHubs] = useState([]);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    const [newStaff, setNewStaff] = useState({
        username: '',
        email: '',
        password: '',
        hub: { hubId: '' }
    });

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setLoading(true);
        try {
            const [staffData, hubData] = await Promise.all([
                ApiService.getAdminStaff(),
                ApiService.getAdminHubs()
            ]);
            setStaffList(staffData || []);
            setHubs(hubData || []);
        } catch (e) {
            console.error("Failed to load staff management data:", e);
            setMessage({ type: 'danger', text: 'Failed to synchronize staff data.' });
        } finally {
            setLoading(false);
        }
    };

    const handleRegisterStaff = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await ApiService.registerStaff(newStaff);
            setMessage({ type: 'success', text: 'New staff member registered successfully!' });
            setNewStaff({ username: '', email: '', password: '', hub: { hubId: '' } });
            loadData();
        } catch (e) {
            setMessage({ type: 'danger', text: 'Registration failed: ' + (e.response?.data?.message || e.message) });
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteStaff = async (id) => {
        if (!window.confirm('Are you sure you want to remove this staff member?')) return;
        setLoading(true);
        try {
            await ApiService.deleteStaff(id);
            setMessage({ type: 'success', text: 'Staff access revoked.' });
            loadData();
        } catch (e) {
            setMessage({ type: 'danger', text: 'Failed to revoke access.' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container-fluid px-5 py-5 bg-light min-vh-100">
            <div className="d-flex justify-content-between align-items-center mb-5">
                <div>
                    <button className="btn btn-link text-decoration-none p-0 mb-3 text-primary fw-bold" onClick={() => navigate('/admin/dashboard')}>
                        <i className="bi bi-arrow-left me-2"></i>Back to Admin Console
                    </button>
                    <h2 className="mb-1 text-gradient display-5 fw-bold">Staff Management</h2>
                    <p className="text-muted mb-0">Provision and manage secure access for fleet operators.</p>
                </div>
                {loading && (
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                )}
            </div>

            {message.text && (
                <div className={`alert alert-${message.type} mb-4 shadow-sm border-0 rounded-4 animate-fade-in py-3 d-flex align-items-center`}>
                    <i className={`bi bi-${message.type === 'success' ? 'check-circle-fill' : 'exclamation-triangle-fill'} me-3 fs-4`}></i>
                    <div>{message.text}</div>
                </div>
            )}

            <div className="row g-4">
                {/* REGISTRATION FORM */}
                <div className="col-lg-4">
                    <div className="premium-card p-4 shadow-sm border-0 bg-white">
                        <h4 className="fw-bold mb-4">Register New Operator</h4>
                        <form onSubmit={handleRegisterStaff}>
                            <div className="mb-3">
                                <label className="form-label small text-muted">Username</label>
                                <input
                                    type="text"
                                    className="form-control rounded-3"
                                    value={newStaff.username}
                                    onChange={e => setNewStaff({ ...newStaff, username: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="mb-3">
                                <label className="form-label small text-muted">Email Address</label>
                                <input
                                    type="email"
                                    className="form-control rounded-3"
                                    value={newStaff.email}
                                    onChange={e => setNewStaff({ ...newStaff, email: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="mb-3">
                                <label className="form-label small text-muted">Initial Password</label>
                                <input
                                    type="password"
                                    className="form-control rounded-3"
                                    value={newStaff.password}
                                    onChange={e => setNewStaff({ ...newStaff, password: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label className="form-label small text-muted">Assign to physical Hub</label>
                                <select
                                    className="form-select rounded-3"
                                    value={newStaff.hub.hubId}
                                    onChange={e => setNewStaff({ ...newStaff, hub: { hubId: e.target.value } })}
                                    required
                                >
                                    <option value="">Select a Hub...</option>
                                    {hubs.map(h => (
                                        <option key={h.hubId} value={h.hubId}>{h.hubName} ({h.city.cityName})</option>
                                    ))}
                                </select>
                            </div>
                            <button type="submit" className="btn btn-primary w-100 py-3 rounded-pill fw-bold shadow-sm" disabled={loading}>
                                <i className="bi bi-person-plus-fill me-2"></i>CREATE STAFF ACCOUNT
                            </button>
                        </form>
                    </div>
                </div>

                {/* STAFF LIST */}
                <div className="col-lg-8">
                    <div className="premium-card shadow-sm border-0 bg-white overflow-hidden">
                        <div className="p-4 border-bottom bg-white d-flex justify-content-between align-items-center">
                            <h5 className="mb-0 fw-bold">Active Fleet Operators</h5>
                            <span className="badge bg-primary bg-opacity-10 text-primary rounded-pill px-3 py-2">
                                {staffList.length} Accounts Found
                            </span>
                        </div>
                        <div className="table-responsive">
                            <table className="table table-hover align-middle mb-0">
                                <thead className="bg-light">
                                    <tr className="small text-muted uppercase">
                                        <th className="px-4">Username</th>
                                        <th>Email</th>
                                        <th>Assigned Hub</th>
                                        <th className="text-end px-4">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {staffList.map(s => (
                                        <tr key={s.id}>
                                            <td className="px-4 fw-600">{s.username}</td>
                                            <td className="text-muted">{s.email}</td>
                                            <td>
                                                {s.hub ? (
                                                    <span className="badge bg-light text-dark border">
                                                        <i className="bi bi-geo-alt-fill text-danger me-1"></i>
                                                        {s.hub.hubName}
                                                    </span>
                                                ) : <span className="text-muted small italic">Not Assigned</span>}
                                            </td>
                                            <td className="text-end px-4">
                                                <button
                                                    className="btn btn-sm btn-outline-danger rounded-pill px-3"
                                                    onClick={() => handleDeleteStaff(s.id)}
                                                    disabled={loading}
                                                >
                                                    Revoke Access
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                    {staffList.length === 0 && (
                                        <tr>
                                            <td colSpan="4" className="text-center py-5 text-muted bg-white">
                                                <i className="bi bi-people display-1 d-block opacity-25 mb-3"></i>
                                                Nothing found. Use the form on the left to add staff.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StaffManagement;
