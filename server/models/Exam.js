const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
    text: { type: String, required: true }, // نص السؤال
    options: { type: [String], required: true }, // الخيارات
    correctAnswer: { type: String, required: true } // الإجابة الصحيحة
});

const examSchema = new mongoose.Schema({
    name: { type: String, required: true }, // اسم الامتحان
    questions: { type: [questionSchema], required: true }, // الأسئلة
    departmentName: { type: String, required: true }, // اسم القسم
    materialId: { type: String, required: true } // معرف المادة
});

module.exports = mongoose.model('Exam', examSchema);