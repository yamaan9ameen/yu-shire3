import React from 'react';
import { Container, Button } from 'react-bootstrap';
import { useLocation } from 'react-router-dom'; // استيراد useLocation
import '../css/header.css'; // ملف CSS خارجي لتخصيص الأنماط
// import HomePage from './HomePage';


const Header = () => {
    const location = useLocation(); // الحصول على مسار الصفحة الحالي

    // إظهار الهيدر فقط في الصفحة الرئيسية وصفحة الأقسام
    if (location.pathname !== '/tees' && location.pathname !== '/departments') {
        return null;
    }

    return (
        <div className={`header-container text-center py-5 ${location.pathname === "/departments" ? "departments-header" : ""}`}>
            <Container className="text-white">
                {/* تغيير محتوى الـ Header بناءً على المسار */}
                {location.pathname === "/departments" ? (
                    <>
                        <h1 className="display-4">أقسام كلية الشريعة</h1>
                        <p className="lead">اختر القسم المناسب لك من الأقسام التالية:</p>
                    </>
                ) : (
                    <>
                        <h1 className="display-4 header-title">مرحبًا بكم في كلية الشريعة!</h1>
                        <p className="lead header-subtitle">اكتشف الأقسام، المحاضرات، والملخصات بطريقة سهلة وبسيطة.</p>
                    </>
                )}
                
                {/* الزر يظهر فقط في الصفحة الرئيسية */}
                {location.pathname !== "/departments" && (
                    
                    <Button className="start-btn" href="/departments">ابدأ الآن</Button>
                )}
            </Container>
            <br></br>
        </div>
    );
};

export default Header;