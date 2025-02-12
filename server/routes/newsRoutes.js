// routes/newsRoutes.js
const express = require('express');
const multer = require('multer');
const News = require('../models/News');

const router = express.Router();

// إعداد رفع الصور
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  },
});

const upload = multer({ storage });

// الحصول على جميع الأخبار مع التصفية والتصنيف
router.get('/news', async (req, res) => {
  try {
    const { page = 1, limit = 10, category = 'all', search = '' } = req.query;
    const filter = category !== 'all' ? { category } : {};
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } },
      ];
    }

    const news = await News.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));
    const total = await News.countDocuments(filter);

    res.json({
      news,
      currentPage: parseInt(page),
      totalPages: Math.ceil(total / limit),
      totalNews: total,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// إضافة خبر جديد
router.post('/news', upload.single('image'), async (req, res) => {
  try {
    const newNews = new News({
      title: req.body.title,
      content: req.body.content,
      author: req.body.author,
      category: req.body.category,
      summary: req.body.summary,
      image: req.file ? `/uploads/${req.file.filename}` : '',
    });

    const savedNews = await newNews.save();
    res.status(201).json(savedNews);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// الحصول على خبر وتحديث عدد المشاهدات
router.get('/news/:id', async (req, res) => {
  try {
    const news = await News.findByIdAndUpdate(
      req.params.id,
      { $inc: { views: 1 } },
      { new: true }
    );
    if (!news) {
      return res.status(404).json({ message: 'الخبر غير موجود' });
    }
    res.json(news);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// حذف خبر
router.delete('/news/:id', async (req, res) => {
  try {
    const deletedNews = await News.findByIdAndDelete(req.params.id);
    if (!deletedNews) {
      return res.status(404).json({ message: 'الخبر غير موجود' });
    }
    res.json({ message: 'تم حذف الخبر بنجاح' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
