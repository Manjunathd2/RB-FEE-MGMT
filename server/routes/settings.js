const express = require('express');
const router = express.Router();
const { mockData } = require('../data/mockData');

// Get school settings
router.get('/school', async (req, res) => {
  try {
    res.json(mockData.schoolSettings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update school settings
router.put('/school', async (req, res) => {
  try {
    // Update school settings
    mockData.schoolSettings = {
      ...mockData.schoolSettings,
      ...req.body,
      updatedAt: new Date()
    };
    
    res.json({
      message: 'School settings updated successfully',
      settings: mockData.schoolSettings
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;