const mongoose = require('mongoose');

const sectionSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  capacity: { type: Number, required: true, min: 1 }
});

const classSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  grade: { type: Number, required: true, min: 1, max: 12 },
  sections: [sectionSchema],
  academicYear: { type: String, required: true, default: '2024-25' },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('Class', classSchema);
