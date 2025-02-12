import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import '../css/DepartmentsPage.css'; // ملف CSS خارجي لتنسيق الصفحة

const DepartmentsPage = () => {
    const [departments, setDepartments] = useState([]);

    useEffect(() => {
        axios.get('https://sharia-yu.onrender.com/departments')
            .then((response) => {
                setDepartments(response.data);
            })
            .catch((error) => {
                console.error("Error fetching departments:", error);
            });
    }, []);

    return (
        <Container className="departments-page">
            <h1 className="text-center">أقسام كلية الشريعة في جامعة اليرموك</h1>
            <Row>
                {departments.map((dept, index) => (
                    <Col md={4} key={index}>
                        <Card className="department-card">
                            <Card.Body>
                                <Card.Title>{dept.name}</Card.Title>
                                <Card.Text>{dept.description}</Card.Text>
                                <Button variant="primary" href={`/departments/${dept.name}`}>
                                    استكشف القسم
                                </Button>
                            </Card.Body>
                        </Card>
                    </Col>
                ))}
            </Row>
        </Container>
    );
};

export default DepartmentsPage;
