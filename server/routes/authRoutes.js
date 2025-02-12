const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const { sendVerificationEmail } = require("../config/mailer"); // استيراد وظيفة إرسال البريد
const router = express.Router();

// إنشاء كود تحقق عشوائي
const generateVerificationCode = () => {
  return Math.floor(100000 + Math.random() * 900000).toString(); // كود مكون من 6 أرقام
};

// إنشاء رقم مستخدم عشوائي (userId)
const generateUserId = () => {
  return Math.floor(100000000 + Math.random() * 900000000).toString(); // رقم عشوائي مكون من 9 أرقام
};

// إنشاء userTag
const generateUserTag = (studentName) => {
  const randomNumbers = Math.floor(1000 + Math.random() * 9000).toString(); // 4 أرقام عشوائية
  return `${studentName}#${randomNumbers}`; // مثل yamaan#9832
};

// تسجيل مستخدم جديد
router.post("/register", async (req, res) => {
  const {
    email,
    password,
    confirmPassword,
    studentName,
    specialization,
    year,
  } = req.body;

  try {
    // التحقق من تعبئة جميع الحقول
    if (
      !email ||
      !password ||
      !confirmPassword ||
      !studentName ||
      !specialization ||
      !year
    ) {
      return res.status(400).json({ message: "يرجى تعبئة جميع الحقول" });
    }

    // التحقق من تطابق كلمة السر وتأكيدها
    if (password !== confirmPassword) {
      return res.status(400).json({ message: "كلمة السر غير متطابقة" });
    }

    // التحقق من عدم وجود مستخدم بنفس البريد الإلكتروني
    let user = await User.findOne({ email });
    if (user) {
      return res
        .status(400)
        .json({ message: "البريد الإلكتروني موجود مسبقًا" });
    }

    // إنشاء كود تحقق
    const verificationCode = generateVerificationCode();
    const verificationCodeExpires = Date.now() + 3600000; // صلاحية الكود لمدة ساعة

    // إنشاء رقم المستخدم (userId) و userTag
    const userId = generateUserId();
    const userTag = generateUserTag(studentName);

    // إنشاء مستخدم جديد
    user = new User({
      email,
      password,
      studentName,
      specialization,
      year,
      verificationCode,
      verificationCodeExpires,
      userId, // إضافة userId
      userTag, // إضافة userTag
      role: "student", // تعيين الدور الافتراضي
    });

    // حفظ المستخدم في قاعدة البيانات
    await user.save();

    // إرسال بريد التحقق
    await sendVerificationEmail(email, verificationCode);

    // إرسال الاستجابة
    res
      .status(201)
      .json({ message: "تم التسجيل بنجاح. يرجى التحقق من بريدك الإلكتروني." });
  } catch (err) {
    console.error("حدث خطأ أثناء التسجيل:", err);
    res.status(500).json({ message: "حدث خطأ في الخادم" });
  }
});

// تسجيل الدخول
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    // التحقق من وجود المستخدم
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(400)
        .json({ message: "البريد الإلكتروني أو كلمة السر غير صحيحة" });
    }

    // التحقق من كلمة السر
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res
        .status(400)
        .json({ message: "البريد الإلكتروني أو كلمة السر غير صحيحة" });
    }

    // التحقق من حالة التحقق (isVerified)
    if (!user.isVerified) {
      return res.status(400).json({
        success: false,
        message: "يرجى التحقق من بريدك الإلكتروني أولاً",
        isVerified: false, // إضافة حالة التحقق
      });
    }

    // إنشاء توكن (JWT) مع بيانات المستخدم
    const token = jwt.sign(
      {
        userId: user.userId,
        studentName: user.studentName,
        email: user.email,
        role: user.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    // إرسال الاستجابة مع التوكن
    res.json({
      success: true,
      token,
      user: {
        email: user.email,
        studentName: user.studentName,
        specialization: user.specialization,
        year: user.year,
        userId: user.userId,
        userTag: user.userTag,
        role: user.role,
      },
    });
  } catch (err) {
    console.error("حدث خطأ أثناء تسجيل الدخول:", err);
    res.status(500).json({ message: "حدث خطأ في الخادم" });
  }
});
// التحقق من الكود
router.post("/verify", async (req, res) => {
  const { email, verificationCode } = req.body;

  try {
    // البحث عن المستخدم
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "البريد الإلكتروني غير صحيح" });
    }

    // التحقق من صحة الكود وتاريخ انتهاء الصلاحية
    if (
      user.verificationCode !== verificationCode || // التحقق من تطابق الكود
      user.verificationCodeExpires < Date.now() // التحقق من تاريخ انتهاء الصلاحية
    ) {
      return res.status(400).json({
        success: false,
        message: "كود التحقق غير صحيح أو منتهي الصلاحية",
      });
    }

    // تحديث حالة التحقق
    user.isVerified = true;
    user.verificationCode = undefined; // إزالة كود التحقق بعد التحقق منه
    user.verificationCodeExpires = undefined; // إزالة تاريخ انتهاء الصلاحية
    await user.save();

    // إنشاء توكن (JWT) مع بيانات المستخدم
    const token = jwt.sign(
      {
        userId: user.userId,
        studentName: user.studentName,
        email: user.email,
        role: user.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    // إرسال الاستجابة مع التوكن
    res.json({
      success: true,
      token,
      user: {
        email: user.email,
        studentName: user.studentName,
        specialization: user.specialization,
        year: user.year,
        userId: user.userId, // إضافة userId
        userTag: user.userTag, // إضافة userTag
        role: user.role, // إضافة role
      },
    });
  } catch (err) {
    console.error("حدث خطأ أثناء التحقق:", err);
    res.status(500).json({ success: false, message: "حدث خطأ في الخادم" });
  }
});

