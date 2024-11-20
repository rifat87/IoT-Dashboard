const express = require('express');
const router = express.Router();

// Example route to get sensor data
router.get('/', (req, res) => {
  res.json({ message: 'Sensor data goes here' });
});

module.exports = router;
