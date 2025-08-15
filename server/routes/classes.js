const express = require('express');
const router = express.Router();
const { mockData, findById, findByQuery, updateById, deleteById, create, countDocuments, generateId } = require('../data/mockData');

// Get all classes
router.get('/', async (req, res) => {
  try {
    const classes = findByQuery('classes', { isActive: true });
    
    // Add student count for each class
    const classesWithCounts = classes.map(classDoc => {
      const studentCount = findByQuery('students', { 
        class: classDoc.name,
        isActive: true 
      }).length;
      
      return {
        ...classDoc,
        studentCount
      };
    });
    
    // Sort by grade
    classesWithCounts.sort((a, b) => a.grade - b.grade);
    
    res.json(classesWithCounts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get class by ID
router.get('/:id', async (req, res) => {
  try {
    const classDoc = findById('classes', req.params.id);
    
    if (!classDoc) {
      return res.status(404).json({ message: 'Class not found' });
    }
    
    // Get students in this class
    const students = findByQuery('students', { 
      class: classDoc.name,
      isActive: true 
    }).map(student => ({
      _id: student._id,
      name: student.name,
      admissionNumber: student.admissionNumber,
      section: student.section,
      parentName: student.parentName,
      parentPhone: student.parentPhone
    }));
    
    res.json({
      ...classDoc,
      students
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create new class
router.post('/', async (req, res) => {
  try {
    const { name, grade, sections, academicYear, isActive } = req.body;
    
    // Check if class already exists
    const existingClass = findByQuery('classes', { name, academicYear });
    if (existingClass.length > 0) {
      return res.status(400).json({ message: 'Class already exists for this academic year' });
    }
    
    const classData = {
      name,
      grade: parseInt(grade),
      sections: sections.map(section => ({
        _id: generateId(),
        name: section.name,
        capacity: parseInt(section.capacity)
      })),
      academicYear: academicYear || '2024-25',
      isActive: isActive !== undefined ? isActive : true
    };
    
    const classDoc = create('classes', classData);
    res.status(201).json(classDoc);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update class
router.put('/:id', async (req, res) => {
  try {
    const { name, grade, sections, academicYear, isActive } = req.body;
    
    const updateData = {
      name,
      grade: parseInt(grade),
      sections: sections.map(section => ({
        _id: section._id || generateId(),
        name: section.name,
        capacity: parseInt(section.capacity)
      })),
      academicYear,
      isActive
    };
    
    const classDoc = updateById('classes', req.params.id, updateData);
    
    if (!classDoc) {
      return res.status(404).json({ message: 'Class not found' });
    }
    
    res.json(classDoc);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete class
router.delete('/:id', async (req, res) => {
  try {
    const classDoc = updateById('classes', req.params.id, { isActive: false });
    
    if (!classDoc) {
      return res.status(404).json({ message: 'Class not found' });
    }
    
    res.json({ message: 'Class deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;