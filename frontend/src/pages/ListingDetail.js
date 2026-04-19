import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import './ListingDetail.css';

const API = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

export default function ListingDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [checkIn, setCheckIn]   = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guests, setGuests]     = useState(1);
  const [booking, setBooking]   = useState(false);
  const [booked, setBooked]     = useState(false);
  const [error, setError]       = useState('');
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    axios.get(`${API}/listings/${id}`)
      .then(r => setListing(r.data))
      .catch(() => navigate('/'))
      .finally(() => setLoading(false));
  }, [id, navigate]);

  const nights = checkIn && checkOut
    ? Math.max(0, Math.ceil((new Date(checkOut) - new Date(checkIn)) / 86400000))
    : 0;

  const handleBook = async () => {
    if (!user) return navigate('/login');
    if (!checkIn || !checkOut || nights < 1) return setError('Please select valid dates.');
    setError(''); setBooking(true);
    try {
      await axios.post(`${API}/bookings`, {
        listingId: id, checkIn, checkOut,
        guests, totalPrice: nights * listing.price
      });
      setBooked(true);
    } catch (e) {
      setError(e.response?.data?.message || 'Booking failed.');
    } finally {
      setBooking(false);
    }
  };

  if (loading) return <div className="page loading">Loading...</div>;
  if (!listing) return null;

  const fallback = 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1200';
  const amenityIcons = { WiFi:'📶', Pool:'🏊', Kitchen:'🍳', AC:'❄️', Parking:'🚗', Fireplace:'🔥', Heating:'🌡️', Breakfast:'🍳', Rooftop:'🏙️', Chef:'👨‍🍳', 'Meals Included':'🍽️', 'Camel Safari':'🐪', 'Folk Music':'🎵', Bonfire:'🔥', 'Bird Watching':'🦜', 'Nature Walk':'🌿', Netflix:'📺', Gym:'💪', Workspace:'💻', 'Sea View':'🌊', Fishing:'🎣' };

  return (
    <div className="page detail-page">
      <div className="container">
        {/* HEADER */}
        <div className="detail-header">
          <h1 className="detail-title">{listing.title}</h1>
          <div className="detail-meta">
            <span className="detail-rating">★ {listing.rating?.toFixed(1)} · <span className="detail-reviews">{listing.reviews} reviews</span></span>
            <span className="detail-location">📍 {listing.location}, {listing.country}</span>
          </div>
        </div>

        {/* IMAGE */}
        <div className="detail-img-wrap">
          <img
            src={imgError ? fallback : listing.image || fallback}
            alt={listing.title}
            onError={() => setImgError(true)}
          />
          <span className="detail-category">{listing.category}</span>
        </div>

        <div className="detail-grid">
          {/* LEFT */}
          <div className="detail-left">
            <div className="detail-host">
              <div>
                <h2>Entire place hosted by {listing.owner?.name || 'Breeze Host'}</h2>
                <p>{listing.guests} guests · {listing.bedrooms} bedrooms · {listing.bathrooms} bathrooms</p>
              </div>
              <div className="host-avatar">{(listing.owner?.name || 'B')[0]}</div>
            </div>
            <hr className="detail-divider" />
            <div className="detail-desc">
              <h3>About this place</h3>
              <p>{listing.description}</p>
            </div>
            <hr className="detail-divider" />
            {listing.amenities?.length > 0 && (
              <div className="detail-amenities">
                <h3>What this place offers</h3>
                <div className="amenities-grid">
                  {listing.amenities.map(a => (
                    <div key={a} className="amenity-item">
                      <span>{amenityIcons[a] || '✦'}</span> {a}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* BOOKING CARD */}
          <div className="booking-card">
            {booked ? (
              <div className="booked-success">
                <div className="booked-icon">🎉</div>
                <h3>Booking Confirmed!</h3>
                <p>Your stay at <strong>{listing.title}</strong> is booked.</p>
                <p>{checkIn} → {checkOut} · {nights} night{nights > 1 ? 's' : ''}</p>
                <p className="booked-total">Total: ₹{(nights * listing.price).toLocaleString()}</p>
                <button className="btn-primary" style={{marginTop:16,width:'100%'}} onClick={() => navigate('/my-bookings')}>
                  View My Bookings
                </button>
              </div>
            ) : (
              <>
                <div className="booking-price">
                  <span className="bp-num">₹{listing.price?.toLocaleString()}</span>
                  <span className="bp-night"> / night</span>
                </div>
                <div className="dates-row">
                  <div className="date-field">
                    <label>CHECK-IN</label>
                    <input type="date" value={checkIn} min={new Date().toISOString().split('T')[0]}
                      onChange={e => setCheckIn(e.target.value)} />
                  </div>
                  <div className="date-field">
                    <label>CHECK-OUT</label>
                    <input type="date" value={checkOut} min={checkIn || new Date().toISOString().split('T')[0]}
                      onChange={e => setCheckOut(e.target.value)} />
                  </div>
                </div>
                <div className="form-group">
                  <label>GUESTS</label>
                  <select value={guests} onChange={e => setGuests(Number(e.target.value))}>
                    {[...Array(listing.guests)].map((_,i) => (
                      <option key={i+1} value={i+1}>{i+1} guest{i > 0 ? 's' : ''}</option>
                    ))}
                  </select>
                </div>
                {error && <div className="error-msg">{error}</div>}
                {nights > 0 && (
                  <div className="price-breakdown">
                    <div className="pb-row"><span>₹{listing.price?.toLocaleString()} × {nights} night{nights > 1 ? 's' : ''}</span><span>₹{(listing.price * nights).toLocaleString()}</span></div>
                    <div className="pb-row total"><span>Total</span><span>₹{(listing.price * nights).toLocaleString()}</span></div>
                  </div>
                )}
                <button className="book-now-btn" onClick={handleBook} disabled={booking}>
                  {booking ? 'Booking...' : user ? 'Reserve Now' : 'Log in to Reserve'}
                </button>
                <p className="book-note">You won't be charged yet</p>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
