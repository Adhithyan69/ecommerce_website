import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import useAuthStore from '../../store/useAuthStore';

/**
 * SellerRoute — RBAC guard for all /seller/* routes.
 * Only users with role === 'seller' can access.
 */
const SellerRoute = ({ children }) => {
  const { isAuthenticated, user } = useAuthStore();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/auth/login" state={{ from: location }} replace />;
  }

  if (user?.role !== 'seller') {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default SellerRoute;
