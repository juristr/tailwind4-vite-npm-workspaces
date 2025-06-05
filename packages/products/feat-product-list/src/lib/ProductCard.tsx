import React from 'react';
import { Link } from 'react-router-dom';

export interface ProductCardProps {
  id: number;
  name: string;
  price: number;
  originalPrice?: number;
  rating: number;
  image: string;
  category: string;
}

const ProductCard: React.FC<ProductCardProps> = ({
  id,
  name,
  price,
  originalPrice,
  rating,
  image,
  category,
}) => {
  const isOnSale = originalPrice !== undefined && originalPrice > price;

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <Link to={`/product/${id}`} className="block">
        <div className="relative">
          <img src={image} alt={name} className="w-full h-64 object-cover" />
          <button className="absolute top-3 right-3 bg-white p-1.5 rounded-full shadow-sm hover:bg-gray-100 z-10" onClick={(e) => e.preventDefault()}>
            {/* Heart icon placeholder */}
            <span role="img" aria-label="favorite">
              ♡
            </span>
          </button>
          {isOnSale && (
            <span className="absolute top-3 left-3 bg-red-500 text-white px-2 py-1 text-xs font-semibold rounded">
              SALE
            </span>
          )}
        </div>
      </Link>

      <div className="p-4">
        <span className="text-sm text-gray-500">{category}</span>
        <Link to={`/product/${id}`} className="block">
          <h3 className="font-semibold text-gray-800 mt-1 hover:text-indigo-600">{name}</h3>
        </Link>

        <div className="flex items-center mt-1">
          {[...Array(5)].map((_, i) => (
            <span
              key={i}
              className={i < rating ? 'text-yellow-400' : 'text-gray-300'}
            >
              ★
            </span>
          ))}
          <span className="text-xs text-gray-500 ml-1">
            ({Math.floor(Math.random() * 150) + 50})
          </span>
        </div>

        <div className="mt-2 flex items-center justify-between">
          <div>
            <span className="font-bold text-gray-800">${price.toFixed(2)}</span>
            {isOnSale && (
              <span className="text-gray-500 text-sm line-through ml-2">
                ${originalPrice?.toFixed(2)}
              </span>
            )}
          </div>

          <button className="bg-indigo-600 hover:bg-indigo-700 text-white p-2 rounded-full">
            {/* Shopping cart icon placeholder */}
            <span role="img" aria-label="cart">
              🛒
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
