const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const Summary = require("../models/Summary"); // نموذج الملخصات
const departmentsData = require("../routes/departmentsData"); // الملف المحلي

// إعداد multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/summaries/");
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const allowedTypes = [".pdf", ".doc", ".docx"];
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowedTypes.includes(ext)) {
      cb(null, true);
    } else {
      cb(new Error("نوع الملف غير مدعوم"));
    }
  },
});

// تنزيل الملفات
router.get("/download/:filename", (req, res) => {
  const filename = req.params.filename;
  const filePath = path.join(__dirname, "../uploads/summaries", filename);
  res.download(filePath, filename, (err) => {
    if (err) {
      return res.status(500).json({ message: "Error downloading file" });
    }
  });
});

// جلب جميع الملخصات لمادة معينة
router.get("/:departmentName/materials/:materialId/summaries", async (req, res) => {
  try {
    const { departmentName, materialId } = req.params;

    const department = departmentsData.find((d) => d.name === departmentName);
    if (!department) {
      return res.status(404).json({ message: "القسم غير موجود" });
    }

    const material = department.materials.find((m) => m._id === materialId);
    if (!material) {
      return res.status(404).json({ message: "المادة غير موجودة" });
    }

    const summaries = await Summary.find({ materialId });
    if (!summaries || summaries.length === 0) {
      return res.status(404).json({ message: "لا توجد ملخصات لهذه المادة" });
    }

    res.json(summaries);
  } catch (error) {
    console.error("خطأ في جلب الملخصات:", error);
    res.status(500).json({ message: "حدث خطأ أثناء جلب الملخصات" });
  }
});

// ✅ إصلاح خطأ ERR_HTTP_HEADERS_SENT في إضافة ملخص كرابط
router.post("/:departmentName/materials/:materialId/summaries/link", async (req, res) => {
  console.log("📥 استقبلنا طلب إضافة ملخص:", req.body);

  try {
    const { departmentName, materialId } = req.params;
    const { title, link, uploader } = req.body;

    if (!uploader) {
      return res.status(400).json({ message: "اسم الرافع مطلوب" });
    }

    const department = departmentsData.find((d) => d.name === departmentName);
    if (!department) {
      return res.status(404).json({ message: "القسم غير موجود" });
    }

    const material = department.materials.find((m) => m._id === materialId);
    if (!material) {
      return res.status(404).json({ message: "المادة غير موجودة" });
    }

    const newSummary = new Summary({
      title,
      type: "link",
      content: link,
      uploader,
      departmentName,
      materialId,
    });

    await newSummary.save();

    return res.status(201).json({ message: "تم إضافة الملخص بنجاح" });
  } catch (error) {
    console.error("خطأ في إضافة ملخص رابط:", error);
    return res.status(500).json({ message: "حدث خطأ أثناء إضافة الملخص" });
  }
});

// إضافة ملخص (ملف)
router.post("/:departmentName/materials/:materialId/summaries/file", upload.single("file"), async (req, res) => {
  try {
    const { departmentName, materialId } = req.params;
    const { title, uploader } = req.body;

    const department = departmentsData.find((d) => d.name === departmentName);
    if (!department) {
      return res.status(404).json({ message: "القسم غير موجود" });
    }

    const material = department.materials.find((m) => m._id === materialId);
    if (!material) {
      return res.status(404).json({ message: "المادة غير موجودة" });
    }

    const newSummary = new Summary({
      title,
      type: "file",
      content: req.file.filename,
      uploader,
      departmentName,
      materialId,
    });

    await newSummary.save();

    return res.status(201).json({ message: "تم إضافة ملف الملخص بنجاح" });
  } catch (error) {
    console.error("خطأ في إضافة ملف الملخص:", error);
    return res.status(500).json({ message: "حدث خطأ أثناء إضافة ملف الملخص" });
  }
});

// حذف ملخص
router.delete("/:departmentName/materials/:materialId/summaries/:summaryId", async (req, res) => {
  try {
    const { departmentName, materialId, summaryId } = req.params;

    const department = departmentsData.find((d) => d.name === departmentName);
    if (!department) {
      return res.status(404).json({ message: "القسم غير موجود" });
    }

    const material = department.materials.find((m) => m._id === materialId);
    if (!material) {
      return res.status(404).json({ message: "المادة غير موجودة" });
    }

    await Summary.findByIdAndDelete(summaryId);

    return res.status(200).json({ message: "تم حذف الملخص بنجاح" });
  } catch (error) {
    console.error("خطأ في حذف الملخص:", error);
    return res.status(500).json({ message: "حدث خطأ أثناء حذف الملخص" });
  }
});

module.exports = router;
