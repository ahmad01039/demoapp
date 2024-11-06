import React from 'react';

interface CardProps {
  name: string;
  price: number;
  category: string;
}

const Card: React.FC<CardProps> = ({ name, price, category }) => {
  return (
    <div className="max-w-sm rounded-lg overflow-hidden shadow-lg group">
      <div className="relative pb-3/4">
        <img
          className="inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-110 cursor-pointer"
          src="/dummy.jpg"
          alt="Product image"
        />
      </div>
      <div className="px-6 py-4">
        <div className="font-bold text-xl mb-2">{name}</div>
        <p className="text-gray-700 text-base">
          <span className="font-semibold">Price:</span> ${price}
        </p>
        <p className="text-gray-700 text-base">
          <span className="font-semibold">Category:</span> {category}
        </p>
      </div>
    </div>
  );
};

export default Card;
