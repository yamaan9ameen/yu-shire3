import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Form, ListGroup, Button, Accordion, Spinner, Alert } from 'react-bootstrap';
import axios from 'axios';
import '../css/MaterialsPage.css';

const MaterialsPage = () => {
    const { name } = useParams(); // الحصول على اسم القسم من الرابط
    const navigate = useNavigate();
    const [department, setDepartment] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchDepartment = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/departments/${name}`);
                setDepartment(response.data);
            } catch (error) {
                setError('حدث خطأ أثناء جلب بيانات القسم');
                console.error('Error fetching department details:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchDepartment();
    }, [name]);

    const handleMaterialClick = (materialId, category) => {
        navigate(`/departments/${name}/materials/${category}/${materialId}`);
    };

    const filterMaterials = (materials, type) => {
        if (!materials) return []; // إذا كانت المواد غير معرَّفة، نرجع مصفوفة فارغة
        return materials.filter((material) =>
            material.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
            material.type === type
        );
    };

    const renderMaterialList = (materials, type) => {
        if (!materials) return null; // إذا كانت المواد غير معرَّفة، لا نعرض شيئًا
        const filteredMaterials = filterMaterials(materials, type);
        if (filteredMaterials.length === 0) {
            return <p>لا توجد مواد في هذا القسم.</p>;
        }
        return (
            <ListGroup>
                {filteredMaterials.map((material, index) => (
                    <ListGroup.Item
                        key={index}
                        action
                        onClick={() => handleMaterialClick(material._id, type)}
                    >
                        <strong>{material.name}</strong>: {material.description}
                    </ListGroup.Item>
                ))}
            </ListGroup>
        );
    };

    if (loading) {
        return (
            <Container className="text-center mt-5">
                <Spinner animation="border" role="status">
                    <span className="visually-hidden">جاري التحميل...</span>
                </Spinner>
            </Container>
        );
    }

    if (error) {
        return (
            <Container className="mt-5">
                <Alert variant="danger">{error}</Alert>
            </Container>
        );
    }

    if (!department) {
        return (
            <Container className="mt-5">
                <Alert variant="warning">القسم غير موجود.</Alert>
            </Container>
        );
    }

    return (
        <Container className="materials-page">
            <h1 className="text-center">مواد التخصص: {department.name}</h1>

            {/* حقل البحث */}
            <Form.Control
                type="text"
                placeholder="ابحث عن مادة..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="mb-3"
            />

            {/* قائمة المواد باستخدام Accordion */}
            <Accordion defaultActiveKey="0" className="w-100">
                {/* مواد إجبارية جامعة */}
                <Accordion.Item eventKey="1">
                    <Accordion.Header>مواد إجبارية جامعة</Accordion.Header>
                    <Accordion.Body>
                        {renderMaterialList(department.materials, 'mandatoryUniversity')}
                    </Accordion.Body>
                </Accordion.Item>

                {/* مواد إجبارية قسم */}
                <Accordion.Item eventKey="2">
                    <Accordion.Header>مواد إجبارية قسم</Accordion.Header>
                    <Accordion.Body>
                        {renderMaterialList(department.materials, 'mandatoryDepartment')}
                    </Accordion.Body>
                </Accordion.Item>

                {/* مواد إجبارية كلية */}
                <Accordion.Item eventKey="3">
                    <Accordion.Header>مواد إجبارية كلية</Accordion.Header>
                    <Accordion.Body>
                        {renderMaterialList(department.materials, 'mandatoryCollege')}
                    </Accordion.Body>
                </Accordion.Item>

                {/* مواد اختيارية جامعة */}
                <Accordion.Item eventKey="4">
                    <Accordion.Header>مواد اختيارية جامعة</Accordion.Header>
                    <Accordion.Body>
                        {renderMaterialList(department.materials, 'electiveUniversity')}
                    </Accordion.Body>
                </Accordion.Item>

                {/* مواد اختيارية كلية/قسم */}
                <Accordion.Item eventKey="5">
                    <Accordion.Header>مواد اختيارية كلية/قسم</Accordion.Header>
                    <Accordion.Body>
                        {renderMaterialList(department.materials, 'electiveDepartment')}
                    </Accordion.Body>
                </Accordion.Item>
            </Accordion>

            {/* زر العودة */}
            <Button variant="secondary" onClick={() => navigate(-1)} className="mt-3">
                العودة
            </Button>
        </Container>
    );
};

export default MaterialsPage;