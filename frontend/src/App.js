import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import ListingDetail from './pages/ListingDetail';
import Login from './pages/Login';
import Register from './pages/Register';
import MyBookings from './pages/MyBookings';
import CreateListing from './pages/CreateListing';
import './App.css';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/"              element={<Home />} />
          <Route path="/listing/:id"   element={<ListingDetail />} />
          <Route path="/login"         element={<Login />} />
          <Route path="/register"      element={<Register />} />
          <Route path="/my-bookings"   element={<MyBookings />} />
          <Route path="/create"        element={<CreateListing />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
