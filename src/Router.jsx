// src/Router.jsx
import { Routes, Route } from 'react-router-dom';

import Home from './pages/Home';
import Register from './pages/Register';
import Login from './pages/Login';
import VerifyEmail from './pages/VerifyEmail';
import RequestResetPassword from './pages/RequestResetPassword';
import ResetPassword from './pages/ResetPassword';
import Dashboard from './pages/Profile';
import OtpVerification from './pages/OtpVerification';
import Snake from './pages/Snake';

function AppRouter() {
  return (
    <Routes>
      <Route path="/home" element={<Home />} />
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/verify-email" element={<VerifyEmail />} />
      <Route path="/request-reset-password" element={<RequestResetPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/otp-verification" element={<OtpVerification />} />
      <Route path="/snake" element={<Snake />} />
    </Routes>
  );
}

export default AppRouter;
