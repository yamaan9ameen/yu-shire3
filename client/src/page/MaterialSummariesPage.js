import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import MaterialSummaries from './MaterialSummaries';
import '../css/MaterialSummariesPage.css'; // استيراد ملف الـ CSS

const MaterialSummariesPage = () => {
    const { department, category, materialId } = useParams();
    const navigate = useNavigate();

    return (
        <div className="material-summaries-page">
            <div className="header">
                <button
                    onClick={() => navigate(-1)} // العودة إلى الصفحة السابقة
                    className="back-button"
                >
                    العودة
                </button>
                <h1>ملخصات المادة</h1>
            </div>

            <div className="summaries-container">
                <MaterialSummaries
                    departmentName={department}
                    materialId={materialId}
                    onAddSuccess={() => {
                        // تحديث الصفحة دون إعادة تحميلها
                        navigate(`/departments/${department}/materials/${materialId}/api/summaries?add=true`, { replace: true });
                    }}
                />
            </div>
        </div>
    );
};

export default MaterialSummariesPage;