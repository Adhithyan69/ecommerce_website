import React from "react";
import ProductCard from "./Product/ProductCard";
import "./AllProducts.css";
import { motion } from "framer-motion";

const products = [
  { id: 1, name: "Smart Watch", price: 2499, imageUrl: "https://via.placeholder.com/150/FF6347/FFFFFF?text=Sale" },
  { id: 2, name: "Bluetooth Speaker", price: 999, imageUrl: "https://via.placeholder.com/150/4682B4/FFFFFF?text=Audio" },
  { id: 5, name: "New Headphones", price: 3499, imageUrl: "https://via.placeholder.com/150/8A2BE2/FFFFFF?text=New" },
  { id: 4, name: "Sneakers", price: 1999, imageUrl: "https://via.placeholder.com/150/20B2AA/FFFFFF?text=Fashion" },
  { id: 6, name: "Gaming Mouse", price: 1299, imageUrl: "https://via.placeholder.com/150/5F9EA0/FFFFFF?text=Gaming" },
  { id: 7, name: "4K Monitor", price: 15499, imageUrl: "https://via.placeholder.com/150/DC143C/FFFFFF?text=HD" },
  { id: 3, name: "Wireless Earbuds", price: 1499, imageUrl: "https://via.placeholder.com/150/6A5ACD/FFFFFF?text=Audio" },
  { id: 8, name: "Mechanical Keyboard", price: 4999, imageUrl: "https://via.placeholder.com/150/2E8B57/FFFFFF?text=Gaming" },
];

const AllProductsSection = () => (
<section className="all-products-section">
  <motion.h3
    className="all-products-section__title"
    initial={{ opacity: 0, y: -20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
  >
    All Products
  </motion.h3>

  <motion.div
    className="grid grid-cols-2 sm:grid-cols-4 gap-4"
    initial="hidden"
    animate="visible"
    variants={{
      hidden: {},
      visible: {
        transition: {
          staggerChildren: 0.15
        }
      }
    }}
  >
    {products.map((product) => (
      <motion.div
        key={product.id}
        variants={{
          hidden: { opacity: 0, y: 30 },
          visible: { opacity: 1, y: 0 }
        }}
        transition={{ duration: 0.4 }}
      >
        <ProductCard product={product} />
      </motion.div>
    ))}
  </motion.div>

  <motion.div
    className="all-products-section__footer"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ delay: 0.6 }}
  >
    <motion.button
      className="all-products-section__view-all-btn"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      View All Products
    </motion.button>
  </motion.div>
</section>
);

export default AllProductsSection;