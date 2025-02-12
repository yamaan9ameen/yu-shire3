const mongoose = require('mongoose');

const summarySchema = new mongoose.Schema({
    title: { type: String, required: true },
    type: { type: String, enum: ['link', 'file'], required: true },
    content: { type: String, required: true }, // URL للروابط أو مسار الملف
    uploadDate: { type: Date, default: Date.now },
    uploader: { type: String, required: true }, // اسم من قام برفع الملخص
    departmentName: { type: String, required: true }, // اسم القسم
    materialId: { type: String, required: true } // id المادة
});

module.exports = mongoose.model('Summary', summarySchema);