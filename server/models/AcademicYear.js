const mongoose = require('mongoose');

const academicYearSchema = new mongoose.Schema({
  year: { type: String, required: true, unique: true }, // e.g., '2024-25'
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  isActive: { type: Boolean, default: false },
  description: { type: String },
  studentsCount: { type: Number, default: 0 },
  classesCount: { type: Number, default: 0 }
}, { timestamps: true }); // Automatically adds createdAt and updatedAt

module.exports = mongoose.model('AcademicYear', academicYearSchema);
