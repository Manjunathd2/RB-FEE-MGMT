const Class = require('../models/Class');
const Student = require('../models/Student'); // Assuming you have this model

// GET all classes with student count
exports.getAllClasses = async (req, res) => {
  try {
    const classes = await Class.find({ isActive: true });

    const classesWithCounts = await Promise.all(
      classes.map(async (classDoc) => {
        const studentCount = await Student.countDocuments({
          class: classDoc.name,
          isActive: true
        });

        return {
          ...classDoc.toObject(),
          studentCount
        };
      })
    );

    classesWithCounts.sort((a, b) => a.grade - b.grade);

    res.json(classesWithCounts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET class by ID with students
exports.getClassById = async (req, res) => {
  try {
    const classDoc = await Class.findById(req.params.id);
    if (!classDoc) return res.status(404).json({ message: 'Class not found' });

    const students = await Student.find({
      class: classDoc.name,
      isActive: true
    }).select('name admissionNumber section parentName parentPhone');

    res.json({ ...classDoc.toObject(), students });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// POST create new class
exports.createClass = async (req, res) => {
  try {
    const { name, grade, sections, academicYear, isActive } = req.body;

    const exists = await Class.findOne({ name, academicYear });
    if (exists) {
      return res.status(400).json({ message: 'Class already exists for this academic year' });
    }

    const newClass = new Class({
      name,
      grade: parseInt(grade),
      sections: sections.map(s => ({
        name: s.name,
        capacity: parseInt(s.capacity)
      })),
      academicYear: academicYear || '2024-25',
      isActive: isActive !== undefined ? isActive : true
    });

    const saved = await newClass.save();
    res.status(201).json(saved);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// PUT update class
exports.updateClass = async (req, res) => {
  try {
    const { name, grade, sections, academicYear, isActive } = req.body;

    const updated = await Class.findByIdAndUpdate(
      req.params.id,
      {
        name,
        grade: parseInt(grade),
        sections: sections.map(section => ({
          _id: section._id || new mongoose.Types.ObjectId(),
          name: section.name,
          capacity: parseInt(section.capacity)
        })),
        academicYear,
        isActive
      },
      { new: true }
    );

    if (!updated) return res.status(404).json({ message: 'Class not found' });

    res.json(updated);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// DELETE class (soft delete)
exports.deleteClass = async (req, res) => {
  try {
    const updated = await Class.findByIdAndUpdate(req.params.id, { isActive: false }, { new: true });

    if (!updated) return res.status(404).json({ message: 'Class not found' });

    res.json({ message: 'Class deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
