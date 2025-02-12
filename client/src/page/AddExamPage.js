import React, { useReducer, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Container, Form, Button, Alert, Spinner, Card } from 'react-bootstrap';
import axios from 'axios';
import '../css/AddExamPage.css'; // استيراد ملف الـ CSS

// Reducer لإدارة حالة الأسئلة
const questionsReducer = (state, action) => {
    switch (action.type) {
        case 'ADD_QUESTION':
            return [
                ...state,
                { text: '', options: ['', '', '', ''], correctAnswer: '', marks: 1 },
            ];
        case 'UPDATE_QUESTION':
            return state.map((question, index) =>
                index === action.payload.index
                    ? { ...question, [action.payload.field]: action.payload.value }
                    : question
            );
        case 'UPDATE_OPTION':
            return state.map((question, qIndex) =>
                qIndex === action.payload.qIndex
                    ? {
                          ...question,
                          options: question.options.map((option, optIndex) =>
                              optIndex === action.payload.optIndex ? action.payload.value : option
                          ),
                      }
                    : question
            );
        case 'DELETE_QUESTION':
            return state.filter((_, index) => index !== action.payload);
        default:
            return state;
    }
};

const AddExamPage = () => {
    const { department, materialId } = useParams();
    const navigate = useNavigate();
    const [title, setTitle] = useState('');
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [questions, dispatch] = useReducer(questionsReducer, []);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    
    // إضافة سؤال جديد
    const addQuestion = () => {
        dispatch({ type: 'ADD_QUESTION' });
    };

    // تحديث بيانات السؤال
    const updateQuestion = (index, field, value) => {
        dispatch({ type: 'UPDATE_QUESTION', payload: { index, field, value } });
    };

    // تحديث خيارات السؤال
    const updateOption = (qIndex, optionIndex, value) => {
        dispatch({ type: 'UPDATE_OPTION', payload: { qIndex, optIndex: optionIndex, value } });
    };

    // حذف سؤال
    const deleteQuestion = (index) => {
        dispatch({ type: 'DELETE_QUESTION', payload: index });
    };

    // تحقق من صحة البيانات قبل الإرسال
    const validateForm = () => {
        if (!title || !date || questions.length === 0) {
            setError('يرجى ملء جميع الحقول المطلوبة.');
            return false;
        }

        for (const question of questions) {
            if (!question.text || !question.correctAnswer || question.marks <= 0) {
                setError('يرجى التأكد من ملء جميع الأسئلة بشكل صحيح.');
                return false;
            }

            for (const option of question.options) {
                if (!option) {
                    setError('يرجى ملء جميع الخيارات في الأسئلة.');
                    return false;
                }
            }
        }

        return true;
    };

    // إرسال الامتحان
    const handleAddExam = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        if (!validateForm()) {
            setLoading(false);
            return;
        }

        try {
            const response = await axios.post(
                `https://sharia-yu.onrender.com/departments/${department}/materials/${materialId}/exams`,
                { name: title, date, questions }
            );
            alert('تمت إضافة الامتحان بنجاح!');
            navigate(-1); // العودة للخلف
        } catch (err) {
            setError('حدث خطأ أثناء إضافة الامتحان.');
            console.error('Error:', err.response?.data || err.message); // عرض تفاصيل الخطأ
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container className="add-exam-page mt-5">
            <h3 className="page-title">إضافة امتحان جديد</h3>
            {error && <Alert variant="danger" className="error-message">{error}</Alert>}
            <Form onSubmit={handleAddExam} className="exam-form">
                <Form.Group className="mb-3 form-group">
                    <Form.Label className="form-label">عنوان الامتحان</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="أدخل عنوان الامتحان"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                        className="form-control"
                    />
                </Form.Group>

                <Form.Group className="mb-3 form-group">
                    <Form.Label className="form-label">تاريخ الامتحان</Form.Label>
                    <Form.Control
                        type="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        required
                        className="form-control"
                    />
                </Form.Group>

                <h5 className="questions-title">الأسئلة:</h5>
                {questions.map((question, qIndex) => (
                    <Card key={qIndex} className="mb-3 question-card">
                        <Card.Body className="card-body">
                            <Form.Group className="mb-3 form-group">
                                <Form.Label className="form-label">نص السؤال</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="أدخل نص السؤال"
                                    value={question.text}
                                    onChange={(e) => updateQuestion(qIndex, 'text', e.target.value)}
                                    required
                                    className="form-control"
                                />
                            </Form.Group>

                            <Form.Group className="mb-3 form-group">
                                <Form.Label className="form-label">خيارات الإجابة</Form.Label>
                                {question.options.map((option, optIndex) => (
                                    <Form.Control
                                        key={optIndex}
                                        type="text"
                                        placeholder={`الخيار ${optIndex + 1}`}
                                        value={option}
                                        onChange={(e) => updateOption(qIndex, optIndex, e.target.value)}
                                        required
                                        className="form-control mb-2"
                                    />
                                ))}
                            </Form.Group>

                            <Form.Group className="mb-3 form-group">
                                <Form.Label className="form-label">الإجابة الصحيحة</Form.Label>
                                <Form.Select
                                    value={question.correctAnswer}
                                    onChange={(e) => updateQuestion(qIndex, 'correctAnswer', e.target.value)}
                                    required
                                    className="form-control"
                                >
                                    <option value="">اختر الإجابة الصحيحة</option>
                                    {question.options.map((option, optIndex) => (
                                        <option key={optIndex} value={option}>
                                            {option}
                                        </option>
                                    ))}
                                </Form.Select>
                            </Form.Group>

                            <Form.Group className="mb-3 form-group">
                                <Form.Label className="form-label">العلامة</Form.Label>
                                <Form.Control
                                    type="number"
                                    placeholder="أدخل العلامة"
                                    value={question.marks}
                                    onChange={(e) => updateQuestion(qIndex, 'marks', e.target.value)}
                                    required
                                    min="1"
                                    className="form-control"
                                />
                            </Form.Group>

                            <Button
                                variant="danger"
                                onClick={() => deleteQuestion(qIndex)}
                                className="delete-question-btn mt-2"
                            >
                                حذف السؤال
                            </Button>
                        </Card.Body>
                    </Card>
                ))}

                <Button variant="secondary" className="add-question-btn mb-3" onClick={addQuestion}>
                    إضافة سؤال جديد
                </Button>

                <Button type="submit" variant="primary" disabled={loading} className="submit-exam-btn">
                    {loading ? <Spinner as="span" animation="border" size="sm" /> : 'إضافة الامتحان'}
                </Button>
            </Form>
        </Container>
    );
};

export default AddExamPage;
