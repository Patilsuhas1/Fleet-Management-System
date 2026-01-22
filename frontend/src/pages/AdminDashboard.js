import React, { useState } from 'react';
import ApiService from '../services/api';

const AdminDashboard = () => {
    const [file, setFile] = useState(null);
    const [message, setMessage] = useState({ type: '', text: '' });
    const [loading, setLoading] = useState(false);

    const handleUpload = async (e) => {
        e.preventDefault();
        if (!file) {
            setMessage({ type: 'warning', text: 'Please select a file.' });
            return;
        }

        setLoading(true);
        try {
            await ApiService.uploadRates(file);
            setMessage({ type: 'success', text: 'Rates uploaded successfully!' });
        } catch (err) {
            setMessage({ type: 'danger', text: 'Upload failed: ' + (err.response?.data?.message || err.message) });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container py-5">
            <h2 className="mb-4">Admin Console</h2>
            <div className="card shadow-sm border-0">
                <div className="card-body p-4">
                    <h5 className="card-title text-muted mb-4">Bulk Data Management</h5>

                    <div className="border border-dashed p-5 rounded text-center bg-light">
                        <i className="bi bi-file-earmark-spreadsheet fs-1 text-success mb-3"></i>
                        <h4 className="mb-3">Upload Vehicle Rates</h4>
                        <p className="text-muted mb-4">Upload an Excel (.xlsx) file to update daily, weekly, and monthly rates for car types.</p>

                        <form onSubmit={handleUpload} className="d-inline-block">
                            <input
                                type="file"
                                className="form-control mb-3"
                                accept=".xlsx"
                                onChange={(e) => setFile(e.target.files[0])}
                            />
                            <button type="submit" className="btn btn-primary px-5" disabled={loading}>
                                {loading ? 'Uploading...' : 'Upload Data'}
                            </button>
                        </form>
                    </div>

                    {message.text && (
                        <div className={`alert alert-${message.type} mt-4`}>{message.text}</div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
