const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');

// Mock users data
const users = [
  { id: 1, name: 'John Doe', email: 'john@example.com', role: 'user', isActive: true },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'facility_owner', isActive: true }
];

// GET /api/users/profile - Get current user profile
router.get('/profile', auth, async (req, res) => {
  try {
    const user = users.find(u => u.id === req.user.userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    const { password, ...userProfile } = user;
    res.json(userProfile);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
});

// PUT /api/users/profile - Update user profile
router.put('/profile', auth, async (req, res) => {
  try {
    const userIndex = users.findIndex(u => u.id === req.user.userId);
    if (userIndex === -1) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    const { name, email } = req.body;
    users[userIndex] = { ...users[userIndex], name, email };
    
    const { password, ...updatedUser } = users[userIndex];
    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

module.exports = router;