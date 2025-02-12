const express = require('express');
const { getProfile, updateProfile, getProfileById } = require('../controllers/profileController');
const authMiddleware = require('../middleware/authMiddleware');
const router = express.Router();

// مسار البروفايل الخاص بالمستخدم المسجل دخوله
router.get('/', authMiddleware, getProfile);

// مسار تحديث البروفايل
router.put('/:userId/update', authMiddleware, updateProfile);


// مسار عرض البروفايل عبر userId
router.get('/:userId', getProfileById);

module.exports = router;