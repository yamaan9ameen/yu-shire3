import React, { useEffect, useState } from 'react';
import { Container, Card, Row, Col, Image, Spinner, Form, Button, Alert } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../css/Profile.css';

const ProfilePage = () => {
    const { userId } = useParams(); // الحصول على userId من الرابط
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [editing, setEditing] = useState({
        studentName: false,
        specialization: false,
        year: false,
    });
    const [updatedUser, setUpdatedUser] = useState({
        studentName: '',
        specialization: '',
        year: '',
    });
    const navigate = useNavigate();

    // جلب userId الخاص بالمستخدم المسجل دخولًا من التوكن
    const loggedInUserId = localStorage.getItem('userId'); // تأكد من أن userId مخزن في localStorage عند تسجيل الدخول

    // قائمة التخصصات
    const specializations = [
        'الفقه وأصوله',
        'أصول الدين',
        'الدراسات الإسلامية',
        'التربية الإسلامية',
        'المصارف والاقتصاد الإسلامي',
    ];

    // قائمة السنوات
    const years = ['الأولى', 'الثانية', 'الثالثة', 'الرابعة'];

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const token = localStorage.getItem('token');
                const endpoint = userId ? `http://localhost:5000/api/profile/${userId}` : 'http://localhost:5000/api/profile';
                const headers = userId ? {} : { Authorization: `Bearer ${token}` };

                const response = await axios.get(endpoint, { headers });
                setUser(response.data);
                setUpdatedUser({
                    studentName: response.data.studentName,
                    specialization: response.data.specialization,
                    year: response.data.year,
                });
                setLoading(false);
            } catch (err) {
                setError("حدث خطأ في تحميل البيانات.");
                setLoading(false);
            }
        };

        fetchUserData();
    }, [userId]);

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('profileImage', file);

        try {
            const token = localStorage.getItem('token');
            const response = await axios.post(`http://localhost:5000/api/profile/${userId}/upload-image`, formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data',
                },
            });

            // تحديث صورة البروفايل في الواجهة
            setUser({ ...user, profileImage: response.data.profileImage });
        } catch (err) {
            console.error("Error uploading image:", err);
            setError("حدث خطأ أثناء تحميل الصورة.");
        }
    };

    const handleEdit = (field) => {
        setEditing({ ...editing, [field]: true });
    };

    const handleSave = async (field) => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.put(
                `http://localhost:5000/api/profile/${userId}/update`,
                { [field]: updatedUser[field] },
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    },
                }
            );
            
            if (response.data) {
                setUser({ ...user, [field]: updatedUser[field] });
                setEditing({ ...editing, [field]: false });
            }
        } catch (err) {
            console.error("Error updating profile:", err);
            setError(err.response?.data?.message || "حدث خطأ أثناء تحديث البيانات.");
        }
    };

    const handleChange = (e, field) => {
        setUpdatedUser({ ...updatedUser, [field]: e.target.value });
    };

    if (loading) {
        return (
            <Container className="text-center mt-5">
                <Spinner animation="border" role="status">
                    <span className="visually-hidden">جاري التحميل...</span>
                </Spinner>
            </Container>
        );
    }

    if (error) {
        return (
            <Container className="text-center mt-5">
                <Alert variant="danger">{error}</Alert>
                <Button variant="primary" onClick={() => navigate('/')}>العودة إلى الرئيسية</Button>
            </Container>
        );
    }

    if (!user) {
        return (
            <Container className="text-center mt-5">
                <Alert variant="warning">المستخدم غير موجود.</Alert>
                <Button variant="primary" onClick={() => navigate('/')}>العودة إلى الرئيسية</Button>
            </Container>
        );
    }

    // التحقق من تسجيل الدخول
    const isLoggedIn = !!localStorage.getItem('token');

    // التحقق من أن المستخدم المسجل دخولًا هو صاحب البروفايل
    const isOwner = loggedInUserId === user.userId;

    return (
        <Container className="profile-container">
            <h1 className="text-center">البروفايل 🚀</h1>
            <Card className="profile-card">
                <Card.Body>
                    <Row>
                        {/* صورة المستخدم */}
                        <Col md={4} className="text-center">
                            <label htmlFor="profileImageUpload" style={{ cursor: 'pointer' }}>
                                <Image
                                    src={user?.profileImage || "https://via.placeholder.com/150"}
                                    alt="صورة المستخدم"
                                    roundedCircle
                                    className="profile-image"
                                />
                                <span className="emoji">📸</span>
                            </label>
                            {isLoggedIn && isOwner && ( // عرض زر تحميل الصورة فقط إذا كان المستخدم صاحب البروفايل
                                <input
                                    type="file"
                                    id="profileImageUpload"
                                    accept="image/*"
                                    style={{ display: 'none' }}
                                    onChange={handleImageUpload}
                                />
                            )}
                        </Col>
                        {/* معلومات المستخدم */}
                        <Col md={8}>
                            <Card.Title className="profile-title">معلومات المستخدم 📋</Card.Title>
                            <div className="profile-info">
                                <strong>الاسم:</strong>
                                {editing.studentName ? (
                                    <div className="edit-field">
                                        <Form.Control
                                            type="text"
                                            value={updatedUser.studentName}
                                            onChange={(e) => handleChange(e, 'studentName')}
                                        />
                                        <Button variant="success" onClick={() => handleSave('studentName')}>
                                            حفظ ✅
                                        </Button>
                                    </div>
                                ) : (
                                    <div className="edit-field">
                                        {user?.studentName}
                                        {isLoggedIn && isOwner && ( // عرض زر التعديل فقط إذا كان المستخدم صاحب البروفايل
                                            <Button variant="link" onClick={() => handleEdit('studentName')}>
                                                <i className="fas fa-edit"></i> تعديل
                                            </Button>
                                        )}
                                    </div>
                                )}
                            </div>
                            <div className="profile-info">
                                <strong>البريد الإلكتروني:</strong> {user?.email} 📧
                            </div>
                            <div className="profile-info">
                                <strong>الرتبة:</strong> {user?.role} 👑
                            </div>
                            <div className="profile-info">
                                <strong>الاسم المعرف:</strong> {user?.userTag} 🏷️
                            </div>
                            <div className="profile-info">
                                <strong>التخصص الجامعي:</strong>
                                {editing.specialization ? (
                                    <div className="edit-field">
                                        <Form.Select
                                            value={updatedUser.specialization}
                                            onChange={(e) => handleChange(e, 'specialization')}
                                        >
                                            {specializations.map((spec, index) => (
                                                <option key={index} value={spec}>
                                                    {spec}
                                                </option>
                                            ))}
                                        </Form.Select>
                                        <Button variant="success" onClick={() => handleSave('specialization')}>
                                            حفظ ✅
                                        </Button>
                                    </div>
                                ) : (
                                    <div className="edit-field">
                                        {user?.specialization}
                                        {isLoggedIn && isOwner && ( // عرض زر التعديل فقط إذا كان المستخدم صاحب البروفايل
                                            <Button variant="link" onClick={() => handleEdit('specialization')}>
                                                <i className="fas fa-edit"></i> تعديل
                                            </Button>
                                        )}
                                    </div>
                                )}
                            </div>
                            <div className="profile-info">
                                <strong>السنة:</strong>
                                {editing.year ? (
                                    <div className="edit-field">
                                        <Form.Select
                                            value={updatedUser.year}
                                            onChange={(e) => handleChange(e, 'year')}
                                        >
                                            {years.map((year, index) => (
                                                <option key={index} value={year}>
                                                    {year}
                                                </option>
                                            ))}
                                        </Form.Select>
                                        <Button variant="success" onClick={() => handleSave('year')}>
                                            حفظ ✅
                                        </Button>
                                    </div>
                                ) : (
                                    <div className="edit-field">
                                        {user?.year}
                                        {isLoggedIn && isOwner && ( // عرض زر التعديل فقط إذا كان المستخدم صاحب البروفايل
                                            <Button variant="link" onClick={() => handleEdit('year')}>
                                                <i className="fas fa-edit"></i> تعديل
                                            </Button>
                                        )}
                                    </div>
                                )}
                            </div>
                        </Col>
                    </Row>
                </Card.Body>
            </Card>
        </Container>
    );
};

export default ProfilePage;