// Mock data store to replace MongoDB
let mockData = {
  users: [
    {
      _id: 'user1',
      name: 'Admin User',
      email: 'admin@school.com',
      password: '$2a$10$rOvHPGkwYKAf8LO.Pc8HEOQGQs8WQ5SLVgOHEeQs8WQ5SLVgOHEeQ', // admin123
      role: 'admin',
      phone: '+1-234-567-8901',
      isActive: true,
      lastLogin: new Date(),
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      _id: 'user2',
      name: 'Clerk User',
      email: 'clerk@school.com',
      password: '$2a$10$rOvHPGkwYKAf8LO.Pc8HEOQGQs8WQ5SLVgOHEeQs8WQ5SLVgOHEeQ', // clerk123
      role: 'clerk',
      phone: '+1-234-567-8902',
      isActive: true,
      lastLogin: new Date(),
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ],

  feeCategories: [
    {
      _id: 'cat1',
      name: 'Tuition Fee',
      description: 'Monthly tuition charges',
      defaultAmount: 5000,
      isOptional: false,
      category: 'academic',
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      _id: 'cat2',
      name: 'Admission Fee',
      description: 'One-time admission charges',
      defaultAmount: 10000,
      isOptional: false,
      category: 'admission',
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      _id: 'cat3',
      name: 'Transportation Fee',
      description: 'Monthly bus transportation',
      defaultAmount: 2000,
      isOptional: true,
      category: 'transport',
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      _id: 'cat4',
      name: 'Library Fee',
      description: 'Annual library charges',
      defaultAmount: 1500,
      isOptional: false,
      category: 'academic',
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      _id: 'cat5',
      name: 'Lab Fee',
      description: 'Laboratory usage charges',
      defaultAmount: 3000,
      isOptional: false,
      category: 'academic',
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      _id: 'cat6',
      name: 'Exam Fee',
      description: 'Examination charges',
      defaultAmount: 1000,
      isOptional: false,
      category: 'academic',
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ],

  feeStructures: [
    {
      _id: 'struct1',
      name: '1st Grade Fee Structure',
      class: '1st Grade',
      feeTypes: [
        { categoryId: 'cat1', amount: 4000, dueDate: new Date('2024-12-31') },
        { categoryId: 'cat2', amount: 8000, dueDate: new Date('2024-12-01') },
        { categoryId: 'cat4', amount: 1200, dueDate: new Date('2024-12-15') }
      ],
      paymentPeriod: 'monthly',
      lateFeeType: 'percentage',
      lateFeeAmount: 5,
      academicYear: '2024-25',
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      _id: 'struct2',
      name: '10th Grade Fee Structure',
      class: '10th Grade',
      feeTypes: [
        { categoryId: 'cat1', amount: 6000, dueDate: new Date('2024-12-31') },
        { categoryId: 'cat2', amount: 12000, dueDate: new Date('2024-12-01') },
        { categoryId: 'cat4', amount: 1500, dueDate: new Date('2024-12-15') },
        { categoryId: 'cat5', amount: 3500, dueDate: new Date('2024-12-20') },
        { categoryId: 'cat6', amount: 1200, dueDate: new Date('2024-12-25') }
      ],
      paymentPeriod: 'quarterly',
      lateFeeType: 'fixed',
      lateFeeAmount: 200,
      academicYear: '2024-25',
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ],

  classes: [
    {
      _id: 'class1',
      name: '1st Grade',
      grade: 1,
      sections: [
        { _id: 'sec1', name: 'A', capacity: 30 },
        { _id: 'sec2', name: 'B', capacity: 30 }
      ],
      academicYear: '2024-25',
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      _id: 'class2',
      name: '10th Grade',
      grade: 10,
      sections: [
        { _id: 'sec3', name: 'A', capacity: 35 },
        { _id: 'sec4', name: 'B', capacity: 35 },
        { _id: 'sec5', name: 'C', capacity: 30 }
      ],
      academicYear: '2024-25',
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      _id: 'class3',
      name: '2nd Grade',
      grade: 2,
      sections: [
        { _id: 'sec6', name: 'A', capacity: 28 },
        { _id: 'sec7', name: 'B', capacity: 28 }
      ],
      academicYear: '2024-25',
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      _id: 'class4',
      name: '3rd Grade',
      grade: 3,
      sections: [
        { _id: 'sec8', name: 'A', capacity: 30 },
        { _id: 'sec9', name: 'B', capacity: 30 }
      ],
      academicYear: '2024-25',
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      _id: 'class5',
      name: '9th Grade',
      grade: 9,
      sections: [
        { _id: 'sec10', name: 'A', capacity: 32 },
        { _id: 'sec11', name: 'B', capacity: 32 },
        { _id: 'sec12', name: 'C', capacity: 30 }
      ],
      academicYear: '2024-25',
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ],

  students: [
    {
      _id: 'student1',
      name: 'John Smith',
      admissionNumber: 'ADM001',
      class: '10th Grade',
      section: 'A',
      dateOfBirth: new Date('2008-05-15'),
      gender: 'male',
      parentName: 'Robert Smith',
      parentPhone: '+1234567890',
      parentEmail: 'robert.smith@email.com',
      address: '123 Main Street, Downtown, City - 12345',
      emergencyContact: '+1234567899',
      bloodGroup: 'O+',
      medicalConditions: '',
      previousSchool: '',
      academicYear: '2024-25',
      admissionDate: new Date('2024-04-01'),
      isActive: true,
      feeStructure: 'struct2',
      totalFee: 24200,
      paidAmount: 12000,
      pendingAmount: 12200,
      discounts: [],
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      _id: 'student2',
      name: 'Emily Johnson',
      admissionNumber: 'ADM002',
      class: '1st Grade',
      section: 'A',
      dateOfBirth: new Date('2016-08-22'),
      gender: 'female',
      parentName: 'Michael Johnson',
      parentPhone: '+1234567891',
      parentEmail: 'michael.johnson@email.com',
      address: '456 Oak Avenue, Suburb, City - 12346',
      emergencyContact: '+1234567898',
      bloodGroup: 'A+',
      medicalConditions: '',
      previousSchool: '',
      academicYear: '2024-25',
      admissionDate: new Date('2024-04-01'),
      isActive: true,
      feeStructure: 'struct1',
      totalFee: 13200,
      paidAmount: 13200,
      pendingAmount: 0,
      discounts: [],
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      _id: 'student3',
      name: 'Alice Brown',
      admissionNumber: 'ADM003',
      class: '2nd Grade',
      section: 'A',
      dateOfBirth: new Date('2015-03-10'),
      gender: 'female',
      parentName: 'David Brown',
      parentPhone: '+1234567892',
      parentEmail: 'david.brown@email.com',
      address: '789 Pine Street, Uptown, City - 12347',
      emergencyContact: '+1234567897',
      bloodGroup: 'B+',
      medicalConditions: '',
      previousSchool: '',
      academicYear: '2024-25',
      admissionDate: new Date('2024-04-01'),
      isActive: true,
      feeStructure: 'struct1',
      totalFee: 13200,
      paidAmount: 8000,
      pendingAmount: 5200,
      discounts: [],
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      _id: 'student4',
      name: 'Michael Davis',
      admissionNumber: 'ADM004',
      class: '9th Grade',
      section: 'B',
      dateOfBirth: new Date('2009-07-25'),
      gender: 'male',
      parentName: 'Sarah Davis',
      parentPhone: '+1234567893',
      parentEmail: 'sarah.davis@email.com',
      address: '321 Elm Avenue, Downtown, City - 12348',
      emergencyContact: '+1234567896',
      bloodGroup: 'O-',
      medicalConditions: 'Asthma',
      previousSchool: 'Central Public School',
      academicYear: '2024-25',
      admissionDate: new Date('2024-04-01'),
      isActive: true,
      feeStructure: 'struct2',
      totalFee: 24200,
      paidAmount: 20000,
      pendingAmount: 4200,
      discounts: [],
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ],

  payments: [
    {
      _id: 'payment1',
      receiptNumber: 'RCP1734567890001',
      student: 'student1',
      feeDetails: [
        { feeType: 'Tuition Fee', amount: 6000 },
        { feeType: 'Library Fee', amount: 1500 }
      ],
      totalAmount: 7500,
      paymentMethod: 'cash',
      paymentDate: new Date('2024-12-15'),
      collectedBy: 'Admin User',
      remarks: 'Monthly fee payment',
      status: 'completed',
      academicYear: '2024-25',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      _id: 'payment2',
      receiptNumber: 'RCP1734567890002',
      student: 'student2',
      feeDetails: [
        { feeType: 'Tuition Fee', amount: 4000 },
        { feeType: 'Admission Fee', amount: 8000 },
        { feeType: 'Library Fee', amount: 1200 }
      ],
      totalAmount: 13200,
      paymentMethod: 'online',
      paymentDate: new Date('2024-12-10'),
      collectedBy: 'Clerk User',
      remarks: 'Full fee payment',
      status: 'completed',
      academicYear: '2024-25',
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ],

  discounts: [
    {
      _id: 'discount1',
      studentId: 'student1',
      studentName: 'John Smith',
      discountType: 'percentage',
      discountValue: 20,
      feeTypes: ['cat1', 'cat4'],
      reason: 'Merit Scholarship',
      approvedBy: 'Principal',
      validFrom: new Date('2024-04-01'),
      validTo: new Date('2025-03-31'),
      isActive: true,
      academicYear: '2024-25',
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ],

  academicYears: [
    {
      _id: 'year1',
      year: '2024-25',
      startDate: new Date('2024-04-01'),
      endDate: new Date('2025-03-31'),
      isActive: true,
      description: 'Current Academic Year',
      studentsCount: 2,
      classesCount: 2,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      _id: 'year2',
      year: '2023-24',
      startDate: new Date('2023-04-01'),
      endDate: new Date('2024-03-31'),
      isActive: false,
      description: 'Previous Academic Year',
      studentsCount: 0,
      classesCount: 0,
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ],

  archivedData: [
    {
      _id: 'archive1',
      type: 'Academic Year',
      title: '2022-23 Academic Year Data',
      academicYear: '2022-23',
      description: 'Complete academic year data including students, classes, and fee records',
      archivedDate: new Date('2023-04-01'),
      size: '125 MB',
      recordsCount: 1180,
      categories: ['Students', 'Classes', 'Fee Records', 'Payments'],
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ],

  schoolSettings: {
    name: 'Greenwood International School',
    address: '123 Education Street, Knowledge City',
    phone: '+1-234-567-8900',
    email: 'info@greenwood.edu',
    website: 'www.greenwood.edu',
    academicYear: '2024-25',
    currency: 'INR',
    timezone: 'Asia/Kolkata',
    logo: '',
    updatedAt: new Date()
  }
};

// Helper functions
const generateId = () => {
  return Date.now().toString() + Math.random().toString(36).substr(2, 9);
};

const findById = (collection, id) => {
  return mockData[collection].find(item => item._id === id);
};

const findByQuery = (collection, query = {}) => {
  let results = [...mockData[collection]];
  
  Object.keys(query).forEach(key => {
    if (query[key] !== undefined && query[key] !== '') {
      if (key === '$or') {
        // Handle $or queries for search
        results = results.filter(item => 
          query[key].some(condition => {
            const field = Object.keys(condition)[0];
            const value = condition[field];
            if (value.$regex) {
              return item[field] && item[field].toLowerCase().includes(value.$regex.toLowerCase());
            }
            return item[field] === value;
          })
        );
      } else if (typeof query[key] === 'object' && query[key].$regex) {
        // Handle regex queries
        results = results.filter(item => 
          item[key] && item[key].toLowerCase().includes(query[key].$regex.toLowerCase())
        );
      } else {
        results = results.filter(item => item[key] === query[key]);
      }
    }
  });
  
  return results;
};

const updateById = (collection, id, updateData) => {
  const index = mockData[collection].findIndex(item => item._id === id);
  if (index !== -1) {
    mockData[collection][index] = {
      ...mockData[collection][index],
      ...updateData,
      updatedAt: new Date()
    };
    return mockData[collection][index];
  }
  return null;
};

const deleteById = (collection, id) => {
  const index = mockData[collection].findIndex(item => item._id === id);
  if (index !== -1) {
    return mockData[collection].splice(index, 1)[0];
  }
  return null;
};

const create = (collection, data) => {
  const newItem = {
    _id: generateId(),
    ...data,
    createdAt: new Date(),
    updatedAt: new Date()
  };
  mockData[collection].push(newItem);
  return newItem;
};

const countDocuments = (collection, query = {}) => {
  return findByQuery(collection, query).length;
};

// Populate function to simulate MongoDB populate
const populate = (item, populateFields) => {
  if (!populateFields) return item;
  
  const populated = { ...item };
  
  if (typeof populateFields === 'string') {
    populateFields = [{ path: populateFields }];
  } else if (!Array.isArray(populateFields)) {
    populateFields = [populateFields];
  }
  
  populateFields.forEach(field => {
    const path = field.path || field;
    const select = field.select;
    
    if (populated[path]) {
      if (path === 'student') {
        const student = findById('students', populated[path]);
        if (student) {
          populated[path] = select ? 
            Object.keys(student).reduce((obj, key) => {
              if (select.includes(key) || key === '_id') obj[key] = student[key];
              return obj;
            }, {}) : student;
        }
      } else if (path === 'feeStructure') {
        const structure = findById('feeStructures', populated[path]);
        if (structure) {
          populated[path] = structure;
        }
      } else if (path === 'feeTypes.categoryId') {
        if (populated.feeTypes) {
          populated.feeTypes = populated.feeTypes.map(feeType => ({
            ...feeType,
            categoryId: findById('feeCategories', feeType.categoryId) || feeType.categoryId
          }));
        }
      }
    }
  });
  
  return populated;
};

module.exports = {
  mockData,
  generateId,
  findById,
  findByQuery,
  updateById,
  deleteById,
  create,
  countDocuments,
  populate
};