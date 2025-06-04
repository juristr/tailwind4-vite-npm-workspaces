import React from 'react';
import { Star, ShoppingCart, Heart } from 'lucide-react';

interface ProductCardProps {
  id: number;
  name: string;
  price: number;
  originalPrice?: number;
  rating: number;
  image: string;
  category: string;
}

const ProductCard: React.FC<ProductCardProps> = ({ 
  name, 
  price, 
  originalPrice, 
  rating, 
  image, 
  category 
}) => {
  const isOnSale = originalPrice !== undefined && originalPrice > price;
  
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <div className="relative">
        <img 
          src={image} 
          alt={name} 
          className="w-full h-64 object-cover"
        />
        <button className="absolute top-3 right-3 bg-white p-1.5 rounded-full shadow-sm hover:bg-gray-100">
          <Heart size={18} className="text-gray-600" />
        </button>
        {isOnSale && (
          <span className="absolute top-3 left-3 bg-red-500 text-white px-2 py-1 text-xs font-semibold rounded">
            SALE
          </span>
        )}
      </div>
      
      <div className="p-4">
        <span className="text-sm text-gray-500">{category}</span>
        <h3 className="font-semibold text-gray-800 mt-1">{name}</h3>
        
        <div className="flex items-center mt-1">
          {[...Array(5)].map((_, i) => (
            <Star 
              key={i} 
              size={16} 
              className={i < rating ? "text-yellow-400 fill-current" : "text-gray-300"} 
            />
          ))}
          <span className="text-xs text-gray-500 ml-1">({Math.floor(Math.random() * 150) + 50})</span>
        </div>
        
        <div className="mt-2 flex items-center justify-between">
          <div>
            <span className="font-bold text-gray-800">${price.toFixed(2)}</span>
            {isOnSale && (
              <span className="text-gray-500 text-sm line-through ml-2">${originalPrice?.toFixed(2)}</span>
            )}
          </div>
          
          <button className="bg-indigo-600 hover:bg-indigo-700 text-white p-2 rounded-full">
            <ShoppingCart size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;