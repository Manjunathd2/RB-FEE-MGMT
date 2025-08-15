const Student = require('../models/Student');
const FeeStructure = require('../models/FeeStructure');

// Get all students with filters and pagination
exports.getStudents = async (req, res) => {
  try {
    const { page = 1, limit = 10, search, class: studentClass, section, status } = req.query;

    let query = {};

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { admissionNumber: { $regex: search, $options: 'i' } },
        { parentName: { $regex: search, $options: 'i' } }
      ];
    }

    if (studentClass) query.class = studentClass;
    if (section) query.section = section;
    if (status === 'active') query.isActive = true;
    if (status === 'inactive') query.isActive = false;

    const total = await Student.countDocuments(query);
    const students = await Student.find(query)
      .populate('feeStructure')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    res.json({
      students,
      totalPages: Math.ceil(total / limit),
      currentPage: parseInt(page),
      total
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get student by ID
exports.getStudentById = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id).populate(['feeStructure', 'discounts']);
    if (!student) return res.status(404).json({ message: 'Student not found' });
    res.json(student);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create a new student
exports.createStudent = async (req, res) => {
  try {
    const existing = await Student.findOne({ admissionNumber: req.body.admissionNumber });
    if (existing) {
      return res.status(400).json({ message: 'Admission number already exists' });
    }

    const feeStructure = await FeeStructure.findOne({
      class: req.body.class,
      isActive: true
    });

    const totalFee = feeStructure
      ? feeStructure.feeTypes.reduce((sum, fee) => sum + fee.amount, 0)
      : 0;

    const studentData = {
      ...req.body,
      feeStructure: feeStructure?._id,
      totalFee,
      pendingAmount: totalFee,
      paidAmount: 0
    };

    const student = await Student.create(studentData);
    const populatedStudent = await student.populate('feeStructure');

    res.status(201).json(populatedStudent);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update student
exports.updateStudent = async (req, res) => {
  try {
    const student = await Student.findByIdAndUpdate(req.params.id, req.body, {
      new: true
    }).populate('feeStructure');

    if (!student) return res.status(404).json({ message: 'Student not found' });

    res.json(student);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete student
exports.deleteStudent = async (req, res) => {
  try {
    const student = await Student.findByIdAndDelete(req.params.id);
    if (!student) return res.status(404).json({ message: 'Student not found' });
    res.json({ message: 'Student deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get defaulters
exports.getDefaulters = async (req, res) => {
  try {
    const { class: studentClass, section } = req.query;

    let query = { isActive: true, pendingAmount: { $gt: 0 } };

    if (studentClass) query.class = studentClass;
    if (section) query.section = section;

    let defaulters = await Student.find(query).populate('feeStructure');

    defaulters = defaulters.map(student => ({
      ...student.toObject(),
      overdueDays: Math.floor(Math.random() * 60) + 1,
      status: Math.random() > 0.7 ? 'critical' : 'overdue'
    }));

    defaulters.sort((a, b) => b.pendingAmount - a.pendingAmount);

    res.json(defaulters);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
