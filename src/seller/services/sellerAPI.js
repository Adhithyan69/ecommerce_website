/**
 * ================================================================
 * Seller API Service Layer
 * ================================================================
 * Set REACT_APP_API_URL=https://your-api.com to use real backend.
 * Without it, all functions return rich mock data.
 * ================================================================
 */

const API_URL = process.env.REACT_APP_API_URL || '';
const USE_MOCK = !API_URL;
const delay = (ms = 500) => new Promise(r => setTimeout(r, ms));

const getHeaders = () => {
  const storage = JSON.parse(localStorage.getItem('ag-auth-storage') || '{}');
  const token = storage?.state?.user?.token || '';
  return { 'Content-Type': 'application/json', ...(token && { Authorization: `Bearer ${token}` }) };
};

const req = async (path, opts = {}) => {
  const res = await fetch(`${API_URL}/seller${path}`, { headers: getHeaders(), ...opts });
  if (!res.ok) { const e = await res.json().catch(() => ({ message: res.statusText })); throw new Error(e.message); }
  return res.json();
};

// ─── Mock Data ────────────────────────────────────────────────────────────────

export const SELLER_MOCK = {
  store: {
    name: 'My Seller Store', logo: '', banner: '', description: 'Premium dropshipping store', gst: 'GST29ABCDE1234F1Z5',
    currency: 'INR', phone: '+91 99999 11111', email: 'seller@test.com', address: 'Mumbai, Maharashtra',
    shippingPreference: 'auto', autoForward: true,
  },

  stats: {
    totalRevenue: 284750, revenueGrowth: 22.4, totalOrders: 128, ordersGrowth: 15.1,
    totalProfit: 68200, profitGrowth: 18.7, pendingOrders: 12, pendingApproval: 3,
    todayOrders: 4, todayRevenue: 8420,
  },

  revenueChart: [
    { month: 'Oct', revenue: 18500, profit: 4200, orders: 22 },
    { month: 'Nov', revenue: 22000, profit: 5100, orders: 28 },
    { month: 'Dec', revenue: 35000, profit: 9100, orders: 42 },
    { month: 'Jan', revenue: 26000, profit: 6200, orders: 31 },
    { month: 'Feb', revenue: 29800, profit: 7300, orders: 35 },
    { month: 'Mar', revenue: 34200, profit: 8420, orders: 41 },
  ],

  supplierProducts: [
    { id: 'sp1', name: 'Wireless Bluetooth Earbuds Pro', category: 'Electronics', supplierPrice: 850, suggestedPrice: 1999, image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&q=80&w=400', rating: 4.6, reviews: 2341, moq: 1, supplier: 'AliExpress', shipsIn: '7-14 days', variants: ['White', 'Black', 'Blue'], imported: false },
    { id: 'sp2', name: 'Portable Mini Projector HD', category: 'Electronics', supplierPrice: 3200, suggestedPrice: 7999, image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&q=80&w=400', rating: 4.4, reviews: 892, moq: 1, supplier: 'AliExpress', shipsIn: '10-20 days', variants: [], imported: false },
    { id: 'sp3', name: 'Magnetic Phone Car Mount', category: 'Accessories', supplierPrice: 180, suggestedPrice: 599, image: 'https://images.unsplash.com/photo-1544866092-1935c5ef2a8f?auto=format&fit=crop&q=80&w=400', rating: 4.8, reviews: 8920, moq: 5, supplier: 'CJ Dropshipping', shipsIn: '5-10 days', variants: [], imported: true },
    { id: 'sp4', name: 'LED Gaming Mousepad XL', category: 'Gaming', supplierPrice: 420, suggestedPrice: 1299, image: 'https://images.unsplash.com/photo-1612287230202-1ff1d85d1bdf?auto=format&fit=crop&q=80&w=400', rating: 4.5, reviews: 4120, moq: 1, supplier: 'AliExpress', shipsIn: '7-14 days', variants: ['Small', 'Medium', 'XL'], imported: false },
    { id: 'sp5', name: 'Bamboo Wireless Charger Pad', category: 'Electronics', supplierPrice: 280, suggestedPrice: 899, image: 'https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?auto=format&fit=crop&q=80&w=400', rating: 4.3, reviews: 1567, moq: 2, supplier: 'CJ Dropshipping', shipsIn: '8-15 days', variants: [], imported: false },
    { id: 'sp6', name: 'Smart Fitness Tracker Band', category: 'Health', supplierPrice: 650, suggestedPrice: 1799, image: 'https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?auto=format&fit=crop&q=80&w=400', rating: 4.7, reviews: 3290, moq: 1, supplier: 'AliExpress', shipsIn: '7-12 days', variants: ['Black', 'Pink', 'Green'], imported: false },
    { id: 'sp7', name: 'Stainless Steel Tumbler 500ml', category: 'Home', supplierPrice: 220, suggestedPrice: 699, image: 'https://images.unsplash.com/photo-1544776193-352d25ca82cd?auto=format&fit=crop&q=80&w=400', rating: 4.9, reviews: 7120, moq: 3, supplier: 'CJ Dropshipping', shipsIn: '5-8 days', variants: ['Black', 'Silver', 'Rose Gold'], imported: false },
    { id: 'sp8', name: 'Desk Cable Organizer Kit', category: 'Office', supplierPrice: 150, suggestedPrice: 499, image: 'https://images.unsplash.com/photo-1593640495253-23196b27a87f?auto=format&fit=crop&q=80&w=400', rating: 4.4, reviews: 2890, moq: 1, supplier: 'AliExpress', shipsIn: '6-12 days', variants: [], imported: false },
  ],

  myProducts: [
    { id: 'mp1', name: 'Wireless Bluetooth Earbuds Pro', category: 'Electronics', costPrice: 850, sellingPrice: 1799, adminPrice: null, profit: 949, margin: 52.8, image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&q=80&w=400', status: 'approved', stock: 50, sold: 34, enabled: true, submittedAt: '2026-03-10', approvedAt: '2026-03-11', rejectionReason: null },
    { id: 'mp2', name: 'Magnetic Phone Car Mount', category: 'Accessories', costPrice: 180, sellingPrice: 549, adminPrice: 599, profit: 369, margin: 61.6, image: 'https://images.unsplash.com/photo-1544866092-1935c5ef2a8f?auto=format&fit=crop&q=80&w=400', status: 'approved', stock: 120, sold: 89, enabled: true, submittedAt: '2026-03-05', approvedAt: '2026-03-06', rejectionReason: null },
    { id: 'mp3', name: 'LED Gaming Mousepad XL', category: 'Gaming', costPrice: 420, sellingPrice: 1099, adminPrice: null, profit: 679, margin: 61.8, image: 'https://images.unsplash.com/photo-1612287230202-1ff1d85d1bdf?auto=format&fit=crop&q=80&w=400', status: 'pending_approval', stock: 0, sold: 0, enabled: false, submittedAt: '2026-03-20', approvedAt: null, rejectionReason: null },
    { id: 'mp4', name: 'Smart Fitness Tracker Band', category: 'Health', costPrice: 650, sellingPrice: 1599, adminPrice: null, profit: 949, margin: 59.3, image: 'https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?auto=format&fit=crop&q=80&w=400', status: 'rejected', stock: 0, sold: 0, enabled: false, submittedAt: '2026-03-15', approvedAt: null, rejectionReason: 'Price too high. Suggest max ₹1,299. Please resubmit.' },
    { id: 'mp5', name: 'Bamboo Wireless Charger', category: 'Electronics', costPrice: 280, sellingPrice: 799, adminPrice: null, profit: 519, margin: 64.9, image: 'https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?auto=format&fit=crop&q=80&w=400', status: 'pending_approval', stock: 0, sold: 0, enabled: false, submittedAt: '2026-03-21', approvedAt: null, rejectionReason: null },
  ],

  orders: [
    { id: 'ORD-2201', customer: 'Rahul Sharma', product: 'Wireless Earbuds Pro', costPrice: 850, sellingPrice: 1799, profit: 949, date: '2026-03-21', status: 'Processing', supplierStatus: 'Forwarded', trackingId: null, address: 'Mumbai, MH 400001' },
    { id: 'ORD-2200', customer: 'Priya Mehta', product: 'Magnetic Car Mount', costPrice: 180, sellingPrice: 599, profit: 369, date: '2026-03-20', status: 'Shipped', supplierStatus: 'Shipped', trackingId: 'AE-TRK-8823441', address: 'Delhi 110001' },
    { id: 'ORD-2199', customer: 'Arjun Kumar', product: 'Wireless Earbuds Pro', costPrice: 850, sellingPrice: 1799, profit: 949, date: '2026-03-20', status: 'Delivered', supplierStatus: 'Delivered', trackingId: 'AE-TRK-8812394', address: 'Bengaluru, KA 560001' },
    { id: 'ORD-2196', customer: 'Sneha Patel', product: 'Magnetic Car Mount', costPrice: 180, sellingPrice: 599, profit: 369, date: '2026-03-18', status: 'Delivered', supplierStatus: 'Delivered', trackingId: 'CJ-TRK-7734823', address: 'Ahmedabad, GJ 380001' },
  ],

  earnings: {
    totalRevenue: 284750, totalCost: 216550, totalProfit: 68200, pendingPayout: 25400, withdrawnTotal: 42800,
    transactions: [
      { id: 't1', date: '2026-03-21', type: 'order', description: 'ORD-2200 — Magnetic Car Mount', amount: 599, cost: 180, profit: 419 },
      { id: 't2', date: '2026-03-20', type: 'order', description: 'ORD-2199 — Wireless Earbuds Pro', amount: 1799, cost: 850, profit: 949 },
      { id: 't3', date: '2026-03-15', type: 'payout', description: 'Payout — Bank Transfer', amount: -15000, cost: 0, profit: -15000 },
    ],
    payouts: [
      { id: 'py1', date: '2026-03-15', amount: 15000, method: 'Bank Transfer', status: 'completed', utr: 'UTR884234' },
      { id: 'py2', date: '2026-02-28', amount: 12000, method: 'UPI', status: 'completed', utr: 'UPI993812' },
    ],
  },

  notifications: [
    { id: 'n1', type: 'order', title: 'New Order Received!', body: 'ORD-2201 — Wireless Earbuds Pro (₹1,799)', time: '5 min ago', read: false },
    { id: 'n2', type: 'approved', title: 'Product Approved ✅', body: 'Wireless Bluetooth Earbuds Pro is now live', time: '2 hours ago', read: false },
    { id: 'n3', type: 'rejected', title: 'Product Rejected ❌', body: 'Smart Fitness Tracker — Admin: Price too high', time: '6 hours ago', read: true },
    { id: 'n4', type: 'shipping', title: 'Shipment Update', body: 'ORD-2200 has been shipped. Tracking: AE-TRK-8823441', time: '1 day ago', read: true },
    { id: 'n5', type: 'payout', title: 'Payout Processed', body: '₹15,000 transferred to your bank on Mar 15', time: '6 days ago', read: true },
  ],

  reviews: [
    { id: 'rv1', product: 'Wireless Earbuds Pro', customer: 'Rahul S.', rating: 5, text: 'Amazing sound quality! Fast delivery. Highly recommend.', date: '2026-03-18', replied: false },
    { id: 'rv2', product: 'Magnetic Car Mount', customer: 'Priya M.', rating: 4, text: 'Works perfectly. Strong magnet. Good packaging.', date: '2026-03-10', replied: true, reply: 'Thank you Priya! Glad you liked it!' },
    { id: 'rv3', product: 'Wireless Earbuds Pro', customer: 'Vikram K.', rating: 3, text: 'Ok quality. Battery lasts 4 hours for me.', date: '2026-03-05', replied: false },
  ],

  tickets: [
    { id: 'TK-001', subject: 'Customer complaint — wrong item', orderRef: 'ORD-2188', status: 'Open', date: '2026-03-18', messages: [{ from: 'seller', text: 'Customer says they received a different color variant.', time: '10:00 AM' }] },
    { id: 'TK-002', subject: 'Tracking not updating', orderRef: 'ORD-2175', status: 'Resolved', date: '2026-03-10', messages: [{ from: 'seller', text: 'Tracking ID not showing movement for 5 days.', time: '9:00 AM' }, { from: 'admin', text: 'Checked with supplier. Update expected in 24h.', time: '11:00 AM' }] },
  ],

  // Admin-facing product requests
  productRequests: [
    { id: 'mp3', sellerId: 'mock-uid-seller', sellerName: 'My Seller Store', sellerEmail: 'seller@test.com', name: 'LED Gaming Mousepad XL', category: 'Gaming', costPrice: 420, sellingPrice: 1099, adminPrice: null, commission: 0, image: 'https://images.unsplash.com/photo-1612287230202-1ff1d85d1bdf?auto=format&fit=crop&q=80&w=400', description: 'Large LED gaming mousepad with RGB lighting.', status: 'pending_approval', submittedAt: '2026-03-20', tags: ['gaming', 'rgb', 'mousepad'] },
    { id: 'mp5', sellerId: 'mock-uid-seller', sellerName: 'My Seller Store', sellerEmail: 'seller@test.com', name: 'Bamboo Wireless Charger', category: 'Electronics', costPrice: 280, sellingPrice: 799, adminPrice: null, commission: 0, image: 'https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?auto=format&fit=crop&q=80&w=400', description: 'Eco-friendly bamboo wireless charging pad.', status: 'pending_approval', submittedAt: '2026-03-21', tags: ['eco', 'wireless', 'charger'] },
    { id: 'mp6', sellerId: 'mock-uid-seller2', sellerName: 'TechGadget Store', sellerEmail: 'seller2@test.com', name: 'Portable Air Purifier Mini', category: 'Home', costPrice: 890, sellingPrice: 2499, adminPrice: null, commission: 0, image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&q=80&w=400', description: 'Compact HEPA air purifier for desks.', status: 'pending_approval', submittedAt: '2026-03-21', tags: ['air purifier', 'hepa', 'desk'] },
  ],
};

// ─── Seller Store API ─────────────────────────────────────────────
export const sellerStoreAPI = {
  getStore: async () => USE_MOCK ? (await delay(400), SELLER_MOCK.store) : req('/store'),
  updateStore: async (data) => USE_MOCK ? (await delay(700), { ...SELLER_MOCK.store, ...data }) : req('/store', { method: 'PUT', body: JSON.stringify(data) }),
};

// ─── Seller Analytics API ─────────────────────────────────────────
export const sellerAnalyticsAPI = {
  getStats: async () => USE_MOCK ? (await delay(400), SELLER_MOCK.stats) : req('/analytics/stats'),
  getRevenueChart: async () => USE_MOCK ? (await delay(300), SELLER_MOCK.revenueChart) : req('/analytics/revenue'),
};

// ─── Supplier Products API ────────────────────────────────────────
export const supplierAPI = {
  getProducts: async (filters = {}) => {
    if (USE_MOCK) {
      await delay(500);
      let products = [...SELLER_MOCK.supplierProducts];
      if (filters.query) products = products.filter(p => p.name.toLowerCase().includes(filters.query.toLowerCase()));
      if (filters.category && filters.category !== 'All') products = products.filter(p => p.category === filters.category);
      if (filters.supplier && filters.supplier !== 'All') products = products.filter(p => p.supplier === filters.supplier);
      return { products };
    }
    return req(`/supplier/products?${new URLSearchParams(filters)}`);
  },
  importProduct: async (product) => {
    if (USE_MOCK) {
      await delay(800);
      return { id: `mp${Date.now()}`, name: product.name, category: product.category, costPrice: product.supplierPrice, sellingPrice: product.suggestedPrice, image: product.image, status: 'draft', stock: 0, sold: 0, enabled: false, submittedAt: new Date().toISOString().split('T')[0], profit: product.suggestedPrice - product.supplierPrice, margin: (((product.suggestedPrice - product.supplierPrice) / product.suggestedPrice) * 100).toFixed(1) };
    }
    return req('/supplier/import', { method: 'POST', body: JSON.stringify(product) });
  },
};

// ─── My Products API ──────────────────────────────────────────────
export const sellerProductsAPI = {
  getAll: async () => USE_MOCK ? (await delay(400), { products: SELLER_MOCK.myProducts }) : req('/products'),
  create: async (data) => USE_MOCK ? (await delay(800), { id: `mp${Date.now()}`, ...data, status: 'pending_approval', sold: 0, stock: 0, enabled: false, submittedAt: new Date().toISOString().split('T')[0] }) : req('/products', { method: 'POST', body: JSON.stringify(data) }),
  update: async (id, data) => USE_MOCK ? (await delay(600), { id, ...data }) : req(`/products/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: async (id) => USE_MOCK ? (await delay(500), { success: true }) : req(`/products/${id}`, { method: 'DELETE' }),
  toggleEnabled: async (id, enabled) => USE_MOCK ? (await delay(300), { id, enabled }) : req(`/products/${id}/toggle`, { method: 'PATCH', body: JSON.stringify({ enabled }) }),
  resubmit: async (id, data) => USE_MOCK ? (await delay(700), { id, ...data, status: 'pending_approval', rejectionReason: null }) : req(`/products/${id}/resubmit`, { method: 'POST', body: JSON.stringify(data) }),
};

// ─── Orders API ───────────────────────────────────────────────────
export const sellerOrdersAPI = {
  getAll: async () => USE_MOCK ? (await delay(400), { orders: SELLER_MOCK.orders }) : req('/orders'),
  forwardToSupplier: async (id) => USE_MOCK ? (await delay(1000), { id, supplierStatus: 'Forwarded', success: true }) : req(`/orders/${id}/forward`, { method: 'POST' }),
  updateStatus: async (id, status) => USE_MOCK ? (await delay(400), { id, status }) : req(`/orders/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status }) }),
};

// ─── Earnings API ─────────────────────────────────────────────────
export const sellerEarningsAPI = {
  get: async () => USE_MOCK ? (await delay(400), SELLER_MOCK.earnings) : req('/earnings'),
  requestPayout: async (data) => USE_MOCK ? (await delay(1200), { id: `py${Date.now()}`, ...data, status: 'processing', date: new Date().toISOString().split('T')[0] }) : req('/earnings/payout', { method: 'POST', body: JSON.stringify(data) }),
};

// ─── Notifications API ────────────────────────────────────────────
export const sellerNotificationsAPI = {
  getAll: async () => USE_MOCK ? (await delay(300), { notifications: SELLER_MOCK.notifications }) : req('/notifications'),
  markRead: async (id) => USE_MOCK ? (await delay(200), { success: true }) : req(`/notifications/${id}/read`, { method: 'POST' }),
};

// ─── Reviews API ──────────────────────────────────────────────────
export const sellerReviewsAPI = {
  getAll: async () => USE_MOCK ? (await delay(400), { reviews: SELLER_MOCK.reviews }) : req('/reviews'),
  reply: async (id, reply) => USE_MOCK ? (await delay(600), { id, replied: true, reply }) : req(`/reviews/${id}/reply`, { method: 'POST', body: JSON.stringify({ reply }) }),
};

// ─── Support API ──────────────────────────────────────────────────
export const sellerSupportAPI = {
  getTickets: async () => USE_MOCK ? (await delay(400), { tickets: SELLER_MOCK.tickets }) : req('/support'),
  createTicket: async (data) => USE_MOCK ? (await delay(800), { id: `TK-${Date.now()}`, ...data, status: 'Open', date: new Date().toISOString().split('T')[0], messages: [{ from: 'seller', text: data.message, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }] }) : req('/support', { method: 'POST', body: JSON.stringify(data) }),
  reply: async (id, message) => USE_MOCK ? (await delay(600), { success: true }) : req(`/support/${id}/reply`, { method: 'POST', body: JSON.stringify({ message }) }),
};

// ─── Admin Product Request API ────────────────────────────────────
export const adminProductRequestsAPI = {
  getAll: async () => USE_MOCK ? (await delay(400), { requests: SELLER_MOCK.productRequests }) : req('/admin/product-requests'),
  approve: async (id, { adminPrice, commission } = {}) => USE_MOCK ? (await delay(700), { id, status: 'approved', adminPrice, commission }) : req(`/admin/product-requests/${id}/approve`, { method: 'POST', body: JSON.stringify({ adminPrice, commission }) }),
  reject: async (id, reason) => USE_MOCK ? (await delay(600), { id, status: 'rejected', rejectionReason: reason }) : req(`/admin/product-requests/${id}/reject`, { method: 'POST', body: JSON.stringify({ reason }) }),
  edit: async (id, data) => USE_MOCK ? (await delay(600), { id, ...data }) : req(`/admin/product-requests/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
};
