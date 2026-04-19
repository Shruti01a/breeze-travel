const express = require('express');
const router  = express.Router();
const Listing = require('../models/Listing');
const auth    = require('../middleware/auth');

// GET all listings (with search & filter)
router.get('/', async (req, res) => {
  try {
    const { search, category, minPrice, maxPrice, guests } = req.query;
    let query = {};
    if (search)   query.$or = [{ title: new RegExp(search,'i') }, { location: new RegExp(search,'i') }, { country: new RegExp(search,'i') }];
    if (category && category !== 'All') query.category = category;
    if (minPrice) query.price = { ...query.price, $gte: Number(minPrice) };
    if (maxPrice) query.price = { ...query.price, $lte: Number(maxPrice) };
    if (guests)   query.guests = { $gte: Number(guests) };
    const listings = await Listing.find(query).sort({ createdAt: -1 });
    res.json(listings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET single listing
router.get('/:id', async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id).populate('owner','name avatar');
    if (!listing) return res.status(404).json({ message: 'Listing not found' });
    res.json(listing);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST create listing (auth required)
router.post('/', auth, async (req, res) => {
  try {
    const listing = await Listing.create({ ...req.body, owner: req.user.id });
    res.status(201).json(listing);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// PUT update listing (owner only)
router.put('/:id', auth, async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);
    if (!listing) return res.status(404).json({ message: 'Not found' });
    if (listing.owner.toString() !== req.user.id) return res.status(403).json({ message: 'Forbidden' });
    Object.assign(listing, req.body);
    await listing.save();
    res.json(listing);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE listing (owner only)
router.delete('/:id', auth, async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);
    if (!listing) return res.status(404).json({ message: 'Not found' });
    if (listing.owner.toString() !== req.user.id) return res.status(403).json({ message: 'Forbidden' });
    await listing.deleteOne();
    res.json({ message: 'Listing deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Seed sample data
router.post('/seed/data', async (req, res) => {
  try {
    await Listing.deleteMany({});
    const samples = [
      { title:'Beachfront Villa in Goa', description:'Stunning beachfront villa with private pool, 50 metres from Calangute Beach. Wake up to ocean sounds every morning.', location:'Calangute, Goa', country:'India', price:8500, category:'Beach', guests:6, bedrooms:3, bathrooms:2, amenities:['WiFi','Pool','Kitchen','AC','Parking'], rating:4.9, reviews:128, image:'https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?w=800' },
      { title:'Himalayan Cabin Retreat', description:'Cosy wooden cabin nestled in the Himalayas with breathtaking valley views. Perfect for trekking enthusiasts.', location:'Manali, Himachal Pradesh', country:'India', price:3200, category:'Mountain', guests:4, bedrooms:2, bathrooms:1, amenities:['WiFi','Fireplace','Kitchen','Heating'], rating:4.8, reviews:89, image:'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800' },
      { title:'Heritage Haveli in Jaipur', description:'Live like royalty in this beautifully restored 200-year-old Rajasthani haveli in the heart of the Pink City.', location:'Old City, Jaipur', country:'India', price:5500, category:'City', guests:4, bedrooms:2, bathrooms:2, amenities:['WiFi','AC','Breakfast','Rooftop'], rating:4.7, reviews:214, image:'https://images.unsplash.com/photo-1477587458883-47145ed31105?w=800' },
      { title:'Backwaters Houseboat, Kerala', description:'Float through the serene backwaters of Kerala on a traditional kettu vallam. Includes all meals and a personal chef.', location:'Alleppey, Kerala', country:'India', price:7200, category:'Countryside', guests:2, bedrooms:1, bathrooms:1, amenities:['Meals Included','AC','Chef','Fishing'], rating:5.0, reviews:67, image:'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=800' },
      { title:'Modern Loft in Bangalore', description:'Sleek, minimalist loft in the heart of Indiranagar — walking distance to restaurants, cafes, and nightlife.', location:'Indiranagar, Bangalore', country:'India', price:2800, category:'City', guests:2, bedrooms:1, bathrooms:1, amenities:['WiFi','Netflix','Gym','Workspace'], rating:4.6, reviews:153, image:'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800' },
      { title:'Desert Camp in Jaisalmer', description:'Luxury tented camp in the Thar Desert with camel safaris, folk music, and a sky full of stars every night.', location:'Sam Sand Dunes, Jaisalmer', country:'India', price:6000, category:'Desert', guests:2, bedrooms:1, bathrooms:1, amenities:['Meals Included','Camel Safari','Folk Music','Bonfire'], rating:4.8, reviews:92, image:'https://images.unsplash.com/photo-1509316785289-025f5b846b35?w=800' },
      { title:'Treehouse in Coorg', description:'Magical treehouse perched 30 feet above a coffee plantation. Fall asleep to jungle sounds and birdsong.', location:'Coorg, Karnataka', country:'India', price:4500, category:'Forest', guests:2, bedrooms:1, bathrooms:1, amenities:['WiFi','Breakfast','Nature Walk','Bird Watching'], rating:4.9, reviews:41, image:'https://images.unsplash.com/photo-1488462237308-ecaa28b729d7?w=800' },
      { title:'Sea-Facing Apartment, Mumbai', description:'High-rise apartment with panoramic Arabian Sea views. Minutes from Bandra, Juhu Beach, and BKC.', location:'Bandra West, Mumbai', country:'India', price:4200, category:'City', guests:3, bedrooms:2, bathrooms:1, amenities:['WiFi','AC','Kitchen','Sea View'], rating:4.5, reviews:178, image:'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800' },
    ];
    await Listing.insertMany(samples);
    res.json({ message: `${samples.length} listings seeded!` });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
