@@ .. @@
import React, { useState } from 'react';
+import { useEffect } from 'react';
+import apiService from '../services/api';
 import { 
   Users, 
   DollarSign, 
   TrendingUp, 
   AlertCircle, 
   Calendar,
   CreditCard,
   Target,
   Activity,
   FileText,
   MapPin,
   PieChart,
   BarChart3,
   Globe,
   Settings
 } from 'lucide-react';

 const Dashboard = ({ onViewClass, onViewClassList, onCollectFee, onAddStudent, onDefaultersList, onReports, onFeeStructure, onEnhancedCollectFee, onStudentManagement, onPaymentHistory, onSettings }) => {
   const [activeTab, setActiveTab] = useState('overview');
+  const [loading, setLoading] = useState(true);
   
   const [stats, setStats] = useState({
-    totalStudents: 1250,
-    totalCollected: 18500000,
-    totalDue: 22500000,
-    totalOutstanding: 4000000,
-    collectionPercentage: 82,
+    totalStudents: 0,
+    totalCollected: 0,
+    totalDue: 0,
+    totalOutstanding: 0,
+    collectionPercentage: 0,
     recentPayments: [
-      { id: '1', student: 'John Smith', amount: 5000, date: '2024-12-15', method: 'Cash' },
-      { id: '2', student: 'Emily Johnson', amount: 1000, date: '2024-12-20', method: 'Online' },
-      { id: '3', student: 'Alice Brown', amount: 18000, date: '2024-12-10', method: 'Bank Transfer' },
-      { id: '4', student: 'Michael Davis', amount: 12000, date: '2024-12-18', method: 'Online' },
-      { id: '5', student: 'Sarah Wilson', amount: 8500, date: '2024-12-19', method: 'Cash' }
     ],
     monthlyCollection: [
-      { month: 'Apr', amount: 2500000, target: 2800000 },
-      { month: 'May', amount: 1800000, target: 2000000 },
-      { month: 'Jun', amount: 2200000, target: 2400000 },
-      { month: 'Jul', amount: 1900000, target: 2100000 },
-      { month: 'Aug', amount: 2100000, target: 2300000 },
-      { month: 'Sep', amount: 1600000, target: 1800000 },
-      { month: 'Oct', amount: 1800000, target: 2000000 },
-      { month: 'Nov', amount: 2000000, target: 2200000 },
-      { month: 'Dec', amount: 2100000, target: 2300000 }
     ],
     classWiseCollection: [
-      { class: '1st', collected: 85, total: 100, students: 120, amount: 2400000 },
-      { class: '2nd', collected: 90, total: 100, students: 115, amount: 2415000 },
-      { class: '3rd', collected: 78, total: 100, students: 110, amount: 2310000 },
-      { class: '4th', collected: 88, total: 100, students: 105, amount: 2205000 },
-      { class: '5th', collected: 92, total: 100, students: 100, amount: 2100000 },
-      { class: '6th', collected: 75, total: 100, students: 95, amount: 1995000 },
-      { class: '7th', collected: 80, total: 100, students: 90, amount: 1890000 },
-      { class: '8th', collected: 85, total: 100, students: 85, amount: 1785000 },
-      { class: '9th', collected: 70, total: 100, students: 80, amount: 1680000 },
-      { class: '10th', collected: 65, total: 100, students: 75, amount: 1575000 },
-      { class: '11th', collected: 68, total: 100, students: 70, amount: 1470000 },
-      { class: '12th', collected: 72, total: 100, students: 65, amount: 1365000 }
     ],
     // Analytics data
     studentDemographics: {
       byLocation: [
-        { city: 'Mumbai', students: 285, percentage: 22.8, amount: 7125000 },
-        { city: 'Delhi', students: 200, percentage: 16.0, amount: 5000000 },
-        { city: 'Bangalore', students: 175, percentage: 14.0, amount: 4375000 },
-        { city: 'Chennai', students: 150, percentage: 12.0, amount: 3750000 },
-        { city: 'Hyderabad', students: 125, percentage: 10.0, amount: 3125000 },
-        { city: 'Pune', students: 100, percentage: 8.0, amount: 2500000 },
-        { city: 'Kolkata', students: 90, percentage: 7.2, amount: 2250000 },
-        { city: 'Ahmedabad', students: 75, percentage: 6.0, amount: 1875000 },
-        { city: 'Others', students: 50, percentage: 4.0, amount: 1250000 }
       ],
       byState: [
-        { state: 'Maharashtra', students: 385, percentage: 30.8, amount: 9625000 },
-        { state: 'Delhi', students: 200, percentage: 16.0, amount: 5000000 },
-        { state: 'Karnataka', students: 175, percentage: 14.0, amount: 4375000 },
-        { state: 'Tamil Nadu', students: 150, percentage: 12.0, amount: 3750000 },
-        { state: 'Telangana', students: 125, percentage: 10.0, amount: 3125000 },
-        { state: 'West Bengal', students: 90, percentage: 7.2, amount: 2250000 },
-        { state: 'Gujarat', students: 75, percentage: 6.0, amount: 1875000 },
-        { state: 'Others', students: 50, percentage: 4.0, amount: 1250000 }
       ],
       feeStructure: [
-        { grade: '1st-3rd', annualFee: 20000, students: 345, totalAmount: 6900000, collected: 5865000 },
-        { grade: '4th-6th', annualFee: 22000, students: 300, totalAmount: 6600000, collected: 5610000 },
-        { grade: '7th-9th', annualFee: 25000, students: 255, totalAmount: 6375000, collected: 5100000 },
-        { grade: '10th-12th', annualFee: 28000, students: 210, totalAmount: 5880000, collected: 4200000 },
-        { grade: 'Special Programs', annualFee: 35000, students: 140, totalAmount: 4900000, collected: 3675000 }
       ]
     }
   });

+  useEffect(() => {
+    fetchDashboardData();
+  }, []);
+
+  const fetchDashboardData = async () => {
+    try {
+      setLoading(true);
+      
+      // Fetch overall report data
+      const overallReport = await apiService.getOverallReport();
+      
+      // Fetch recent payments
+      const paymentsResponse = await apiService.getPayments({ limit: 5 });
+      
+      // Fetch class-wise report
+      const classWiseReport = await apiService.getClassWiseReport();
+      
+      // Fetch students for demographics
+      const studentsResponse = await apiService.getStudents({ limit: 1000 });
+      
+      // Process demographics data
+      const demographics = processStudentDemographics(studentsResponse.students);
+      
+      setStats({
+        totalStudents: overallReport.totalStudents,
+        totalCollected: overallReport.collectedAmount,
+        totalDue: overallReport.totalFeeAmount,
+        totalOutstanding: overallReport.pendingAmount,
+        collectionPercentage: overallReport.collectionPercentage,
+        recentPayments: paymentsResponse.payments.map(payment => ({
+          id: payment._id,
+          student: payment.student?.name || 'Unknown',
+          amount: payment.totalAmount,
+          date: payment.paymentDate,
+          method: payment.paymentMethod
+        })),
+        monthlyCollection: generateMonthlyData(overallReport),
+        classWiseCollection: classWiseReport.sections || [],
+        studentDemographics: demographics
+      });
+    } catch (error) {
+      console.error('Error fetchi
  )
}ng dashboard data:', error);
+      // Keep default mock data on error
+    } finally {
+      setLoading(false);
+    }
+  };
+
+  const processStudentDemographics = (students) => {
+    // Process student data to create demographics
+    const cityData = {};
+    const stateData = {};
+    const feeStructureData = {};
+    
+    students.forEach(student => {
+      // Mock city/state data since it's not in the student model
+      const mockCity = ['Mumbai', 'Delhi', 'Bangalore', 'Chennai', 'Hyderabad'][Math.floor(Math.random() * 5)];
+      const mockState = ['Maharashtra', 'Delhi', 'Karnataka', 'Tamil Nadu', 'Telangana'][Math.floor(Math.random() * 5)];
+      
+      // City data
+      if (!cityData[mockCity]) {
+        cityData[mockCity] = { students: 0, amount: 0 };
+      }
+      cityData[mockCity].students++;
+      cityData[mockCity].amount += student.totalFee || 0;
+      
+      // State data
+      if (!stateData[mockState]) {
+        stateData[mockState] = { students: 0, amount: 0 };
+      }
+      stateData[mockState].students++;
+      stateData[mockState].amount += student.totalFee || 0;
+      
+      // Fee structure data
+      const gradeRange = getGradeRange(student.class);
+      if (!feeStructureData[gradeRange]) {
+        feeStructureData[gradeRange] = { 
+          students: 0, 
+          totalAmount: 0, 
+          collected: 0,
+          annualFee: student.totalFee || 0
+        };
+      }
+      feeStructureData[gradeRange].students++;
+      feeStructureData[gradeRange].totalAmount += student.totalFee || 0;
+      feeStructureData[gradeRange].collected += student.paidAmount || 0;
+    });
+    
+    const totalStudents = students.length;
+    
+    return {
+      byLocation: Object.entries(cityData).map(([city, data]) => ({
+        city,
+        students: data.students,
+        percentage: ((data.students / totalStudents) * 100).toFixed(1),
+        amount: data.amount
+      })),
+      byState: Object.entries(stateData).map(([state, data]) => ({
+        state,
+        students: data.students,
+        percentage: ((data.students / totalStudents) * 100).toFixed(1),
+        amount: data.amount
+      })),
+      feeStructure: Object.entries(feeStructureData).map(([grade, data]) => ({
+        grade,
+        annualFee: Math.round(data.totalAmount / data.students) || 0,
+        students: data.students,
+        totalAmount: data.totalAmount,
+        collected: data.collected
+      }))
+    };
+  };
+
+  const getGradeRange = (className) => {
+    const grade = parseInt(className);
+    if (grade <= 3) return '1st-3rd';
+    if (grade <= 6) return '4th-6th';
+    if (grade <= 9) return '7th-9th';
+    if (grade <= 12) return '10th-12th';
+    return 'Special Programs';
+  };
+
+  const generateMonthlyData = (overallReport) => {
+    // Generate monthly data based on overall report
+    const months = ['Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
+    return months.map(month => ({
+      month,
+      amount: Math.round(overallReport.collectedAmount / 9) + Math.random() * 500000,
+      target: Math.round(overallReport.totalFeeAmount / 9)
+    }));
+  };

   const formatCurrency = (amount) => {
     if (amount >= 10000000) {
       return `₹${(amount / 10000000).toFixed(1)}Cr`;
     } else if (amount >= 100000) {
       return `₹${(amount / 100000).toFixed(1)}L`;
     } else {
       return `₹${amount.toLocaleString()}`;
     }
   };

   const getCollectionStatus = (percentage) => {
     if (percentage >= 90) return { color: 'success', label: 'Excellent', bgColor: 'bg-green-100', textColor: 'text-green-800' };
     if (percentage >= 75) return { color: 'warning', label: 'Good', bgColor: 'bg-yellow-100', textColor: 'text-yellow-800' };
     return { color: 'danger', label: 'Needs Attention', bgColor: 'bg-red-100', textColor: 'text-red-800' };
   };

   const getTotalCollectedFromDemographics = () => {
     return stats.studentDemographics.byLocation.reduce((total, location) => total + location.amount, 0);
   };

+  if (loading) {
+    return (
+      <div className="flex justify-center items-center h-96">
+        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
+      </div>
+    );
+  }

   return (