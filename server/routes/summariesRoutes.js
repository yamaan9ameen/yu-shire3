const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Summary = require('../models/Summary'); // نموذج الملخصات
const departmentsData = require('../routes/departmentsData'); // الملف المحلي

// إعداد multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/summaries/');
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});

const upload = multer({ 
    storage,
    fileFilter: (req, file, cb) => {
        const allowedTypes = ['.pdf', '.doc', '.docx'];
        const ext = path.extname(file.originalname).toLowerCase();
        if (allowedTypes.includes(ext)) {
            cb(null, true);
        } else {
            cb(new Error('نوع الملف غير مدعوم'));
        }
    }
});

// Route لتنزيل الملفات
router.get('/download/:filename', (req, res) => {
    const filename = req.params.filename;
    const filePath = path.join(__dirname, '../uploads/summaries', filename); // ضمان أن السيرفر يصل للمسار الصحيح
    res.download(filePath, filename, (err) => {
        if (err) {
            res.status(500).json({ message: 'Error downloading file' });
        }
    });
});
// جلب جميع الملخصات لمادة معينة
router.get('/:departmentName/materials/:materialId/summaries', async (req, res) => {
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

        // جلب الملخصات من قاعدة البيانات
        const summaries = await Summary.find({ materialId });
        if (!summaries || summaries.length === 0) {
            return res.status(404).json({ message: 'لا توجد ملخصات لهذه المادة' });
        }

        res.json(summaries);
    } catch (error) {
        console.error('خطأ في جلب الملخصات:', error);
        res.status(500).json({ message: 'حدث خطأ أثناء جلب الملخصات' });
    }
});

// إضافة ملخص (رابط)
router.post('/:departmentName/materials/:materialId/summaries/link', async (req, res) => {
    try {
        const { departmentName, materialId } = req.params;
        const { title, link, uploader } = req.body;
        if (!uploader) {
            return res.status(400).json({ message: 'اسم الرافع مطلوب' });
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

        // إنشاء ملخص جديد وحفظه في قاعدة البيانات
        const newSummary = new Summary({
            title,
            type: 'link',
            content: link,
            uploader,
            departmentName,
            materialId
        });

        await newSummary.save();

        res.status(201).json({ message: 'تم إضافة الملخص بنجاح' });
    } catch (error) {
        console.error('خطأ في إضافة ملخص رابط:', error);
        res.status(500).json({ message: 'حدث خطأ أثناء إضافة الملخص' });
    }
});

// إضافة ملخص (ملف)
router.post('/:departmentName/materials/:materialId/summaries/file', upload.single('file'), async (req, res) => {
    try {
        const { departmentName, materialId } = req.params;
        const { title , uploader} = req.body;
      //  const uploader = 'فاعل خير'; // اسم المستخدم المسجل
        

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

        // إنشاء ملخص جديد وحفظه في قاعدة البيانات
        const newSummary = new Summary({
            title,
            type: 'file',
            content: req.file.filename,
            uploader,
            departmentName,
            materialId
        });

        await newSummary.save();

        res.status(201).json({ message: 'تم إضافة ملف الملخص بنجاح' });
    } catch (error) {
        console.error('خطأ في إضافة ملف الملخص:', error);
        res.status(500).json({ message: 'حدث خطأ أثناء إضافة ملف الملخص' });
    }
});

// حذف ملخص
router.delete('/:departmentName/materials/:materialId/summaries/:summaryId', async (req, res) => {
    try {
        const { departmentName, materialId, summaryId } = req.params;

        // التحقق من دور المستخدم
        // const allowedRoles = ['admin', 'manager', 'assistant professor'];
        // if (!allowedRoles.includes(req.user.role)) {
        //     return res.status(403).json({ message: 'غير مصرح لك بحذف الملخص' });
        // }

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

        // حذف الملخص من قاعدة البيانات
        await Summary.findByIdAndDelete(summaryId);

        res.status(200).json({ message: 'تم حذف الملخص بنجاح' });
    } catch (error) {
        console.error('خطأ في حذف الملخص:', error);
        res.status(500).json({ message: 'حدث خطأ أثناء حذف الملخص' });
    }
});

module.exports = router;