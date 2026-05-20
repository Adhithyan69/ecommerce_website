import React, { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import useAuthStore from './store/useAuthStore';

// Layouts & Config
import Layout from './components/layout/Layout';
import ProtectedRoute from './routes/ProtectedRoute';

// Admin
import AdminLayout from './admin/layout/AdminLayout';
import AdminRoute from './admin/routes/AdminRoute';

// Seller
import SellerLayout from './seller/layout/SellerLayout';
import SellerRoute from './seller/routes/SellerRoute';

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
const ForgotPassword = lazy(() => import('./pages/auth/ForgotPassword'));

// Pages (Public/Guest)
const Checkout = lazy(() => import('./pages/Checkout'));
const Offers = lazy(() => import('./pages/Offers'));
const Wishlist = lazy(() => import('./pages/Wishlist'));
const Support = lazy(() => import('./pages/Support'));
const Notifications = lazy(() => import('./pages/Notifications'));

// User Pages (Protected)
const Dashboard = lazy(() => import('./pages/user/Dashboard'));
const Orders = lazy(() => import('./pages/user/Orders'));
const OrderDetails = lazy(() => import('./pages/user/OrderDetails'));
const Invoice = lazy(() => import('./pages/user/Invoice'));
const Inbox = lazy(() => import('./pages/user/Inbox'));
const Addresses = lazy(() => import('./pages/user/Addresses'));
const Complaints = lazy(() => import('./pages/user/Complaints'));

// Admin Pages (lazy-loaded for performance)
const AdminDashboard = lazy(() => import('./admin/pages/AdminDashboard'));
const AdminProducts = lazy(() => import('./admin/pages/AdminProducts'));
const AdminOrders = lazy(() => import('./admin/pages/AdminOrders'));
const AdminUsers = lazy(() => import('./admin/pages/AdminUsers'));
const AdminComplaints = lazy(() => import('./admin/pages/AdminComplaints'));
const AdminCoupons = lazy(() => import('./admin/pages/AdminCoupons'));
const AdminBanners = lazy(() => import('./admin/pages/AdminBanners'));
const AdminAnalytics = lazy(() => import('./admin/pages/AdminAnalytics'));
const AdminCategories = lazy(() => import('./admin/pages/AdminCategories'));
const AdminReviews = lazy(() => import('./admin/pages/AdminReviews'));
const AdminNotifications = lazy(() => import('./admin/pages/AdminNotifications'));
const AdminRoles = lazy(() => import('./admin/pages/AdminRoles'));
const AdminProductRequests = lazy(() => import('./admin/pages/AdminProductRequests'));

// Seller Pages (lazy-loaded)
const SellerDashboard = lazy(() => import('./seller/pages/SellerDashboard'));
const SellerProductSourcing = lazy(() => import('./seller/pages/SellerProductSourcing'));
const SellerMyProducts = lazy(() => import('./seller/pages/SellerMyProducts'));
const SellerProductForm = lazy(() => import('./seller/pages/SellerProductForm'));
const SellerOrders = lazy(() => import('./seller/pages/SellerOrders'));
const SellerEarnings = lazy(() => import('./seller/pages/SellerEarnings'));
const SellerPaymentHistory = lazy(() => import('./seller/pages/SellerPaymentHistory'));
const SellerReturns = lazy(() => import('./seller/pages/SellerReturns'));
const SellerStore = lazy(() => import('./seller/pages/SellerStore'));
const SellerNotifications = lazy(() => import('./seller/pages/SellerNotifications'));
const SellerSupport = lazy(() => import('./seller/pages/SellerSupport'));
const SellerReviews = lazy(() => import('./seller/pages/SellerReviews'));
const SellerMarketing = lazy(() => import('./seller/pages/SellerMarketing'));

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
          <Route path="auth/forgot-password" element={
            <AuthRouteRedirect><ForgotPassword /></AuthRouteRedirect>
          } />

          {/* Notifications (public) */}
          <Route path="notifications" element={<Notifications />} />
          
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
          <Route path="user/orders/:orderId" element={
            <ProtectedRoute><OrderDetails /></ProtectedRoute>
          } />
          <Route path="user/orders/:orderId/invoice" element={
            <ProtectedRoute><Invoice /></ProtectedRoute>
          } />
          <Route path="user/inbox" element={
            <ProtectedRoute><Inbox /></ProtectedRoute>
          } />
          <Route path="user/addresses" element={
            <ProtectedRoute><Addresses /></ProtectedRoute>
          } />
          <Route path="user/complaints" element={
            <ProtectedRoute><Complaints /></ProtectedRoute>
          } />
          
          {/* 404 Route */}
          <Route path="*" element={<NotFound />} />
        </Route>

        {/* ─── Admin Routes ───────────────────────────────────── */}
        <Route path="/admin" element={<AdminRoute><AdminLayout /></AdminRoute>}>
          <Route index element={<Suspense fallback={<div className="p-8 text-slate-400">Loading...</div>}><AdminDashboard /></Suspense>} />
          <Route path="products" element={<Suspense fallback={null}><AdminProducts /></Suspense>} />
          <Route path="orders" element={<Suspense fallback={null}><AdminOrders /></Suspense>} />
          <Route path="users" element={<Suspense fallback={null}><AdminUsers /></Suspense>} />
          <Route path="complaints" element={<Suspense fallback={null}><AdminComplaints /></Suspense>} />
          <Route path="coupons" element={<Suspense fallback={null}><AdminCoupons /></Suspense>} />
          <Route path="banners" element={<Suspense fallback={null}><AdminBanners /></Suspense>} />
          <Route path="analytics" element={<Suspense fallback={null}><AdminAnalytics /></Suspense>} />
          <Route path="categories" element={<Suspense fallback={null}><AdminCategories /></Suspense>} />
          <Route path="reviews" element={<Suspense fallback={null}><AdminReviews /></Suspense>} />
          <Route path="notifications" element={<Suspense fallback={null}><AdminNotifications /></Suspense>} />
          <Route path="roles" element={<Suspense fallback={null}><AdminRoles /></Suspense>} />
          <Route path="product-requests" element={<Suspense fallback={null}><AdminProductRequests /></Suspense>} />
        </Route>

        {/* ─── Seller Routes ───────────────────────────────────── */}
        <Route path="/seller" element={<SellerRoute><SellerLayout /></SellerRoute>}>
          <Route index element={<Suspense fallback={<div className="p-8 text-slate-400">Loading...</div>}><SellerDashboard /></Suspense>} />
          <Route path="sourcing" element={<Suspense fallback={null}><SellerProductSourcing /></Suspense>} />
          <Route path="products" element={<Suspense fallback={null}><SellerMyProducts /></Suspense>} />
          <Route path="products/new" element={<Suspense fallback={null}><SellerProductForm /></Suspense>} />
          <Route path="products/:id/edit" element={<Suspense fallback={null}><SellerProductForm /></Suspense>} />
          <Route path="orders" element={<Suspense fallback={null}><SellerOrders /></Suspense>} />
          <Route path="returns" element={<Suspense fallback={null}><SellerReturns /></Suspense>} />
          <Route path="earnings" element={<Suspense fallback={null}><SellerEarnings /></Suspense>} />
          <Route path="payments" element={<Suspense fallback={null}><SellerPaymentHistory /></Suspense>} />
          <Route path="store" element={<Suspense fallback={null}><SellerStore /></Suspense>} />
          <Route path="notifications" element={<Suspense fallback={null}><SellerNotifications /></Suspense>} />
          <Route path="support" element={<Suspense fallback={null}><SellerSupport /></Suspense>} />
          <Route path="reviews" element={<Suspense fallback={null}><SellerReviews /></Suspense>} />
          <Route path="marketing" element={<Suspense fallback={null}><SellerMarketing /></Suspense>} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
