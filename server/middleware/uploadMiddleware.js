const multer = require('multer');
const fs = require('fs');
const path = require('path');

// إنشاء مجلد uploads إذا لم يكن موجودًا
const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// إعداد multer لتخزين الصور
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir); // مجلد تخزين الصور
    },
    filename: (req, file, cb) => {
        const uniqueName = Date.now() + '-' + file.originalname;
        console.log("Saving file:", uniqueName); // فحص اسم الملف المحفوظ
        cb(null, uniqueName);
    },
});

// التحقق من صيغة الملف
const fileFilter = (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/gif'];
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true); // قبول الملف
    } else {
        cb(new Error('صيغة الملف غير مدعومة. يرجى تحميل صورة بصيغة JPEG, PNG, JPG, أو GIF.'), false);
    }
};

const upload = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024, // الحد الأقصى لحجم الملف: 5MB
    },
});

module.exports = upload;