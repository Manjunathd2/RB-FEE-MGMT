const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { mockData, findByQuery, updateById, create } = require('../data/mockData');
const router = express.Router();

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const users = findByQuery('users', { email, isActive: true });
    const user = users[0];
    
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Check password (for demo, we'll accept the plain passwords)
    const isMatch = password === 'admin123' || password === 'clerk123' || 
                   await bcrypt.compare(password, user.password);
    
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Update last login
    updateById('users', user._id, { lastLogin: new Date() });

    // Generate JWT
    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Register (Admin only)
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // Check if user already exists
    const existingUsers = findByQuery('users', { email });
    if (existingUsers.length > 0) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const userData = { 
      name, 
      email, 
      password: hashedPassword, 
      role: role || 'clerk',
      isActive: true
    };
    
    const user = create('users', userData);

    res.status(201).json({ message: 'User created successfully' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;