import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ChevronLeft, Package, Truck, CheckCircle, XCircle, Clock, AlertTriangle, FileText, CornerDownLeft } from 'lucide-react';

const MOCK_ORDER_DATA = {
  id: 'AG-8832',
  date: 'March 15, 2026',
  total: 124.99,
  status: 'In Transit',
  paymentMethod: 'Credit Card (ending in 4242)',
  shippingAddress: {
    name: 'John Doe',
    street: '123 Tech Avenue, Apt 4B',
    city: 'San Francisco, CA 94105',
    phone: '+1 234 567 8900'
  },
  items: [
    {
      id: 1,
      name: 'Sony WH-1000XM5 Wireless Noise Canceling Headphones',
      price: 99.99,
      quantity: 1,
      image: 'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?auto=format&fit=crop&q=80&w=200'
    },
    {
      id: 2,
      name: 'Smart LED Light Strip 32.8ft',
      price: 25.00,
      quantity: 1,
      image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=200'
    }
  ],
  timeline: [
    { status: 'Order Placed', date: 'Mar 15, 10:23 AM', done: true, icon: <Package size={20} /> },
    { status: 'Processing', date: 'Mar 15, 02:45 PM', done: true, icon: <Clock size={20} /> },
    { status: 'Shipped', date: 'Mar 17, 09:12 AM', done: true, icon: <Truck size={20} /> },
    { status: 'Out for Delivery', date: 'Pending', done: false, icon: <Truck size={20} /> },
    { status: 'Delivered', date: 'Pending', done: false, icon: <CheckCircle size={20} /> },
  ]
};

