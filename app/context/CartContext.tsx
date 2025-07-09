'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Product } from '../lib/db';
import { cartApi, CartItem } from '../utils/cartApi';
import { useToast } from './ToastContext';
import { useAuth } from './AuthContext';

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (product: Product) => Promise<void>;
  removeFromCart: (productId: string) => Promise<void>;
  updateQuantity: (productId: string, change: number) => Promise<void>;
  clearCart: () => Promise<void>;
  getTotalItems: () => number;
  getSubtotal: () => number;
  loading: boolean;
  error: string | null;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { addToast } = useToast();
  const { user } = useAuth();

  // Load cart when user is authenticated
  useEffect(() => {
    if (user) {
      loadCart();
    } else {
      setCartItems([]); // Clear cart when user logs out
    }
  }, [user]);

  const loadCart = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      setError(null);
      const cartData = await cartApi.getCart();
      setCartItems(cartData.items);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load cart';
      if (errorMessage.includes('Authentication required')) {
        // User is not authenticated, clear cart
        setCartItems([]);
        setError(null);
      } else {
        setError(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (product: Product) => {
    if (!user) {
      addToast('Please login to add items to cart', 'error', 4000);
      return;
    }

    try {
      setError(null);
      const cartData = await cartApi.addToCart(product.id);
      setCartItems(cartData.items);
      
      // Show success toast
      addToast(`${product.name} added to cart!`, 'success', 3000);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to add item to cart';
      setError(errorMessage);
      addToast(errorMessage, 'error', 4000);
      throw err;
    }
  };

  const removeFromCart = async (productId: string) => {
    if (!user) {
      addToast('Please login to manage cart', 'error', 4000);
      return;
    }

    try {
      setError(null);
      const itemToRemove = cartItems.find(item => item.productId === productId);
      const cartData = await cartApi.removeFromCart(productId);
      setCartItems(cartData.items);
      
      // Show success toast
      if (itemToRemove) {
        addToast(`${itemToRemove.name} removed from cart`, 'success', 3000);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to remove item from cart';
      setError(errorMessage);
      addToast(errorMessage, 'error', 4000);
      throw err;
    }
  };

  const updateQuantity = async (productId: string, change: number) => {
    if (!user) {
      addToast('Please login to manage cart', 'error', 4000);
      return;
    }

    try {
      setError(null);
      const currentItem = cartItems.find(item => item.productId === productId);
      if (!currentItem) return;

      const newQuantity = Math.max(0, currentItem.quantity + change);
      const cartData = await cartApi.updateQuantity(productId, newQuantity);
      setCartItems(cartData.items);
      
      // Show success toast for quantity updates
      if (newQuantity > 0) {
        addToast(`Updated ${currentItem.name} quantity to ${newQuantity}`, 'success', 2000);
      } else if (newQuantity === 0) {
        addToast(`${currentItem.name} removed from cart`, 'success', 3000);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update cart';
      setError(errorMessage);
      addToast(errorMessage, 'error', 4000);
      throw err;
    }
  };

  const clearCart = async () => {
    if (!user) {
      addToast('Please login to manage cart', 'error', 4000);
      return;
    }

    try {
      setError(null);
      // Remove all items one by one (in a real app, you'd have a clear cart endpoint)
      for (const item of cartItems) {
        await cartApi.removeFromCart(item.productId);
      }
      setCartItems([]);
      addToast('Cart cleared successfully', 'success', 3000);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to clear cart';
      setError(errorMessage);
      addToast(errorMessage, 'error', 4000);
      throw err;
    }
  };

  const getTotalItems = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  const getSubtotal = () => {
    return cartItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getTotalItems,
        getSubtotal,
        loading,
        error,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
} 