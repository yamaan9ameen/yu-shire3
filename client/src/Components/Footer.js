import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import '../css/Footer.css'; // ملف CSS خارجي

const Footer = () => {
    return (
        <footer className="custom-footer py-3">
            <Container>
                <Row>
                    <Col md={4}>
                        <h5 className="footer-title">روابط سريعة</h5>
                        <ul className="list-unstyled">
                            <li><a href="/guide" className="footer-link">دليل الطلاب</a></li>
                            <li><a href="/faq" className="footer-link">الأسئلة الشائعة</a></li>
                            <li><a href="/privacy" className="footer-link">سياسة الخصوصية</a></li>
                        </ul>
                    </Col>
                    <Col md={4}>
                        <h5 className="footer-title">معلومات الاتصال</h5>
                        <p>بريد إلكتروني: collegeofsharia2@gmail.com</p>
                        <p>هاتف: مافي داعي</p>
                    </Col>
                    <Col md={4}>
                        <h5 className="footer-title">تابعنا</h5>
                        <a href="https://www.facebook.com/sultanameenn/" className="footer-social-icon me-2">فيسبوك</a>
                        <a href="https://www.instagram.com/system9_s/" className="footer-social-icon">إنستغرام</a>
                    </Col>
                </Row>
                <hr />
                <p className="text-center footer-copy">&copy; جميع الحقوق محفوظة 2025 طالب يمان القرعان - بأشرف الدكتورة أسيل شديفات </p>
            </Container>
        </footer>
    );
};

export default Footer;
