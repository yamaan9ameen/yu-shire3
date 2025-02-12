import React, { useState } from 'react';
import { Container, Form, Button, Alert } from 'react-bootstrap';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../css/ForgotPassword.css';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!email) {
            setError('يرجى إدخال البريد الإلكتروني');
            return;
        }

        try {
            // إرسال طلب إعادة تعيين كلمة المرور
            const response = await axios.post('http://localhost:5000/api/auth/forgot-password', { email });

            // عرض رسالة نجاح
            setSuccess('تم إرسال رابط إعادة تعيين كلمة المرور إلى بريدك الإلكتروني.');
            setError('');

            // توجيه المستخدم إلى صفحة إدخال الكود
            navigate('/reset-password', { state: { email } });
        } catch (err) {
            if (err.response) {
                setError(err.response.data.message || 'حدث خطأ أثناء إرسال الطلب');
            } else {
                setError('حدث خطأ في الاتصال بالخادم');
            }
        }
    };

    return (
        <Container className="forgot-password-container">
            <h1 className="text-center">نسيت كلمة المرور</h1>
            {error && <Alert variant="danger">{error}</Alert>}
            {success && <Alert variant="success">{success}</Alert>}
            <Form onSubmit={handleSubmit}>
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

                <Button variant="primary" type="submit" className="w-100">
                    إرسال
                </Button>
            </Form>
        </Container>
    );
};

export default ForgotPassword;