const express = require('express');
const router = express.Router();
const academicYearController = require('../controllers/academicYearController');
// Import other controllers as needed

// Academic Year Routes
router.get('/years', academicYearController.getAllYears);
router.get('/years/active', academicYearController.getActiveYear);
router.post('/years', academicYearController.createYear);
router.put('/years/:id', academicYearController.updateYear);
router.delete('/years/:id', academicYearController.deleteYear);

// Later, plug in archive, promotion, and balance controllers

module.exports = router;
