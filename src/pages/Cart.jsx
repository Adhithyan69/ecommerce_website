import React from 'react';
import { useCart, useCartActions } from '../viewmodels/CartContext';
import BottomNav from '../components/BottomNav';

const Cart = () => {
  const { items, subtotal } = useCart();
  const { setQuantity, removeFromCart, clearCart } = useCartActions();

  if (!items.length) {
    return (
      <>
        <div className="container mx-auto px-6 md:px-10 lg:px-16 py-12 mb-20">
          <h2 className="text-2xl font-bold mb-4">Your Cart</h2>
          <p>Your cart is empty.</p>
        </div>
        <BottomNav />
      </>
    );
  }

  return (
    <>
      <div className="container mx-auto px-6 md:px-10 lg:px-16 py-12 mb-20">
        <h2 className="text-2xl font-bold mb-6">Your Cart</h2>
        <div className="grid gap-4">
          {items.map(item => (
            <div key={item.id} className="flex items-center gap-4 border rounded-lg p-4">
              <img src={item.imageUrl} alt={item.name} className="w-16 h-16 object-cover rounded" />
              <div className="flex-1">
                <div className="font-semibold">{item.name}</div>
                <div className="text-gray-600">₹{item.price.toLocaleString()}</div>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => setQuantity(item.id, Math.max(0, (item.quantity - 1)))} className="px-3 py-1 border rounded">-</button>
                <span className="w-8 text-center">{item.quantity}</span>
                <button onClick={() => setQuantity(item.id, item.quantity + 1)} className="px-3 py-1 border rounded">+</button>
              </div>
              <button onClick={() => removeFromCart(item.id)} className="ml-4 text-red-600">Remove</button>
            </div>
          ))}
        </div>
        <div className="flex items-center justify-between mt-6">
          <button onClick={clearCart} className="text-red-600">Clear Cart</button>
          <div className="text-xl font-bold">Subtotal: ₹{subtotal.toLocaleString()}</div>
        </div>
      </div>
      <BottomNav />
    </>
  );
};

export default Cart;


