const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  receiptNumber: { type: String, required: true, unique: true },
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
  feeDetails: [{ feeType: { type: String, required: true }, amount: { type: Number, required: true } }],
  totalAmount: { type: Number, required: true },
  paymentMethod: { type: String, enum: ['cash', 'online', 'cheque', 'card'], required: true },
  paymentDate: { type: Date, required: true, default: Date.now },
  collectedBy: { type: String, required: true },
  remarks: { type: String },
  status: { type: String, enum: ['completed', 'pending', 'cancelled'], default: 'completed' },
  academicYear: { type: String, required: true, default: '2024-25' }
}, { timestamps: true });

// Generate receipt number before saving
paymentSchema.pre('save', function(next) {
  if (!this.receiptNumber) {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    this.receiptNumber = `RCP${timestamp}${random}`;
  }
  next();
});

module.exports = mongoose.model('Payment', paymentSchema);
