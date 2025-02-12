import React, { useState } from 'react';
import { Container, Form, Button, Alert } from 'react-bootstrap';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../css/Login.css';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault(); // منع إعادة تحميل الصفحة

        // التحقق من تعبئة الحقول
        if (!email || !password) {
            setError('يرجى تعبئة جميع الحقول');
            return;
        }

        try {
            // إرسال طلب تسجيل الدخول إلى الخادم
            const response = await axios.post('http://localhost:5000/api/auth/login', { email, password });

            // تخزين التوكن وبيانات المستخدم في localStorage
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('userData', JSON.stringify(response.data.user));
            localStorage.setItem('userId', response.data.user.userId); // تخزين userId
            localStorage.setItem('role', response.data.user.role); // تخزين role

            // توجيه المستخدم إلى الصفحة الرئيسية
            navigate('/');

            // عمل ريفرش للصفحة لتحديث البيانات
            window.location.reload();
        } catch (err) {
            // التعامل مع الأخطاء
            if (err.response) {
                setError(err.response.data.message || 'حدث خطأ أثناء تسجيل الدخول');
            } else {
                setError('حدث خطأ في الاتصال بالخادم');
            }
        }
    };

    return (
        <Container className="login-container">
            <h1 className="text-center">تسجيل الدخول</h1>
            {error && <Alert variant="danger">{error}</Alert>}
            <Form onSubmit={handleLogin}>
                {/* حقل البريد الإلكتروني */}
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

                {/* حقل كلمة السر */}
                <Form.Group controlId="formPassword" className="mb-3">
                    <Form.Label>كلمة السر</Form.Label>
                    <Form.Control
                        type="password"
                        placeholder="أدخل كلمة السر"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </Form.Group>

                {/* زر تسجيل الدخول */}
                <Button variant="primary" type="submit" className="w-100">
                    تسجيل الدخول
                </Button>

                {/* زر "نسيت كلمة المرور" */}
                <div className="text-center mt-3">
                    <Button
                        variant="link"
                        onClick={() => navigate('/forgot-password')}
                        className="register-link"
                    >
                        نسيت كلمة المرور؟
                    </Button>
                </div>

                {/* زر "سجل من هنا" */}
                <div className="text-center mt-3">
                    <span>ليس لديك حساب؟ </span>
                    <Button
                        variant="link"
                        onClick={() => navigate('/register')}
                        className="register-link"
                    >
                        سجل من هنا
                    </Button>
                </div>
            </Form>
        </Container>
    );
};

export default LoginPage;