import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import ListingCard from '../components/ListingCard';
import './Home.css';

const API = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
const CATEGORIES = ['All','Beach','Mountain','City','Countryside','Desert','Forest'];

export default function Home() {
  const [listings, setListings] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [search, setSearch]     = useState('');
  const [category, setCategory] = useState('All');
  const [maxPrice, setMaxPrice] = useState('');
  const [guests, setGuests]     = useState('');
  const [seeded, setSeeded]     = useState(false);

  const fetchListings = useCallback(async () => {
    setLoading(true);
    try {
      const params = {};
      if (search)   params.search = search;
      if (category !== 'All') params.category = category;
      if (maxPrice) params.maxPrice = maxPrice;
      if (guests)   params.guests = guests;
      const { data } = await axios.get(`${API}/listings`, { params });
      setListings(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [search, category, maxPrice, guests]);

  useEffect(() => { fetchListings(); }, [fetchListings]);

  const seedData = async () => {
    await axios.post(`${API}/listings/seed/data`);
    setSeeded(true);
    fetchListings();
  };

  return (
    <div className="page">
      {/* HERO */}
      <section className="hero">
        <div className="hero-bg" />
        <div className="hero-content container">
          <p className="hero-eyebrow">Discover India's Most Beautiful Stays</p>
          <h1 className="hero-title">Find your perfect<br /><em>breeze away</em></h1>

          {/* SEARCH BAR */}
          <div className="search-bar">
            <div className="search-field">
              <label>Where</label>
              <input
                type="text" placeholder="Search destinations..."
                value={search} onChange={e => setSearch(e.target.value)}
              />
            </div>
            <div className="search-divider" />
            <div className="search-field">
              <label>Max Price / night</label>
              <input
                type="number" placeholder="Any price"
                value={maxPrice} onChange={e => setMaxPrice(e.target.value)}
              />
            </div>
            <div className="search-divider" />
            <div className="search-field">
              <label>Guests</label>
              <input
                type="number" placeholder="Add guests" min="1"
                value={guests} onChange={e => setGuests(e.target.value)}
              />
            </div>
            <button className="search-btn" onClick={fetchListings}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
                <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
              </svg>
            </button>
          </div>
        </div>
      </section>

      {/* CATEGORY PILLS */}
      <div className="categories-bar container">
        {CATEGORIES.map(c => (
          <button
            key={c}
            className={`cat-pill ${category === c ? 'active' : ''}`}
            onClick={() => setCategory(c)}
          >{c}</button>
        ))}
      </div>

      {/* LISTINGS */}
      <section className="listings-section container">
        {listings.length === 0 && !loading && (
          <div className="empty-state">
            <div className="empty-icon">🏡</div>
            <h3>No listings found</h3>
            <p>Try adjusting your filters or seed some sample data.</p>
            {!seeded && (
              <button className="btn-primary" style={{marginTop:16}} onClick={seedData}>
                Load Sample Listings
              </button>
            )}
          </div>
        )}
        {loading ? (
          <div className="loading">Loading listings...</div>
        ) : (
          <div className="listings-grid">
            {listings.map(l => <ListingCard key={l._id} listing={l} />)}
          </div>
        )}
      </section>
    </div>
  );
}
