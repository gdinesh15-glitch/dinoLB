const User = require('../models/User');
const Book = require('../models/Book');
const Transaction = require('../models/Transaction');

// @desc    Get all students
// @route   GET /api/users/students
// @access  Protected (Admin, Faculty, Librarian)
exports.getStudents = async (req, res) => {
    try {
        const students = await User.find({ role: 'Student' }).select('-password');
        res.json(students);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Create a new user
// @route   POST /api/users
// @access  Protected (Admin, Faculty, Librarian)
exports.createUser = async (req, res) => {
    try {
        const { userId, name, password, role, department, year } = req.body;
        
        const userExists = await User.findOne({ userId });
        if (userExists) {
            return res.status(400).json({ message: 'User ID already exists' });
        }

        const user = await User.create({
            userId,
            name,
            password,
            role,
            department,
            year
        });

        res.status(201).json({
            id: user._id,
            userId: user.userId,
            name: user.name,
            role: user.role
        });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// @desc    Get dashboard stats
// @route   GET /api/users/dashboard-stats
// @access  Protected
exports.getDashboardStats = async (req, res) => {
    try {
        const totalStudents = await User.countDocuments({ role: 'Student' });
        const totalBooks = await Book.countDocuments();
        const activeIssues = await Transaction.countDocuments({ status: 'Issued' });
        const overdueBooks = await Transaction.countDocuments({ status: 'Overdue' });

        res.json({
            totalStudents,
            totalBooks,
            activeIssues,
            overdueBooks
        });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
};
