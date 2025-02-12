import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FaCalendarAlt, FaUser, FaTrash, FaArrowLeft } from 'react-icons/fa';
import { Modal, Button, Toast, ToastContainer } from 'react-bootstrap'; // استيراد Toast
import '../css/NewsDetailsPage.css';

const NewsDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [newsItem, setNewsItem] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showToast, setShowToast] = useState(false); // حالة التحكم في عرض Toast
    const userRole = localStorage.getItem('role');
    const allowedRoles = ['admin', 'manager', 'assistant professor'];
    const canDelete = allowedRoles.includes(userRole);

    const fetchNewsDetails = async () => {
      try {
        setLoading(true);
        const response = await fetch(`http://localhost:5000/api/news/${id}`);
        if (!response.ok) throw new Error('فشل في جلب تفاصيل الخبر');
        const data = await response.json();
        setNewsItem(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
  
    const deleteNews = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/news/${id}`, {
          method: 'DELETE',
        });
        if (!response.ok) throw new Error('فشل في حذف الخبر');
        setShowToast(true); // عرض Toast عند النجاح
        setTimeout(() => {
          navigate('/news'); // إعادة التوجيه بعد 3 ثوانٍ
        }, 3000); // تأخير 3 ثوانٍ قبل التوجيه
      } catch (err) {
        console.error(err);
        alert('حدث خطأ أثناء حذف الخبر');
      } finally {
        setShowDeleteModal(false); // إغلاق المودال بعد الحذف
      }
    };
  
    useEffect(() => {
      fetchNewsDetails();
    }, [id]);
  
    if (loading) return <div className="text-center">جاري تحميل الخبر... ⏳</div>;
    if (error) return <div className="text-danger text-center">{error}</div>;
  
    return (
      <div className="container py-4 news-details-container">
        {newsItem && (
          <div className="card news-card shadow-lg">
            {newsItem.image && (
              <img
                src={newsItem.image}
                className="card-img-top news-card-img"
                alt={newsItem.title}
              />
            )}
            <div className="card-body">
              <h1 className="card-title news-title">{newsItem.title}</h1>
              <div className="mb-3 text-muted news-info">
                <span><FaUser /> {newsItem.author}</span>
                <span className="mx-3"><FaCalendarAlt /> {new Date(newsItem.createdAt).toLocaleDateString('ar-EG')}</span>
              </div>
              <p className="card-text news-content">{newsItem.content}</p>
            </div>
            <div className="card-footer d-flex justify-content-between align-items-center">
              <button className="btn btn-secondary back-btn" onClick={() => navigate(-1)}>
                <FaArrowLeft /> العودة للخلف
              </button>
              {canDelete && (
                <button className="btn btn-danger delete-btn" onClick={() => setShowDeleteModal(true)}>
                  <FaTrash /> حذف الخبر
                </button>
              )}
            </div>
          </div>
        )}

        {/* مودال تأكيد الحذف */}
        <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>تأكيد الحذف</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            هل أنت متأكد أنك تريد حذف هذا الخبر؟ لا يمكن التراجع عن هذه العملية.
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
              إلغاء
            </Button>
            <Button variant="danger" onClick={deleteNews}>
              حذف الخبر
            </Button>
          </Modal.Footer>
        </Modal>

        {/* Toast للإشعار */}
        <ToastContainer position="top-end" className="p-3">
          <Toast
            show={showToast}
            onClose={() => setShowToast(false)}
            delay={1000} // إغلاق Toast تلقائيًا بعد 3 ثوانٍ
            autohide
            bg="success"
          >
            <Toast.Header>
              <strong className="me-auto">نجاح</strong>
            </Toast.Header>
            <Toast.Body className="text-white">تم حذف الخبر بنجاح!</Toast.Body>
          </Toast>
        </ToastContainer>
      </div>
    );
};

export default NewsDetails;