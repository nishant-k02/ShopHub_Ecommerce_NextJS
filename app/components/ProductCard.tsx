'use client';

import Image from 'next/image';
import { HeartIcon, ShoppingCartIcon, PlusIcon } from '@heroicons/react/24/outline';
import { HeartIcon as HeartIconSolid } from '@heroicons/react/24/solid';
import { useState } from 'react';
import { Product } from '../lib/db';
import { useRouter } from 'next/navigation';
import { useCart } from '../context/CartContext';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const [isFavorite, setIsFavorite] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { addToCart } = useCart();

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card click when clicking the button
    setIsLoading(true);
    
    // Add a small delay to show loading state
    await new Promise(resolve => setTimeout(resolve, 300));
    
    addToCart(product);
    setIsLoading(false);
  };

  const handleCardClick = () => {
    router.push(`/products/${product.id}`);
  };

  return (
    <div 
      className="bg-white rounded-2xl shadow-sm border border-gray-100 group cursor-pointer overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1 flex flex-col h-full"
      onClick={handleCardClick}
    >
      <div className="relative aspect-square overflow-hidden">
        <Image
          src={product.imageUrl}
          alt={product.name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <button
          onClick={(e) => {
            e.stopPropagation();
            setIsFavorite(!isFavorite);
          }}
          className="absolute top-3 right-3 p-2 rounded-full bg-white/90 backdrop-blur-sm hover:bg-white transition-all duration-200 shadow-sm hover:shadow-md"
        >
          {isFavorite ? (
            <HeartIconSolid className="h-5 w-5 text-red-500" />
          ) : (
            <HeartIcon className="h-5 w-5 text-gray-600 hover:text-red-500 transition-colors" />
          )}
        </button>
        
        {/* Quick Add Button - appears on hover */}
        <button
          onClick={handleAddToCart}
          disabled={isLoading}
          className="absolute bottom-3 right-3 p-2 rounded-full bg-primary/90 backdrop-blur-sm text-white opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-primary hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
        >
          {isLoading ? (
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
          ) : (
            <PlusIcon className="h-5 w-5" />
          )}
        </button>
      </div>
      
      <div className="p-6 flex flex-col flex-grow">
        <div className="flex-grow">
          <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-primary transition-colors min-h-[3.5rem]">
            {product.name}
          </h3>
          <p className="text-sm text-gray-600 mb-4 line-clamp-2 min-h-[2.5rem]">{product.description}</p>
        </div>
        
        <div className="mt-auto">
          <div className="flex items-center justify-between mb-4">
            <div className="flex flex-col">
              <span className="text-2xl font-bold text-gray-900">${product.price.toFixed(2)}</span>
              <span className="text-sm text-gray-500">Free shipping</span>
            </div>
          </div>
          
          <button 
            onClick={handleAddToCart}
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-primary to-accent text-white font-medium rounded-xl hover:from-primary/90 hover:to-accent/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl"
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                <span className="text-sm font-medium">Adding...</span>
              </>
            ) : (
              <>
                <ShoppingCartIcon className="h-5 w-5" />
                <span className="text-sm font-medium">Add to Cart</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
} 