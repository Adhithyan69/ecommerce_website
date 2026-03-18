import React from 'react';

const CategoryCard = ({ img, name }) => (
  <div className="flex flex-col items-center text-center p-2">
    <div className="w-32 h-32 rounded-full overflow-hidden shadow-md hover:shadow-lg transition-shadow bg-gray-100 p-2">
      <img src={img} alt={name} className="w-full h-full object-cover rounded-full" />
    </div>
    <p className="font-medium mt-3 text-base">{name}</p>
  </div>
);

export default CategoryCard;