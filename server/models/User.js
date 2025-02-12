const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    studentName: { type: String, required: true },
    specialization: { type: String, required: true },
    year: { type: String, required: true },
    profileImage: { type: String, default: '' },
    isVerified: { type: Boolean, default: false },
    verificationCode: { type: String },
    verificationCodeExpires: { type: Date },
    userId: { type: String, unique: true }, // رقم عشوائي مكون من 9 أرقام
    userTag: { type: String, unique: true }, // مثل yamaan#9832
    role: { type: String, enum: ['admin', 'assistant professor', 'student', 'manager'], default: 'student' }, // دور المستخدم
});

// تشفير كلمة السر قبل الحفظ
userSchema.pre('save', async function (next) {
    if (this.isModified('password')) {
        this.password = await bcrypt.hash(this.password, 10);
    }
    next();
});

// مقارنة كلمة السر المدخلة مع المشفرة
userSchema.methods.comparePassword = async function (password) {
    return await bcrypt.compare(password, this.password);
};

module.exports = mongoose.model('User', userSchema);