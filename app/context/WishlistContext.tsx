'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Product } from '../lib/db';
import { wishlistApi, WishlistItem } from '../utils/wishlistApi';
import { useToast } from './ToastContext';
import { useAuth } from './AuthContext';

interface WishlistContextType {
  wishlistItems: WishlistItem[];
  addToWishlist: (product: Product) => Promise<void>;
  removeFromWishlist: (productId: string) => Promise<void>;
  isInWishlist: (productId: string) => boolean;
  getTotalItems: () => number;
  loading: boolean;
  error: string | null;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { addToast } = useToast();
  const { user } = useAuth();

  // Load wishlist when user is authenticated
  useEffect(() => {
    if (user) {
      loadWishlist();
    } else {
      setWishlistItems([]); // Clear wishlist when user logs out
    }
  }, [user]);

  const loadWishlist = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      setError(null);
      const wishlistData = await wishlistApi.getWishlist();
      setWishlistItems(wishlistData.items);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load wishlist';
      if (errorMessage.includes('Authentication required')) {
        // User is not authenticated, clear wishlist
        setWishlistItems([]);
        setError(null);
      } else {
        setError(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  const addToWishlist = async (product: Product) => {
    if (!user) {
      addToast('Please login to add items to wishlist', 'error', 4000);
      return;
    }

    try {
      setError(null);
      const wishlistData = await wishlistApi.addToWishlist(product.id);
      setWishlistItems(wishlistData.items);
      
      // Show success toast
      addToast(`${product.name} added to wishlist!`, 'success', 3000);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to add item to wishlist';
      setError(errorMessage);
      addToast(errorMessage, 'error', 4000);
      throw err;
    }
  };

  const removeFromWishlist = async (productId: string) => {
    if (!user) {
      addToast('Please login to manage wishlist', 'error', 4000);
      return;
    }

    try {
      setError(null);
      const itemToRemove = wishlistItems.find(item => item.productId === productId);
      const wishlistData = await wishlistApi.removeFromWishlist(productId);
      setWishlistItems(wishlistData.items);
      
      // Show success toast
      if (itemToRemove) {
        addToast(`${itemToRemove.name} removed from wishlist`, 'success', 3000);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to remove item from wishlist';
      setError(errorMessage);
      addToast(errorMessage, 'error', 4000);
      throw err;
    }
  };

  const isInWishlist = (productId: string) => {
    return wishlistItems.some(item => item.productId === productId);
  };

  const getTotalItems = () => {
    return wishlistItems.length;
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlistItems,
        addToWishlist,
        removeFromWishlist,
        isInWishlist,
        getTotalItems,
        loading,
        error,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (context === undefined) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
} 