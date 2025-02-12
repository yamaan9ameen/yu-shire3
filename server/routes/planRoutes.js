const express = require('express');
const router = express.Router();
const departmentsData = require('./departmentsData'); // جلب البيانات من الملف

// إنشاء خطة فصلية
router.post('/:name/plan', async (req, res) => {
    try {
        const { year, semester, hours, selectedMaterials } = req.body;
        const department = departmentsData.find(d => d.name === req.params.name);
        if (!department) {
            return res.status(404).json({ message: 'القسم غير موجود' });
        }

        // تصنيف المواد بناءً على السنة والفصل
        const materialsForYearAndSemester = department.materials.filter(material =>
            material.year === parseInt(year) && material.semester === parseInt(semester)
        );

        // تصنيف المواد بناءً على النوع
        const mandatoryDepartment = materialsForYearAndSemester.filter(m => m.type === 'mandatoryDepartment');
        const mandatoryUniversity = materialsForYearAndSemester.filter(m => m.type === 'mandatoryUniversity');
        const mandatoryCollege = materialsForYearAndSemester.filter(m => m.type === 'mandatoryCollege');
        const electiveDepartment = materialsForYearAndSemester.filter(m => m.type === 'electiveDepartment');
        const electiveUniversity = materialsForYearAndSemester.filter(m => m.type === 'electiveUniversity');

        // المواد المحددة من قبل المستخدم
        const userSelectedMaterials = department.materials.filter(material =>
            selectedMaterials.includes(material._id)
        );

        // حساب الساعات المتبقية بعد إضافة المواد المحددة
        const hoursPerCourse = 3; // افتراض أن كل مادة تحتاج 3 ساعات
        const remainingHours = hours - (userSelectedMaterials.length * hoursPerCourse);

        // إضافة مواد إجباري قسم تلقائيًا
        const suggestedPlan = [...userSelectedMaterials];
        if (remainingHours > 0) {
            suggestedPlan.push(...mandatoryDepartment.slice(0, Math.ceil(remainingHours / hoursPerCourse)));
        }

        // إذا لم تكفِ المواد، نضيف مواد من السنة التالية والفصل التالي
        if (suggestedPlan.length * hoursPerCourse < hours) {
            const nextYear = parseInt(year) + 1;
            const nextSemester = parseInt(semester) === 1 ? 2 : 1;
            const materialsForNextYearAndSemester = department.materials.filter(material =>
                material.year === nextYear && material.semester === nextSemester
            );

            const remainingMaterials = materialsForNextYearAndSemester.filter(material =>
                !suggestedPlan.some(m => m._id === material._id)
            );

            suggestedPlan.push(...remainingMaterials.slice(0, Math.ceil((hours - (suggestedPlan.length * hoursPerCourse)) / hoursPerCourse)));
        }

        res.json(suggestedPlan);
    } catch (error) {
        console.error('Error generating plan:', error);
        res.status(500).json({ message: 'حدث خطأ أثناء إنشاء الخطة' });
    }
});

module.exports = router;