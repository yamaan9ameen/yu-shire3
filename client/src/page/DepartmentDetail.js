import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Card, Button, Spinner } from 'react-bootstrap';
import axios from 'axios';
import '../css/DepartmentDetail.css';

const DepartmentDetail = () => {
    const { name } = useParams();
    const navigate = useNavigate();
    const [department, setDepartment] = React.useState(null);

    React.useEffect(() => {
        axios.get(`https://sharia-yu.onrender.com/departments/${name}`)
            .then((response) => {
                setDepartment(response.data);
            })
            .catch((error) => {
                console.error("Error fetching department details:", error);
            });
    }, [name]);

    if (!department) {
        return (
            <Container className="text-center mt-5">
                <Spinner animation="border" role="status">
                    <span className="visually-hidden">جاري التحميل...</span>
                </Spinner>
            </Container>
        );
    }

    return (
        <Container className="department-detail">
            <h1 className="text-center">{department?.name || "القسم غير متوفر"}</h1>
            <Card>
                <Card.Body>
                    <Card.Text>{department?.description || "لا يوجد وصف متاح."}</Card.Text>
                    <Card.Text>{department?.intro || "لا يوجد مقدمة متاحة."}</Card.Text>
                </Card.Body>
            </Card>
            {/* الأزرار تحت المعلومات */}
            <div className="buttons-container">
                <Button
                    variant="primary"
                    onClick={() => navigate(`/departments/${name}/materials`)}
                    className="m-2"
                >
                    عرض المواد
                </Button>
                <Button
                    variant="success"
                    onClick={() => navigate(`/departments/${name}/plan`)}
                    className="m-2"
                >
                    الخطة الفصلية
                </Button>
            </div>
        </Container>
    );
};

export default DepartmentDetail;
