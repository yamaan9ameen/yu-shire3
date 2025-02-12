const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Exam = require('../models/Exam'); // نموذج الامتحان
const departmentsData = require('../routes/departmentsData'); // الملف المحلي

// جلب جميع الامتحانات لمادة معينة
router.get('/:departmentName/materials/:materialId/exams', async (req, res) => {
    try {
        const { departmentName, materialId } = req.params;

        // البحث عن القسم في الملف المحلي
        const department = departmentsData.find(d => d.name === departmentName);
        if (!department) {
            return res.status(404).json({ message: 'القسم غير موجود' });
        }

        // البحث عن المادة في القسم
        const material = department.materials.find(m => m._id === materialId);
        if (!material) {
            return res.status(404).json({ message: 'المادة غير موجودة' });
        }

        // جلب الامتحانات من قاعدة البيانات فقط
        const exams = await Exam.find({ departmentName, materialId });

        if (!exams || exams.length === 0) {
            return res.status(404).json({ message: 'لا توجد امتحانات لهذه المادة' });
        }

        res.json(exams);
    } catch (error) {
        console.error('خطأ في جلب الامتحانات:', error);
        res.status(500).json({ message: 'حدث خطأ أثناء جلب الامتحانات' });
    }
});

// إضافة امتحان جديد
router.post('/:departmentName/materials/:materialId/exams', async (req, res) => {
    try {
        const { departmentName, materialId } = req.params;
        const { name, questions, date, duration } = req.body;

        // التحقق من البيانات المدخلة
        if (!name || !questions || questions.length === 0 || !date) {
            return res.status(400).json({ message: 'يرجى توفير جميع الحقول المطلوبة.' });
        }

        // البحث عن القسم في الملف المحلي
        const department = departmentsData.find(d => d.name === departmentName);
        if (!department) {
            return res.status(404).json({ message: 'القسم غير موجود' });
        }

        // البحث عن المادة في القسم
        const material = department.materials.find(m => m._id === materialId);
        if (!material) {
            return res.status(404).json({ message: 'المادة غير موجودة' });
        }

        // إنشاء امتحان جديد في قاعدة البيانات
        const newExam = new Exam({
            name,
            departmentName,
            materialId,
            date,
            duration,
            questions,
        });

        await newExam.save(); // حفظ الامتحان في قاعدة البيانات

        res.status(201).json({ message: 'تم إضافة الامتحان بنجاح.', exam: newExam });
    } catch (error) {
        console.error('خطأ في إضافة الامتحان:', error);
        res.status(500).json({ message: 'حدث خطأ أثناء إضافة الامتحان.' });
    }
});

// جلب امتحان محدد
router.get('/:departmentName/materials/:materialId/exams/:examId', async (req, res) => {
    try {
        const { departmentName, materialId, examId } = req.params;

        // التحقق من أن examId قيمة صالحة لـ ObjectId
        if (!mongoose.Types.ObjectId.isValid(examId)) {
            return res.status(400).json({ message: 'معرف الامتحان غير صالح.' });
        }

        // البحث عن القسم في الملف المحلي
        const department = departmentsData.find(d => d.name === departmentName);
        if (!department) {
            return res.status(404).json({ message: 'القسم غير موجود' });
        }

        // البحث عن المادة في القسم
        const material = department.materials.find(m => m._id === materialId);
        if (!material) {
            return res.status(404).json({ message: 'المادة غير موجودة' });
        }

        // البحث عن الامتحان في قاعدة البيانات
        const exam = await Exam.findById(examId);
        if (!exam) {
            return res.status(404).json({ message: 'الامتحان غير موجود.' });
        }

        res.json(exam);
    } catch (error) {
        console.error('خطأ في جلب الامتحان:', error);
        res.status(500).json({ message: 'حدث خطأ أثناء جلب الامتحان.' });
    }
});

// تقديم إجابات الامتحان
router.post('/:departmentName/materials/:materialId/exams/:examId/submit', async (req, res) => {
    try {
        const { departmentName, materialId, examId } = req.params;
        const { userId, answers } = req.body;

        // التحقق من أن examId قيمة صالحة لـ ObjectId
        if (!mongoose.Types.ObjectId.isValid(examId)) {
            return res.status(400).json({ message: 'معرف الامتحان غير صالح.' });
        }

        if (!userId || !answers || answers.length === 0) {
            return res.status(400).json({ message: 'يرجى توفير جميع الحقول المطلوبة.' });
        }

        // البحث عن القسم في الملف المحلي
        const department = departmentsData.find(d => d.name === departmentName);
        if (!department) {
            return res.status(404).json({ message: 'القسم غير موجود' });
        }

        // البحث عن المادة في القسم
        const material = department.materials.find(m => m._id === materialId);
        if (!material) {
            return res.status(404).json({ message: 'المادة غير موجودة' });
        }

        // البحث عن الامتحان في قاعدة البيانات
        const exam = await Exam.findById(examId);
        if (!exam) {
            return res.status(404).json({ message: 'الامتحان غير موجود.' });
        }

        // حساب النتيجة ونتائج كل سؤال
        let score = 0;
        const questionResults = exam.questions.map((question, index) => {
            const isCorrect = question.correctAnswer === answers[index];
            if (isCorrect) {
                score += 1; // زيادة النتيجة في حالة الإجابة الصحيحة
            }
            return isCorrect; // إرجاع true أو false لكل سؤال
        });

        const totalMarks = exam.questions.length;

        res.json({
            message: 'تم تقديم الامتحان بنجاح.',
            result: score,
            totalMarks,
            questionResults, // إرجاع نتائج كل سؤال
        });
    } catch (error) {
        console.error('خطأ أثناء تقديم الامتحان:', error);
        res.status(500).json({ message: 'حدث خطأ أثناء تقديم الامتحان.' });
    }
});

// حذف امتحان
router.delete('/:departmentName/materials/:materialId/exams/:examId', async (req, res) => {
    try {
        const { departmentName, materialId, examId } = req.params;

        // التحقق من أن examId قيمة صالحة لـ ObjectId
        if (!mongoose.Types.ObjectId.isValid(examId)) {
            return res.status(400).json({ message: 'معرف الامتحان غير صالح.' });
        }

        // البحث عن القسم في الملف المحلي
        const department = departmentsData.find(d => d.name === departmentName);
        if (!department) {
            return res.status(404).json({ message: 'القسم غير موجود' });
        }

        // البحث عن المادة في القسم
        const material = department.materials.find(m => m._id === materialId);
        if (!material) {
            return res.status(404).json({ message: 'المادة غير موجودة' });
        }

        // حذف الامتحان من قاعدة البيانات
        const exam = await Exam.findByIdAndDelete(examId);
        if (!exam) {
            return res.status(404).json({ message: 'الامتحان غير موجود.' });
        }

        res.json({ message: 'تم حذف الامتحان بنجاح.', exam });
    } catch (error) {
        console.error('خطأ في حذف الامتحان:', error);
        res.status(500).json({ message: 'حدث خطأ أثناء حذف الامتحان.' });
    }
});

module.exports = router;
