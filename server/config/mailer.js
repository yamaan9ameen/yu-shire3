const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
    service: "gmail",
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: true,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

const sendVerificationEmail = async (email, verificationCode) => {
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: '🔒 تأكيد بريدك الإلكتروني - خطوة أخيرة!',
        html: `
            <div style="font-family: Arial, sans-serif; text-align: center; padding: 20px;">
                <h1 style="color: #4CAF50;">مرحبًا بك في منصتنا! 🎉</h1>
                <p style="font-size: 18px; color: #333;">شكرًا لانضمامك إلينا! نحن سعداء بوجودك.</p>
                <p style="font-size: 18px; color: #333;">لإكمال عملية التسجيل، يرجى إدخال رمز التحقق التالي:</p>
                <div style="font-size: 22px; font-weight: bold; color: #E91E63; background: #F8F8F8; padding: 10px; border-radius: 5px; display: inline-block;">${verificationCode}</div>
                <p style="font-size: 16px; color: #555; margin-top: 20px;">إذا لم تطلب هذا البريد، يمكنك تجاهله بكل بساطة.</p>
                <p style="font-size: 16px; color: #555;">مع أطيب التحيات،<br>فريق الدعم 💡</p>
            </div>
        `,
    };

    await transporter.sendMail(mailOptions);
};

module.exports = { sendVerificationEmail };