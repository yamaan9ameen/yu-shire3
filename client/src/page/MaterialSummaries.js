import React, { useState, useEffect } from 'react';
import { getSummaries, addSummaryLink, addSummaryFile, deleteSummary } from '../Components/summaries';
import '../css/MaterialSummaries.css'; // استيراد ملف الـ CSS

// تعريف AddSummaryForm
const AddSummaryForm = ({ departmentName, materialId, onClose, onSuccess }) => {
    const [title, setTitle] = useState('');
    const [type, setType] = useState('link');
    const [link, setLink] = useState('');
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        
        const datauser = JSON.parse(localStorage.getItem('userData'));

        // التأكد من أن datauser موجود قبل محاولة الوصول إلى studentName
        const uploader = datauser ? datauser.studentName : 'مستخدم غير معروف';

        try {
            if (type === 'link') {
                const data = await addSummaryLink(departmentName, materialId, {
                    title,
                    link,
                    uploader: uploader, // سيتم استبداله باسم المستخدم المسجل
                    uploadDate: new Date(), // التاريخ الحالي
                });
                onSuccess(data);
            } else {
                const formData = new FormData();
                formData.append('file', file);
                formData.append('title', title);
                formData.append('uploader', uploader);
                formData.append('uploadDate', new Date()); // التاريخ الحالي
                
                const data = await addSummaryFile(departmentName, materialId, formData);
                onSuccess(data);
            }
        } catch (err) {
            setError('حدث خطأ أثناء إضافة الملخص');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h4>📝 إضافة ملخص جديد</h4>
                
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block mb-2">عنوان الملخص</label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full border rounded p-2"
                            required
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block mb-2">نوع الملخص</label>
                        <select
                            value={type}
                            onChange={(e) => setType(e.target.value)}
                            className="w-full border rounded p-2"
                        >
                            <option value="link">رابط</option>
                            <option value="file">ملف</option>
                        </select>
                    </div>

                    {type === 'link' ? (
                        <div className="mb-4">
                            <label className="block mb-2">الرابط</label>
                            <input
                                type="url"
                                value={link}
                                onChange={(e) => setLink(e.target.value)}
                                className="w-full border rounded p-2"
                                required
                            />
                        </div>
                    ) : (
                        <div className="mb-4">
                            <label className="block mb-2">الملف</label>
                            <input
                                type="file"
                                onChange={(e) => setFile(e.target.files[0])}
                                className="w-full border rounded p-2"
                                accept=".pdf,.doc,.docx"
                                required
                            />
                        </div>
                    )}

                    {error && <p className="text-red-500 mb-4">{error}</p>}

                    <div className="flex justify-end gap-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 border rounded"
                            disabled={loading}
                        >
                            إلغاء
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-blue-500 text-white rounded"
                            disabled={loading}
                        >
                            {loading ? 'جاري الإضافة...' : 'إضافة'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

// تعريف SummaryCard
const SummaryCard = ({ summary, onDelete, userRole }) => {
    const handleDownload = () => {
        if (summary.type === 'file') {
            // استخراج اسم الملف من المسار
            // const filename = summary.content.split('/').pop();
            // إنشاء رابط التنزيل
            
            const downloadLink = `https://sharia-yu.onrender.com/api/summaries/download/${summary.content}`;
            //             // فتح الرابط في نافذة جديدة لبدء التنزيل
            window.open(downloadLink, '_blank');
        }
    };

    // التحقق من دور المستخدم
    const allowedRoles = ['admin', 'manager', 'assistant professor'];
    const canDelete = allowedRoles.includes(userRole);
    console.log(summary);
    return (
        <div className="summary-card">
            <h5>📄 {summary.title}</h5>
            <p className="text-sm text-gray-600 mb-2">
                تم الرفع بواسطة: {summary.uploader}
            </p>
            <p className="text-sm text-gray-600 mb-4">
                تاريخ الرفع: {new Date(summary.uploadDate).toLocaleDateString('ar-EG')}
            </p>
            
            {summary.type === 'link' ? (
                <a
                    href={summary.content}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:underline"
                >
                    🌐 فتح الرابط
                </a>
            ) : (
                <button
                    onClick={handleDownload}
                    className="text-blue-500 hover:underline"
                >
                    📥 تنزيل الملف
                </button>
            )}

            {canDelete && (
                <button
                    onClick={onDelete}
                    className="mt-2 text-red-500 text-sm hover:underline"
                >
                    🗑️ حذف
                </button>
            )}
        </div>
    );
};

// المكون الرئيسي
// المكون الرئيسي
const MaterialSummaries = ({ departmentName, materialId, onAddSuccess }) => {
    const [summaries, setSummaries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showAddForm, setShowAddForm] = useState(false);

    // جلب دور المستخدم من localStorage
    const userRole = localStorage.getItem('role');

    // جلب الملخصات
    useEffect(() => {
        const fetchSummaries = async () => {
            try {
                const data = await getSummaries(departmentName, materialId);
                setSummaries(data);
            } catch (err) {
                setError('لا يوجد ملخصات ');
            } finally {
                setLoading(false);
            }
        };
        fetchSummaries();
    }, [departmentName, materialId]);

    return (
        <div className="p-4">
            <h3 className="text-xl font-bold mb-4">📚 ملخصات المادة</h3>
            <br></br>
            {/* زر إضافة ملخص جديد */}
            <button
                onClick={() => setShowAddForm(true)}
                className="add-summary-button"
            >
                 إضافة ملخص جديد
            </button>

            {/* نموذج إضافة ملخص */}
            {showAddForm && (
                <AddSummaryForm
                    departmentName={departmentName}
                    materialId={materialId}
                    onClose={() => setShowAddForm(false)}
                    onSuccess={(newSummary) => {
                        setSummaries([...summaries, newSummary]);
                        setShowAddForm(false);
                        onAddSuccess();
                    }}
                />
            )}

            {/* عرض الملخصات */}
            {loading ? (
                <p>⏳ جاري التحميل...</p>
            ) : error ? (
                <p className="text-red-500">❌ {error}</p>
            ) : summaries.length === 0 ? (
                <p>📭 لا يوجد ملخصات متاحة</p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {summaries.map((summary) => (
                        <SummaryCard
                            key={summary._id}
                            summary={summary}
                            onDelete={async () => {
                                try {
                                    await deleteSummary(departmentName, materialId, summary._id);
                                    setSummaries(summaries.filter(s => s._id !== summary._id));
                                } catch (err) {
                                    setError('حدث خطأ أثناء حذف الملخص');
                                }
                            }}
                            userRole={userRole} // تمرير دور المستخدم
                        />
                    ))}
                </div>
            )}
        </div>
    );
};
export default MaterialSummaries;
