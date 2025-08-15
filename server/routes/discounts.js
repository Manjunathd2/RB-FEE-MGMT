const express = require('express');
const router = express.Router();
const {
  getDiscounts,
  createDiscount,
  updateDiscount,
  deleteDiscount
} = require('../controllers/discountController');

router.get('/', getDiscounts);
router.post('/', createDiscount);
router.put('/:id', updateDiscount);
router.delete('/:id', deleteDiscount);

module.exports = router;
