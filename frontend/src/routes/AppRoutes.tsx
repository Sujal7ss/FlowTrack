import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from '../components/ProtectedRoute';
import Login from '../features/auth/Login';
import Dashboard from '../features/dashboard/Dashboard';
import TransactionsPage from '../features/transactions/TransactionsPage';
import ReceiptUpload from '../features/receipts/ReceiptUpload';

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/transactions"
        element={
          <ProtectedRoute>
            <TransactionsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/receipts"
        element={
          <ProtectedRoute>
            <ReceiptUpload />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
};

export default AppRoutes;