// controllers/adminController.js
const Admin = require('../models/Admin');
const jwt = require('jsonwebtoken');

// Generate JWT token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

// @desc    Register a new admin
// @route   POST /api/admin/register
// @access  Public (or restricted to super-admin)
exports.registerAdmin = async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;

    // Input validation
    if (!firstName || !lastName || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required'
      });
    }

    // Check if admin already exists
    const adminExists = await Admin.findOne({ email });
    if (adminExists) {
      return res.status(400).json({
        success: false,
        message: 'Admin already exists'
      });
    }

    // Create new admin
    const admin = await Admin.create({ firstName, lastName, email, password });

    return res.status(201).json({
      success: true,
      data: {
        _id: admin._id,
        firstName: admin.firstName,
        lastName: admin.lastName,
        email: admin.email,
        token: generateToken(admin._id)
      }
    });

  } catch (error) {
    console.error('Admin registration error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Admin login
// @route   POST /api/admin/login
// @access  Public
exports.loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Input validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required'
      });
    }

    // Find admin by email
    const admin = await Admin.findOne({ email });

    if (!admin) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Compare password
    const isMatch = await admin.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Successful login
    return res.json({
      success: true,
      data: {
        _id: admin._id,
        firstName: admin.firstName,
        lastName: admin.lastName,
        email: admin.email,
        token: generateToken(admin._id)
      }
    });

  } catch (error) {
    console.error('Admin login error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};
