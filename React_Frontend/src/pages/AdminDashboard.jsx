import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ApiService from '../services/api';

const AdminDashboard = () => {
    const navigate = useNavigate();
    const [file, setFile] = useState(null);
    const [message, setMessage] = useState({ type: '', text: '' });
    const [loading, setLoading] = useState(false);

    const [uploadKey, setUploadKey] = useState(Date.now());

    // Auto-clear message after 5 seconds
    React.useEffect(() => {
        if (message.text) {
            const timer = setTimeout(() => {
                setMessage({ type: '', text: '' });
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [message]);

    const handleRateUpload = async (e) => {
        e.preventDefault();
        uploadFile(file, ApiService.uploadRates, 'Rates');
    };

    const handleCarUpload = async (e) => {
        e.preventDefault();
        uploadFile(file, ApiService.uploadCars, 'Cars');
    };

    const [vendors, setVendors] = useState([]);
    const [newVendor, setNewVendor] = useState({ name: '', type: 'Maintenance', email: '', apiUrl: 'https://api.example.com/v1' });
    const [showVendorForm, setShowVendorForm] = useState(false);

    React.useEffect(() => {
        loadVendors();
    }, []);

    const loadVendors = async () => {
        try {
            const data = await ApiService.getAllVendors();
            setVendors(data);
        } catch (e) { console.error(e); }
    };

    const handleAddVendor = async () => {
        if (!newVendor.name) return;
        try {
            await ApiService.addVendor(newVendor);
            setMessage({ type: 'success', text: 'Vendor added successfully.' });
            setNewVendor({ name: '', type: 'Maintenance', email: '', apiUrl: 'https://api.example.com/v1' });
            setShowVendorForm(false);
            loadVendors();
        } catch (e) { setMessage({ type: 'danger', text: 'Failed to add vendor.' }); }
    };

    const handleTestConnection = async (id) => {
        try {
            const res = await ApiService.testVendorConnection(id);
            alert(res.message);
        } catch (e) {
            alert('Connection Failed: ' + (e.response?.data?.message || e.message));
        }
    };

    const uploadFile = async (currentFile, apiMethod, typeName) => {
        if (!currentFile) {
            setMessage({ type: 'warning', text: 'Please select a file first.' });
            return;
        }

        setLoading(true);
        setMessage({ type: '', text: '' }); // Clear old message

        try {
            const res = await apiMethod(currentFile);
            console.log(`${typeName} upload response:`, res);
            setMessage({ type: 'success', text: `${typeName} synchronization completed successfully!` });
            setFile(null);
            setUploadKey(Date.now()); // Reset input field
        } catch (err) {
            console.error(`${typeName} upload error:`, err);
            const errMsg = err.response?.data?.message || err.message || 'Unknown error';
            setMessage({ type: 'danger', text: 'Upload failed: ' + errMsg });
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="container-fluid px-5 py-5 bg-light min-vh-100">
            <div className="d-flex justify-content-between align-items-center mb-5">
                <div>
                    <h2 className="mb-1 text-gradient display-5 fw-bold">Admin Console</h2>
                    <p className="text-muted mb-0">Manage fleet, pricing, and ecosystem integrations.</p>
                </div>
                {loading && (
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                )}
            </div>

            {/* Notification Bar */}
            {message.text && (
                <div className={`alert alert-${message.type} mb-4 shadow-sm border-0 rounded-4 animate-fade-in py-3 d-flex align-items-center`}>
                    <i className={`bi bi-${message.type === 'success' ? 'check-circle-fill' : 'exclamation-triangle-fill'} me-3 fs-4`}></i>
                    <div>
                        <strong className="d-block">{message.type === 'success' ? 'Success' : 'Attention'}</strong>
                        {message.text}
                    </div>
                </div>
            )}

            <div className="row g-4 mb-5">
                {/* RATES UPLOAD */}
                <div className="col-lg-3">
                    <div className="premium-card h-100 p-4 shadow-sm border-0 bg-white">
                        <div className="text-center">
                            <div className="icon-box bg-primary bg-opacity-10 rounded-circle d-inline-flex p-3 mb-4">
                                <i className="bi bi-currency-rupee fs-2 text-primary"></i>
                            </div>
                            <h4 className="fw-bold mb-3">Pricing Strategies</h4>
                            <p className="text-muted small mb-4">Bulk rates synchronization with dynamic adjustments.</p>
                            <form onSubmit={handleRateUpload}>
                                <div className="glass-effect p-2 rounded-4 mb-3 bg-light">
                                    <input
                                        key={`rate-${uploadKey}`}
                                        type="file"
                                        className="form-control form-control-sm bg-white border text-muted"
                                        accept=".xlsx"
                                        onChange={(e) => setFile(e.target.files[0])}
                                    />
                                </div>
                                <button type="submit" className="btn btn-primary w-100 py-2 rounded-pill fw-bold shadow-sm" disabled={loading}>
                                    {loading ? 'Processing...' : 'SYNC RATES'}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>

                {/* CARS UPLOAD */}
                <div className="col-lg-3">
                    <div className="premium-card h-100 p-4 shadow-sm border-0 bg-white">
                        <div className="text-center">
                            <div className="icon-box bg-primary bg-opacity-10 rounded-circle d-inline-flex p-3 mb-4">
                                <i className="bi bi-car-front-fill fs-2 text-primary"></i>
                            </div>
                            <h4 className="fw-bold mb-3">Fleet Inventory</h4>
                            <p className="text-muted small mb-4">Register new vehicles and assign to hubs.</p>
                            <form onSubmit={handleCarUpload}>
                                <div className="glass-effect p-2 rounded-4 mb-3 bg-light">
                                    <input
                                        key={`car-${uploadKey}`}
                                        type="file"
                                        className="form-control form-control-sm bg-white border text-muted"
                                        accept=".xlsx"
                                        onChange={(e) => setFile(e.target.files[0])}
                                    />
                                </div>
                                <button type="submit" className="btn btn-primary w-100 py-2 rounded-pill fw-bold shadow-sm" disabled={loading}>
                                    {loading ? 'Processing...' : 'EXPAND FLEET'}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>

                {/* BOOKINGS LINK */}
                <div className="col-lg-3">
                    <div className="premium-card h-100 p-4 shadow-sm border-0 bg-white border-start border-success border-4 rounded-4">
                        <div className="text-center">
                            <div className="icon-box bg-success bg-opacity-10 rounded-circle d-inline-flex p-3 mb-4">
                                <i className="bi bi-calendar-check fs-2 text-success"></i>
                            </div>
                            <h4 className="fw-bold mb-3">Booking Insights</h4>
                            <p className="text-muted small mb-4">Monitor all active and pending reservations.</p>
                            <div className="pt-2">
                                <button className="btn btn-success w-100 py-3 rounded-pill fw-bold shadow-sm d-flex align-items-center justify-content-center" onClick={() => navigate('/admin/bookings')}>
                                    VIEW RECORDS<i className="bi bi-arrow-right ms-2"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* STAFF MANAGEMENT */}
                <div className="col-lg-3">
                    <div className="premium-card h-100 p-4 shadow-sm border-0 bg-white border-start border-primary border-4 rounded-4">
                        <div className="text-center">
                            <div className="icon-box bg-primary bg-opacity-10 rounded-circle d-inline-flex p-3 mb-4">
                                <i className="bi bi-people-fill fs-2 text-primary"></i>
                            </div>
                            <h4 className="fw-bold mb-3">Operator Control</h4>
                            <p className="text-muted small mb-4">Manage staff accounts and assignments.</p>
                            <div className="pt-2">
                                <button className="btn btn-primary w-100 py-3 rounded-pill fw-bold shadow-sm d-flex align-items-center justify-content-center" onClick={() => navigate('/admin/staff')}>
                                    MANAGE STAFF<i className="bi bi-person-plus ms-2"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* VENDOR MANAGEMENT SECTION */}
            <div className="premium-card shadow-sm border-0 overflow-hidden bg-white">
                <div className="bg-primary bg-opacity-10 p-4 border-bottom border-light d-flex justify-content-between align-items-center">
                    <h5 className="mb-0 fw-bold">Ecosystem Integrations</h5>
                    <button className="btn btn-sm btn-link text-primary text-decoration-none fw-600" onClick={() => setShowVendorForm(!showVendorForm)}>
                        {showVendorForm ? '✕ Close Panel' : '+ Add External API'}
                    </button>
                </div>
                <div className="p-4">
                    {showVendorForm && (
                        <div className="mb-5 p-4 glass-effect rounded-4 border-light bg-light animate-fade-in">
                            <h6 className="mb-4 uppercase small tracking-wider text-primary fw-bold">Register New Vendor Integration</h6>
                            <div className="row g-3">
                                <div className="col-md-3"><input className="form-control bg-white border text-dark" placeholder="Vendor Name" value={newVendor.name} onChange={e => setNewVendor({ ...newVendor, name: e.target.value })} /></div>
                                <div className="col-md-3">
                                    <select className="form-select bg-white border text-dark" value={newVendor.type} onChange={e => setNewVendor({ ...newVendor, type: e.target.value })}>
                                        <option>Maintenance</option>
                                        <option>Cleaning</option>
                                        <option>Parts Supplier</option>
                                    </select>
                                </div>
                                <div className="col-md-4"><input className="form-control bg-white border text-dark" placeholder="REST API Endpoint" value={newVendor.apiUrl} onChange={e => setNewVendor({ ...newVendor, apiUrl: e.target.value })} /></div>
                                <div className="col-md-2"><button className="btn btn-primary w-100 shadow-sm" onClick={handleAddVendor}>Save Integration</button></div>
                            </div>
                        </div>
                    )}

                    <div className="table-responsive">
                        <table className="table table-hover align-middle">
                            <thead className="table-light">
                                <tr className="text-muted small uppercase">
                                    <th className="px-4">Service Provider</th>
                                    <th>Category</th>
                                    <th>API Hub</th>
                                    <th className="text-end px-4">Connectivity</th>
                                </tr>
                            </thead>
                            <tbody>
                                {vendors.map(v => (
                                    <tr key={v.vendorId}>
                                        <td className="px-4 py-3">
                                            <div className="d-flex align-items-center">
                                                <div className="bg-primary bg-opacity-10 rounded-circle p-2 me-3">
                                                    <i className="bi bi-plug text-primary"></i>
                                                </div>
                                                <span className="fw-600 text-dark">{v.name}</span>
                                            </div>
                                        </td>
                                        <td><span className="badge rounded-pill bg-primary bg-opacity-25 text-primary border border-primary border-opacity-25 px-3 py-2">{v.type}</span></td>
                                        <td className="text-muted small font-monospace">{v.apiUrl || 'internal-link://v1'}</td>
                                        <td className="text-end px-4">
                                            <button className="btn btn-sm btn-outline-primary rounded-pill px-3" onClick={() => handleTestConnection(v.vendorId)}>
                                                Ping API
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                                {vendors.length === 0 && <tr><td colSpan="4" className="text-center py-5 text-muted">No external integrations discovered.</td></tr>}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>


        </div>
    );
};

export default AdminDashboard;