const OrderDetails = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState(MOCK_ORDER_DATA);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showReturnModal, setShowReturnModal] = useState(false);
  
  // Real implementation would fetch order by ID using useEffect

  const handleCancelOrder = () => {
    setOrder({ ...order, status: 'Cancelled' });
    setShowCancelModal(false);
    // In real app, call API to cancel
  };

  const handleRequestReturn = () => {
    setOrder({ ...order, status: 'Return Requested' });
    setShowReturnModal(false);
    // Call API
  };

  return (
    <div className="container-custom py-12 pb-24">
      {/* Header */}
      <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <Link to="/user/orders" className="text-sm text-gray-500 hover:text-accent flex items-center gap-1 mb-2 transition-colors">
            <ChevronLeft size={16} /> Back to Orders
          </Link>
          <div className="flex items-center gap-4">
            <h1 className="text-3xl font-display font-bold text-gray-900 dark:text-white">Order #{orderId || order.id}</h1>
            <span className={`px-3 py-1 rounded-full text-sm font-bold 
              ${order.status === 'Delivered' ? 'bg-emerald-100 text-emerald-700' : 
                order.status === 'Cancelled' ? 'bg-rose-100 text-rose-700' : 
                order.status === 'Return Requested' ? 'bg-amber-100 text-amber-700' :
                'bg-blue-100 text-blue-700'}`}>
              {order.status}
            </span>
          </div>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Placed on {order.date}</p>
        </div>
        
        <div className="flex items-center gap-3">
          <Link to={`/user/orders/${orderId || order.id}/invoice`} className="btn btn-secondary flex items-center gap-2">
            <FileText size={18} /> Invoice
          </Link>
          
          {/* Action Buttons based on status */}
          {(order.status === 'Order Placed' || order.status === 'Processing') && (
             <button onClick={() => setShowCancelModal(true)} className="btn bg-rose-50 text-rose-600 hover:bg-rose-100 border border-rose-200">
               Cancel Order
             </button>
          )}
          
          {(order.status === 'Delivered') && (
             <button onClick={() => setShowReturnModal(true)} className="btn bg-amber-50 text-amber-600 hover:bg-amber-100 border border-amber-200 flex items-center gap-2">
               <CornerDownLeft size={18} /> Return Item
             </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column (Timeline & Items) */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Tracking Timeline */}
          {order.status !== 'Cancelled' && (
            <div className="bg-white dark:bg-dark-card border border-gray-100 dark:border-dark-border rounded-2xl p-6 md:p-8 shadow-sm">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-8 border-b border-gray-100 dark:border-dark-border pb-4">Tracking History</h3>
              
              <div className="relative">
                {/* Vertical Line */}
                <div className="absolute left-6 md:left-8 top-2 bottom-2 w-0.5 bg-gray-100 dark:bg-gray-800"></div>
                
                <div className="space-y-8">
                  {order.timeline.map((event, index) => (
                    <div key={index} className={`relative flex items-start gap-6 ${event.done ? 'opacity-100' : 'opacity-40'}`}>
                      <div className={`relative z-10 w-12 h-12 md:w-16 md:h-16 rounded-full flex items-center justify-center shrink-0 border-4 border-white dark:border-dark-card
                        ${event.done ? 'bg-accent text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-400'}`}>
                        {event.icon}
                      </div>
                      <div className="pt-2 md:pt-4">
                        <h4 className={`font-bold text-base md:text-lg ${event.done ? 'text-gray-900 dark:text-white' : 'text-gray-500'}`}>
                          {event.status}
                        </h4>
                        <p className="text-sm text-gray-500 mt-1">{event.date}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Canceled State View */}
          {order.status === 'Cancelled' && (
             <div className="bg-rose-50 dark:bg-rose-900/10 border border-rose-200 dark:border-rose-900/30 rounded-2xl p-6 shadow-sm flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-rose-100 dark:bg-rose-900/50 text-rose-600 dark:text-rose-400 flex items-center justify-center shrink-0">
                  <XCircle size={24} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-rose-900 dark:text-rose-400">Order Cancelled</h3>
                  <p className="text-rose-700 dark:text-rose-300 mt-1">This order was cancelled successfully. If you were charged, the refund will be processed within 5-7 business days.</p>
                </div>
             </div>
          )}

          {/* Order Items */}
          <div className="bg-white dark:bg-dark-card border border-gray-100 dark:border-dark-border rounded-2xl overflow-hidden shadow-sm">
            <div className="p-6 border-b border-gray-100 dark:border-dark-border">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">Items in this order</h3>
            </div>
            <div className="divide-y divide-gray-100 dark:divide-dark-border">
              {order.items.map((item) => (
                <div key={item.id} className="p-6 flex flex-col sm:flex-row gap-6">
                  <div className="w-24 h-24 bg-gray-50 dark:bg-dark-bg rounded-xl border border-gray-100 dark:border-dark-border overflow-hidden p-2 shrink-0">
                    <img src={item.image} alt={item.name} className="w-full h-full object-contain mix-blend-multiply dark:mix-blend-normal" />
                  </div>
                  <div className="flex-1 flex flex-col sm:flex-row justify-between">
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-1 line-clamp-2">{item.name}</h4>
                      <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                    </div>
                    <div className="mt-4 sm:mt-0 text-left sm:text-right">
                      <p className="font-bold text-gray-900 dark:text-white">${item.price.toFixed(2)}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column (Summary & Addresses) */}
        <div className="space-y-6">
          {/* Order Summary */}
          <div className="bg-white dark:bg-dark-card border border-gray-100 dark:border-dark-border rounded-2xl p-6 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-accent/5 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none"></div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Order Summary</h3>
            <div className="space-y-4">
              <div className="flex justify-between text-gray-600 dark:text-gray-400">
                <span>Subtotal ({order.items.length} items)</span>
                <span>${(order.total - 10).toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-600 dark:text-gray-400">
                <span>Shipping</span>
                <span>$10.00</span>
              </div>
              <div className="flex justify-between text-gray-600 dark:text-gray-400">
                <span>Tax</span>
                <span>$0.00</span>
              </div>
              <div className="h-px bg-gray-100 dark:bg-dark-border my-2"></div>
              <div className="flex justify-between text-lg font-bold text-gray-900 dark:text-white">
                <span>Total</span>
                <span>${order.total.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Shipping Details */}
          <div className="bg-white dark:bg-dark-card border border-gray-100 dark:border-dark-border rounded-2xl p-6 shadow-sm">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Shipping Address</h3>
            <div className="text-gray-600 dark:text-gray-300">
              <p className="font-semibold text-gray-900 dark:text-white">{order.shippingAddress.name}</p>
              <p className="mt-1">{order.shippingAddress.street}</p>
              <p>{order.shippingAddress.city}</p>
              <p className="mt-2 text-sm">{order.shippingAddress.phone}</p>
            </div>
          </div>

          {/* Payment Method */}
          <div className="bg-white dark:bg-dark-card border border-gray-100 dark:border-dark-border rounded-2xl p-6 shadow-sm">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Payment Method</h3>
            <div className="text-gray-600 dark:text-gray-300 flex items-center gap-3">
              <div className="w-10 h-6 bg-gray-200 dark:bg-gray-700 rounded flex items-center justify-center text-xs font-bold text-gray-600 dark:text-gray-300">VISA</div>
              <span>{order.paymentMethod}</span>
            </div>
          </div>

        </div>
      </div>

      {/* Cancel Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-dark-card rounded-2xl w-full max-w-md p-6 animate-fade-in shadow-2xl">
            <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-500 flex items-center justify-center mb-4 mx-auto">
              <AlertTriangle size={24} />
            </div>
            <h3 className="text-xl font-bold text-center text-gray-900 dark:text-white mb-2">Cancel Order?</h3>
            <p className="text-center text-gray-500 mb-6">Are you sure you want to cancel this order? This action cannot be undone.</p>
            <div className="flex gap-3">
              <button onClick={() => setShowCancelModal(false)} className="flex-1 px-4 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 rounded-lg font-medium transition-colors">No, Keep It</button>
              <button onClick={handleCancelOrder} className="flex-1 px-4 py-2 bg-rose-500 hover:bg-rose-600 text-white rounded-lg font-medium transition-colors">Yes, Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* Return Modal */}
      {showReturnModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-dark-card rounded-2xl w-full max-w-md p-6 animate-fade-in shadow-2xl">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Request Return</h3>
            <p className="text-gray-500 mb-4 text-sm">Please provide a reason for the return.</p>
            <textarea className="w-full border border-gray-200 dark:border-gray-700 rounded-xl p-3 mb-6 bg-gray-50 dark:bg-dark-bg focus:ring-2 focus:ring-accent outline-none" rows="4" placeholder="Reason for return..."></textarea>
            <div className="flex gap-3 justify-end">
              <button onClick={() => setShowReturnModal(false)} className="px-4 py-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg font-medium transition-colors">Cancel</button>
              <button onClick={handleRequestReturn} className="px-4 py-2 btn-primary rounded-lg font-medium">Submit Request</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderDetails;
