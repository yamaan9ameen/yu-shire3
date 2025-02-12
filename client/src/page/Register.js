import React, { useState } from 'react';
import { Container, Form, Button, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'; // استيراد axios لإرسال الطلبات إلى الخادم
import '../css/Register.css'; // ملف CSS خارجي لتنسيق الصفحة

const RegisterPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [specialization, setSpecialization] = useState('');
    const [year, setYear] = useState('');
    const [studentName, setStudentName] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        // التحقق من تطابق كلمة السر وتأكيدها
        if (password !== confirmPassword) {
            setError('⚠️ كلمة السر غير متطابقة');
            return;
        }

        // التحقق من تعبئة جميع الحقول
        if (!email || !password || !confirmPassword || !specialization || !year || !studentName) {
            setError('⚠️ يرجى تعبئة جميع الحقول');
            return;
        }

        try {
            // إرسال البيانات إلى الخادم
            const userData = {
                email,
                password,
                confirmPassword,
                studentName,
                specialization,
                year,
            };

            const response = await axios.post('http://localhost:5000/api/auth/register', userData, {
                headers: {
                    'Content-Type': 'application/json', // تأكد من أن الرأس مضبوط بشكل صحيح
                },
            });

            // عرض رسالة نجاح
            setSuccess('🎉 تم التسجيل بنجاح! يرجى التحقق من بريدك الإلكتروني لإكمال العملية.');

            // توجيه المستخدم إلى صفحة التحقق مع إرسال البريد الإلكتروني كـ state
            setTimeout(() => {
                navigate('/verify-email', { state: { email } });
            }, 2000); // الانتقال بعد ثانيتين
        } catch (err) {
            setError('⚠️ حدث خطأ أثناء التسجيل: ' + (err.response?.data?.message || 'يرجى المحاولة مرة أخرى'));
            console.error('Error during registration:', err);
        }
    };

    return (
        <Container className="register-page">
            <h1 className="text-center">تسجيل حساب جديد</h1>
            {error && <Alert variant="danger">{error}</Alert>}
            {success && <Alert variant="success">{success}</Alert>}
            <Form onSubmit={handleSubmit}>
                {/* اسم الطالب */}
                <Form.Group controlId="formStudentName" className="mb-3">
                    <Form.Label>👤 اسم الطالب</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="أدخل اسمك الكامل"
                        value={studentName}
                        onChange={(e) => setStudentName(e.target.value)}
                        required
                    />
                </Form.Group>

                {/* البريد الإلكتروني */}
                <Form.Group controlId="formEmail" className="mb-3">
                    <Form.Label> 📧 البريد الإلكتروني</Form.Label>
                    <Form.Control
                        type="email"
                        placeholder="أدخل بريدك الإلكتروني"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </Form.Group>

                {/* كلمة السر */}
                <Form.Group controlId="formPassword" className="mb-3">
                    <Form.Label> 🔑 كلمة السر</Form.Label>
                    <Form.Control
                        type="password"
                        placeholder="أدخل كلمة السر"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </Form.Group>

                {/* تأكيد كلمة السر */}
                <Form.Group controlId="formConfirmPassword" className="mb-3">
                    <Form.Label>🔑 تأكيد كلمة السر</Form.Label>
                    <Form.Control
                        type="password"
                        placeholder="أعد إدخال كلمة السر"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                    />
                </Form.Group>

                {/* التخصص */}
                <Form.Group controlId="formSpecialization" className="mb-3">
                    <Form.Label>✍️ التخصص</Form.Label>
                    <Form.Control
                        as="select"
                        value={specialization}
                        onChange={(e) => setSpecialization(e.target.value)}
                        required
                    >
                        <option value="">اختر التخصص</option>
                        <option value="الفقه وأصوله">الفقه وأصوله</option>
                        <option value="أصول الدين">أصول الدين</option>
                        <option value="الاقتصاد الإسلامي">الاقتصاد الإسلامي</option>
                        <option value="التربية الإسلامية">التربية الإسلامية</option>
                    </Form.Control>
                </Form.Group>

                {/* السنة الدراسية */}
                <Form.Group controlId="formYear" className="mb-3">
                    <Form.Label>✍️ السنة الدراسية</Form.Label>
                    <Form.Control
                        as="select"
                        value={year}
                        onChange={(e) => setYear(e.target.value)}
                        required
                    >
                        <option value="">اختر السنة</option>
                        <option value="الأولى">الأولى</option>
                        <option value="الثانية">الثانية</option>
                        <option value="الثالثة">الثالثة</option>
                        <option value="الرابعة">الرابعة</option>
                    </Form.Control>
                </Form.Group>

                {/* زر التسجيل */}
                <Button variant="primary" type="submit" className="w-100 mt-3" style={{ fontSize: '1.1rem', fontWeight: 'bold', padding: '12px', borderRadius: '8px', transition: 'all 0.3s ease', position: 'relative', overflow: 'hidden' }}>
                    تسجيل 📝
                </Button>
            </Form>
            <p className="text-center mt-3">
                لديك حساب بالفعل؟ <a href="/login">سجل الدخول هنا</a>
            </p>
        </Container>
    );
};

export default RegisterPage;