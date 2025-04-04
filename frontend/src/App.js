import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import LoginPage from './pages/LoginPage';
import TransactionsPage from './pages/TransactionsPage';
import AdminPage from './pages/AdminPage';
import PrivateRoute from './components/PrivateRoute';
import AuthProvider from './context/AuthContext';

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/" element={<LoginPage />} />
            <Route path="/transactions" element={
              <PrivateRoute>
                <TransactionsPage />
              </PrivateRoute>
            } />
            <Route path="/admin" element={
              <PrivateRoute adminOnly>
                <AdminPage />
              </PrivateRoute>
            } />
          </Routes>
        </Router>
        <ToastContainer position="bottom-right" autoClose={3000} />
      </AuthProvider>
    </div>
  );
}

export default App;