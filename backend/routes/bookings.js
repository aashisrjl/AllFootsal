const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');

// Mock bookings data
const bookings = [
  {
    id: 1,
    userId: 1,
    facilityId: 1,
    pitchId: 1,
    date: '2024-01-20',
    startTime: '10:00',
    endTime: '11:00',
    totalPrice: 50,
    status: 'confirmed',
    createdAt: '2024-01-15T10:00:00Z'
  }
];

// GET /api/bookings - Get user's bookings
router.get('/', auth, async (req, res) => {
  try {
    const userBookings = bookings.filter(b => b.userId === req.user.userId);
    res.json({ bookings: userBookings });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch bookings' });
  }
});

// POST /api/bookings - Create new booking
router.post('/', auth, async (req, res) => {
  try {
    const { facilityId, pitchId, date, startTime, endTime, totalPrice } = req.body;
    
    const newBooking = {
      id: bookings.length + 1,
      userId: req.user.userId,
      facilityId,
      pitchId,
      date,
      startTime,
      endTime,
      totalPrice,
      status: 'pending',
      createdAt: new Date().toISOString()
    };
    
    bookings.push(newBooking);
    res.status(201).json(newBooking);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create booking' });
  }
});

// PUT /api/bookings/:id/status - Update booking status
router.put('/:id/status', auth, async (req, res) => {
  try {
    const bookingId = parseInt(req.params.id);
    const { status } = req.body;
    
    const bookingIndex = bookings.findIndex(b => b.id === bookingId);
    if (bookingIndex === -1) {
      return res.status(404).json({ error: 'Booking not found' });
    }
    
    bookings[bookingIndex].status = status;
    res.json(bookings[bookingIndex]);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update booking' });
  }
});

module.exports = router;