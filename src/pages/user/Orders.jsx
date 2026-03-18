import React from 'react';
import { Link } from 'react-router-dom';
import { Package, ChevronLeft, Truck, CheckCircle2, Clock } from 'lucide-react';

const MOCK_ORDERS = [
  {
    id: 'AG-8832', date: 'March 15, 2026', total: 124.99, status: 'Delivered', items: 2,
    images: ['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=200', 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=200']
  },
  {
    id: 'AG-9104', date: 'March 10, 2026', total: 45.00, status: 'In Transit', items: 1,
    images: ['https://images.unsplash.com/photo-1542291026-7eec264c27ab?auto=format&fit=crop&q=80&w=200']
  },
  {
    id: 'AG-7021', date: 'Feb 28, 2026', total: 299.00, status: 'Processing', items: 1,
    images: ['https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&q=80&w=200']
  }
];

const Orders = () => {
  return (
    <div className="container-custom py-12 pb-24">
      <div className="mb-8">
        <Link to="/user/dashboard" className="text-sm text-gray-500 hover:text-accent flex items-center gap-1 mb-2">
          <ChevronLeft size={16} /> Back to Dashboard
        </Link>
        <h1 className="text-3xl font-display font-bold text-gray-900 dark:text-white">My Orders</h1>
      </div>

      <div className="space-y-6">
        {MOCK_ORDERS.map((order) => (
          <div key={order.id} className="bg-white dark:bg-dark-card border border-gray-200 dark:border-dark-border rounded-2xl overflow-hidden hover:shadow-lg transition-shadow">
            {/* Header */}
            <div className="bg-gray-50 dark:bg-dark-bg p-4 md:p-6 flex flex-wrap gap-4 justify-between items-center border-b border-gray-100 dark:border-dark-border">
              <div className="flex gap-6 md:gap-12">
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-1">Order Placed</p>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">{order.date}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-1">Total</p>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">${order.total.toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-1">Order #</p>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">{order.id}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {order.status === 'Delivered' ? <CheckCircle2 size={18} className="text-emerald-500" /> : order.status === 'In Transit' ? <Truck size={18} className="text-blue-500" /> : <Clock size={18} className="text-amber-500" />}
                <span className={`text-sm font-bold ${order.status === 'Delivered' ? 'text-emerald-600' : order.status === 'In Transit' ? 'text-blue-600' : 'text-amber-600'}`}>
                  {order.status}
                </span>
              </div>
            </div>

            {/* Body */}
            <div className="p-6 flex flex-col md:flex-row gap-6 items-start md:items-center justify-between">
              <div className="flex gap-4">
                {order.images.map((img, i) => (
                  <div key={i} className="w-20 h-20 bg-gray-50 dark:bg-dark-bg rounded-lg border border-gray-100 dark:border-dark-border overflow-hidden p-2">
                    <img src={img} alt="Product" className="w-full h-full object-contain mix-blend-multiply dark:mix-blend-normal" />
                  </div>
                ))}
              </div>
              <div className="flex gap-3 w-full md:w-auto">
                <button className="flex-1 md:flex-none btn-secondary text-sm py-2">View Invoice</button>
                <button className="flex-1 md:flex-none btn-primary text-sm py-2">Track Order</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Orders;