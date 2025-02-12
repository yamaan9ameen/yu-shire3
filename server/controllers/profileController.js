const User = require('../models/User');

// دالة مساعدة لتوليد userTag
const generateUserTag = (studentName) => {
    const randomNumbers = Math.floor(1000 + Math.random() * 9000).toString(); // 4 أرقام عشوائية
    return `${studentName}#${randomNumbers}`; // مثل yamaan#9832
};

// الحصول على بيانات الملف الشخصي للمستخدم الحالي
const getProfile = async (req, res) => {
    try {
        // البحث عن المستخدم باستخدام userId من التوكن
        const user = await User.findOne({ userId: req.user.userId }).select('-password');
        if (!user) {
            return res.status(404).json({ message: 'المستخدم غير موجود' });
        }
        res.json(user);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: 'حدث خطأ في السيرفر' });
    }
};

// تحديث بيانات الملف الشخصي
const updateProfile = async (req, res) => {
    try {
        const { studentName, specialization, year } = req.body;

      
        // التحقق من وجود userId في الطلب
        if (!req.user || !req.user.userId) {
            return res.status(401).json({ message: 'غير مصرح به' });
        }

        // البحث عن المستخدم باستخدام userId
        const user = await User.findOne({ userId: req.user.userId });
        if (!user) {
            return res.status(404).json({ message: 'المستخدم غير موجود' });
        }

        // تحديث الحقول المطلوبة
        if (studentName) {
            user.studentName = studentName;
            user.userTag = generateUserTag(studentName); // تحديث userTag تلقائيًا
        }
        if (specialization) user.specialization = specialization;
        if (year) user.year = year;

        // حفظ التعديلات
        await user.save();

        // إرسال الاستجابة
        res.json({ message: 'تم تحديث البيانات بنجاح', user });
    } catch (err) {
        console.error("Error updating profile:", err);
        res.status(500).json({ message: 'حدث خطأ في السيرفر' });
    }
};

// الحصول على بيانات الملف الشخصي باستخدام userId
const getProfileById = async (req, res) => {
    try {
        const { userId } = req.params; // الحصول على userId من الرابط
        const user = await User.findOne({ userId }).select('-password'); // البحث عن المستخدم باستخدام userId

        if (!user) {
            return res.status(404).json({ message: 'المستخدم غير موجود' });
        }

        res.json(user); // إرسال بيانات المستخدم
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: 'حدث خطأ في السيرفر' });
    }
};

module.exports = { getProfile, updateProfile, getProfileById };