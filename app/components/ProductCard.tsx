'use client';

import Image from 'next/image';
import { HeartIcon, ShoppingCartIcon, PlusIcon } from '@heroicons/react/24/outline';
import { HeartIcon as HeartIconSolid } from '@heroicons/react/24/solid';
import { useState } from 'react';
import { Product } from '../lib/db';
import { useRouter } from 'next/navigation';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useAuth } from '../context/AuthContext';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const { user } = useAuth();

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card click when clicking the button
    
    if (!user) {
      router.push('/auth/login');
      return;
    }

    setIsLoading(true);
    
    // Add a small delay to show loading state
    await new Promise(resolve => setTimeout(resolve, 300));
    
    try {
      await addToCart(product);
    } catch (error) {
      console.error('Error adding to cart:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleWishlistToggle = async (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card click
    
    if (!user) {
      router.push('/auth/login');
      return;
    }

    try {
      if (isInWishlist(product.id)) {
        await removeFromWishlist(product.id);
      } else {
        await addToWishlist(product);
      }
    } catch (error) {
      console.error('Error toggling wishlist:', error);
    }
  };

  const handleCardClick = () => {
    if (!user) {
      router.push('/auth/login');
      return;
    }
    router.push(`/products/${product.id}`);
  };

  return (
    <div 
      className="bg-white rounded-2xl shadow-sm border border-gray-100 group cursor-pointer overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1 flex flex-col h-full"
      onClick={handleCardClick}
    >
      {/* Product Image */}
      <div className="relative aspect-square overflow-hidden bg-gray-50">
        <Image
          src={product.imageUrl}
          alt={product.name}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover group-hover:scale-105 transition-transform duration-300"
        />
        
        {/* Wishlist Button */}
        <button
          onClick={handleWishlistToggle}
          className="absolute top-3 right-3 p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-sm hover:bg-white transition-all duration-200 z-10"
        >
          {isInWishlist(product.id) ? (
            <HeartIconSolid className="h-5 w-5 text-red-500" />
          ) : (
            <HeartIcon className="h-5 w-5 text-gray-600 hover:text-red-500" />
          )}
        </button>

        {/* Quick Add Button (appears on hover) */}
        <button
          onClick={handleAddToCart}
          disabled={isLoading}
          className="absolute bottom-3 right-3 p-2 bg-primary/90 backdrop-blur-sm text-white rounded-full shadow-sm hover:bg-primary transition-all duration-200 opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
          ) : (
            <PlusIcon className="h-5 w-5" />
          )}
        </button>
        
        {/* Authentication Badge for non-logged in users */}
        {!user && (
          <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <div className="bg-white/95 backdrop-blur-sm rounded-lg px-3 py-2 text-sm font-medium text-gray-900">
              Login to View
            </div>
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="p-4 flex-1 flex flex-col">
        <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2 min-h-[3.5rem]">
          {product.name}
        </h3>
        
        <p className="text-sm text-gray-600 mb-4 line-clamp-2 flex-1 min-h-[2.5rem]">
          {product.description}
        </p>
        
        <div className="flex items-center justify-between mt-auto">
          <span className="text-xl font-bold text-primary">
            ${product.price.toFixed(2)}
          </span>
          
          <button
            onClick={handleAddToCart}
            disabled={isLoading || !user}
            className="px-4 py-2 bg-gradient-to-r from-primary to-accent text-white font-medium rounded-xl hover:from-primary/90 hover:to-accent/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none text-sm"
          >
            {!user ? (
              'Login Required'
            ) : isLoading ? (
              <div className="flex items-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                <span>Adding...</span>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <ShoppingCartIcon className="h-4 w-4" />
                <span>Add to Cart</span>
              </div>
            )}
          </button>
        </div>
      </div>
    </div>
  );
} 