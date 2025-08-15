const express = require('express');
const router = express.Router();
const { mockData, findById, findByQuery, updateById, deleteById, create } = require('../data/mockData');

// Academic Years Routes

// Get all academic years
router.get('/years', async (req, res) => {
  try {
    const academicYears = findByQuery('academicYears', {});
    academicYears.sort((a, b) => new Date(b.startDate) - new Date(a.startDate));
    res.json(academicYears);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create academic year
router.post('/years', async (req, res) => {
  try {
    const { year, startDate, endDate, description, isActive } = req.body;
    
    // Check if year already exists
    const existingYear = findByQuery('academicYears', { year });
    if (existingYear.length > 0) {
      return res.status(400).json({ message: 'Academic year already exists' });
    }
    
    // If setting as active, deactivate other years
    if (isActive) {
      mockData.academicYears.forEach(acadYear => {
        acadYear.isActive = false;
      });
    }
    
    const academicYearData = {
      year,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      description: description || '',
      isActive: isActive || false,
      studentsCount: 0,
      classesCount: 0
    };
    
    const academicYear = create('academicYears', academicYearData);
    res.status(201).json(academicYear);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update academic year
router.put('/years/:id', async (req, res) => {
  try {
    const { isActive } = req.body;
    
    // If setting as active, deactivate other years
    if (isActive) {
      mockData.academicYears.forEach(acadYear => {
        acadYear.isActive = false;
      });
    }
    
    const academicYear = updateById('academicYears', req.params.id, req.body);
    
    if (!academicYear) {
      return res.status(404).json({ message: 'Academic year not found' });
    }
    
    res.json(academicYear);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete academic year
router.delete('/years/:id', async (req, res) => {
  try {
    const academicYear = deleteById('academicYears', req.params.id);
    
    if (!academicYear) {
      return res.status(404).json({ message: 'Academic year not found' });
    }
    
    res.json({ message: 'Academic year deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


// Get the active academic year
router.get('/years/active', async (req, res) => {
  try {
    const activeYear = findByQuery('academicYears', { isActive: true });
    if (activeYear.length === 0) {
      return res.status(404).json({ message: 'No active academic year found' });
    }
    res.json(activeYear[0]); // return the first match
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Archive Routes

// Get archived data
router.get('/archive', async (req, res) => {
  try {
    const { type, academicYear } = req.query;
    
    let query = {};
    if (type) query.type = type;
    if (academicYear) query.academicYear = academicYear;
    
    const archivedData = findByQuery('archivedData', query);
    archivedData.sort((a, b) => new Date(b.archivedDate) - new Date(a.archivedDate));
    
    res.json(archivedData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create archive
router.post('/archive', async (req, res) => {
  try {
    const archiveData = {
      ...req.body,
      archivedDate: new Date(),
      size: req.body.size || '0 MB',
      recordsCount: req.body.recordsCount || 0
    };
    
    const archive = create('archivedData', archiveData);
    res.status(201).json(archive);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Student Promotion Routes

// Get students for promotion
router.get('/promotion/students', async (req, res) => {
  try {
    const { class: className, academicYear = '2024-25' } = req.query;
    
    let query = { academicYear, isActive: true };
    if (className) query.class = className;
    
    let students = findByQuery('students', query);
    
    // Add promotion eligibility data
    students = students.map(student => ({
      ...student,
      performance: ['Excellent', 'Good', 'Average', 'Poor'][Math.floor(Math.random() * 4)],
      attendance: Math.floor(Math.random() * 40) + 60, // 60-100%
      isEligible: Math.random() > 0.2, // 80% eligible
      nextClass: getNextClass(student.class),
      remarks: getRandomRemarks()
    }));
    
    res.json(students);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Promote students
router.post('/promotion/promote', async (req, res) => {
  try {
    const { studentIds, fromYear, toYear, promotionDate } = req.body;
    
    const promotedStudents = [];
    
    studentIds.forEach(studentId => {
      const student = findById('students', studentId);
      if (student && student.isEligible !== false) {
        const updatedStudent = updateById('students', studentId, {
          class: getNextClass(student.class),
          academicYear: toYear,
          promotionDate: new Date(promotionDate)
        });
        promotedStudents.push(updatedStudent);
      }
    });
    
    res.json({
      message: `Successfully promoted ${promotedStudents.length} students`,
      promotedStudents
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Fee Balance Carry Forward Routes

// Get students with balances
router.get('/balance/students', async (req, res) => {
  try {
    const { balanceType = 'all' } = req.query;
    
    let students = findByQuery('students', { isActive: true });
    
    // Add balance information
    students = students.map(student => {
      const balance = (student.paidAmount || 0) - (student.totalFee || 0);
      return {
        ...student,
        balance: balance,
        balanceType: balance > 0 ? 'advance' : balance < 0 ? 'due' : 'nil',
        lastPaymentDate: student.updatedAt
      };
    });
    
    // Filter by balance type
    if (balanceType === 'advance') {
      students = students.filter(student => student.balance > 0);
    } else if (balanceType === 'due') {
      students = students.filter(student => student.balance < 0);
    } else if (balanceType !== 'all') {
      students = students.filter(student => student.balance !== 0);
    }
    
    res.json(students);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Carry forward balances
router.post('/balance/carry-forward', async (req, res) => {
  try {
    const { studentIds, fromYear, toYear, carryForwardDate, remarks } = req.body;
    
    const carriedForwardStudents = [];
    
    studentIds.forEach(studentId => {
      const student = findById('students', studentId);
      if (student) {
        const balance = (student.paidAmount || 0) - (student.totalFee || 0);
        const updatedStudent = updateById('students', studentId, {
          carryForwardAmount: balance,
          carryForwardDate: new Date(carryForwardDate),
          carryForwardYear: toYear,
          carryForwardRemarks: remarks,
          // Reset balance after carry forward
          paidAmount: balance > 0 ? balance : 0,
          pendingAmount: balance < 0 ? Math.abs(balance) : 0
        });
        carriedForwardStudents.push(updatedStudent);
      }
    });
    
    res.json({
      message: `Successfully carried forward balances for ${carriedForwardStudents.length} students`,
      carriedForwardStudents
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Helper functions
function getNextClass(currentClass) {
  const classMap = {
    '1st Grade': '2nd Grade',
    '2nd Grade': '3rd Grade',
    '3rd Grade': '4th Grade',
    '4th Grade': '5th Grade',
    '5th Grade': '6th Grade',
    '6th Grade': '7th Grade',
    '7th Grade': '8th Grade',
    '8th Grade': '9th Grade',
    '9th Grade': '10th Grade',
    '10th Grade': '11th Grade',
    '11th Grade': '12th Grade',
    '12th Grade': 'Graduated'
  };
  return classMap[currentClass] || currentClass;
}

function getRandomRemarks() {
  const remarks = [
    'Outstanding performance',
    'Good academic progress',
    'Needs improvement in attendance',
    'Excellent student',
    'Ready for next grade',
    'Consistent performer',
    'Shows great potential'
  ];
  return remarks[Math.floor(Math.random() * remarks.length)];
}

module.exports = router;