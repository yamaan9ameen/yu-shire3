const express = require('express');
const router = express.Router();
const Department = require('../models/Department'); // نموذج القسم

// البحث عن قسم معين
const findDepartmentByName = async (name) => {
    return await Department.findOne({ name }).exec();
};

// البحث عن مادة معينة داخل القسم
const findMaterialById = (department, materialId) => {
    return department.materials.id(materialId); // يعمل مع Subdocument Array
};

// عرض جميع المواد الخاصة بقسم معين
router.get('/:name/materials', async (req, res) => {
    try {
        const departmentName = req.params.name;

        // البحث عن القسم
        const department = await findDepartmentByName(departmentName);

        if (!department) {
            return res.status(404).json({ message: 'القسم غير موجود' });
        }

        res.json(department.materials); // إرجاع جميع المواد كـ JSON
    } catch (error) {
        console.error('Error fetching materials:', error);
        res.status(500).json({ message: 'حدث خطأ أثناء جلب المواد' });
    }
});
// router.get('/departments/:department/materials/:category/:materialId', async (req, res) => {

// عرض تفاصيل مادة معينة بناءً على `materialId`
router.get('/:name/materials/:materialId', async (req, res) => {
    try {
        const departmentName = req.params.name;
        const materialId = req.params.materialId;

        // البحث عن القسم
        const department = await findDepartmentByName(departmentName);

        if (!department) {
            return res.status(404).json({ message: 'القسم غير موجود' });
        }

        // البحث عن المادة
        const material = findMaterialById( materialId);

        if (!material) {
            return res.status(404).json({ message: 'المادة غير موجودة' });
        }

        res.json(material); // إرجاع تفاصيل المادة
    } catch (error) {
        console.error('Error fetching material details:', error);
        res.status(500).json({ message: 'حدث خطأ أثناء جلب تفاصيل المادة' });
    }
});

module.exports = router;
