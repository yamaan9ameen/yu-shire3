const express = require('express');
const router = express.Router();
const departments = require('../routes/departmentsData'); // استيراد بيانات الأقسام

// دالة مساعدة للبحث عن قسم معين
const findDepartmentByName = (name) => {
    return departments.find(dept => dept.name === name);
};

// الحصول على جميع الأقسام
router.get('/', (req, res) => {
    try {
        res.json(departments);
    } catch (error) {
        res.status(500).json({ message: "حدث خطأ أثناء جلب البيانات" });
    }
});

// الحصول على قسم معين
router.get('/:name', (req, res) => {
    try {
        const departmentName = req.params.name;
        const department = findDepartmentByName(departmentName);

        if (department) {
            res.json(department);
        } else {
            res.status(404).json({ message: "القسم غير موجود" });
        }
    } catch (error) {
        res.status(500).json({ message: "حدث خطأ أثناء جلب بيانات القسم" });
    }
});

// الحصول على مواد قسم معين
router.get('/:name/materials', async (req, res) => {
    try {
        const departmentName = req.params.name;
        const department = findDepartmentByName(departmentName);

        if (!department) {
            return res.status(404).json({ message: 'القسم غير موجود' });
        }

        res.json(department.materials);
    } catch (error) {
        console.error('Error fetching materials:', error);
        res.status(500).json({ message: 'حدث خطأ أثناء جلب المواد' });
    }
});

// الحصول على تفاصيل مادة معينة
router.get('/:name/materials/:materialId', async (req, res) => {
    try {
        const departmentName = req.params.name;
        const materialId = req.params.materialId;

        if (!departmentName || !materialId) {
            return res.status(400).json({ message: 'يجب تقديم اسم القسم ومعرف المادة' });
        }

        const department = findDepartmentByName(departmentName);

        if (!department) {
            return res.status(404).json({ message: 'القسم غير موجود' });
        }

        const material = department.materials.find((m) => m._id === materialId);

        if (!material) {
            return res.status(404).json({ message: 'المادة غير موجودة' });
        }

        res.json(material);
    } catch (error) {
        console.error('Error fetching material details:', error);
        res.status(500).json({ message: 'حدث خطأ أثناء جلب تفاصيل المادة' });
    }
});

module.exports = router;