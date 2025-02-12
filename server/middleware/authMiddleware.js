// middleware/authMiddleware.js
const jwt = require('jsonwebtoken');
require('dotenv').config(); 
const authMiddleware = (req, res, next) => {
    // جلب التوكن من الهيدر
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
        return res.status(401).json({ message: 'غير مصرح به، يلزم توكن' });
    }

    try {
        // التحقق من التوكن
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // إضافة بيانات المستخدم إلى الطلب
        
        // التحقق من وجود بيانات المستخدم في التوكن
        if (!decoded.userId || !decoded.studentName) {
            return res.status(401).json({ message: 'توكن غير صالح: بيانات مستخدم ناقصة' });
        }

        // إضافة بيانات المستخدم إلى الطلب
        req.user = decoded;
        next();
    } catch (err) {
        // تحسين رسائل الأخطاء
        if (err.name === 'TokenExpiredError') {
            return res.status(401).json({ message: 'انتهت صلاحية التوكن، يلزم تسجيل الدخول مرة أخرى' });
        }
        res.status(401).json({ message: 'توكن غير صالح' });
    }
};

module.exports = authMiddleware;