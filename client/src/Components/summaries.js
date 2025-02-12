// الرابط الأساسي للـ API
const API_BASE_URL = '/api/summaries';

/**
 * التحقق من صحة الاستجابة وإرجاع البيانات أو رمي خطأ
 * @param {Response} response - كائن الاستجابة من الخادم
 * @param {string} errorMessage - رسالة الخطأ الافتراضية
 */
const handleResponse = async (response, errorMessage) => {
    if (!response.ok) {
        try {
            const errorData = await response.json();
            throw new Error(errorData.message || `${errorMessage}: ${response.statusText}`);
        } catch (e) {
            throw new Error(`${errorMessage}: ${response.statusText}`);
        }
    }
    return response.json();
};

// جلب الملخصات
export const getSummaries = async (departmentName, materialId) => {
    try {
        console.log(`جاري جلب الملخصات للقسم: ${departmentName}, المادة: ${materialId}`);
        const response = await fetch(
            `${API_BASE_URL}/${departmentName}/materials/${materialId}/summaries`
        );
        return handleResponse(response, 'فشل في جلب الملخصات');
    } catch (error) {
        console.error('خطأ في جلب الملخصات:', error);
        throw error;
    }
};

// إضافة ملخص رابط
export const addSummaryLink = async (departmentName, materialId, data) => {
    try {
        console.log(`جاري إضافة رابط ملخص للقسم: ${departmentName}, المادة: ${materialId}`, data);
        const response = await fetch(
            `${API_BASE_URL}/${departmentName}/materials/${materialId}/summaries/link`,
            {
                method: 'POST',
headers: {
            "Content-Type": "multipart/form-data",
        },
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
 credentials: "include",
            }
        );
        return handleResponse(response, 'فشل في إضافة رابط الملخص');
    } catch (error) {
        console.error('خطأ في إضافة رابط الملخص:', error);
        throw error;
    }
};

// إضافة ملخص ملف
export const addSummaryFile = async (departmentName, materialId, formData) => {
    try {
        console.log(`جاري رفع ملف ملخص للقسم: ${departmentName}, المادة: ${materialId}`);
        const response = await fetch(
            `${API_BASE_URL}/${departmentName}/materials/${materialId}/summaries/file`,
            {
                method: 'POST',
                body: formData,
            },
 credentials: "include",
        );
        return handleResponse(response, 'فشل في رفع ملف الملخص');
    } catch (error) {
        console.error('خطأ في رفع ملف الملخص:', error);
        throw error;
    }
};

// حذف ملخص
export const deleteSummary = async (departmentName, materialId, summaryId) => {
    try {
        console.log(`جاري حذف الملخص: ${summaryId} من القسم: ${departmentName}, المادة: ${materialId}`);
        const response = await fetch(
            `${API_BASE_URL}/${departmentName}/materials/${materialId}/summaries/${summaryId}`,
            {
                method: 'DELETE',
            }
        );
        return handleResponse(response, 'فشل في حذف الملخص');
    } catch (error) {
        console.error('خطأ في حذف الملخص:', error);
        throw error;
    }
};
