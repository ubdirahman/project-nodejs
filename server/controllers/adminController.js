const User = require('../models/User');
const bcrypt = require('bcryptjs');

// @desc    Get dashboard stats
// @route   GET /api/admin/stats
// @access  Private/Admin
const getAdminStats = async (req, res) => {
    const totalUsers = await User.countDocuments();
    // In a real app, you might want to chart recent user signups, etc.
    const newUsersToday = await User.countDocuments({
        createdAt: { $gte: new Date(new Date().setHours(0, 0, 0, 0)) }
    });

    res.json({
        totalUsers,
        newUsersToday
    });
};

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private/Admin
const getUsers = async (req, res) => {
    const users = await User.find({}).select('-password');
    res.json(users);
};

// @desc    Delete user
// @route   DELETE /api/admin/users/:id
// @access  Private/Admin
const deleteUser = async (req, res) => {
    const user = await User.findById(req.params.id);

    if (user) {
        await user.deleteOne();
        res.json({ message: 'User removed' });
    } else {
        res.status(404).json({ message: 'User not found' });
    }
};


// @desc    Toggle user block status
// @route   PUT /api/admin/users/:id/block
// @access  Private/Admin
const toggleUserBlock = async (req, res) => {
    const user = await User.findById(req.params.id);

    if (user) {
        user.isBlocked = !user.isBlocked;
        await user.save();
        res.json({ message: `User ${user.isBlocked ? 'blocked' : 'unblocked'} successfully`, isBlocked: user.isBlocked });
    } else {
        res.status(404).json({ message: 'User not found' });
    }
};

// @desc    Update user password
// @route   PUT /api/admin/users/:id/password
// @access  Private/Admin
const updateUserPassword = async (req, res) => {
    const { password } = req.body;
    const user = await User.findById(req.params.id);

    if (user) {
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);
        await user.save();
        res.json({ message: 'Password updated successfully' });
    } else {
        res.status(404).json({ message: 'User not found' });
    }
};

module.exports = { getAdminStats, getUsers, deleteUser, toggleUserBlock, updateUserPassword };
