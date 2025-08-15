const express = require('express');
const router = express.Router();
const controller = require('../controllers/feeController');

// Fee Categories
router.get('/categories', controller.getFeeCategories);
router.post('/categories', controller.createFeeCategory);
router.put('/categories/:id', controller.updateFeeCategory);
router.delete('/categories/:id', controller.deleteFeeCategory);

// Fee Structures
router.get('/structures', controller.getFeeStructures);
router.post('/structures', controller.createFeeStructure);
router.put('/structures/:id', controller.updateFeeStructure);
router.delete('/structures/:id', controller.deleteFeeStructure);

module.exports = router;
