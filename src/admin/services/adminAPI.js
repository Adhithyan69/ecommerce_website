/**
 * ================================================================
 * Admin API Service Layer
 * ================================================================
 * To connect to a real backend:
 *   1. Set REACT_APP_API_URL=https://your-api.com in .env
 *   2. All mock functions below will switch to real HTTP calls
 * ================================================================
 */

const API_URL = process.env.REACT_APP_API_URL || '';
const USE_MOCK = !API_URL;

const getAdminHeaders = () => {
  const storage = JSON.parse(localStorage.getItem('ag-auth-storage') || '{}');
  const token = storage?.state?.user?.token || '';
  return {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
    'X-Admin-Access': 'true',
  };
};

const req = async (path, opts = {}) => {
  const res = await fetch(`${API_URL}/admin${path}`, { headers: getAdminHeaders(), ...opts });
  if (!res.ok) { const e = await res.json().catch(() => ({ message: res.statusText })); throw new Error(e.message); }
  return res.json();
};

const delay = (ms = 500) => new Promise(r => setTimeout(r, ms));

// ─── Mock Data ────────────────────────────────────────────────────────────────

export const ADMIN_MOCK = {
  stats: {
    totalRevenue: 2847560,
    revenueGrowth: 18.4,
    totalOrders: 1284,
    ordersGrowth: 12.1,
    totalUsers: 8492,
    usersGrowth: 24.7,
    conversionRate: 3.8,
    conversionGrowth: 0.4,
    pendingOrders: 47,
    openTickets: 12,
    lowStockProducts: 8,
    todayRevenue: 84320,
  },

  revenueChart: [
    { month: 'Oct', revenue: 185000, orders: 89 },
    { month: 'Nov', revenue: 220000, orders: 112 },
    { month: 'Dec', revenue: 310000, orders: 158 },
    { month: 'Jan', revenue: 265000, orders: 134 },
    { month: 'Feb', revenue: 298000, orders: 151 },
    { month: 'Mar', revenue: 342000, orders: 178 },
  ],

  ordersByDay: [
    { day: 'Mon', orders: 42 }, { day: 'Tue', orders: 58 }, { day: 'Wed', orders: 35 },
    { day: 'Thu', orders: 67 }, { day: 'Fri', orders: 89 }, { day: 'Sat', orders: 112 },
    { day: 'Sun', orders: 76 },
  ],

  categoryRevenue: [
    { name: 'Electronics', value: 42, color: '#6366F1' },
    { name: 'Fashion', value: 28, color: '#8B5CF6' },
    { name: 'Home', value: 18, color: '#EC4899' },
    { name: 'Beauty', value: 8, color: '#F59E0B' },
    { name: 'Sports', value: 4, color: '#10B981' },
  ],

  products: [
    { id: 'p1', name: 'Sony WH-1000XM5 Headphones', category: 'Electronics', price: 29999, stock: 45, sold: 234, status: 'active', image: 'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?auto=format&fit=crop&q=80&w=100', rating: 4.8 },
    { id: 'p2', name: 'Artisan Ceramic Mug Set', category: 'Home', price: 2499, stock: 120, sold: 89, status: 'active', image: 'https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?auto=format&fit=crop&q=80&w=100', rating: 4.9 },
    { id: 'p3', name: 'Ergonomic Office Chair', category: 'Home', price: 18999, stock: 3, sold: 312, status: 'low_stock', image: 'https://images.unsplash.com/photo-1505843490538-5133c6c7d0e1?auto=format&fit=crop&q=80&w=100', rating: 4.5 },
    { id: 'p4', name: 'Smart LED Light Strip 10M', category: 'Electronics', price: 1999, stock: 0, sold: 4056, status: 'out_of_stock', image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=100', rating: 4.3 },
    { id: 'p5', name: 'Premium Leather Wallet', category: 'Fashion', price: 2999, stock: 78, sold: 623, status: 'active', image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&q=80&w=100', rating: 4.7 },
    { id: 'p6', name: 'Apple AirPods Pro 2nd Gen', category: 'Electronics', price: 24999, stock: 22, sold: 891, status: 'active', image: 'https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46?auto=format&fit=crop&q=80&w=100', rating: 4.9 },
  ],

  orders: [
    { id: 'AG-8832', customer: 'Rahul Sharma', email: 'rahul@example.com', date: '2026-03-21', total: 54998, status: 'Delivered', items: 2, payment: 'UPI' },
    { id: 'AG-8831', customer: 'Priya Mehta', email: 'priya@example.com', date: '2026-03-21', total: 29999, status: 'Shipped', items: 1, payment: 'Credit Card' },
    { id: 'AG-8830', customer: 'Arjun Kumar', email: 'arjun@example.com', date: '2026-03-20', total: 4498, status: 'Processing', items: 3, payment: 'Net Banking' },
    { id: 'AG-8829', customer: 'Sneha Patel', email: 'sneha@example.com', date: '2026-03-20', total: 18999, status: 'Delivered', items: 1, payment: 'UPI' },
    { id: 'AG-8828', customer: 'Vikram Singh', email: 'vikram@example.com', date: '2026-03-19', total: 27998, status: 'Cancelled', items: 2, payment: 'Wallet' },
    { id: 'AG-8827', customer: 'Anita Desai', email: 'anita@example.com', date: '2026-03-19', total: 2499, status: 'Processing', items: 1, payment: 'COD' },
    { id: 'AG-8826', customer: 'Rohit Verma', email: 'rohit@example.com', date: '2026-03-18', total: 49998, status: 'Shipped', items: 3, payment: 'Credit Card' },
  ],

  users: [
    { id: 'u1', name: 'Rahul Sharma', email: 'rahul@example.com', phone: '+91 98765 43210', joined: '2026-01-15', orders: 12, spent: 84320, status: 'active', role: 'user' },
    { id: 'u2', name: 'Priya Mehta', email: 'priya@example.com', phone: '+91 87654 32109', joined: '2026-02-08', orders: 5, spent: 32000, status: 'active', role: 'user' },
    { id: 'u3', name: 'Arjun Kumar', email: 'arjun@example.com', phone: '+91 76543 21098', joined: '2025-11-22', orders: 28, spent: 215000, status: 'active', role: 'user' },
    { id: 'u4', name: 'Sneha Patel', email: 'sneha@example.com', phone: '+91 65432 10987', joined: '2026-03-01', orders: 2, spent: 21498, status: 'blocked', role: 'user' },
    { id: 'u5', name: 'Admin User', email: 'admin@test.com', phone: '+91 99999 00000', joined: '2025-10-01', orders: 0, spent: 0, status: 'active', role: 'admin' },
  ],

  complaints: [
    { id: 'TIC-1001', user: 'Rahul Sharma', email: 'rahul@example.com', subject: 'Wrong item delivered', type: 'Order Issue', orderId: 'AG-8820', status: 'Open', priority: 'High', date: '2026-03-20', messages: [ { from: 'user', text: 'I received the wrong product. Please resolve this urgently.', time: '2:30 PM' } ] },
    { id: 'TIC-1002', user: 'Priya Mehta', email: 'priya@example.com', subject: 'Refund not received', type: 'Refund', orderId: 'AG-8815', status: 'In Progress', priority: 'High', date: '2026-03-19', messages: [ { from: 'user', text: 'My refund was initiated 10 days ago but I haven\'t received it.', time: '10:15 AM' }, { from: 'admin', text: 'We\'re checking with the payment team. Will update you in 24 hours.', time: '11:00 AM' } ] },
    { id: 'TIC-1003', user: 'Arjun Kumar', email: 'arjun@example.com', subject: 'Product quality issue', type: 'Product', orderId: 'AG-8810', status: 'Resolved', priority: 'Low', date: '2026-03-15', messages: [ { from: 'user', text: 'The quality is poor compared to images.', time: '3:00 PM' }, { from: 'admin', text: 'We apologize! A replacement has been shipped.', time: '4:30 PM' } ] },
  ],

  coupons: [
    { id: 'c1', code: 'SAVE20', type: 'percent', value: 20, minOrder: 500, maxUses: 1000, used: 342, expiry: '2026-06-30', status: 'active', categories: 'All' },
    { id: 'c2', code: 'FIRST50', type: 'flat', value: 50, minOrder: 299, maxUses: 500, used: 491, expiry: '2026-04-30', status: 'active', categories: 'All' },
    { id: 'c3', code: 'AG100', type: 'flat', value: 100, minOrder: 999, maxUses: 200, used: 200, expiry: '2026-03-01', status: 'expired', categories: 'Electronics' },
    { id: 'c4', code: 'TECH15', type: 'percent', value: 15, minOrder: 2000, maxUses: 300, used: 89, expiry: '2026-05-31', status: 'active', categories: 'Electronics' },
  ],

  banners: [
    { id: 'b1', title: 'Spring Sale 2026', subtitle: 'Up to 50% off', image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&q=80&w=800', link: '/offers', order: 1, status: 'active' },
    { id: 'b2', title: 'New Electronics Arrivals', subtitle: 'Latest Tech', image: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?auto=format&fit=crop&q=80&w=800', link: '/category/electronics', order: 2, status: 'active' },
    { id: 'b3', title: 'Fashion Forward', subtitle: 'New Season Drops', image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&q=80&w=800', link: '/category/fashion', order: 3, status: 'draft' },
  ],

  categories: [
    { id: 'cat1', name: 'Electronics', slug: 'electronics', icon: '⚡', products: 120, status: 'active' },
    { id: 'cat2', name: 'Fashion', slug: 'fashion', icon: '👗', products: 340, status: 'active' },
    { id: 'cat3', name: 'Home & Living', slug: 'home', icon: '🏠', products: 210, status: 'active' },
    { id: 'cat4', name: 'Beauty', slug: 'beauty', icon: '✨', products: 90, status: 'active' },
    { id: 'cat5', name: 'Sports', slug: 'sports', icon: '🏃', products: 80, status: 'active' },
  ],

  reviews: [
    { id: 'r1', user: 'Rahul S.', product: 'Sony WH-1000XM5', rating: 5, review: 'Amazing sound quality! Best headphones I\'ve ever owned. Highly recommend.', date: '2026-03-20', status: 'pending' },
    { id: 'r2', user: 'Priya M.', product: 'Artisan Mug Set', rating: 4, review: 'Beautiful mugs, great quality. Packaging could be better though.', date: '2026-03-19', status: 'pending' },
    { id: 'r3', user: 'Anonymous', product: 'LED Light Strip', rating: 1, review: 'Buy on Amazon instead. Fake product. Zero stars.', date: '2026-03-18', status: 'flagged' },
  ],

  roles: [
    { id: 'role1', name: 'Super Admin', slug: 'superadmin', users: 1, permissions: ['all'] },
    { id: 'role2', name: 'Admin', slug: 'admin', users: 3, permissions: ['products', 'orders', 'users', 'complaints', 'coupons', 'banners', 'categories', 'reviews'] },
    { id: 'role3', name: 'Support Agent', slug: 'support', users: 5, permissions: ['complaints', 'orders:view', 'users:view'] },
    { id: 'role4', name: 'Marketing', slug: 'marketing', users: 2, permissions: ['coupons', 'banners', 'notifications', 'analytics:view'] },
  ],
};

// ─── Admin API Functions ──────────────────────────────────────────────────────

export const adminProductsAPI = {
  getAll: async () => USE_MOCK ? (await delay(400), { products: ADMIN_MOCK.products }) : req('/products'),
  create: async (data) => USE_MOCK ? (await delay(800), { id: `p${Date.now()}`, ...data, status: 'active', sold: 0 }) : req('/products', { method: 'POST', body: JSON.stringify(data) }),
  update: async (id, data) => USE_MOCK ? (await delay(600), { id, ...data }) : req(`/products/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: async (id) => USE_MOCK ? (await delay(500), { success: true }) : req(`/products/${id}`, { method: 'DELETE' }),
  toggleStatus: async (id, status) => USE_MOCK ? (await delay(300), { id, status }) : req(`/products/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status }) }),
};

export const adminOrdersAPI = {
  getAll: async (filters = {}) => USE_MOCK ? (await delay(400), { orders: ADMIN_MOCK.orders }) : req(`/orders?${new URLSearchParams(filters)}`),
  updateStatus: async (id, status) => USE_MOCK ? (await delay(600), { id, status }) : req(`/orders/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status }) }),
  getById: async (id) => USE_MOCK ? (await delay(300), ADMIN_MOCK.orders.find(o => o.id === id)) : req(`/orders/${id}`),
};

export const adminUsersAPI = {
  getAll: async () => USE_MOCK ? (await delay(400), { users: ADMIN_MOCK.users }) : req('/users'),
  toggleBlock: async (id, blocked) => USE_MOCK ? (await delay(500), { id, status: blocked ? 'blocked' : 'active' }) : req(`/users/${id}/block`, { method: 'PATCH', body: JSON.stringify({ blocked }) }),
  updateRole: async (id, role) => USE_MOCK ? (await delay(500), { id, role }) : req(`/users/${id}/role`, { method: 'PATCH', body: JSON.stringify({ role }) }),
};

export const adminComplaintsAPI = {
  getAll: async () => USE_MOCK ? (await delay(400), { tickets: ADMIN_MOCK.complaints }) : req('/complaints'),
  reply: async (id, message) => USE_MOCK ? (await delay(600), { success: true, message }) : req(`/complaints/${id}/reply`, { method: 'POST', body: JSON.stringify({ message }) }),
  updateStatus: async (id, status) => USE_MOCK ? (await delay(400), { id, status }) : req(`/complaints/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status }) }),
};

