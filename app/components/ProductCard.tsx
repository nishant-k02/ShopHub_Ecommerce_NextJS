'use client';

import Image from 'next/image';
import { HeartIcon, ShoppingCartIcon } from '@heroicons/react/24/outline';
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
  const router = useRouter();
  const { addToCart } = useCart();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card click when clicking the button
    addToCart(product);
  };

  const handleCardClick = () => {
    router.push(`/products/${product.id}`);
  };

  return (
    <div 
      className="card group cursor-pointer"
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
          className="absolute top-2 right-2 p-2 rounded-full bg-white/80 hover:bg-white transition-colors"
        >
          {isFavorite ? (
            <HeartIconSolid className="h-5 w-5 text-red-500" />
          ) : (
            <HeartIcon className="h-5 w-5 text-gray-600" />
          )}
        </button>
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-1">{product.name}</h3>
        <p className="text-sm text-gray-600 mb-2 line-clamp-2">{product.description}</p>
        <div className="flex items-center justify-between">
          <span className="text-lg font-bold text-primary">${product.price.toFixed(2)}</span>
          <button 
            onClick={handleAddToCart}
            className="btn btn-primary flex items-center gap-2"
          >
            <ShoppingCartIcon className="h-5 w-5" />
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
} 