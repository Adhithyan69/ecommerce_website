import React, { useState } from "react";
import { FaHeart, FaEye, FaShoppingCart, FaStar } from "react-icons/fa";
import ProductImage from "./ProductImage";
import { useCartActions } from "../../viewmodels/CartContext";
import { useNavigate } from "react-router-dom";

const ProductCard = ({ product, onAddToCart }) => {
  const { addToCart } = useCartActions();
  const navigate = useNavigate();
  const [selectedColor, setSelectedColor] = useState(product.colors?.[0] || "");

  const handleAddToCart = () => {
    const item = { id: product.id, name: product.name, price: product.price, imageUrl: product.imageUrl };
    if (typeof onAddToCart === 'function') {
      onAddToCart(product);
    } else {
      addToCart(item, 1);
    }
  };

  const handleBuyNow = () => {
    handleAddToCart();
    navigate('/cart');
  };

  return (
    <div className="relative border rounded-xl p-3 shadow-sm hover:shadow-lg transition-all bg-white">
      {/* 🔹 Discount & New Labels */}
      <div className="absolute top-2 left-2 flex flex-col gap-1">
        {product.discount && (
          <span className="bg-red-500 text-white text-xs font-semibold px-2 py-0.5 rounded">
            -{product.discount}%
          </span>
        )}
        {product.isNew && (
          <span className="bg-green-500 text-white text-xs font-semibold px-2 py-0.5 rounded">
            NEW
          </span>
        )}
      </div>

      {/* 🔹 Action Icons */}
      <div className="absolute top-2 right-2 flex flex-col items-center gap-2">
        <button className="p-2 bg-white rounded-full shadow hover:bg-gray-100">
          <FaHeart className="text-gray-600" size={14} />
        </button>
        <button className="p-2 bg-white rounded-full shadow hover:bg-gray-100">
          <FaEye className="text-gray-600" size={14} />
        </button>
        <button
          className="p-2 bg-white rounded-full shadow hover:bg-gray-100"
          onClick={handleAddToCart}
        >
          <FaShoppingCart className="text-gray-600" size={14} />
        </button>
      </div>

      {/* 🔹 Image */}
      <ProductImage src={product.imageUrl} alt={product.name} />

      {/* 🔹 Color Options */}
      {product.colors && (
        <div className="flex justify-center mb-2">
          {product.colors.map((color, index) => (
            <button
              key={index}
              onClick={() => setSelectedColor(color)}
              className={`w-4 h-4 rounded-full border-2 mx-0.5 ${
                selectedColor === color ? "border-blue-500" : "border-gray-300"
              }`}
              style={{ backgroundColor: color }}
            ></button>
          ))}
        </div>
      )}

      {/* 🔹 Product Info */}
      <h4 className="text-sm text-gray-600 font-medium">{product.brand}</h4>
      <p className="text-gray-800 font-semibold text-base line-clamp-2">
        {product.name}
      </p>

      {/* 🔹 Ratings */}
      <div className="flex justify-center items-center mt-1">
        {[...Array(5)].map((_, i) => (
          <FaStar
            key={i}
            size={12}
            className={i < product.rating ? "text-yellow-400" : "text-gray-300"}
          />
        ))}
        <span className="text-xs text-gray-500 ml-1">({product.reviews})</span>
      </div>

      {/* 🔹 Price */}
      <div className="mt-2">
        <span className="text-gray-400 text-sm line-through mr-2">
          ₹{product.oldPrice?.toLocaleString()}
        </span>
        <span className="text-blue-600 font-semibold text-lg">
          ₹{product.price.toLocaleString()}
        </span>
      </div>

      {/* 🔹 Buy Now Button */}
      <button
        onClick={handleBuyNow}
        className="mt-3 w-full bg-blue-500 text-white text-sm py-2 rounded-lg hover:bg-blue-600 transition-all"
      >
        Buy Now
      </button>
    </div>
  );
};

export default ProductCard;
