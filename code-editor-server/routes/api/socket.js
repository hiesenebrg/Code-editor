// src/routes/apiRoutes.js
const express = require('express');
const router = express.Router();

router.get('/users', (req, res) => {
    // Simulate fetching users from database or memory
    res.json({ message: 'List of users will be here' });
});

// Example API route for room management
router.get('/rooms', (req, res) => {
    // Simulate fetching rooms from database or memory
    res.json({ message: 'List of rooms will be here' });
});

module.exports = router;
