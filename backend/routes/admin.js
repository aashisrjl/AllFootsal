const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');

// Admin middleware
const adminAuth = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Admin access required' });
  }
  next();
};

// GET /api/admin/stats - Get admin dashboard statistics
router.get('/stats', auth, adminAuth, async (req, res) => {
  try {
    const stats = {
      totalFacilities: 12,
      totalUsers: 1234,
      totalBookings: 567,
      monthlyRevenue: 12345,
      growth: {
        facilities: '+2',
        users: '+15%',
        bookings: '+23%',
        revenue: '+8%'
      }
    };
    
    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch admin stats' });
  }
});

// GET /api/admin/facilities - Get all facilities for admin
router.get('/facilities', auth, adminAuth, async (req, res) => {
  try {
    // Mock facility data for admin view
    const facilities = [
      { id: 1, name: 'Elite Sports Arena', owner: 'John Smith', status: 'active', subscription: 'premium' },
      { id: 2, name: 'City Futsal Hub', owner: 'Jane Doe', status: 'active', subscription: 'basic' }
    ];
    
    res.json({ facilities });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch facilities' });
  }
});

// GET /api/admin/users - Get all users for admin
router.get('/users', auth, adminAuth, async (req, res) => {
  try {
    const users = [
      { id: 1, name: 'John Doe', email: 'john@example.com', role: 'user', status: 'active' },
      { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'facility_owner', status: 'active' }
    ];
    
    res.json({ users });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

module.exports = router;