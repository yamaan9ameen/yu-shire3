import React, { useState, useEffect } from 'react';
import { Navbar, Nav, Container, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import '../css/AppNavbar.css';

const AppNavbar = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userId, setUserId] = useState(null); // تخزين userId
    const navigate = useNavigate();

    // تحقق من حالة تسجيل الدخول عند تحميل المكون
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            setIsLoggedIn(true);
            const userData = JSON.parse(localStorage.getItem('userData')); // استخراج بيانات المستخدم
            if (userData && userData.userId) {
                setUserId(userData.userId); // تعيين userId
            } else {
                console.error("لم يتم العثور على userId في localStorage");
            }
        }
    }, []);

    // تسجيل الخروج
    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('userData'); // إزالة بيانات المستخدم
        localStorage.removeItem('role'); // إزالة دور المستخدم
        localStorage.removeItem('userId'); // إزالة دور المستخدم

        setIsLoggedIn(false);
        setUserId(null);
        navigate('/login');
    };

    // الانتقال إلى البروفايل الخاص بالمستخدم
    const handleProfileClick = () => {
        const userData = JSON.parse(localStorage.getItem('userData')); // استخراج بيانات المستخدم
        if (userData && userData.userId) {
            navigate(`/profile/${userData.userId}`); // الانتقال إلى البروفايل باستخدام userId
        } else {
            console.error("لم يتم العثور على userId في localStorage");
            alert("لم يتم العثور على بيانات المستخدم. يرجى تسجيل الدخول مرة أخرى.");
        }
    };

    return (
        <Navbar className="custom-navbar" expand="lg" sticky="top">
            <Container>
                <Navbar.Brand href="/" className="navbar-brand">كلية الشريعة</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="me-auto">
                        <Nav.Link href="/" className="nav-link">الرئيسية</Nav.Link>
                        <Nav.Link href="/departments" className="nav-link">الأقسام</Nav.Link>
                        <Nav.Link href="/news" className="nav-link">الأخبار</Nav.Link>
                        <Nav.Link href="/guide" className="nav-link">دليل الطلاب</Nav.Link>
                    </Nav>
                    <Nav>
                        {isLoggedIn ? (
                            <>
                                <Nav.Link onClick={handleProfileClick} className="nav-link">البروفايل</Nav.Link>
                                <Button variant="outline-light" onClick={handleLogout}>تسجيل الخروج</Button>
                            </>
                        ) : (
                            <Nav.Link href="/login" className="nav-link">تسجيل الدخول</Nav.Link>
                        )}
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
};

export default AppNavbar;