import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import HomePage from './pages/HomePage';
import CategoryScreen from './pages/CategoryScreen';
import Cart from './pages/Cart';
import { CartProvider } from './viewmodels/CartContext';

function App() {
  return (
    <CartProvider>
      <div className="App">
        <Header />
        <main className="pt-20">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/category" element={<CategoryScreen />} />
            <Route path="/category/:categoryName" element={<CategoryScreen />} />
            <Route path="/cart" element={<Cart />} />
          </Routes>
        </main>
      </div>
    </CartProvider>
  );
}

export default App;
