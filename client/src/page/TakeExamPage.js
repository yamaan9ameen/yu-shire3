import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Form, Button, Alert, Spinner } from 'react-bootstrap';
import axios from 'axios';
import '../css/TakeExamPage.css'; // استيراد ملف CSS

const TakeExamPage = () => {
    const { department, materialId, examId } = useParams();
    const navigate = useNavigate();
    const [exam, setExam] = useState(null);
    const [answers, setAnswers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState(null);
    const [result, setResult] = useState(null);
    const [questionResults, setQuestionResults] = useState([]); // نتائج كل سؤال
    const [isSubmitted, setIsSubmitted] = useState(false); // حالة لتتبع ما إذا تم الإرسال

    const userId = localStorage.getItem('userId'); // جلب userId من localStorage

    useEffect(() => {
        const fetchExam = async () => {
            try {
                const response = await axios.get(
                    `http://localhost:5000/departments/${department}/materials/${materialId}/exams/${examId}`
                );
                setExam(response.data);
                setAnswers(new Array(response.data.questions.length).fill(''));
            } catch (err) {
                setError('حدث خطأ أثناء تحميل الامتحان.');
            } finally {
                setLoading(false);
            }
        };

        fetchExam();
    }, [department, materialId, examId]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setError(null);

        try {
            const response = await axios.post(
                `http://localhost:5000/departments/${department}/materials/${materialId}/exams/${examId}/submit`,
                {
                    userId,
                    answers,
                }
            );
            setResult(response.data.result); // جلب النتيجة من السيرفر
            setQuestionResults(response.data.questionResults); // نتائج كل سؤال
            setIsSubmitted(true); // تم الإرسال بنجاح
        } catch (err) {
            setError('حدث خطأ أثناء إرسال الإجابات.');
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <Container className="take-exam-page text-center mt-5">
                <Spinner animation="border" role="status" className="loading-spinner">
                    <span className="visually-hidden">جاري التحميل...</span>
                </Spinner>
            </Container>
        );
    }

    if (error) {
        return (
            <Container className="take-exam-page mt-5">
                <Alert variant="danger" className="error-message">
                    {error}
                </Alert>
            </Container>
        );
    }

    return (
        <Container className="take-exam-page mt-5">
            <h3 className="exam-title">📝 {exam.name}</h3>
            <Form onSubmit={handleSubmit} className="exam-form">
                {exam.questions.map((question, index) => (
                    <Form.Group key={index} className="mb-4 question-group">
                        <Form.Label className="question-label">{`سؤال ${index + 1}: ${question.text}`}</Form.Label>
                        
                        <Form.Select
                            value={answers[index]}
                            onChange={(e) =>
                                setAnswers(answers.map((answer, i) => (i === index ? e.target.value : answer)))
                            }
                            required
                            className="answer-select"
                            disabled={isSubmitted} // تعطيل الخيارات بعد الإرسال
                        >
                            <option value="">اختر الإجابة</option>
                            {question.options.map((option, optIndex) => (
                                <option key={optIndex} value={option}>
                                    {option}
                                </option>
                            ))}
                        </Form.Select>

                        {/* عرض نتيجة السؤال */}
                        {result !== null && (
                            <div className={`question-result ${questionResults[index] ? 'correct' : 'incorrect'}`}>
                                {questionResults[index] ? (
                                    <span>✅ إجابتك صحيحة!</span>
                                ) : (
                                    <span>❌ إجابتك خاطئة. الإجابة الصحيحة: {question.correctAnswer}</span>
                                )}
                            </div>
                        )}
                    </Form.Group>
                ))}

                {/* زر الإرسال (يتم تعطيله بعد الإرسال) */}
                <Button
                    type="submit"
                    variant="primary"
                    className="submit-btn"
                    disabled={submitting || isSubmitted} // تعطيل الزر أثناء الإرسال أو بعد الإرسال
                >
                    {submitting ? (
                        <Spinner as="span" animation="border" size="sm" className="submit-spinner" />
                    ) : (
                        isSubmitted ? 'تم الإرسال ✔️' : 'إرسال الإجابات 🚀'
                    )}
                </Button>
            </Form>

            {result !== null && (
                <Alert variant="success" className="result-alert mt-4">
                    🎉 نتيجتك: {result}/{exam.questions.length}
                </Alert>
            )}
        </Container>
    );
};

export default TakeExamPage;