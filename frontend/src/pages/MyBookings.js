import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import './MyBookings.css';

const API = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

export default function MyBookings() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading]   = useState(true);

  useEffect(() => {
    if (!user) return navigate('/login');
    axios.get(`${API}/bookings/my`)
      .then(r => setBookings(r.data))
      .finally(() => setLoading(false));
  }, [user, navigate]);

  const cancel = async (id) => {
    await axios.delete(`${API}/bookings/${id}`);
    setBookings(bs => bs.map(b => b._id === id ? { ...b, status: 'cancelled' } : b));
  };

  const nights = (b) => Math.max(1, Math.ceil((new Date(b.checkOut) - new Date(b.checkIn)) / 86400000));
  const fallback = 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400';

  if (loading) return <div className="page loading">Loading your bookings...</div>;

  return (
    <div className="page bookings-page container">
      <h1 className="bookings-title">My Bookings</h1>
      {bookings.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">🗓️</div>
          <h3>No bookings yet</h3>
          <p>Start exploring and book your first stay!</p>
          <Link to="/" className="btn-primary" style={{display:'inline-block',marginTop:16}}>Explore Listings</Link>
        </div>
      ) : (
        <div className="bookings-list">
          {bookings.map(b => (
            <div key={b._id} className={`booking-item ${b.status}`}>
              <img src={b.listing?.image || fallback} alt={b.listing?.title} onError={e => e.target.src = fallback} />
              <div className="booking-info">
                <div className="booking-status-badge" data-status={b.status}>{b.status}</div>
                <h3>{b.listing?.title || 'Listing'}</h3>
                <p className="bi-location">📍 {b.listing?.location}</p>
                <p className="bi-dates">
                  {new Date(b.checkIn).toLocaleDateString('en-IN', {day:'numeric',month:'short',year:'numeric'})}
                  {' → '}
                  {new Date(b.checkOut).toLocaleDateString('en-IN', {day:'numeric',month:'short',year:'numeric'})}
                  <span> · {nights(b)} night{nights(b) > 1 ? 's' : ''}</span>
                </p>
                <p className="bi-total">₹{b.totalPrice?.toLocaleString()} total</p>
              </div>
              <div className="booking-actions">
                <Link to={`/listing/${b.listing?._id}`} className="btn-outline" style={{fontSize:13}}>View</Link>
                {b.status === 'confirmed' && (
                  <button className="cancel-btn" onClick={() => cancel(b._id)}>Cancel</button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
