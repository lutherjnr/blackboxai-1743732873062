import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const PrivateRoute = ({ children, adminOnly = false }) => {
  const { user } = useContext(AuthContext);

  if (!user) {
    return <Navigate to="/" replace />;
  }

  if (adminOnly && user.role !== 'ADMIN') {
    return <Navigate to="/transactions" replace />;
  }

  return children;
};

export default PrivateRoute;