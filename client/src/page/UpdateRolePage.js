import React, { useState, useEffect } from 'react';
import { Container, Form, Button, Alert, Card, Spinner } from 'react-bootstrap';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const UpdateRolePage = () => {
    const [userId, setUserId] = useState('');
    const [user, setUser] = useState(null);
    const [newRole, setNewRole] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);
    const [isManager, setIsManager] = useState(false); // تحقق من دور المدير
    const navigate = useNavigate();

    // تحقق من دور المستخدم عند تحميل الصفحة
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            const decoded = JSON.parse(atob(token.split('.')[1])); // فك تشفير التوكن
            if (decoded.role === 'manager') {
                setIsManager(true);
            } else {
                navigate('/'); // توجيه المستخدم إلى الصفحة الرئيسية إذا لم يكن مديرًا
            }
        } else {
            navigate('/login'); // توجيه المستخدم إلى صفحة تسجيل الدخول إذا لم يكن مسجل دخولًا
        }
    }, [navigate]);

    // البحث عن المستخدم باستخدام userId
    const handleSearch = async () => {
        if (!userId) {
            setError('يرجى إدخال رقم المستخدم.');
            return;
        }
        setLoading(true);
        setError('');
        setSuccess('');
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`https://sharia-yu.onrender.com/api/profile/${userId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setUser(response.data);
        } catch (err) {
            setError('المستخدم غير موجود أو حدث خطأ في البحث.');
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    // تحديث رتبة المستخدم
    const handleUpdateRole = async () => {
        if (!newRole) {
            setError('يرجى اختيار رتبة جديدة.');
            return;
        }
        setLoading(true);
        setError('');
        setSuccess('');
        try {
            const token = localStorage.getItem('token');
            const response = await axios.put(
                `https://sharia-yu.onrender.com/api/users/${userId}/update-role`,
                { role: newRole },
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );
            setSuccess('تم تحديث الرتبة بنجاح.');
            setUser(response.data.user); // تحديث بيانات المستخدم
        } catch (err) {
            setError('حدث خطأ أثناء تحديث الرتبة.');
        } finally {
            setLoading(false);
        }
    };

    // إذا لم يكن المستخدم مديرًا، لا تعرض الصفحة
    if (!isManager) {
        return null; // أو يمكنك عرض رسالة "غير مصرح لك بالوصول"
    }

    return (
        <Container className="mt-5">
            <h1 className="text-center mb-4">تعديل رتبة المستخدم</h1>

            {error && <Alert variant="danger">{error}</Alert>}
            {success && <Alert variant="success">{success}</Alert>}

            {/* حقل البحث عن المستخدم */}
            <Form.Group className="mb-3">
                <Form.Label>ابحث عن المستخدم باستخدام الـ ID:</Form.Label>
                <Form.Control
                    type="text"
                    placeholder="أدخل الـ ID"
                    value={userId}
                    onChange={(e) => setUserId(e.target.value)}
                />
                <Button
                    variant="primary"
                    onClick={handleSearch}
                    className="mt-2"
                    disabled={loading}
                >
                    {loading ? <Spinner animation="border" size="sm" /> : 'بحث'}
                </Button>
            </Form.Group>

            {/* عرض بيانات المستخدم */}
            {user && (
                <Card className="mt-3">
                    <Card.Body>
                        <Card.Title>بيانات المستخدم</Card.Title>
                        <Card.Text>
                            <strong>الاسم:</strong> {user.studentName}
                        </Card.Text>
                        <Card.Text>
                            <strong>البريد الإلكتروني:</strong> {user.email}
                        </Card.Text>
                        <Card.Text>
                            <strong>الرتبة الحالية:</strong> {user.role}
                        </Card.Text>

                        {/* تحديث الرتبة */}
                        <Form.Group className="mb-3">
                            <Form.Label>اختر الرتبة الجديدة:</Form.Label>
                            <Form.Select
                                value={newRole}
                                onChange={(e) => setNewRole(e.target.value)}
                            >
                                <option value="">اختر رتبة</option>
                                <option value="admin">مدير</option>
                                <option value="assistant professor">أستاذ مساعد</option>
                                <option value="student">طالب</option>
                                <option value="manager">مدير النظام</option>
                            </Form.Select>
                        </Form.Group>

                        <Button
                            variant="success"
                            onClick={handleUpdateRole}
                            disabled={loading}
                        >
                            {loading ? <Spinner animation="border" size="sm" /> : 'تحديث الرتبة'}
                        </Button>
                    </Card.Body>
                </Card>
            )}
        </Container>
    );
};

export default UpdateRolePage;
