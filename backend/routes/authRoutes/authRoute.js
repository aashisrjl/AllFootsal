const express = require('express');
const router = express.Router();
const { register } = require('../../controllers/authControllers/authController');

// Register route
router.post('/register', register);

module.exports = router;
// End of recent edits
