'use client';

import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { HeartIcon, ShoppingCartIcon, TrashIcon } from '@heroicons/react/24/outline';
import { HeartIcon as HeartIconSolid } from '@heroicons/react/24/solid';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useEffect, useState } from 'react';

export default function WishlistPage() {
  const router = useRouter();
  const { user, isLoading: authLoading } = useAuth();
  const { wishlistItems, removeFromWishlist, loading, error } = useWishlist();
  const { addToCart } = useCart();
  const [addingToCart, setAddingToCart] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/auth/login');
    }
  }, [user, authLoading, router]);

  const handleAddToCart = async (item: any) => {
    if (!user) {
      router.push('/auth/login');
      return;
    }

    setAddingToCart(prev => ({ ...prev, [item.productId]: true }));
    
    try {
      // Create a product object from wishlist item
      const product = {
        id: item.productId,
        name: item.name,
        price: item.price,
        imageUrl: item.imageUrl,
        description: '', // We don't have description in wishlist, could fetch from API if needed
        category: ''
      };
      
      await addToCart(product);
    } catch (error) {
      console.error('Error adding to cart:', error);
    } finally {
      setAddingToCart(prev => ({ ...prev, [item.productId]: false }));
    }
  };

  const handleRemoveFromWishlist = async (productId: string) => {
    try {
      await removeFromWishlist(productId);
    } catch (error) {
      console.error('Error removing from wishlist:', error);
    }
  };

  // Show loading while checking authentication
  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Show login prompt if user is not authenticated
  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="mx-auto h-16 w-16 bg-gradient-to-br from-primary to-accent rounded-2xl flex items-center justify-center mb-6">
              <HeartIcon className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Login Required</h1>
            <p className="text-gray-600 mb-6">
              Please login to view your wishlist and save items for later.
            </p>
            <div className="space-y-3">
              <button
                onClick={() => router.push('/auth/login')}
                className="w-full px-6 py-3 bg-gradient-to-r from-primary to-accent text-white font-medium rounded-xl hover:from-primary/90 hover:to-accent/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl"
              >
                Login
              </button>
              <button
                onClick={() => router.push('/auth/signup')}
                className="w-full px-6 py-3 bg-white text-gray-700 font-medium rounded-xl border-2 border-gray-200 hover:border-gray-300 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all duration-200"
              >
                Create Account
              </button>
              <button
                onClick={() => router.push('/products')}
                className="w-full text-sm text-gray-500 hover:text-gray-700 transition-colors"
              >
                Back to Products
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading wishlist...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-6 py-3 bg-gradient-to-r from-primary to-accent text-white font-medium rounded-xl hover:from-primary/90 hover:to-accent/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center">
            <div className="h-12 w-12 bg-gradient-to-br from-pink-500 to-red-500 rounded-xl flex items-center justify-center mr-4">
              <HeartIconSolid className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Your Wishlist</h1>
              <p className="text-gray-600">
                {wishlistItems.length} {wishlistItems.length === 1 ? 'item' : 'items'} saved for later
              </p>
            </div>
          </div>
          <p className="text-sm text-gray-500">
            Welcome back, {user.name}!
          </p>
        </div>

        {wishlistItems.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <HeartIcon className="mx-auto h-16 w-16" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Your wishlist is empty</h3>
            <p className="text-gray-500 mb-6">Save items you love to your wishlist and shop them later.</p>
            <button 
              onClick={() => router.push('/products')} 
              className="px-6 py-3 bg-gradient-to-r from-primary to-accent text-white font-medium rounded-xl hover:from-primary/90 hover:to-accent/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl"
            >
              Start Shopping
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {wishlistItems.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-2xl shadow-sm border border-gray-100 group overflow-hidden hover:shadow-lg transition-all duration-300"
              >
                {/* Product Image */}
                <div className="relative aspect-square overflow-hidden bg-gray-50">
                  <Image
                    src={item.imageUrl}
                    alt={item.name}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                    className="object-cover"
                  />
                  
                  {/* Remove from Wishlist Button */}
                  <button
                    onClick={() => handleRemoveFromWishlist(item.productId)}
                    className="absolute top-3 right-3 p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-sm hover:bg-white transition-all duration-200 z-10"
                  >
                    <TrashIcon className="h-5 w-5 text-red-500" />
                  </button>
                </div>

                {/* Product Info */}
                <div className="p-6">
                  <h3 
                    className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2 cursor-pointer hover:text-primary transition-colors"
                    onClick={() => router.push(`/products/${item.productId}`)}
                  >
                    {item.name}
                  </h3>
                  
                  <div className="flex items-center justify-between mt-4">
                    <span className="text-xl font-bold text-primary">
                      ${item.price.toFixed(2)}
                    </span>
                    
                    <button
                      onClick={() => handleAddToCart(item)}
                      disabled={addingToCart[item.productId]}
                      className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-primary to-accent text-white font-medium rounded-xl hover:from-primary/90 hover:to-accent/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none text-sm"
                    >
                      {addingToCart[item.productId] ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                          <span>Adding...</span>
                        </>
                      ) : (
                        <>
                          <ShoppingCartIcon className="h-4 w-4" />
                          <span>Add to Cart</span>
                        </>
                      )}
                    </button>
                  </div>

                  {/* Added date */}
                  <p className="text-xs text-gray-500 mt-3">
                    Added {new Date(item.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

        {wishlistItems.length > 0 && (
          <div className="mt-12 text-center">
            <button 
              onClick={() => router.push('/products')} 
              className="px-6 py-3 bg-white text-gray-700 font-medium rounded-xl border-2 border-gray-200 hover:border-gray-300 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all duration-200"
            >
              Continue Shopping
            </button>
          </div>
        )}
      </div>
    </div>
  );
} 