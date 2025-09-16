const express = require('express');
const router = express.Router();
const { registerAdmin, loginAdmin } = require('../controllers/adminController');

// Admin registration and login
router.post('/register', registerAdmin);
router.post('/login', loginAdmin);

module.exports = router;
