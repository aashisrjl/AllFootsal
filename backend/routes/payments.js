const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');

// Mock payment processing
router.post('/process', auth, async (req, res) => {
  try {
    const { bookingId, amount, paymentMethod } = req.body;
    
    // Mock payment processing
    const payment = {
      id: Math.random().toString(36).substr(2, 9),
      bookingId,
      amount,
      paymentMethod,
      status: 'completed',
      transactionId: 'txn_' + Math.random().toString(36).substr(2, 9),
      processedAt: new Date().toISOString()
    };
    
    res.json(payment);
  } catch (error) {
    res.status(500).json({ error: 'Payment processing failed' });
  }
});

module.exports = router;