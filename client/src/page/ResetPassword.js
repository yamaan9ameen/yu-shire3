import React, { useState } from 'react';
import { Container, Form, Button, Alert } from 'react-bootstrap';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import '../css/ResetPassword.css';

const ResetPassword = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [code, setCode] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const email = location.state?.email || '';

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!code || !newPassword) {
            setError('يرجى تعبئة جميع الحقول');
            return;
        }

        try {
            // إرسال طلب إعادة تعيين كلمة المرور
            const response = await axios.post('http://localhost:5000/api/auth/reset-password', {
                email,
                code,
                newPassword,
            });

            // عرض رسالة نجاح
            setSuccess('تم إعادة تعيين كلمة المرور بنجاح.');
            setError('');

            // توجيه المستخدم إلى صفحة تسجيل الدخول
            setTimeout(() => {
                navigate('/login');
            }, 2000);
        } catch (err) {
            if (err.response) {
                setError(err.response.data.message || 'حدث خطأ أثناء إعادة تعيين كلمة المرور');
            } else {
                setError('حدث خطأ في الاتصال بالخادم');
            }
        }
    };

    return (
        <Container className="reset-password-container">
            <h1 className="text-center">إعادة تعيين كلمة المرور</h1>
            {error && <Alert variant="danger">{error}</Alert>}
            {success && <Alert variant="success">{success}</Alert>}
            <Form onSubmit={handleSubmit}>
                <Form.Group controlId="formCode" className="mb-3">
                    <Form.Label>كود التحقق</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="أدخل كود التحقق"
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                        required
                    />
                </Form.Group>

                <Form.Group controlId="formNewPassword" className="mb-3">
                    <Form.Label>كلمة المرور الجديدة</Form.Label>
                    <Form.Control
                        type="password"
                        placeholder="أدخل كلمة المرور الجديدة"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        required
                    />
                </Form.Group>

                <Button variant="primary" type="submit" className="w-100">
                    إعادة تعيين كلمة المرور
                </Button>
            </Form>
        </Container>
    );
};

export default ResetPassword;