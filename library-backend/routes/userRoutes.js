const express = require('express');
const router = express.Router();
const { getStudents, createUser, getDashboardStats } = require('../controllers/userController');
const { protect, authorize } = require('../middleware/auth');

router.get('/students', protect, authorize('Admin', 'Faculty', 'Librarian'), getStudents);
router.post('/', protect, authorize('Admin', 'Faculty', 'Librarian'), createUser);
router.get('/dashboard-stats', protect, getDashboardStats);

module.exports = router;
