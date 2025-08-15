const mongoose = require('mongoose');
require('dotenv').config();

const User = require('../models/User');
const FeeCategory = require('../models/FeeCategory');
const FeeStructure = require('../models/FeeStructure');
const Class = require('../models/Class');
const Student = require('../models/Student');
const Payment = require('../models/Payment');
const Discount = require('../models/Discount');

async function seedData() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/school_fee_management');
    console.log('Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await FeeCategory.deleteMany({});
    await FeeStructure.deleteMany({});
    await Class.deleteMany({});
    await Student.deleteMany({});
    await Payment.deleteMany({});
    await Discount.deleteMany({});

    // Create admin user
    const adminUser = new User({
      name: 'Admin User',
      email: 'admin@school.com',
      password: 'admin123',
      role: 'admin'
    });
    await adminUser.save();

    // Create clerk user
    const clerkUser = new User({
      name: 'Clerk User',
      email: 'clerk@school.com',
      password: 'clerk123',
      role: 'clerk'
    });
    await clerkUser.save();

    // Create fee categories
    const feeCategories = [
      {
        name: 'Tuition Fee',
        description: 'Monthly tuition charges',
        defaultAmount: 5000,
        isOptional: false,
        category: 'academic'
      },
      {
        name: 'Admission Fee',
        description: 'One-time admission charges',
        defaultAmount: 10000,
        isOptional: false,
        category: 'admission'
      },
      {
        name: 'Transportation Fee',
        description: 'Monthly bus transportation',
        defaultAmount: 2000,
        isOptional: true,
        category: 'transport'
      },
      {
        name: 'Library Fee',
        description: 'Annual library charges',
        defaultAmount: 1500,
        isOptional: false,
        category: 'academic'
      },
      {
        name: 'Lab Fee',
        description: 'Laboratory usage charges',
        defaultAmount: 3000,
        isOptional: false,
        category: 'academic'
      },
      {
        name: 'Exam Fee',
        description: 'Examination charges',
        defaultAmount: 1000,
        isOptional: false,
        category: 'academic'
      }
    ];

    const createdCategories = await FeeCategory.insertMany(feeCategories);
    console.log('Fee categories created');

    // Create classes
    const classes = [
      {
        name: '1st Grade',
        grade: 1,
        sections: [
          { name: 'A', capacity: 30 },
          { name: 'B', capacity: 30 }
        ]
      },
      {
        name: '10th Grade',
        grade: 10,
        sections: [
          { name: 'A', capacity: 35 },
          { name: 'B', capacity: 35 },
          { name: 'C', capacity: 30 }
        ]
      }
    ];

    const createdClasses = await Class.insertMany(classes);
    console.log('Classes created');

    // Create fee structures
    const feeStructures = [
      {
        name: '1st Grade Fee Structure',
        class: '1st Grade',
        feeTypes: [
          { categoryId: createdCategories[0]._id, amount: 4000, dueDate: new Date('2024-12-31') },
          { categoryId: createdCategories[1]._id, amount: 8000, dueDate: new Date('2024-12-01') },
          { categoryId: createdCategories[3]._id, amount: 1200, dueDate: new Date('2024-12-15') }
        ],
        paymentPeriod: 'monthly',
        lateFeeType: 'percentage',
        lateFeeAmount: 5
      },
      {
        name: '10th Grade Fee Structure',
        class: '10th Grade',
        feeTypes: [
          { categoryId: createdCategories[0]._id, amount: 6000, dueDate: new Date('2024-12-31') },
          { categoryId: createdCategories[1]._id, amount: 12000, dueDate: new Date('2024-12-01') },
          { categoryId: createdCategories[3]._id, amount: 1500, dueDate: new Date('2024-12-15') },
          { categoryId: createdCategories[4]._id, amount: 3500, dueDate: new Date('2024-12-20') },
          { categoryId: createdCategories[5]._id, amount: 1200, dueDate: new Date('2024-12-25') }
        ],
        paymentPeriod: 'quarterly',
        lateFeeType: 'fixed',
        lateFeeAmount: 200
      }
    ];

    const createdStructures = await FeeStructure.insertMany(feeStructures);
    console.log('Fee structures created');

    // Create sample students
    const students = [
      {
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
        academicYear: '2024-25',
        feeStructure: createdStructures[1]._id,
        totalFee: 24200,
        paidAmount: 12000,
        pendingAmount: 12200
      },
      {
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
        academicYear: '2024-25',
        feeStructure: createdStructures[0]._id,
        totalFee: 13200,
        paidAmount: 13200,
        pendingAmount: 0
      }
    ];

    await Student.insertMany(students);
    console.log('Sample students created');

    // Create sample payments
    const payments = [
      {
        student: students[0]._id,
        feeDetails: [
          { feeType: 'Tuition Fee', amount: 6000 },
          { feeType: 'Library Fee', amount: 1500 }
        ],
        totalAmount: 7500,
        paymentMethod: 'cash',
        collectedBy: 'Admin User',
        remarks: 'Monthly fee payment'
      },
      {
        student: students[1]._id,
        feeDetails: [
          { feeType: 'Tuition Fee', amount: 4000 },
          { feeType: 'Transport Fee', amount: 2000 }
        ],
        totalAmount: 6000,
        paymentMethod: 'online',
        collectedBy: 'Clerk User',
        remarks: 'Online payment via UPI'
      }
    ];

    await Payment.insertMany(payments);
    console.log('Sample payments created');

    // Create sample discounts
    const discounts = [
      {
        studentId: students[0]._id,
        studentName: students[0].name,
        discountType: 'percentage',
        discountValue: 20,
        feeTypes: [createdCategories[0]._id, createdCategories[3]._id],
        reason: 'Merit Scholarship',
        approvedBy: 'Principal',
        validFrom: new Date('2024-04-01'),
        validTo: new Date('2025-03-31')
      }
    ];

    await Discount.insertMany(discounts);
    console.log('Sample discounts created');
    console.log('✅ Database seeded successfully!');
    console.log('Admin login: admin@school.com / admin123');
    console.log('Clerk login: clerk@school.com / clerk123');

  } catch (error) {
    console.error('❌ Error seeding database:', error);
  } finally {
    await mongoose.disconnect();
  }
}

seedData();