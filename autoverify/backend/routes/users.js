const router  = require('express').Router();
const protect = require('../middleware/auth');
const User    = require('../models/User');
const Report  = require('../models/Report');

// GET /api/users/stats
router.get('/stats', protect, async (req, res) => {
  try {
    const user = req.user;
    const reports = await Report.find({ userId: user._id, status: 'completed' });
    const safeVehicles = reports.filter(r => r.riskLevel === 'low').length;
    const fraudCaught  = reports.filter(r => r.riskLevel === 'high').length;
    res.json({
      success: true,
      stats: {
        totalChecks: user.totalChecks,
        checksRemaining: user.checksRemaining,
        safeVehicles,
        fraudCaught,
        plan: user.plan
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// PUT /api/users/profile
router.put('/profile', protect, async (req, res) => {
  try {
    const { firstName, lastName, phone, city } = req.body;
    if (!firstName || !lastName) {
      return res.status(400).json({ success: false, message: 'First and last name are required.' });
    }
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { firstName, lastName, phone: phone || '', city: city || '' },
      { new: true, runValidators: true }
    );
    res.json({ success: true, user, message: 'Profile updated successfully.' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// PUT /api/users/notifications
router.put('/notifications', protect, async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { notifications: req.body },
      { new: true }
    );
    res.json({ success: true, user, message: 'Notification preferences saved.' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// PUT /api/users/change-password
router.put('/change-password', protect, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ success: false, message: 'Both fields are required.' });
    }
    if (newPassword.length < 6) {
      return res.status(400).json({ success: false, message: 'New password must be at least 6 characters.' });
    }
    const user = await User.findById(req.user._id);
    const match = await user.comparePassword(currentPassword);
    if (!match) {
      return res.status(400).json({ success: false, message: 'Current password is incorrect.' });
    }
    user.password = newPassword;
    await user.save();
    res.json({ success: true, message: 'Password updated successfully.' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// PUT /api/users/upgrade
router.put('/upgrade', protect, async (req, res) => {
  try {
    const { plan } = req.body;
    const checksMap = { free: 3, pro: 30, enterprise: 999999 };
    if (!checksMap[plan]) {
      return res.status(400).json({ success: false, message: 'Invalid plan.' });
    }
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { plan, checksRemaining: checksMap[plan] },
      { new: true }
    );
    res.json({ success: true, user, message: `Successfully upgraded to ${plan} plan!` });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
