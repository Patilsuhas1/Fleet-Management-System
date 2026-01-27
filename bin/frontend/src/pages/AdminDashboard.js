import React, { useState } from 'react';
import ApiService from '../services/api';

const AdminDashboard = () => {
    const [file, setFile] = useState(null);
    const [message, setMessage] = useState({ type: '', text: '' });
    const [loading, setLoading] = useState(false);

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
            setMessage({ type: 'warning', text: 'Please select a file.' });
            return;
        }

        setLoading(true);
        try {
            await apiMethod(currentFile);
            setMessage({ type: 'success', text: `${typeName} uploaded successfully!` });
            setFile(null); // Clear file after success
        } catch (err) {
            setMessage({ type: 'danger', text: 'Upload failed: ' + (err.response?.data?.message || err.message) });
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="container py-5">
            <h2 className="mb-5 text-gradient">Admin Console</h2>
            <div className="row">
                {/* RATES UPLOAD */}
                <div className="col-md-6 mb-4">
                    <div className="premium-card h-100 p-5">
                        <div className="text-center">
                            <i className="bi bi-currency-rupee display-4 text-primary mb-4 d-block"></i>
                            <h4 className="mb-3">Pricing Strategies</h4>
                            <p className="text-muted mb-4 px-lg-4">Upload bulk rates for base categories. Supports dynamic peak-season adjustments.</p>
                            <form onSubmit={handleRateUpload}>
                                <div className="glass-effect p-3 rounded-4 mb-3 border-light">
                                    <input type="file" className="form-control bg-white border text-muted" accept=".xlsx" onChange={(e) => setFile(e.target.files[0])} />
                                </div>
                                <button type="submit" className="btn btn-premium w-100" disabled={loading}>
                                    {loading ? 'Processing...' : 'Sync Rates (INR)'}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>

                {/* CARS UPLOAD */}
                <div className="col-md-6 mb-4">
                    <div className="premium-card h-100 p-5">
                        <div className="text-center">
                            <i className="bi bi-car-front-fill display-4 text-primary mb-4 d-block"></i>
                            <h4 className="mb-3">Fleet Inventory</h4>
                            <p className="text-muted mb-4 px-lg-4">Register new physical vehicles to the system. Assign hubs and plate numbers.</p>
                            <form onSubmit={handleCarUpload}>
                                <div className="glass-effect p-3 rounded-4 mb-3 border-light">
                                    <input type="file" className="form-control bg-white border text-muted" accept=".xlsx" onChange={(e) => setFile(e.target.files[0])} />
                                </div>
                                <button type="submit" className="btn btn-premium w-100" disabled={loading}>
                                    {loading ? 'Processing...' : 'Expand Fleet'}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>

            {/* VENDOR MANAGEMENT SECTION */}
            <div className="premium-card mt-4 overflow-hidden">
                <div className="bg-primary bg-opacity-10 p-4 border-bottom border-light d-flex justify-content-between align-items-center">
                    <h5 className="mb-0 fw-bold">Ecosystem Integrations</h5>
                    <button className="btn btn-sm btn-link text-primary text-decoration-none fw-600" onClick={() => setShowVendorForm(!showVendorForm)}>
                        {showVendorForm ? '✕ Close Panel' : '+ Add External API'}
                    </button>
                </div>
                <div className="p-4">
                    {showVendorForm && (
                        <div className="mb-5 p-4 glass-effect rounded-4 border-light">
                            <h6 className="mb-4 uppercase small tracking-wider text-primary">Register New Vendor Integration</h6>
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
                                <div className="col-md-2"><button className="btn btn-premium w-100" onClick={handleAddVendor}>Save</button></div>
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

            {message.text && (
                <div className={`alert alert-${message.type} mt-4 glass-effect border-0 rounded-4`}>{message.text}</div>
            )}
        </div>
    );
};

export default AdminDashboard;
