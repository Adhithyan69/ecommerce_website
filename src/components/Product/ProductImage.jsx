import React from 'react';

const ProductImage = ({ src, alt }) => {
  const fallback = 'https://via.placeholder.com/300x300.png?text=Product';
  const imageSrc = src || fallback;
  return (
    <img
      src={imageSrc}
      alt={alt}
      className="w-full h-48 object-cover rounded-md mb-4"
      loading="lazy"
    />
  );
};

export default ProductImage;


