const mongoose = require('mongoose');

const discountSchema = new mongoose.Schema({
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: true
  },
  studentName: {
    type: String,
    required: true
  },
  discountType: {
    type: String,
    enum: ['percentage', 'fixed'],
    required: true
  },
  discountValue: {
    type: Number,
    required: true,
    min: 0
  },
  feeTypes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'FeeCategory'
  }],
  reason: {
    type: String,
    required: true
  },
  approvedBy: {
    type: String,
    required: true
  },
  validFrom: {
    type: Date,
    required: true
  },
  validTo: {
    type: Date,
    required: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  academicYear: {
    type: String,
    required: true,
    default: '2024-25'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Discount', discountSchema);