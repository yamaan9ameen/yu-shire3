import React from 'react';
import Header from './Header';
import AppNavbar from './Navbar';
import Footer from './Footer';
import '../css/MainPage.css'; // لتنسيق الصفحة الرئيسية

const MainPage = () => {
    return (
        <div className="main-page">
            <AppNavbar />
            <Header />
            <Footer />
            </div>
       
    );
};

export default MainPage;
