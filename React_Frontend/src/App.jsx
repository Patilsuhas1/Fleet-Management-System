import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import About from './pages/About';
import Login from './pages/Login';
import Register from './pages/Register';
import Booking from './pages/Booking';
import MyBookings from './pages/MyBookings';
import CarSelection from './pages/CarSelection';
import HubSelection from './pages/HubSelection';
import StaffDashboard from './pages/StaffDashboard';
import AdminDashboard from './pages/AdminDashboard';
import AdminBookings from './pages/AdminBookings';
import StaffManagement from './pages/StaffManagement';
import ManageBooking from './pages/ManageBooking';
import CustomerCare from './pages/CustomerCare';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

function App() {
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'dark-theme');

  useEffect(() => {
    localStorage.setItem('theme', theme);
    // Apply theme to body
    document.body.className = theme;
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark-theme' ? 'light-theme' : 'dark-theme');
  };

  return (
    <Router>
      <Navbar theme={theme} toggleTheme={toggleTheme} />
      <div className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/customer-care" element={<CustomerCare />} />
          <Route path="/booking" element={<Booking />} />
          <Route path="/manage-booking" element={<ManageBooking />} />
          <Route path="/my-bookings" element={<MyBookings />} />
          <Route path="/select-car" element={<CarSelection />} />
          <Route path="/select-hub" element={<HubSelection />} />
          <Route path="/staff/dashboard" element={<StaffDashboard />} />
          <Route path="/staff/handover" element={<StaffDashboard />} />
          <Route path="/staff/return" element={<StaffDashboard />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/bookings" element={<AdminBookings />} />
          <Route path="/admin/staff" element={<StaffManagement />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
