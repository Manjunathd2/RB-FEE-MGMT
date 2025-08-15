const AcademicYear = require('../models/AcademicYear');

exports.getAllYears = async (req, res) => {
  try {
    const years = await AcademicYear.find().sort({ startDate: -1 });
    res.json(years);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getActiveYear = async (req, res) => {
  try {
    const active = await AcademicYear.findOne({ isActive: true });
    if (!active) return res.status(404).json({ message: 'No active year found' });
    res.json(active);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createYear = async (req, res) => {
  try {
    const { year, startDate, endDate, description, isActive } = req.body;

    const existing = await AcademicYear.findOne({ year });
    if (existing) return res.status(400).json({ message: 'Year already exists' });

    if (isActive) await AcademicYear.updateMany({}, { isActive: false });

    const newYear = new AcademicYear({
      year, startDate, endDate, description,
      isActive: !!isActive, studentsCount: 0, classesCount: 0
    });

    await newYear.save();
    res.status(201).json(newYear);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.updateYear = async (req, res) => {
  try {
    const { isActive } = req.body;
    const id = req.params.id;

    if (isActive) await AcademicYear.updateMany({}, { isActive: false });

    const updated = await AcademicYear.findByIdAndUpdate(id, req.body, { new: true });
    if (!updated) return res.status(404).json({ message: 'Not found' });

    res.json(updated);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.deleteYear = async (req, res) => {
  try {
    const deleted = await AcademicYear.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Not found' });
    res.json({ message: 'Deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
