import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AppNavbar from "./Components/Navbar";
import Header from "./Components/Header";
import Footer from "./Components/Footer";
import HomePage from "./Components/HomePage";
import DepartmentsPage from "./page/DepartmentsPage";
import LoginPage from "./page/Login";
import RegisterPage from "./page/Register";
import DepartmentDetail from "./page/DepartmentDetail";
import ProfilePage from "./page/Profile";
import VerifyEmail from "./page/VerifyEmail";
import MaterialsPage from "./page/MaterialsPage";
import PlanPage from "./page/PlanPage";
import MaterialDetailsPage from "./page/MaterialDetailsPage";
import MaterialSummariesPage from "./page/MaterialSummariesPage";
import UpdateRolePage from "./page/UpdateRolePage";
import AddExamPage from "./page/AddExamPage";
import ExamsListPage from "./page/ExamsListPage";
import TakeExamPage from "./page/TakeExamPage";
import Guide from "./page/Guide";
import Privacy from "./page/Privacy";
import Faq from './page/FAQ';
import ForgotPassword from './page/ForgotPassword';
import ResetPassword from './page/ResetPassword';
import NewsPage from './page/NewsPage';
import NewsDetails from './page/NewsDetailsPage';  {/* إضافة المسار الخاص بتفاصيل الخبر */}

const App = () => {
  return (
    <Router>
      <AppNavbar />
      <Header />
      <Routes>
        {/** مسار الصفحة الرئسية - مسار صفحة بروفايل وتحقق */}
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/profile/:userId" element={<ProfilePage />} />
        <Route path="/verify-email" element={<VerifyEmail />} />
        <Route path="/update-role" element={<UpdateRolePage />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        {/** مسار الاقسام - وملخصات - والمواد */}
        <Route path="/departments" element={<DepartmentsPage />} />
        <Route path="/departments/:name" element={<DepartmentDetail />} />
        <Route path="/departments/:name/materials" element={<MaterialsPage />} />
        <Route path="/departments/:name/plan" element={<PlanPage />} />
        <Route
          path="/departments/:department/materials/:category/:materialId"
          element={<MaterialDetailsPage />}
        />
        <Route
          path="/departments/:department/materials/:materialId/api/summaries"
          element={<MaterialSummariesPage />}
        />

        {/** مسارات الأخبار */}
        <Route path="/news" element={<NewsPage />} />
        <Route path="/news/:id" element={<NewsDetails />} /> {/* إضافة مسار تفاصيل الخبر */}

        {/** المسار الفوتر */}
        <Route path="/guide" element={<Guide />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/faq" element={<Faq />} />

        {/* مسار إضافة الامتحان */}
        <Route
          path="/departments/:department/materials/:materialId/add-exam"
          element={<AddExamPage />}
        />
        <Route
          path="/departments/:department/materials/:materialId/exams"
          element={<ExamsListPage />}
        />
        <Route
          path="/departments/:department/materials/:materialId/exams/:examId"
          element={<TakeExamPage />}
        />
      </Routes>
      <Footer />
    </Router>
  );
};

export default App;
