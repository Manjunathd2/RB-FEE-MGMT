const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  admissionNumber: { type: String, required: true, unique: true, trim: true },
  class: { type: String, required: true },
  section: { type: String, required: true },
  dateOfBirth: { type: Date, required: true },
  gender: { type: String, enum: ['male', 'female', 'other'], required: true },
  parentName: { type: String, required: true, trim: true },
  parentPhone: { type: String, required: true },
  parentEmail: { type: String, trim: true, lowercase: true },
  address: { type: String, required: true },
  emergencyContact: { type: String },
  bloodGroup: { type: String, enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'] },
  medicalConditions: { type: String },
  previousSchool: { type: String },
  academicYear: { type: String, required: true, default: '2024-25' },
  admissionDate: { type: Date, required: true, default: Date.now },
  isActive: { type: Boolean, default: true },
  feeStructure: { type: mongoose.Schema.Types.ObjectId, ref: 'FeeStructure' },
  totalFee: { type: Number, default: 0 },
  paidAmount: { type: Number, default: 0 },
  pendingAmount: { type: Number, default: 0 },
  discounts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Discount' }]
}, { timestamps: true });

// Calculate pending amount before saving
studentSchema.pre('save', function(next) {
  this.pendingAmount = this.totalFee - this.paidAmount;
  next();
});

module.exports = mongoose.model('Student', studentSchema);
