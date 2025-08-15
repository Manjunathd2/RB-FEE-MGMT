const mongoose = require('mongoose');

const feeCategorySchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, unique: true },
  description: { type: String, trim: true },
  defaultAmount: { type: Number, required: true, min: 0 },
  isOptional: { type: Boolean, default: false },
  category: { type: String, enum: ['academic','exam','library','buidling fund', 'admission', 'transport', 'miscellaneous'], default: 'academic' },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('FeeCategory', feeCategorySchema);
