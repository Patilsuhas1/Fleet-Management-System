import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import ApiService from '../services/api';

const HubSelection = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [hubs, setHubs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const { pickupDateTime, returnDateTime, locationData, searchType } = location.state || {};

    useEffect(() => {
        if (!location.state) {
            navigate('/booking');
            return;
        }

        const fetchHubs = async () => {
            try {
                let data = [];
                if (searchType === 'airport') {
                    // locationData is already the hub list for airports in current Booking.js logic
                    data = locationData;
                } else if (searchType === 'city') {
                    data = await ApiService.getHubs(locationData.stateName, locationData.cityName);
                }
                setHubs(data);
            } catch (err) {
                setError('Failed to load hubs. Please try again.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchHubs();
    }, [location.state, navigate, searchType, locationData]);

    const handleHubSelect = (hub) => {
        navigate('/select-car', {
            state: {
                pickupHub: hub,
                pickupDateTime,
                returnDateTime
            }
        });
    };

    if (loading) return (
        <div className="container py-5 text-center">
            <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading Hubs...</span>
            </div>
        </div>
    );

    return (
        <div className="hub-selection-page py-5">
            <div className="container py-5">
                <div className="text-center mb-5">
                    <h2 className="display-5 fw-bold text-gradient mb-3">Select a Pick-up Hub</h2>
                    <p className="text-muted fs-5">Choose the most convenient location to start your journey.</p>
                </div>

                {error && (
                    <div className="alert alert-danger rounded-4 border-0 shadow-sm mb-5 text-center">
                        <i className="bi bi-exclamation-circle me-2"></i>{error}
                    </div>
                )}

                <div className="row g-4 justify-content-center">
                    {hubs.length > 0 ? (
                        hubs.map(hub => (
                            <div className="col-lg-4 col-md-6" key={hub.hubId}>
                                <div className="premium-card h-100 p-0 overflow-hidden shadow-premium border-0">
                                    <div className="p-4">
                                        <div className="d-flex align-items-start mb-3">
                                            <div className="bg-primary bg-opacity-10 p-3 rounded-circle me-3">
                                                <i className="bi bi-geo-alt fs-4 text-primary"></i>
                                            </div>
                                            <div>
                                                <h4 className="fw-bold mb-1">{hub.hubName}</h4>
                                                <p className="text-muted small mb-0">{hub.hubAddress}</p>
                                            </div>
                                        </div>

                                        <div className="border-top border-light pt-3 mt-3">
                                            <div className="d-flex justify-content-between align-items-center mb-3">
                                                <span className="text-muted small"><i className="bi bi-clock me-1"></i> Available 24/7</span>
                                                <span className="badge bg-success bg-opacity-10 text-success rounded-pill px-3">Open</span>
                                            </div>
                                            <button
                                                className="btn btn-premium w-100 rounded-pill shadow-glow"
                                                onClick={() => handleHubSelect(hub)}
                                            >
                                                Select Hub
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="col-12 text-center py-5">
                            <div className="bg-light p-5 rounded-5 border-0 shadow-sm d-inline-block">
                                <i className="bi bi-search display-3 text-muted mb-4 d-block"></i>
                                <h3 className="fw-bold mb-3">No Hubs Found</h3>
                                <p className="text-muted mb-4">We couldn't find any locations matching your search criteria.</p>
                                <button className="btn btn-outline-primary rounded-pill px-5" onClick={() => navigate('/booking')}>Go Back</button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default HubSelection;
