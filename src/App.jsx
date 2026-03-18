import React, { lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import useAuthStore from './store/useAuthStore';

// Layouts & Config
import Layout from './components/layout/Layout';
import ProtectedRoute from './routes/ProtectedRoute';

// Keep Home static for fast LCP
import Home from './pages/Home';

// Lazy loaded pages to reduce initial bundle size
const Category = lazy(() => import('./pages/Category'));
const ProductDetails = lazy(() => import('./pages/ProductDetails'));
const Cart = lazy(() => import('./pages/Cart'));
const NotFound = lazy(() => import('./pages/NotFound'));

// Auth Pages
const Login = lazy(() => import('./pages/auth/Login'));
const Signup = lazy(() => import('./pages/auth/Signup'));

// Pages (Public/Guest)
const Checkout = lazy(() => import('./pages/Checkout'));
const Offers = lazy(() => import('./pages/Offers'));
const Wishlist = lazy(() => import('./pages/Wishlist'));
const Support = lazy(() => import('./pages/Support'));

// User Pages (Protected)
const Dashboard = lazy(() => import('./pages/user/Dashboard'));
const Orders = lazy(() => import('./pages/user/Orders'));
const Inbox = lazy(() => import('./pages/user/Inbox'));

// Component to protect Auth routes (e.g. dont show login if already logged in)
const AuthRouteRedirect = ({ children }) => {
  const { isAuthenticated } = useAuthStore();
  if (isAuthenticated) {
    return <Navigate to="/user/dashboard" replace />;
  }
  return children;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          {/* Main Public Routes */}
          <Route index element={<Home />} />
          <Route path="category/:categoryId" element={<Category />} />
          <Route path="product/:productId" element={<ProductDetails />} />
          <Route path="cart" element={<Cart />} />
          <Route path="wishlist" element={<Wishlist />} />
          <Route path="offers" element={<Offers />} />
          <Route path="support" element={<Support />} />
          
          {/* Auth Routes */}
          <Route path="auth/login" element={
            <AuthRouteRedirect><Login /></AuthRouteRedirect>
          } />
          <Route path="auth/signup" element={
            <AuthRouteRedirect><Signup /></AuthRouteRedirect>
          } />
          
          {/* Protected Routes */}
          <Route path="checkout" element={
            <ProtectedRoute><Checkout /></ProtectedRoute>
          } />
          <Route path="user/dashboard" element={
            <ProtectedRoute><Dashboard /></ProtectedRoute>
          } />
          <Route path="user/orders" element={
            <ProtectedRoute><Orders /></ProtectedRoute>
          } />
          <Route path="user/inbox" element={
            <ProtectedRoute><Inbox /></ProtectedRoute>
          } />
          
          {/* 404 Route */}
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
