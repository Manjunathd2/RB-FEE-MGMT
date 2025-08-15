const express = require('express');
const router = express.Router();
const { mockData, findById, findByQuery, updateById, deleteById, create, countDocuments, populate } = require('../data/mockData');

// Get all payments with filters
router.get('/', async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 10, 
      search, 
      class: studentClass,
      paymentMethod,
      startDate,
      endDate
    } = req.query;

    let query = {};
    
    if (startDate && endDate) {
      // Mock date filtering
      const start = new Date(startDate);
      const end = new Date(endDate);
      query.dateRange = { start, end };
    }
    
    if (paymentMethod) query.paymentMethod = paymentMethod;

    let payments = findByQuery('payments', {});
    
    // Apply date filtering
    if (query.dateRange) {
      payments = payments.filter(payment => {
        const paymentDate = new Date(payment.paymentDate);
        return paymentDate >= query.dateRange.start && paymentDate <= query.dateRange.end;
      });
    }
    
    // Apply payment method filter
    if (paymentMethod) {
      payments = payments.filter(payment => payment.paymentMethod === paymentMethod);
    }

    // Populate student data
    payments = payments.map(payment => ({
      ...payment,
      student: findById('students', payment.student)
    }));

    // Filter by student class if specified
    if (studentClass) {
      payments = payments.filter(payment => 
        payment.student && payment.student.class === studentClass
      );
    }

    // Filter by search term if specified
    if (search) {
      payments = payments.filter(payment => 
        payment.student && (
          payment.student.name.toLowerCase().includes(search.toLowerCase()) ||
          payment.student.admissionNumber.toLowerCase().includes(search.toLowerCase()) ||
          payment.receiptNumber.toLowerCase().includes(search.toLowerCase())
        )
      );
    }

    // Sort by payment date (newest first)
    payments.sort((a, b) => new Date(b.paymentDate) - new Date(a.paymentDate));
    
    // Pagination
    const total = payments.length;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + parseInt(limit);
    const paginatedPayments = payments.slice(startIndex, endIndex);

    res.json({
      payments: paginatedPayments,
      totalPages: Math.ceil(total / limit),
      currentPage: parseInt(page),
      total
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create new payment
router.post('/', async (req, res) => {
  try {
    const { studentId, feeDetails, totalAmount, paymentMethod, remarks, collectedBy } = req.body;

    // Find student
    const student = findById('students', studentId);
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    // Generate receipt number
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    const receiptNumber = `RCP${timestamp}${random}`;

    // Create payment record
    const paymentData = {
      receiptNumber,
      student: studentId,
      feeDetails,
      totalAmount,
      paymentMethod,
      paymentDate: new Date(),
      remarks,
      collectedBy: collectedBy || 'Admin User',
      status: 'completed',
      academicYear: '2024-25'
    };

    const payment = create('payments', paymentData);

    // Update student payment status
    const updatedStudent = updateById('students', studentId, {
      paidAmount: student.paidAmount + totalAmount,
      pendingAmount: student.totalFee - (student.paidAmount + totalAmount)
    });

    // Populate student data in payment response
    const populatedPayment = {
      ...payment,
      student: updatedStudent
    };

    res.status(201).json(populatedPayment);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get payment by ID
router.get('/:id', async (req, res) => {
  try {
    const payment = findById('payments', req.params.id);
    
    if (!payment) {
      return res.status(404).json({ message: 'Payment not found' });
    }
    
    const populatedPayment = {
      ...payment,
      student: findById('students', payment.student)
    };
    
    res.json(populatedPayment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get daily report
router.get('/reports/daily', async (req, res) => {
  try {
    const { date = new Date().toISOString().split('T')[0] } = req.query;
    
    const startDate = new Date(date);
    const endDate = new Date(date);
    endDate.setDate(endDate.getDate() + 1);

    let payments = mockData.payments.filter(payment => {
      const paymentDate = new Date(payment.paymentDate);
      return paymentDate >= startDate && paymentDate < endDate && payment.status === 'completed';
    });

    // Populate student data
    payments = payments.map(payment => ({
      ...payment,
      student: findById('students', payment.student)
    }));

    const totalCollections = payments.reduce((sum, payment) => sum + payment.totalAmount, 0);
    const totalTransactions = payments.length;

    const paymentMethods = payments.reduce((acc, payment) => {
      if (!acc[payment.paymentMethod]) {
        acc[payment.paymentMethod] = { amount: 0, count: 0 };
      }
      acc[payment.paymentMethod].amount += payment.totalAmount;
      acc[payment.paymentMethod].count += 1;
      return acc;
    }, {});

    const classWiseBreakdown = payments.reduce((acc, payment) => {
      const className = payment.student?.class || 'Unknown';
      if (!acc[className]) {
        acc[className] = { amount: 0, transactions: 0 };
      }
      acc[className].amount += payment.totalAmount;
      acc[className].transactions += 1;
      return acc;
    }, {});

    res.json({
      date,
      totalCollections,
      totalTransactions,
      paymentMethods,
      transactions: payments,
      classWiseBreakdown: Object.entries(classWiseBreakdown).map(([className, data]) => ({
        class: className,
        ...data
      }))
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get monthly report
router.get('/reports/monthly', async (req, res) => {
  try {
    const { month = new Date().toISOString().slice(0, 7) } = req.query;
    
    const startDate = new Date(month + '-01');
    const endDate = new Date(startDate);
    endDate.setMonth(endDate.getMonth() + 1);

    let payments = mockData.payments.filter(payment => {
      const paymentDate = new Date(payment.paymentDate);
      return paymentDate >= startDate && paymentDate < endDate && payment.status === 'completed';
    });

    // Populate student data
    payments = payments.map(payment => ({
      ...payment,
      student: findById('students', payment.student)
    }));

    const totalCollected = payments.reduce((sum, payment) => sum + payment.totalAmount, 0);
    const totalTransactions = payments.length;
    const daysInMonth = new Date(endDate.getFullYear(), endDate.getMonth(), 0).getDate();
    const averagePerDay = totalCollected / daysInMonth;

    const paymentMethodTrends = payments.reduce((acc, payment) => {
      if (!acc[payment.paymentMethod]) {
        acc[payment.paymentMethod] = { amount: 0, percentage: 0 };
      }
      acc[payment.paymentMethod].amount += payment.totalAmount;
      return acc;
    }, {});

    // Calculate percentages
    Object.keys(paymentMethodTrends).forEach(method => {
      paymentMethodTrends[method].percentage = 
        totalCollected > 0 ? Math.round((paymentMethodTrends[method].amount / totalCollected) * 100) : 0;
    });

    res.json({
      month: new Date(month + '-01').toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
      totalCollected,
      totalTransactions,
      averagePerDay: Math.round(averagePerDay),
      paymentMethodTrends
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;