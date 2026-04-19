const mongoose = require('mongoose');

const listingSchema = new mongoose.Schema({
  title:       { type: String, required: true, trim: true },
  description: { type: String, required: true },
  location:    { type: String, required: true },
  country:     { type: String, required: true },
  price:       { type: Number, required: true },
  image:       { type: String, default: '' },
  category:    { type: String, enum: ['Beach','Mountain','City','Countryside','Desert','Forest'], default: 'City' },
  guests:      { type: Number, default: 2 },
  bedrooms:    { type: Number, default: 1 },
  bathrooms:   { type: Number, default: 1 },
  amenities:   [{ type: String }],
  rating:      { type: Number, default: 4.5, min: 1, max: 5 },
  reviews:     { type: Number, default: 0 },
  owner:       { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });

module.exports = mongoose.model('Listing', listingSchema);
