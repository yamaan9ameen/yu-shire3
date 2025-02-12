import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Card, Button, Spinner, Alert, ListGroup } from 'react-bootstrap';
import axios from 'axios';
import '../css/MaterialDetailsPage.css';

const MaterialDetailsPage = () => {
    const { department, category, materialId } = useParams();
    const navigate = useNavigate();
    const [material, setMaterial] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // جلب دور المستخدم من localStorage
    const userRole = localStorage.getItem('role');
    const allowedRoles = ['admin', 'manager', 'assistant professor'];
    const canAddExam = allowedRoles.includes(userRole); // تحقق من الصلاحية

    useEffect(() => {
        const fetchMaterial = async () => {
            try {
                const response = await axios.get(`https://sharia-yu.onrender.com/departments/${department}/materials/${materialId}`);
                const materialData = response.data;
                setMaterial(materialData);
            } catch (err) {
                setError('حدث خطأ أثناء جلب بيانات المادة.');
            } finally {
                setLoading(false);
            }
        };

        fetchMaterial();
    }, [department, category, materialId]);

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
            <Container className="mt-5">
                <Alert variant="danger">{error}</Alert>
            </Container>
        );
    }

    if (!material) {
        return (
            <Container className="mt-5">
                <Alert variant="warning">المادة غير موجودة.</Alert>
            </Container>
        );
    }

    return (
        <Container className="material-details-page">
            <Card className="text-center">
                <Card.Header as="h3">{material.name}</Card.Header>
                <Card.Body>
                    <Card.Text>{material.description}</Card.Text>

                    {/* قسم الدكاترة */}
                    {material.professors && material.professors.length > 0 && (
                        <>
                            <h5>الدكاترة المسؤولون:</h5>
                            <ListGroup>
                                {material.professors.map((professor, index) => (
                                    <ListGroup.Item key={index}>{professor}</ListGroup.Item>
                                ))}
                            </ListGroup>
                        </>
                    )}

                    {/* قسم الموضوعات */}
                    {material.topics && material.topics.length > 0 && (
                        <>
                            <h5 className="mt-3">موضوعات المادة:</h5>
                            <ListGroup>
                                {material.topics.map((topic, index) => (
                                    <ListGroup.Item key={index}>{topic}</ListGroup.Item>
                                ))}
                            </ListGroup>
                        </>
                    )}

                    {/* عدد الساعات */}
                    {material.hours && (
                        <p className="mt-3"><strong>عدد الساعات:</strong> {material.hours}</p>
                    )}

                    {/* معلومات إضافية */}
                    {material.additionalInfo && (
                        <p className="mt-3"><strong>معلومات إضافية:</strong> {material.additionalInfo}</p>
                    )}

                    {/* زر العودة */}
                    <Button variant="secondary" onClick={() => navigate(-1)} className="mt-3 me-2">
                        العودة
                    </Button>

                    {/* زر إضافة ملخص */}
                    <Button
                        variant="primary"
                        onClick={() => navigate(`/departments/${department}/materials/${materialId}/api/summaries?add=true`)}
                        className="mt-3 me-2"
                    >
                        عرض ملخصات
                    </Button>

                    {/* زر إضافة امتحان (يظهر فقط إذا كان canAddExam يساوي true) */}
                    {canAddExam && (
                        <Button
                            variant="success"
                            onClick={() => navigate(`/departments/${department}/materials/${materialId}/add-exam`)}
                            className="mt-3 me-2"
                        >
                            إضافة امتحان
                        </Button>
                    )}

                    {/* زر تقديم امتحان */}
                    <Button
                        variant="warning"
                        onClick={() => navigate(`/departments/${department}/materials/${materialId}/exams`)}
                        className="mt-3"
                    >
                        تقديم امتحان
                    </Button>
                </Card.Body>
            </Card>
        </Container>
    );
};

export default MaterialDetailsPage;