// إعادة إرسال كود التحقق
// إعادة إرسال كود التحقق
router.post("/resend-code", async (req, res) => {
  const { email } = req.body;

  try {
    // البحث عن المستخدم
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "البريد الإلكتروني غير صحيح" });
    }

    // إنشاء كود تحقق جديد
    const verificationCode = generateVerificationCode();
    const verificationCodeExpires = Date.now() + 3600000; // صلاحية الكود لمدة ساعة

    // تحديث كود التحقق في قاعدة البيانات
    user.verificationCode = verificationCode;
    user.verificationCodeExpires = verificationCodeExpires;
    await user.save();

    // إرسال بريد التحقق
    await sendVerificationEmail(email, verificationCode);

    // إرسال الاستجابة
    res.json({
      success: true,
      message: "تم إعادة إرسال كود التحقق إلى بريدك الإلكتروني.",
    });
  } catch (err) {
    console.error("حدث خطأ أثناء إعادة إرسال الكود:", err);
    res.status(500).json({ success: false, message: "حدث خطأ في الخادم" });
  }
});

// التحقق من حالة تسجيل الدخول
router.get("/check-auth", async (req, res) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    return res
      .status(401)
      .json({ isAuthenticated: false, message: "غير مصرح لك بالوصول" });
  }

  try {
    // التحقق من صحة التوكن
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // البحث عن المستخدم في قاعدة البيانات
    const user = await User.findOne({ userId: decoded.userId }); // البحث باستخدام userId
    if (!user) {
      return res
        .status(401)
        .json({ isAuthenticated: false, message: "المستخدم غير موجود" });
    }

    // إرجاع بيانات المستخدم
    res.json({
      isAuthenticated: true,
      user: {
        email: user.email,
        studentName: user.studentName,
        specialization: user.specialization,
        year: user.year,
        profileImage: user.profileImage,
        userId: user.userId, // إضافة userId
        userTag: user.userTag, // إضافة userTag
        role: user.role, // إضافة role
      },
    });
  } catch (error) {
    res.status(401).json({ isAuthenticated: false, message: "توكن غير صالح" });
  }
});
router.post("/forgot-password", async (req, res) => {
  const { email } = req.body;

  try {
      const user = await User.findOne({ email });
      if (!user) {
          return res.status(400).json({ message: "البريد الإلكتروني غير موجود" });
      }

      // إنشاء كود تحقق جديد
      const verificationCode = generateVerificationCode();
      user.verificationCode = verificationCode;
      user.verificationCodeExpires = Date.now() + 3600000; // صلاحية الكود لمدة ساعة
      await user.save();

      // إرسال الكود إلى البريد الإلكتروني
      await sendVerificationEmail(email, verificationCode);

      res.json({ success: true, message: "تم إرسال كود التحقق إلى بريدك الإلكتروني." });
  } catch (err) {
      console.error("حدث خطأ أثناء إعادة تعيين كلمة المرور:", err);
      res.status(500).json({ message: "حدث خطأ في الخادم" });
  }
});
router.post("/reset-password", async (req, res) => {
  const { email, code, newPassword } = req.body;

  try {
      const user = await User.findOne({ email });
      if (!user) {
          return res.status(400).json({ message: "البريد الإلكتروني غير موجود" });
      }

      // التحقق من صحة الكود وتاريخ انتهاء الصلاحية
      if (user.verificationCode !== code || user.verificationCodeExpires < Date.now()) {
          return res.status(400).json({ message: "كود التحقق غير صحيح أو منتهي الصلاحية" });
      }

      // تحديث كلمة المرور
      user.password = newPassword;
      user.verificationCode = undefined;
      user.verificationCodeExpires = undefined;
      await user.save();

      res.json({ success: true, message: "تم إعادة تعيين كلمة المرور بنجاح." });
  } catch (err) {
      console.error("حدث خطأ أثناء إعادة تعيين كلمة المرور:", err);
      res.status(500).json({ message: "حدث خطأ في الخادم" });
  }
});
module.exports = router;