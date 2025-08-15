const mongoose = require('mongoose');

const feeTypeSchema = new mongoose.Schema({
  categoryId: { type: mongoose.Schema.Types.ObjectId, ref: 'FeeCategory', required: true },
  amount: { type: Number, required: true },
  dueDate: { type: Date, required: true },
  isOptional: { type: Boolean, default: false }
});

const feeStructureSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  class: { type: String, required: true },
  academicYear: { type: String, required: true, default: '2024-25' },
  feeTypes: [feeTypeSchema],
  paymentPeriod: { type: String, enum: ['monthly', 'quarterly', 'annually'], default: 'annually' },
  lateFeeType: { type: String, enum: ['fixed', 'percentage'], default: 'fixed' },
  lateFeeAmount: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('FeeStructure', feeStructureSchema);
