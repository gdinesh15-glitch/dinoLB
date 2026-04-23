const User = require('../models/User');
const jwt = require('jsonwebtoken');

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res) => {
    const { userId, password } = req.body;

    try {
        // Find user by userId
        const user = await User.findOne({ userId });

        if (!user) {
            return res.status(401).json({ message: 'Invalid User ID or password' });
        }

        // Check password
        const isMatch = await user.comparePassword(password);

        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid User ID or password' });
        }

        // Generate token
        const token = jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_SECRET || 'secret',
            { expiresIn: '30d' }
        );

        res.json({
            token,
            user: {
                id: user._id,
                userId: user.userId,
                name: user.name,
                role: user.role,
                department: user.department,
                year: user.year
            }
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};
