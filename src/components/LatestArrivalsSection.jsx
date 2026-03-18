import React from "react";
import ProductCard from "./Product/ProductCard";
import "./LatestArrivals.css";

const products = [
  { id: 5, name: "New Headphones", price: 3499, imageUrl: "https://via.placeholder.com/150/8A2BE2/FFFFFF?text=New" },
  { id: 6, name: "Gaming Mouse", price: 1299, imageUrl: "https://via.placeholder.com/150/5F9EA0/FFFFFF?text=Gaming" },
  { id: 7, name: "4K Monitor", price: 15499, imageUrl: "https://via.placeholder.com/150/DC143C/FFFFFF?text=HD" },
  { id: 8, name: "Mechanical Keyboard", price: 4999, imageUrl: "https://via.placeholder.com/150/2E8B57/FFFFFF?text=Gaming" },
];

const LatestArrivalsSection = () => (
  <section className="container mx-auto px-6 md:px-10 lg:px-16 py-12">
    <h3 className="latest-arrivals-section__title">Latest Arrivals</h3>
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  </section>
);

export default LatestArrivalsSection;