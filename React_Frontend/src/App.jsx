import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import Home from './pages/client/Home';
import About from './pages/client/About';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Booking from './pages/client/Booking';
import MyBookings from './pages/client/MyBookings';
import CarSelection from './pages/client/CarSelection';
import HubSelection from './pages/client/HubSelection';
import StaffDashboard from './pages/staff/StaffDashboard';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminBookings from './pages/admin/AdminBookings';
import StaffManagement from './pages/admin/StaffManagement';
import ManageBooking from './pages/client/ManageBooking';
import CustomerCare from './pages/client/CustomerCare';

function App() {
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'dark');

  useEffect(() => {
    localStorage.setItem('theme', theme);
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  return (
    <Router>
      <div className="flex flex-col min-h-screen bg-background text-foreground">
        <Navbar theme={theme} toggleTheme={toggleTheme} />
        <main className="flex-grow">
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
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
