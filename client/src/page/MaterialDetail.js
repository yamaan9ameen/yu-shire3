import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Button, Spinner, Alert } from 'react-bootstrap';
import axios from 'axios';

const MaterialDetail = () => {
    const { name, materialId, category } = useParams(); // الحصول على name و materialId و category من الرابط
    const navigate = useNavigate();
    const [material, setMaterial] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchMaterial = async () => {
            try {
                const response = await axios.get(`https://sharia-yu.onrender.com/departments/${name}`);
                const department = response.data;
                const materials = department.materials[category];
                const selectedMaterial = materials[materialId];
                setMaterial(selectedMaterial);
            } catch (error) {
                setError('حدث خطأ أثناء جلب تفاصيل المادة');
                console.error('Error fetching material details:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchMaterial();
    }, [name, materialId, category]);

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

    return (
        <Container className="material-detail">
            <h1 className="text-center">تفاصيل المادة: {material.name}</h1>
            <p><strong>الوصف:</strong> {material.description}</p>
            <Button variant="secondary" onClick={() => navigate(-1)} className="mt-3">
                العودة
            </Button>
        </Container>
    );
};

export default MaterialDetail;
