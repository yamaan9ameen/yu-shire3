const express = require('express');
const { updateRole } = require('../controllers/updateroleController'); // استيراد الكنترولر
const router = express.Router();

// تحديث رتبة المستخدم

router.put('/:userId/update-role', updateRole);

module.exports = router;
