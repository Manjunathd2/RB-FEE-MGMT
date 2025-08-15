const express = require('express');
const router = express.Router();
const classController = require('../controllers/classController');

// GET all classes
router.get('/', classController.getAllClasses);

// GET class by ID
router.get('/:id', classController.getClassById);

// POST new class
router.post('/', classController.createClass);

// PUT update class
router.put('/:id', classController.updateClass);

// DELETE (soft delete) class
router.delete('/:id', classController.deleteClass);

module.exports = router;
