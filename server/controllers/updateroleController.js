const User = require('../models/User');

const updateRole = async (req, res) => {
    const { userId } = req.params; // التقاط userId من الـ params
    const { role } = req.body;

    // console.log('Received params:', req.params);
    // console.log('Received body:', req.body);

    // التحقق من إرسال الدور
    if (!role) {
        return res.status(400).json({ message: 'يرجى تحديد الدور الجديد' });
    }
   
    // التحقق من صحة الدور
    const validRoles = ['admin', 'assistant professor', 'student', 'manager'];
    if (!validRoles.includes(role)) {
        return res.status(400).json({ message: 'الدور المحدد غير صالح' });
    }

    try {
        // البحث عن المستخدم
        const user = await User.findOne({ userId });
        if (!user) {
            return res.status(404).json({ message: 'المستخدم غير موجود' });
        }

        // تحديث الرتبة
        user.role = role; // تحديث الدور
        await user.save(); // حفظ التعديلات في قاعدة البيانات

        res.json({
            message: 'تم تحديث الرتبة بنجاح',
            user: {
                userId: user.userId,
                studentName: user.studentName,
                email: user.email,
                role: user.role,
            },
        });
    } catch (err) {
        console.error('Error updating user role:', err);
        res.status(500).json({ message: 'حدث خطأ أثناء تحديث الرتبة' });
    }
};

module.exports = { updateRole };