export const adminCouponsAPI = {
  getAll: async () => USE_MOCK ? (await delay(300), { coupons: ADMIN_MOCK.coupons }) : req('/coupons'),
  create: async (data) => USE_MOCK ? (await delay(700), { id: `c${Date.now()}`, ...data, used: 0, status: 'active' }) : req('/coupons', { method: 'POST', body: JSON.stringify(data) }),
  delete: async (id) => USE_MOCK ? (await delay(500), { success: true }) : req(`/coupons/${id}`, { method: 'DELETE' }),
  toggleStatus: async (id, status) => USE_MOCK ? (await delay(300), { id, status }) : req(`/coupons/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status }) }),
};

export const adminBannersAPI = {
  getAll: async () => USE_MOCK ? (await delay(300), { banners: ADMIN_MOCK.banners }) : req('/banners'),
  create: async (data) => USE_MOCK ? (await delay(600), { id: `b${Date.now()}`, ...data }) : req('/banners', { method: 'POST', body: JSON.stringify(data) }),
  update: async (id, data) => USE_MOCK ? (await delay(500), { id, ...data }) : req(`/banners/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: async (id) => USE_MOCK ? (await delay(400), { success: true }) : req(`/banners/${id}`, { method: 'DELETE' }),
};

export const adminAnalyticsAPI = {
  getStats: async () => USE_MOCK ? (await delay(500), ADMIN_MOCK.stats) : req('/analytics/stats'),
  getRevenueChart: async () => USE_MOCK ? (await delay(400), ADMIN_MOCK.revenueChart) : req('/analytics/revenue'),
  getOrdersByDay: async () => USE_MOCK ? (await delay(300), ADMIN_MOCK.ordersByDay) : req('/analytics/orders-by-day'),
  getCategoryRevenue: async () => USE_MOCK ? (await delay(300), ADMIN_MOCK.categoryRevenue) : req('/analytics/categories'),
};

export const adminReviewsAPI = {
  getAll: async () => USE_MOCK ? (await delay(400), { reviews: ADMIN_MOCK.reviews }) : req('/reviews/pending'),
  approve: async (id) => USE_MOCK ? (await delay(400), { id, status: 'approved' }) : req(`/reviews/${id}/approve`, { method: 'POST' }),
  reject: async (id) => USE_MOCK ? (await delay(400), { id, status: 'rejected' }) : req(`/reviews/${id}/reject`, { method: 'POST' }),
};

export const adminCategoriesAPI = {
  getAll: async () => USE_MOCK ? (await delay(300), { categories: ADMIN_MOCK.categories }) : req('/categories'),
  create: async (data) => USE_MOCK ? (await delay(600), { id: `cat${Date.now()}`, ...data, products: 0 }) : req('/categories', { method: 'POST', body: JSON.stringify(data) }),
  update: async (id, data) => USE_MOCK ? (await delay(500), { id, ...data }) : req(`/categories/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: async (id) => USE_MOCK ? (await delay(400), { success: true }) : req(`/categories/${id}`, { method: 'DELETE' }),
};

export const adminRolesAPI = {
  getAll: async () => USE_MOCK ? (await delay(300), { roles: ADMIN_MOCK.roles }) : req('/roles'),
  inviteAdmin: async (email, role) => USE_MOCK ? (await delay(800), { success: true, message: `Invitation sent to ${email}` }) : req('/roles/invite', { method: 'POST', body: JSON.stringify({ email, role }) }),
};

export const adminNotificationsAPI = {
  broadcast: async (data) => USE_MOCK ? (await delay(1000), { success: true, recipients: 8492 }) : req('/notifications/broadcast', { method: 'POST', body: JSON.stringify(data) }),
  getHistory: async () => USE_MOCK ? (await delay(400), { notifications: [] }) : req('/notifications/history'),
};
