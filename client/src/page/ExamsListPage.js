import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, ListGroup, Alert, Spinner, Button, Modal } from 'react-bootstrap';
import axios from 'axios';
import '../css/ExamsListPage.css';

const ExamsListPage = () => {
    const { department, materialId } = useParams();
    const navigate = useNavigate();
    const [exams, setExams] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedExamId, setSelectedExamId] = useState(null);

    // جلب دور المستخدم من localStorage
    const userRole = localStorage.getItem('role');
    const allowedRoles = ['admin', 'manager', 'assistant professor'];
    const canDelete = allowedRoles.includes(userRole); // تحقق من الصلاحية

    useEffect(() => {
        const fetchExams = async () => {
            try {
                const response = await axios.get(
                    `http://localhost:5000/departments/${department}/materials/${materialId}/exams`
                );
                setExams(response.data);
            } catch (err) {
                setError('لا يوجد امتحانات');
            } finally {
                setLoading(false);
            }
        };

        fetchExams();
    }, [department, materialId]);

    const handleDeleteExam = async (examId) => {
        setIsDeleting(true);
        try {
            await axios.delete(
                `http://localhost:5000/departments/${department}/materials/${materialId}/exams/${examId}`
            );
            setExams(exams.filter((exam) => exam._id !== examId)); // تحديث القائمة بعد الحذف
            setShowDeleteModal(false); // إغلاق النافذة المنبثقة
        } catch (err) {
            setError('حدث خطأ أثناء حذف الامتحان.');
        } finally {
            setIsDeleting(false);
        }
    };

    const confirmDelete = (examId) => {
        setSelectedExamId(examId);
        setShowDeleteModal(true);
    };

    const handleCloseDeleteModal = () => {
        setShowDeleteModal(false);
        setSelectedExamId(null);
    };

    if (loading) {
        return (
            <Container className="exams-list-page text-center mt-5">
                <Spinner animation="border" role="status" className="loading-spinner">
                    <span className="visually-hidden">جاري التحميل...</span>
                </Spinner>
            </Container>
        );
    }

    if (error) {
        return (
            <Container className="exams-list-page mt-5">
                <Alert variant="danger" className="error-message">
                    {error}
                </Alert>
            </Container>
        );
    }

    return (
        <Container className="exams-list-page mt-5">
            <h3 className="page-title">الامتحانات المتاحة</h3>
            {exams.length === 0 ? (
                <Alert variant="warning" className="no-exams-alert">
                    لا توجد امتحانات لهذه المادة.
                </Alert>
            ) : (
                <ListGroup className="exams-list">
                    {exams.map((exam) => (
                        <ListGroup.Item
                            key={exam._id}
                            action
                            className="exam-item"
                            onClick={() => navigate(`/departments/${department}/materials/${materialId}/exams/${exam._id}`)}
                        >
                            <span className="exam-title">{exam.name}</span>
                            <span className="exam-date"> - تاريخ: {exam.date}</span>

                            {/* زر الحذف (يظهر فقط إذا كان canDelete يساوي true) */}
                            {canDelete && (
                                <Button
                                    variant="danger"
                                    className="delete-btn"
                                    onClick={(e) => {
                                        e.stopPropagation(); // منع التنقل عند النقر على زر الحذف
                                        confirmDelete(exam._id);
                                    }}
                                >
                                    حذف
                                </Button>
                            )}
                        </ListGroup.Item>
                    ))}
                </ListGroup>
            )}

            {/* نافذة تأكيد الحذف */}
            <Modal show={showDeleteModal} onHide={handleCloseDeleteModal}>
                <Modal.Header closeButton>
                    <Modal.Title>تأكيد الحذف</Modal.Title>
                </Modal.Header>
                <Modal.Body>هل أنت متأكد من أنك تريد حذف هذا الامتحان؟</Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseDeleteModal}>
                        إلغاء
                    </Button>
                    <Button
                        variant="danger"
                        onClick={() => handleDeleteExam(selectedExamId)}
                        disabled={isDeleting}
                    >
                        {isDeleting ? 'جاري الحذف...' : 'حذف'}
                    </Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
};

export default ExamsListPage;