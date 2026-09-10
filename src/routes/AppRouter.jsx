import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import AdminDashboard from '../pages/AdminDashboard';

export default function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<AdminDashboard />} />
      <Route path="/admin" element={<AdminDashboard />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
