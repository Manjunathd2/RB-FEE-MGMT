const express = require('express');
const router = express.Router();
const { mockData, findById, findByQuery } = require('../data/mockData');

// Overall report
router.get('/overall', async (req, res) => {
  try {
    const { academicYear = '2024-25' } = req.query;

    // Get all students for the academic year
    const students = findByQuery('students', { academicYear, isActive: true });
    const totalStudents = students.length;
    const totalFeeAmount = students.reduce((sum, student) => sum + (student.totalFee || 0), 0);
    const collectedAmount = students.reduce((sum, student) => sum + (student.paidAmount || 0), 0);
    const pendingAmount = totalFeeAmount - collectedAmount;
    const collectionPercentage = totalFeeAmount > 0 ? Math.round((collectedAmount / totalFeeAmount) * 100) : 0;

    // Get payments for the academic year
    let payments = findByQuery('payments', { 
      academicYear,
      status: 'completed'
    });

    // Populate student data
    payments = payments.map(payment => ({
      ...payment,
      student: findById('students', payment.student)
    }));

    // Payment method distribution
    const paymentMethodDistribution = payments.reduce((acc, payment) => {
      if (!acc[payment.paymentMethod]) {
        acc[payment.paymentMethod] = { amount: 0, percentage: 0 };
      }
      acc[payment.paymentMethod].amount += payment.totalAmount;
      return acc;
    }, {});

    // Calculate percentages
    Object.keys(paymentMethodDistribution).forEach(method => {
      paymentMethodDistribution[method].percentage = 
        collectedAmount > 0 ? Math.round((paymentMethodDistribution[method].amount / collectedAmount) * 100) : 0;
    });

    // Top performing classes
    const classPerformance = students.reduce((acc, student) => {
      if (!acc[student.class]) {
        acc[student.class] = { 
          totalFee: 0, 
          collected: 0, 
          students: 0 
        };
      }
      acc[student.class].totalFee += student.totalFee || 0;
      acc[student.class].collected += student.paidAmount || 0;
      acc[student.class].students += 1;
      return acc;
    }, {});

    const topPerformingClasses = Object.entries(classPerformance)
      .map(([className, data]) => ({
        class: className,
        percentage: data.totalFee > 0 ? Math.round((data.collected / data.totalFee) * 100) : 0,
        collected: data.collected,
        students: data.students
      }))
      .sort((a, b) => b.percentage - a.percentage)
      .slice(0, 5);

    // Defaulters summary
    const defaulters = students.filter(student => (student.pendingAmount || 0) > 0);
    const criticalDefaulters = defaulters.filter(student => (student.pendingAmount || 0) > (student.totalFee || 0) * 0.5);

    res.json({
      academicYear,
      totalStudents,
      totalFeeAmount,
      collectedAmount,
      pendingAmount,
      collectionPercentage,
      paymentMethodDistribution,
      topPerformingClasses,
      defaultersSummary: {
        total: defaulters.length,
        critical: criticalDefaulters.length,
        overdue: defaulters.length - criticalDefaulters.length,
        totalPending: pendingAmount
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Class-wise report
router.get('/classwise', async (req, res) => {
  try {
    const { class: className, academicYear = '2024-25' } = req.query;

    let query = { academicYear, isActive: true };
    if (className) query.class = className;

    const students = findByQuery('students', query);

    if (className) {
      // Specific class report with sections
      const sections = students.reduce((acc, student) => {
        if (!acc[student.section]) {
          acc[student.section] = {
            students: 0,
            collected: 0,
            pending: 0,
            totalFee: 0
          };
        }
        acc[student.section].students += 1;
        acc[student.section].collected += student.paidAmount || 0;
        acc[student.section].pending += student.pendingAmount || 0;
        acc[student.section].totalFee += student.totalFee || 0;
        return acc;
      }, {});

      const sectionsArray = Object.entries(sections).map(([section, data]) => ({
        section,
        ...data,
        percentage: data.totalFee > 0 ? Math.round((data.collected / data.totalFee) * 100) : 0
      }));

      const totalFeeAmount = students.reduce((sum, s) => sum + (s.totalFee || 0), 0);
      const collectedAmount = students.reduce((sum, s) => sum + (s.paidAmount || 0), 0);
      const pendingAmount = students.reduce((sum, s) => sum + (s.pendingAmount || 0), 0);

      res.json({
        class: className,
        totalStudents: students.length,
        totalFeeAmount,
        collectedAmount,
        pendingAmount,
        collectionPercentage: totalFeeAmount > 0 ? Math.round((collectedAmount / totalFeeAmount) * 100) : 0,
        sections: sectionsArray
      });
    } else {
      // All classes report
      const classes = students.reduce((acc, student) => {
        if (!acc[student.class]) {
          acc[student.class] = {
            students: 0,
            collected: 0,
            pending: 0,
            totalFee: 0
          };
        }
        acc[student.class].students += 1;
        acc[student.class].collected += student.paidAmount || 0;
        acc[student.class].pending += student.pendingAmount || 0;
        acc[student.class].totalFee += student.totalFee || 0;
        return acc;
      }, {});

      const classesArray = Object.entries(classes).map(([className, data]) => ({
        class: className,
        ...data,
        percentage: data.totalFee > 0 ? Math.round((data.collected / data.totalFee) * 100) : 0
      }));

      const totalFeeAmount = students.reduce((sum, s) => sum + (s.totalFee || 0), 0);
      const collectedAmount = students.reduce((sum, s) => sum + (s.paidAmount || 0), 0);
      const pendingAmount = students.reduce((sum, s) => sum + (s.pendingAmount || 0), 0);

      res.json({
        class: 'All Classes',
        totalStudents: students.length,
        totalFeeAmount,
        collectedAmount,
        pendingAmount,
        collectionPercentage: totalFeeAmount > 0 ? Math.round((collectedAmount / totalFeeAmount) * 100) : 0,
        sections: classesArray
      });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;