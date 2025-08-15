const API_BASE_URL = 'http://localhost:5000/api';

class ApiService {
  constructor() {
    this.token = localStorage.getItem('token');
  }

  setToken(token) {
    this.token = token;
    localStorage.setItem('token', token);
  }

  removeToken() {
    this.token = null;
    localStorage.removeItem('token');
  }

  async request(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...(this.token && { Authorization: `Bearer ${this.token}` }),
        ...options.headers,
      },
      ...options,
    };

    if (config.body && typeof config.body === 'object') {
      config.body = JSON.stringify(config.body);
    }

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'API request failed');
      }

      return await response.json();
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }

  // Auth methods
  async login(email, password) {
    const response = await this.request('/auth/login', {
      method: 'POST',
      body: { email, password },
    });
    
    if (response.token) {
      this.setToken(response.token);
    }
    
    return response;
  }

  async register(userData) {
    return this.request('/auth/register', {
      method: 'POST',
      body: userData,
    });
  }

  // Student methods
  async getStudents(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/students${queryString ? `?${queryString}` : ''}`);
  }

  async getStudent(id) {
    return this.request(`/students/${id}`);
  }

  async createStudent(studentData) {
    return this.request('/students', {
      method: 'POST',
      body: studentData,
    });
  }

  async updateStudent(id, studentData) {
    return this.request(`/students/${id}`, {
      method: 'PUT',
      body: studentData,
    });
  }

  async deleteStudent(id) {
    return this.request(`/students/${id}`, {
      method: 'DELETE',
    });
  }

  async getDefaulters(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/students/reports/defaulters${queryString ? `?${queryString}` : ''}`);
  }

  // Payment methods
  async getPayments(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/payments${queryString ? `?${queryString}` : ''}`);
  }

  async createPayment(paymentData) {
    return this.request('/payments', {
      method: 'POST',
      body: paymentData,
    });
  }

  async getPayment(id) {
    return this.request(`/payments/${id}`);
  }

  async getDailyReport(date) {
    return this.request(`/payments/reports/daily?date=${date}`);
  }

  async getMonthlyReport(month) {
    return this.request(`/payments/reports/monthly?month=${month}`);
  }

  // Fee methods
  async getFeeCategories() {
    return this.request('/fees/categories');
  }

  async createFeeCategory(categoryData) {
    return this.request('/fees/categories', {
      method: 'POST',
      body: categoryData,
    });
  }

  async updateFeeCategory(id, categoryData) {
    return this.request(`/fees/categories/${id}`, {
      method: 'PUT',
      body: categoryData,
    });
  }

  async deleteFeeCategory(id) {
    return this.request(`/fees/categories/${id}`, {
      method: 'DELETE',
    });
  }

  async getFeeStructures() {
    return this.request('/fees/structures');
  }

  async createFeeStructure(structureData) {
    return this.request('/fees/structures', {
      method: 'POST',
      body: structureData,
    });
  }

  async updateFeeStructure(id, structureData) {
    return this.request(`/fees/structures/${id}`, {
      method: 'PUT',
      body: structureData,
    });
  }

  async deleteFeeStructure(id) {
    return this.request(`/fees/structures/${id}`, {
      method: 'DELETE',
    });
  }

  // Class methods
  async getClasses() {
    return this.request('/classes');
  }

  async getClass(id) {
    return this.request(`/classes/${id}`);
  }

  async createClass(classData) {
    return this.request('/classes', {
      method: 'POST',
      body: classData,
    });
  }

  async updateClass(id, classData) {
    return this.request(`/classes/${id}`, {
      method: 'PUT',
      body: classData,
    });
  }

  async deleteClass(id) {
    return this.request(`/classes/${id}`, {
      method: 'DELETE',
    });
  }

  // Report methods
  async getOverallReport(academicYear = '2024-25') {
    return this.request(`/reports/overall?academicYear=${academicYear}`);
  }

  async getClassWiseReport(className = '', academicYear = '2024-25') {
    const params = new URLSearchParams({ academicYear });
    if (className) params.append('class', className);
    return this.request(`/reports/classwise?${params.toString()}`);
  }

  // Settings methods
  async getSchoolSettings() {
    return this.request('/settings/school');
  }

  async updateSchoolSettings(settings) {
    return this.request('/settings/school', {
      method: 'PUT',
      body: settings,
    });
  }

  // Discount methods
  async getDiscounts(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/discounts${queryString ? `?${queryString}` : ''}`);
  }

  async createDiscount(discountData) {
    return this.request('/discounts', {
      method: 'POST',
      body: discountData,
    });
  }

  async updateDiscount(id, discountData) {
    return this.request(`/discounts/${id}`, {
      method: 'PUT',
      body: discountData,
    });
  }

  async deleteDiscount(id) {
    return this.request(`/discounts/${id}`, {
      method: 'DELETE',
    });
  }

  // Academic management methods
  async getAcademicYears() {
    return this.request('/academic/years');
  }

  async createAcademicYear(yearData) {
    return this.request('/academic/years', {
      method: 'POST',
      body: yearData,
    });
  }

  async updateAcademicYear(id, yearData) {
    return this.request(`/academic/years/${id}`, {
      method: 'PUT',
      body: yearData,
    });
  }

  async deleteAcademicYear(id) {
    return this.request(`/academic/years/${id}`, {
      method: 'DELETE',
    });
  }

  async getActiveAcademicYear  () {
      return this.request('/academic/years/active'); // replace with your actual API route
       // assumes { year: '2025-26' } or similar
  };

  async getArchivedData(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/academic/archive${queryString ? `?${queryString}` : ''}`);
  }

  async createArchive(archiveData) {
    return this.request('/academic/archive', {
      method: 'POST',
      body: archiveData,
    });
  }

  async getStudentsForPromotion(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/academic/promotion/students${queryString ? `?${queryString}` : ''}`);
  }

  async promoteStudents(promotionData) {
    return this.request('/academic/promotion/promote', {
      method: 'POST',
      body: promotionData,
    });
  }

  async getStudentsWithBalances(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/academic/balance/students${queryString ? `?${queryString}` : ''}`);
  }

  async carryForwardBalances(carryForwardData) {
    return this.request('/academic/balance/carry-forward', {
      method: 'POST',
      body: carryForwardData,
    });
  }
}

export default new ApiService();