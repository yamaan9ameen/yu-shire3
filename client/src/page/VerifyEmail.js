import React, { useState } from 'react';
import { Container, Form, Button, Alert } from 'react-bootstrap';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../css/VerifyEmail.css'; // ملف CSS لتنسيق الصفحة

const VerifyEmail = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [email, setEmail] = useState(location.state?.email || ''); // الحصول على البريد الإلكتروني من state
    const [verificationCode, setVerificationCode] = useState('');
    const [error, setError] = useState('');
    const [isResending, setIsResending] = useState(false); // حالة إعادة الإرسال

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            console.log('بيانات التحقق المرسلة:', { email, verificationCode }); // طباعة البيانات المرسلة
            const response = await axios.post('https://sharia-yu.onrender.com/api/auth/verify', { email, verificationCode });
            console.log('استجابة الخادم:', response.data); // طباعة استجابة الخادم

            if (response.data.success) {
                navigate('/login'); // توجيه المستخدم إلى صفحة البروفايل
            } else {
                setError('كود التحقق غير صحيح أو منتهي الصلاحية');
            }
        } catch (err) {
            console.error('حدث خطأ أثناء التحقق:', err); // طباعة الخطأ بالتفصيل
            setError('حدث خطأ أثناء التحقق. يرجى المحاولة مرة أخرى.');
        }
    };

    const resendVerificationCode = async () => {
        setIsResending(true); // تعيين حالة الإرسال إلى true
        try {
            const response = await axios.post('https://sharia-yu.onrender.com/api/auth/resend-code', { email });
            console.log('استجابة إعادة الإرسال:', response.data); // طباعة استجابة الخادم

            if (response.data.success) {
                alert('تم إعادة إرسال كود التحقق إلى بريدك الإلكتروني.');
            } else {
                setError('حدث خطأ أثناء إعادة إرسال الكود. يرجى المحاولة مرة أخرى.');
            }
        } catch (err) {
            console.error('حدث خطأ أثناء إعادة الإرسال:', err); // طباعة الخطأ بالتفصيل
            setError('حدث خطأ أثناء إعادة الإرسال. يرجى المحاولة مرة أخرى.');
        } finally {
            setIsResending(false); // إعادة تعيين حالة الإرسال إلى false
        }
    };

    return (
        <Container className="verify-email-page mt-5">
            <h1 className="text-center">تحقق من بريدك الإلكتروني</h1>
            {error && <Alert variant="danger">{error}</Alert>}
            <Form onSubmit={handleSubmit} className="verify-form">
                <Form.Group controlId="formEmail" className="mb-3">
                    <Form.Label>البريد الإلكتروني</Form.Label>
                    <Form.Control
                        type="email"
                        placeholder="أدخل بريدك الإلكتروني"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </Form.Group>

                <Form.Group controlId="formVerificationCode" className="mb-3">
                    <Form.Label>كود التحقق</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="أدخل كود التحقق"
                        value={verificationCode}
                        onChange={(e) => setVerificationCode(e.target.value)}
                        required
                    />
                </Form.Group>

                <Button variant="primary" type="submit" className="w-100 mt-3 verify-button">
                    تحقق
                </Button>

                <Button
                    variant="secondary"
                    onClick={resendVerificationCode}
                    className="w-100 mt-3 resend-button"
                    disabled={isResending} // تعطيل الزر أثناء الإرسال
                >
                    {isResending ? 'جاري الإرسال...' : 'إعادة إرسال الكود'}
                </Button>
            </Form>
        </Container>
    );
};

export default VerifyEmail;
