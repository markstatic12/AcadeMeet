import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from '../pages/Login/LoginPage';
import SignUpPage from '../pages/SignUp/SignUpPage';

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        {/* Add other routes for dashboard, notes, etc. here later */}
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;