const mongoose = require('mongoose');

const summarySchema = new mongoose.Schema({
    title: { type: String, required: true },
    type: { type: String, enum: ['link', 'file'], required: true },
    content: { type: String, required: true }, // URL للروابط أو مسار الملف
    uploadDate: { type: Date, default: Date.now },
    uploader: { type: String, required: true } // اسم من قام برفع الملخص
});


const materialSchema = new mongoose.Schema({
    _id: { type: String, required: true }, // id الماده
    name: { type: String, required: true },
    description: { type: String, required: true },
    professors: [{ type: String }],
    topics: [{ type: String }],
    hours: { type: Number },
    type: { type: String, enum: ['mandatoryCollege', 'mandatoryUniversity', 'electiveDepartment', 'electiveUniversity', 'mandatoryDepartment'], required: true },
    summaries: [summarySchema] // إضافة الملخصات
});

const departmentSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    intro: { type: String, required: true },
    materials: [materialSchema],
});

module.exports = mongoose.model('Department', departmentSchema);
