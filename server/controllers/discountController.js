const Discount = require('../models/Discount');
const Student = require('../models/Student');
const FeeCategory = require('../models/FeeCategory');

// GET /api/discounts
exports.getDiscounts = async (req, res) => {
  try {
    const { page = 1, limit = 10, studentId, isActive } = req.query;

    const query = {};
    if (studentId) query.studentId = studentId;
    if (isActive !== undefined) query.isActive = isActive === 'true';

    let discounts = await Discount.find(query).lean();

    discounts = await Promise.all(discounts.map(async discount => {
      const student = await Student.findById(discount.studentId).lean();
      const feeTypes = await Promise.all(
        discount.feeTypes.map(id => FeeCategory.findById(id).lean())
      );

      return {
        ...discount,
        studentId: student ? {
          _id: student._id,
          name: student.name,
          admissionNumber: student.admissionNumber,
          class: student.class,
          section: student.section,
        } : null,
        feeTypes: feeTypes.filter(Boolean).map(f => ({
          _id: f._id,
          name: f.name,
        }))
      };
    }));

    discounts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    const total = discounts.length;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + parseInt(limit);
    const paginatedDiscounts = discounts.slice(startIndex, endIndex);

    res.json({
      discounts: paginatedDiscounts,
      totalPages: Math.ceil(total / limit),
      currentPage: parseInt(page),
      total
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// POST /api/discounts
exports.createDiscount = async (req, res) => {
  try {
    const {
      studentId, discountType, discountValue,
      feeTypes, reason, approvedBy, validFrom, validTo
    } = req.body;

    const student = await Student.findById(studentId).lean();
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    const discount = await Discount.create({
      studentId,
      studentName: student.name,
      discountType,
      discountValue,
      feeTypes,
      reason,
      approvedBy,
      validFrom: new Date(validFrom),
      validTo: new Date(validTo),
      isActive: true,
      academicYear: '2024-25'
    });

    const populatedDiscount = {
      ...discount.toObject(),
      studentId: {
        _id: student._id,
        name: student.name,
        admissionNumber: student.admissionNumber,
        class: student.class,
        section: student.section
      },
      feeTypes: await Promise.all(
        feeTypes.map(async id => {
          const feeType = await FeeCategory.findById(id).lean();
          return feeType ? { _id: feeType._id, name: feeType.name } : null;
        })
      ).then(results => results.filter(Boolean))
    };

    res.status(201).json(populatedDiscount);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// PUT /api/discounts/:id
exports.updateDiscount = async (req, res) => {
  try {
    const discount = await Discount.findByIdAndUpdate(req.params.id, req.body, { new: true }).lean();
    if (!discount) {
      return res.status(404).json({ message: 'Discount not found' });
    }

    const student = await Student.findById(discount.studentId).lean();
    const feeTypes = await Promise.all(
      discount.feeTypes.map(id => FeeCategory.findById(id).lean())
    );

    const populatedDiscount = {
      ...discount,
      studentId: student ? {
        _id: student._id,
        name: student.name,
        admissionNumber: student.admissionNumber,
        class: student.class,
        section: student.section
      } : null,
      feeTypes: feeTypes.filter(Boolean).map(f => ({
        _id: f._id,
        name: f.name
      }))
    };

    res.json(populatedDiscount);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// DELETE /api/discounts/:id
exports.deleteDiscount = async (req, res) => {
  try {
    const discount = await Discount.findByIdAndUpdate(req.params.id, { isActive: false }, { new: true });
    if (!discount) {
      return res.status(404).json({ message: 'Discount not found' });
    }

    res.json({ message: 'Discount deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
