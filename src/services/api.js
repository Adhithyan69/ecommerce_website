/**
 * ================================================================
 * Anti-Gravity E-Commerce — API Service Layer
 * ================================================================
 * This file is backend-ready. To connect to a real API:
 *   1. Set REACT_APP_API_URL=https://your-api.com in .env
 *   2. Replace mock data returns with real fetch/axios calls
 *   3. Update auth functions to call your auth backend/Firebase
 * ================================================================
 */

const API_URL = process.env.REACT_APP_API_URL || '';
const USE_MOCK = !API_URL; // auto-switch to mock when no API URL set

// ─── HTTP Helper ─────────────────────────────────────────────────
const getAuthHeaders = () => {
  const storage = JSON.parse(localStorage.getItem('ag-auth-storage') || '{}');
  const token = storage?.state?.user?.token || '';
  return {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};

const request = async (path, options = {}) => {
  const res = await fetch(`${API_URL}${path}`, {
    headers: getAuthHeaders(),
    ...options,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: res.statusText }));
    throw new Error(err.message || 'Request failed');
  }
  return res.json();
};

// ─── Mock Data ───────────────────────────────────────────────────
export const MOCK_PRODUCTS = [
  { id: 'p1', title: 'Sony WH-1000XM5 Noise Canceling Headphones', price: 29999, originalPrice: 39999, image: 'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?auto=format&fit=crop&q=80&w=400', rating: 4.8, reviews: 1245, stock: 5, isNew: true, brand: 'Sony', category: 'electronics', description: 'Industry-leading noise cancelation with Dual Noise Sensor technology. Up to 30-hour battery life with quick charge.' },
  { id: 'p2', title: 'Minimalist Artisan Ceramic Coffee Mug Set of 4', price: 2499, image: 'https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?auto=format&fit=crop&q=80&w=400', rating: 4.9, reviews: 89, stock: 24, isNew: false, brand: 'Artisan', category: 'home', description: 'Handcrafted ceramic mugs with matte finish. Dishwasher safe, microwave safe.' },
  { id: 'p3', title: 'Ergonomic Mesh Office Chair with Lumbar Support', price: 18999, originalPrice: 24999, image: 'https://images.unsplash.com/photo-1505843490538-5133c6c7d0e1?auto=format&fit=crop&q=80&w=400', rating: 4.5, reviews: 312, stock: 8, isNew: false, brand: 'ErgoLife', category: 'home', description: 'Breathable mesh back, adjustable lumbar support, and multi-directional armrests for all-day comfort.' },
  { id: 'p4', title: 'Smart LED Light Strip 10M with App Control', price: 1999, image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=400', rating: 4.3, reviews: 4056, stock: 120, isNew: true, brand: 'SmartHome', category: 'electronics', description: 'Voice control via Alexa & Google Home. 16 million colors. Music sync mode available.' },
  { id: 'p5', title: 'Premium Leather Minimalist Wallet — RFID Blocking', price: 2999, originalPrice: 4499, image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&q=80&w=400', rating: 4.7, reviews: 623, stock: 45, isNew: false, brand: 'Dapper', category: 'fashion', description: 'Slim genuine leather wallet with RFID-blocking technology. Holds up to 8 cards.' },
  { id: 'p6', title: 'Apple AirPods Pro 2nd Generation — Original', price: 24999, originalPrice: 26999, image: 'https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46?auto=format&fit=crop&q=80&w=400', rating: 4.9, reviews: 8901, stock: 15, isNew: false, brand: 'Apple', category: 'electronics', description: 'Active Noise Cancellation. Adaptive Audio. Transparency mode. H2 chip.' },
  { id: 'p7', title: 'Oversized Linen Blend Summer Co-ord Set', price: 3499, originalPrice: 4999, image: 'https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?auto=format&fit=crop&q=80&w=400', rating: 4.4, reviews: 201, stock: 30, isNew: true, brand: 'Urban Thread', category: 'fashion', description: 'Breathable linen blend fabric. Relaxed fit. Available in 5 colors.' },
  { id: 'p8', title: 'Wooden Floating Wall Shelf — Set of 3 Sizes', price: 2799, image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&q=80&w=400', rating: 4.6, reviews: 445, stock: 60, isNew: false, brand: 'WoodCraft', category: 'home', description: 'Easy to install. Solid mango wood. Hidden hardware. Max load 10kg each.' },
];

export const MOCK_CATEGORIES = [
  { id: 'electronics', label: 'Electronics', icon: '⚡', count: 120 },
  { id: 'fashion', label: 'Fashion', icon: '👗', count: 340 },
  { id: 'home', label: 'Home & Living', icon: '🏠', count: 210 },
  { id: 'beauty', label: 'Beauty', icon: '✨', count: 90 },
  { id: 'sports', label: 'Sports', icon: '🏃', count: 80 },
  { id: 'books', label: 'Books', icon: '📚', count: 55 },
];

export const MOCK_ORDERS = [
  { id: 'AG-8832', date: 'Mar 20, 2026', status: 'Delivered', total: 34998, items: [MOCK_PRODUCTS[0], MOCK_PRODUCTS[3]], address: '123 MG Road, Bengaluru - 560001', paymentMethod: 'UPI', trackingId: 'DTDC123456789' },
  { id: 'AG-8512', date: 'Mar 10, 2026', status: 'Shipped', total: 2499, items: [MOCK_PRODUCTS[1]], address: '45 Powai Lake Dr, Mumbai - 400076', paymentMethod: 'Credit Card', trackingId: 'BLUEDART987654' },
  { id: 'AG-7541', date: 'Feb 28, 2026', status: 'Processing', total: 27998, items: [MOCK_PRODUCTS[5], MOCK_PRODUCTS[4]], address: '8 Park Street, Kolkata - 700016', paymentMethod: 'Net Banking', trackingId: null },
];

// ─── Auth API ────────────────────────────────────────────────────
export const authAPI = {
  login: async ({ email, password }) => {
    if (USE_MOCK) {
      await new Promise(r => setTimeout(r, 1000));
      if (!email || !password) throw new Error('Invalid credentials');
      const role = email === 'superadmin@test.com' ? 'superadmin'
        : email === 'admin@test.com' ? 'admin'
        : email === 'seller@test.com' ? 'seller'
        : 'user';
      const displayName = email === 'admin@test.com' ? 'Admin User'
        : email === 'superadmin@test.com' ? 'Super Admin'
        : email === 'seller@test.com' ? 'My Seller Store'
        : email.split('@')[0];
      return { uid: `mock-uid-${role}`, email, displayName, photoURL: null, token: `mock-token-${role}`, role };
    }
    return request('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) });
  },


  signup: async ({ name, email, password }) => {
    if (USE_MOCK) {
      await new Promise(r => setTimeout(r, 1200));
      return { uid: 'mock-uid-2', email, displayName: name, photoURL: null, token: 'mock-token-456' };
    }
    return request('/auth/signup', { method: 'POST', body: JSON.stringify({ name, email, password }) });
  },

  logout: async () => {
    if (USE_MOCK) return true;
    return request('/auth/logout', { method: 'POST' });
  },

  forgotPassword: async (email) => {
    if (USE_MOCK) {
      await new Promise(r => setTimeout(r, 800));
      return { message: 'Password reset email sent' };
    }
    return request('/auth/forgot-password', { method: 'POST', body: JSON.stringify({ email }) });
  },
};

// ─── Products API ─────────────────────────────────────────────────
export const productsAPI = {
  getAll: async (filters = {}) => {
    if (USE_MOCK) {
      let results = [...MOCK_PRODUCTS];
      if (filters.category && filters.category !== 'all') results = results.filter(p => p.category === filters.category);
      if (filters.query) results = results.filter(p => p.title.toLowerCase().includes(filters.query.toLowerCase()));
      if (filters.minPrice) results = results.filter(p => p.price >= filters.minPrice);
      if (filters.maxPrice) results = results.filter(p => p.price <= filters.maxPrice);
      if (filters.sort === 'price_asc') results.sort((a, b) => a.price - b.price);
      if (filters.sort === 'price_desc') results.sort((a, b) => b.price - a.price);
      if (filters.sort === 'rating') results.sort((a, b) => b.rating - a.rating);
      return { products: results, total: results.length };
    }
    const params = new URLSearchParams(filters).toString();
    return request(`/products?${params}`);
  },

  getById: async (id) => {
    if (USE_MOCK) {
      const product = MOCK_PRODUCTS.find(p => p.id === id);
      if (!product) throw new Error('Product not found');
      return product;
    }
    return request(`/products/${id}`);
  },

  search: async (query) => {
    if (USE_MOCK) {
      const results = MOCK_PRODUCTS.filter(p =>
        p.title.toLowerCase().includes(query.toLowerCase()) ||
        p.brand.toLowerCase().includes(query.toLowerCase())
      );
      return { products: results };
    }
    return request(`/products/search?q=${encodeURIComponent(query)}`);
  },
};

// ─── Orders API ───────────────────────────────────────────────────
export const ordersAPI = {
  getAll: async () => {
    if (USE_MOCK) {
      await new Promise(r => setTimeout(r, 600));
      return { orders: MOCK_ORDERS };
    }
    return request('/orders');
  },

  getById: async (id) => {
    if (USE_MOCK) {
      const order = MOCK_ORDERS.find(o => o.id === id);
      if (!order) throw new Error('Order not found');
      return order;
    }
    return request(`/orders/${id}`);
  },

  create: async (orderData) => {
    if (USE_MOCK) {
      await new Promise(r => setTimeout(r, 1500));
      return { id: `AG-${Math.floor(Math.random() * 9000) + 1000}`, ...orderData, status: 'Processing' };
    }
    return request('/orders', { method: 'POST', body: JSON.stringify(orderData) });
  },

  cancel: async (id) => {
    if (USE_MOCK) {
      await new Promise(r => setTimeout(r, 800));
      return { success: true, message: 'Order cancelled successfully' };
    }
    return request(`/orders/${id}/cancel`, { method: 'POST' });
  },

  returnRequest: async (id, reason) => {
    if (USE_MOCK) {
      await new Promise(r => setTimeout(r, 800));
      return { success: true, message: 'Return request submitted' };
    }
    return request(`/orders/${id}/return`, { method: 'POST', body: JSON.stringify({ reason }) });
  },
};

// ─── User Profile API ─────────────────────────────────────────────
export const userAPI = {
  getProfile: async () => {
    if (USE_MOCK) return { name: 'User', email: 'user@example.com', phone: '', avatar: null };
    return request('/user/profile');
  },

  updateProfile: async (data) => {
    if (USE_MOCK) {
      await new Promise(r => setTimeout(r, 800));
      return { ...data, success: true };
    }
    return request('/user/profile', { method: 'PUT', body: JSON.stringify(data) });
  },

  changePassword: async ({ currentPassword, newPassword }) => {
    if (USE_MOCK) {
      await new Promise(r => setTimeout(r, 1000));
      return { success: true, message: 'Password updated successfully' };
    }
    return request('/user/password', { method: 'PUT', body: JSON.stringify({ currentPassword, newPassword }) });
  },

  getAddresses: async () => {
    if (USE_MOCK) return [];
    return request('/user/addresses');
  },

  addAddress: async (address) => {
    if (USE_MOCK) return { id: Date.now(), ...address };
    return request('/user/addresses', { method: 'POST', body: JSON.stringify(address) });
  },

  deleteAddress: async (id) => {
    if (USE_MOCK) return { success: true };
    return request(`/user/addresses/${id}`, { method: 'DELETE' });
  },
};

// ─── Support API ──────────────────────────────────────────────────
export const supportAPI = {
  getTickets: async () => {
    if (USE_MOCK) return [];
    return request('/support/tickets');
  },

  createTicket: async (data) => {
    if (USE_MOCK) {
      await new Promise(r => setTimeout(r, 800));
      return { id: `TIC-${Math.floor(Math.random() * 9000) + 1000}`, ...data, status: 'Open', date: new Date().toISOString() };
    }
    return request('/support/tickets', { method: 'POST', body: JSON.stringify(data) });
  },

  replyToTicket: async (ticketId, message) => {
    if (USE_MOCK) {
      await new Promise(r => setTimeout(r, 600));
      return { success: true };
    }
    return request(`/support/tickets/${ticketId}/reply`, { method: 'POST', body: JSON.stringify({ message }) });
  },
};

// ─── Payments API ─────────────────────────────────────────────────
export const paymentsAPI = {
  createRazorpayOrder: async (amount) => {
    if (USE_MOCK) {
      await new Promise(r => setTimeout(r, 1000));
      // In production: integrate Razorpay SDK
      // import Razorpay from 'razorpay'; 
      return { orderId: `rzp_mock_${Date.now()}`, amount, currency: 'INR' };
    }
    return request('/payments/create-order', { method: 'POST', body: JSON.stringify({ amount }) });
  },

  verifyPayment: async (paymentData) => {
    if (USE_MOCK) return { success: true };
    return request('/payments/verify', { method: 'POST', body: JSON.stringify(paymentData) });
  },
};

export default { authAPI, productsAPI, ordersAPI, userAPI, supportAPI, paymentsAPI };
