import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import './CreateListing.css';

const API = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
const AMENITIES_LIST = ['WiFi','Pool','Kitchen','AC','Parking','Fireplace','Heating','Breakfast','Rooftop','Netflix','Gym','Workspace','Sea View'];

export default function CreateListing() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title:'', description:'', location:'', country:'India',
    price:'', category:'City', guests:2, bedrooms:1, bathrooms:1, image:''
  });
  const [amenities, setAmenities] = useState([]);
  const [error, setError]   = useState('');
  const [loading, setLoading] = useState(false);

  if (!user) { navigate('/login'); return null; }

  const toggle = (a) => setAmenities(prev => prev.includes(a) ? prev.filter(x=>x!==a) : [...prev,a]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); setLoading(true);
    try {
      const { data } = await axios.post(`${API}/listings`, { ...form, amenities, price: Number(form.price) });
      navigate(`/listing/${data._id}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create listing.');
    } finally {
      setLoading(false);
    }
  };

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  return (
    <div className="page create-page container">
      <h1 className="create-title">Add a New Listing</h1>
      <p className="create-sub">Share your space with travellers across India 🌏</p>

      {error && <div className="error-msg">{error}</div>}

      <form className="create-form" onSubmit={handleSubmit}>
        <div className="form-section">
          <h3>Basic Info</h3>
          <div className="form-group">
            <label>Listing Title *</label>
            <input value={form.title} onChange={e=>set('title',e.target.value)} placeholder="e.g. Beachfront Villa in Goa" required />
          </div>
          <div className="form-group">
            <label>Description *</label>
            <textarea rows={4} value={form.description} onChange={e=>set('description',e.target.value)} placeholder="Describe your property..." required />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Location *</label>
              <input value={form.location} onChange={e=>set('location',e.target.value)} placeholder="e.g. Calangute, Goa" required />
            </div>
            <div className="form-group">
              <label>Country</label>
              <input value={form.country} onChange={e=>set('country',e.target.value)} />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Category</label>
              <select value={form.category} onChange={e=>set('category',e.target.value)}>
                {['Beach','Mountain','City','Countryside','Desert','Forest'].map(c=><option key={c}>{c}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label>Price per Night (₹) *</label>
              <input type="number" value={form.price} onChange={e=>set('price',e.target.value)} placeholder="3000" required min="1" />
            </div>
          </div>
        </div>

        <div className="form-section">
          <h3>Details</h3>
          <div className="form-row three">
            <div className="form-group">
              <label>Max Guests</label>
              <input type="number" min="1" max="20" value={form.guests} onChange={e=>set('guests',Number(e.target.value))} />
            </div>
            <div className="form-group">
              <label>Bedrooms</label>
              <input type="number" min="1" max="20" value={form.bedrooms} onChange={e=>set('bedrooms',Number(e.target.value))} />
            </div>
            <div className="form-group">
              <label>Bathrooms</label>
              <input type="number" min="1" max="20" value={form.bathrooms} onChange={e=>set('bathrooms',Number(e.target.value))} />
            </div>
          </div>
          <div className="form-group">
            <label>Image URL</label>
            <input value={form.image} onChange={e=>set('image',e.target.value)} placeholder="https://images.unsplash.com/..." />
          </div>
        </div>

        <div className="form-section">
          <h3>Amenities</h3>
          <div className="amenities-picker">
            {AMENITIES_LIST.map(a => (
              <button type="button" key={a}
                className={`amenity-toggle ${amenities.includes(a)?'selected':''}`}
                onClick={()=>toggle(a)}>{a}</button>
            ))}
          </div>
        </div>

        <button className="btn-primary create-btn" type="submit" disabled={loading}>
          {loading ? 'Publishing...' : '🚀 Publish Listing'}
        </button>
      </form>
    </div>
  );
}
