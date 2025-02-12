const jwt = require('jsonwebtoken');
const User = require('../models/User');

const loginUser = async (req, res) => {
    const { email, password } = req.body;

    // التحقق من وجود البريد الإلكتروني وكلمة المرور في الطلب
    if (!email || !password) {
        return res.status(400).json({ message: 'يرجى إدخال البريد الإلكتروني وكلمة المرور' });
    }

    try {
        // البحث عن المستخدم باستخدام البريد الإلكتروني
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'البريد الإلكتروني أو كلمة المرور غير صحيحة' });
        }

        // التحقق من تطابق كلمة المرور
        const isMatch = await user.matchPassword(password);
        if (!isMatch) {
            return res.status(400).json({ message: 'البريد الإلكتروني أو كلمة المرور غير صحيحة' });
        }

        // التحقق من أن الحساب مفعل
        if (!user.isVerified) {
            return res.status(400).json({ message: 'يرجى تفعيل الحساب أولاً' });
        }

        // إنشاء التوكن
       // عند تسجيل الدخول أو إنشاء التوكن
const token = jwt.sign(
    { 
        userId: user._id,
        studentName: user.studentName,
        role: user.role 
    },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
);

        // إنشاء refreshToken
        const refreshToken = jwt.sign(
            { userId: user.userId },
            process.env.REFRESH_TOKEN_SECRET,
            { expiresIn: '30d' }
        );

        // حفظ refreshToken في قاعدة البيانات
        user.refreshToken = refreshToken;
        await user.save();


        // إرسال التوكن وبيانات المستخدم
        res.json({
            token,
            refreshToken,
            user: {
                id: user._id,
                email: user.email,
                userId: user.userId,
                studentName: user.studentName,
                specialization: user.specialization,
                year: user.year,
                role: user.role,
            },
        });
        
    } catch (err) {
        console.error("Error during login:", err);
        res.status(500).json({ message: 'حدث خطأ في السيرفر' });
    }
};

module.exports = { loginUser };
