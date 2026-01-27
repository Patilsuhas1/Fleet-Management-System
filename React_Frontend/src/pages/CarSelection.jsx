import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import ApiService from '../services/api';

const CarSelection = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [cars, setCars] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [filter, setFilter] = useState('All');

    const { pickupHub, pickupDateTime, returnDateTime } = location.state || {};

    useEffect(() => {
        if (!location.state || !pickupHub) {
            navigate('/booking');
            return;
        }

        const fetchCars = async () => {
            try {
                const data = await ApiService.getAvailableCars(pickupHub.hubId, pickupDateTime, returnDateTime);
                setCars(data);
            } catch (err) {
                setError('Failed to load available cars. Please try again.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchCars();
    }, [location.state, navigate, pickupHub, pickupDateTime, returnDateTime]);

    const handleCarSelect = (car) => {
        navigate('/booking', {
            state: {
                selectedCar: car,
                pickupHub,
                startDate: pickupDateTime,
                endDate: returnDateTime
            }
        });
    };

    const filteredCars = filter === 'All'
        ? cars
        : cars.filter(car => car.carType?.carTypeName === filter);

    const carTypes = ['All', ...new Set(cars.map(car => car.carType?.carTypeName).filter(Boolean))];

    if (loading) return (
        <div className="container py-5 text-center">
            <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Searching for available cars...</span>
            </div>
        </div>
    );

    return (
        <div className="car-selection-page py-5">
            <div className="container py-5">
                <div className="d-flex flex-column flex-md-row justify-content-between align-items-center mb-5 gap-4">
                    <div className="text-start">
                        <h2 className="display-5 fw-bold text-gradient mb-2">Available Vehicles</h2>
                        <p className="text-muted mb-0">Showing cars for <span className="fw-bold text-primary">{pickupHub?.hubName}</span></p>
                    </div>

                    <div className="d-flex gap-2 p-2 bg-glass rounded-pill">
                        {carTypes.map(type => (
                            <button
                                key={type}
                                className={`btn btn-sm rounded-pill px-4 ${filter === type ? 'btn-premium' : 'btn-link text-decoration-none text-muted'}`}
                                onClick={() => setFilter(type)}
                            >
                                {type}
                            </button>
                        ))}
                    </div>
                </div>

                {error && (
                    <div className="alert alert-danger rounded-4 border-0 shadow-sm mb-5 text-center">
                        <i className="bi bi-exclamation-circle me-2"></i>{error}
                    </div>
                )}

                <div className="row g-4">
                    {filteredCars.length > 0 ? (
                        filteredCars.map(car => (
                            <div className="col-lg-4 col-md-6" key={car.carId}>
                                <div className="premium-card h-100 p-0 overflow-hidden shadow-premium border-0">
                                    <div className="position-relative">
                                        <img
                                            src={car.imagePath || 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&w=500&q=60'}
                                            alt={car.carModel}
                                            className="w-100 h-100 object-fit-cover"
                                            style={{ height: '220px' }}
                                        />
                                        <div className="position-absolute top-0 end-0 m-3">
                                            <span className="badge bg-primary rounded-pill px-3 py-2 shadow-sm">₹{car.carType?.dailyRate}/day</span>
                                        </div>
                                    </div>

                                    <div className="p-4">
                                        <div className="d-flex justify-content-between align-items-start mb-3">
                                            <div>
                                                <h4 className="fw-bold mb-1">{car.carModel}</h4>
                                                <p className="text-muted small mb-0">{car.carType?.carTypeName || 'Premium Sedan'}</p>
                                            </div>
                                            <div className="text-warning">
                                                <i className="bi bi-star-fill"></i>
                                                <i className="bi bi-star-fill"></i>
                                                <i className="bi bi-star-fill"></i>
                                                <i className="bi bi-star-fill"></i>
                                                <i className="bi bi-star-half"></i>
                                            </div>
                                        </div>

                                        <div className="row g-2 mb-4">
                                            <div className="col-6">
                                                <div className="bg-light p-2 rounded-3 text-center small text-muted">
                                                    <i className="bi bi-people me-1"></i> 5 Seats
                                                </div>
                                            </div>
                                            <div className="col-6">
                                                <div className="bg-light p-2 rounded-3 text-center small text-muted">
                                                    <i className="bi bi-gear me-1"></i> Automatic
                                                </div>
                                            </div>
                                            <div className="col-6">
                                                <div className="bg-light p-2 rounded-3 text-center small text-muted">
                                                    <i className="bi bi-fuel-pump me-1"></i> Petrol
                                                </div>
                                            </div>
                                            <div className="col-6">
                                                <div className="bg-light p-2 rounded-3 text-center small text-muted">
                                                    <i className="bi bi-briefcase me-1"></i> 2 Large
                                                </div>
                                            </div>
                                        </div>

                                        <button
                                            className="btn btn-premium w-100 rounded-pill shadow-glow"
                                            onClick={() => handleCarSelect(car)}
                                        >
                                            Book This Vehicle
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="col-12 text-center py-5">
                            <i className="bi bi-car-front display-1 text-muted opacity-25 mb-4"></i>
                            <h3 className="fw-bold">No Vehicles Available</h3>
                            <p className="text-muted">There are no vehicles matching your criteria at this location for these dates.</p>
                            <button className="btn btn-outline-primary rounded-pill px-5 mt-3" onClick={() => navigate('/booking')}>Modify Search</button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CarSelection;
