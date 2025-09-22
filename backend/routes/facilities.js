const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');

// Mock data - replace with database queries
const facilities = [
  {
    id: 1,
    name: 'Elite Sports Arena',
    location: 'Downtown',
    description: 'Premium futsal facility',
    ownerId: 2,
    pitches: [
      { id: 1, name: 'Pitch A', pricePerHour: 50, isActive: true },
      { id: 2, name: 'Pitch B', pricePerHour: 45, isActive: true }
    ],
    amenities: ['Parking', 'Changing Rooms', 'Cafeteria'],
    rating: 4.8,
    isActive: true,
    createdAt: '2024-01-15T10:00:00Z'
  }
];

// GET /api/facilities - Get all active facilities
router.get('/', async (req, res) => {
  try {
    const { search, location, minPrice, maxPrice } = req.query;
    
    let filteredFacilities = facilities.filter(f => f.isActive);
    
    // Apply filters
    if (search) {
      filteredFacilities = filteredFacilities.filter(f => 
        f.name.toLowerCase().includes(search.toLowerCase()) ||
        f.description.toLowerCase().includes(search.toLowerCase())
      );
    }
    
    if (location) {
      filteredFacilities = filteredFacilities.filter(f => 
        f.location.toLowerCase().includes(location.toLowerCase())
      );
    }

    res.json({
      facilities: filteredFacilities,
      total: filteredFacilities.length
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch facilities' });
  }
});

// GET /api/facilities/:id - Get facility details
router.get('/:id', async (req, res) => {
  try {
    const facilityId = parseInt(req.params.id);
    const facility = facilities.find(f => f.id === facilityId && f.isActive);
    
    if (!facility) {
      return res.status(404).json({ error: 'Facility not found' });
    }

    res.json(facility);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch facility' });
  }
});

// POST /api/facilities - Create new facility (facility owners only)
router.post('/', auth, async (req, res) => {
  try {
    if (req.user.role !== 'facility_owner' && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Access denied' });
    }

    const { name, location, description, amenities, pitches } = req.body;
    
    const newFacility = {
      id: facilities.length + 1,
      name,
      location,
      description,
      ownerId: req.user.userId,
      pitches: pitches || [],
      amenities: amenities || [],
      rating: 0,
      isActive: true,
      createdAt: new Date().toISOString()
    };
    
    facilities.push(newFacility);
    
    res.status(201).json(newFacility);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create facility' });
  }
});

// PUT /api/facilities/:id - Update facility
router.put('/:id', auth, async (req, res) => {
  try {
    const facilityId = parseInt(req.params.id);
    const facilityIndex = facilities.findIndex(f => f.id === facilityId);
    
    if (facilityIndex === -1) {
      return res.status(404).json({ error: 'Facility not found' });
    }
    
    const facility = facilities[facilityIndex];
    
    // Check ownership or admin role
    if (facility.ownerId !== req.user.userId && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Access denied' });
    }

    // Update facility
    facilities[facilityIndex] = { ...facility, ...req.body, id: facilityId };
    
    res.json(facilities[facilityIndex]);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update facility' });
  }
});

// GET /api/facilities/owner/my - Get facilities owned by current user
router.get('/owner/my', auth, async (req, res) => {
  try {
    if (req.user.role !== 'facility_owner') {
      return res.status(403).json({ error: 'Access denied' });
    }

    const myFacilities = facilities.filter(f => f.ownerId === req.user.userId);
    
    res.json({
      facilities: myFacilities,
      total: myFacilities.length
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch your facilities' });
  }
});

module.exports = router;