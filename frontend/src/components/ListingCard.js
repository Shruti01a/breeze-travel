import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './ListingCard.css';

export default function ListingCard({ listing }) {
  const [imgError, setImgError] = useState(false);
  const fallback = `https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800`;

  return (
    <Link to={`/listing/${listing._id}`} className="listing-card">
      <div className="card-img-wrap">
        <img
          src={imgError ? fallback : listing.image || fallback}
          alt={listing.title}
          onError={() => setImgError(true)}
        />
        <span className="card-category">{listing.category}</span>
      </div>
      <div className="card-body">
        <div className="card-top">
          <h3 className="card-title">{listing.title}</h3>
          <div className="card-rating">
            <span>★</span> {listing.rating?.toFixed(1)}
          </div>
        </div>
        <p className="card-location">📍 {listing.location}, {listing.country}</p>
        <p className="card-meta">{listing.guests} guests · {listing.bedrooms} bed · {listing.bathrooms} bath</p>
        <div className="card-price">
          <span className="price-num">₹{listing.price?.toLocaleString()}</span>
          <span className="price-night"> / night</span>
        </div>
      </div>
    </Link>
  );
}
