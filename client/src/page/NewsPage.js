import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../css/NewsApp.css';
import { FaImage, FaCalendarAlt, FaUser, FaEye, FaShare } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const NewsApp = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddingNews, setIsAddingNews] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [newArticle, setNewArticle] = useState({
    title: '',
    content: '',
    author: '',
    image: '',
    category: 'general',
    summary: ''
  });

  // جلب دور المستخدم من localStorage
  const userRole = localStorage.getItem('role');

  // الأدوار المسموح لها بإضافة أخبار
  const allowedRoles = ['admin', 'manager', 'assistant professor'];

  // التحقق من صلاحية المستخدم
  const canAddNews = allowedRoles.includes(userRole);

  // دالة لجلب الأخبار
  const fetchNews = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `http://localhost:5000/api/news?page=${page}&search=${searchQuery}`
      );
      if (!response.ok) throw new Error('لا يوجد اخبار');
      
      const data = await response.json();
      setNews(data.news);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // استدعاء fetchNews عند تغيير الصفحة أو نص البحث
  useEffect(() => {
    fetchNews();
  }, [page, searchQuery]);

  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const addNews = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append('title', newArticle.title);
      formData.append('content', newArticle.content);
      formData.append('author', newArticle.author);
      formData.append('category', newArticle.category);
      formData.append('summary', newArticle.summary);
      if (selectedImage) {
        formData.append('image', selectedImage);
      }

      const response = await fetch('http://localhost:5000/api/news', {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) throw new Error('فشل في إضافة الخبر');
      
      fetchNews();
      setIsAddingNews(false);
      resetForm();
    } catch (err) {
      setError(err.message);
    }
  };

  const resetForm = () => {
    setNewArticle({
      title: '',
      content: '',
      author: '',
      image: '',
      category: 'general',
      summary: ''
    });
    setSelectedImage(null);
    setImagePreview('');
  };

  const shareNews = async (newsItem) => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: newsItem.title,
          text: newsItem.summary,
          url: window.location.href
        });
      } else {
        await navigator.clipboard.writeText(window.location.href);
        alert('تم نسخ الرابط!');
      }
    } catch (err) {
      console.error('فشل في المشاركة:', err);
    }
  };

  return (
    <div className="container py-4">
      <div className="row mb-4">
        <div className="col">
          <h1 className="text-center main-title">آخر الأخبار 📰</h1>
          
          <div className="search-filter-bar mb-4">
            <div className="row g-3">
              <div className="col-md-6">
                <input
                  type="text"
                  className="form-control"
                  placeholder="ابحث في الأخبار... 🔍"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="col-md-3">
                <select className="form-select" onChange={(e) => setNewArticle({...newArticle, category: e.target.value})}>
                  <option value="all">جميع التصنيفات</option>
                  <option value="academic">أكاديمي</option>
                  <option value="activities">نشاطات</option>
                  <option value="announcements">إعلانات</option>
                </select>
              </div>
              {/* عرض زر "إضافة خبر جديد" فقط إذا كان المستخدم لديه الصلاحية */}
              {canAddNews && (
                <div className="col-md-3">
                  <button className="btn btn-primary w-100" onClick={() => setIsAddingNews(true)}>
                    إضافة خبر جديد 📝
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* عرض نموذج إضافة الخبر فقط إذا كان المستخدم لديه الصلاحية */}
          {canAddNews && isAddingNews && (
            <div className="add-news-form card mb-4">
              <div className="card-body">
                <form onSubmit={addNews}>
                  <div className="mb-3">
                    <label className="form-label">عنوان الخبر</label>
                    <input
                      type="text"
                      className="form-control"
                      value={newArticle.title}
                      onChange={(e) => setNewArticle({...newArticle, title: e.target.value})}
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label">ملخص الخبر</label>
                    <textarea
                      className="form-control"
                      rows={2}
                      value={newArticle.summary}
                      onChange={(e) => setNewArticle({...newArticle, summary: e.target.value})}
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label">المحتوى</label>
                    <textarea
                      className="form-control"
                      rows={4}
                      value={newArticle.content}
                      onChange={(e) => setNewArticle({...newArticle, content: e.target.value})}
                      required
                    />
                  </div>

                  <div className="row mb-3">
                    <div className="col-md-6">
                      <label className="form-label">الكاتب</label>
                      <input
                        type="text"
                        className="form-control"
                        value={newArticle.author}
                        onChange={(e) => setNewArticle({...newArticle, author: e.target.value})}
                        required
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">التصنيف</label>
                      <select 
                        className="form-select"
                        value={newArticle.category}
                        onChange={(e) => setNewArticle({...newArticle, category: e.target.value})}
                      >
                        <option value="academic">أكاديمي</option>
                        <option value="activities">نشاطات</option>
                        <option value="announcements">إعلانات</option>
                      </select>
                    </div>
                  </div>

                  <div className="mb-3">
                    <label className="form-label">صورة الخبر</label>
                    <input
                      type="file"
                      className="form-control"
                      accept="image/*"
                      onChange={handleImageSelect}
                    />
                    {imagePreview && (
                      <div className="mt-2">
                        <img 
                          src={imagePreview} 
                          alt="معاينة" 
                          className="img-preview"
                        />
                      </div>
                    )}
                  </div>

                  <div className="d-flex gap-2">
                    <button type="submit" className="btn btn-primary">نشر 🖊️</button>
                    <button 
                      type="button" 
                      className="btn btn-secondary"
                      onClick={() => {
                        setIsAddingNews(false);
                        resetForm();
                      }}
                    >
                      إلغاء ❌
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {loading && <div>جاري تحميل الأخبار... ⏳</div>}
          {error && <div className="text-danger">{error}</div>}

          <div className="row">
            {news.map((item) => (
              <div className="col-md-6 mb-4" key={item._id}>
                <div className="card news-card h-100">
                  {item.image && (
                    <img 
                      src={item.image} 
                      className="card-img-top news-image" 
                      alt={item.title} 
                    />
                  )}
                  <div className="card-body">
                    <div className="category-badge mb-2">{item.category}</div>
                    <h5 className="card-title">{item.title}</h5>
                    <p className="card-summary">{item.summary}</p>
                    <div className="news-metadata">
                      <span><FaUser /> {item.author}</span>
                      <span><FaCalendarAlt /> {new Date(item.createdAt).toLocaleDateString('ar-EG')}</span>
                      <span><FaEye /> {item.views || 0} مشاهدة</span>
                    </div>
                  </div>
                  <div className="card-footer">
                    <Link to={`/news/${item._id}`} className="btn btn-link">
                      قراءة المزيد 📖
                    </Link>
                    <button className="btn btn-link" onClick={() => shareNews(item)}>
                      <FaShare /> مشاركة
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="d-flex justify-content-center gap-2 mt-4">
            <button
              className="btn btn-primary"
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
            >
              السابق ⬅️
            </button>
            <button
              className="btn btn-primary"
              onClick={() => setPage(p => p + 1)}
              disabled={news.length < 10}
            >
              التالي ➡️
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewsApp;