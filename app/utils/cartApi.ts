export interface CartItem {
  id: string;
  productId: string;
  quantity: number;
  name: string;
  price: number;
  imageUrl: string;
}

export interface CartResponse {
  items: CartItem[];
  totalItems: number;
  subtotal: number;
}

export const cartApi = {
  // Get cart items
  async getCart(): Promise<CartResponse> {
    const response = await fetch('/api/cart');
    if (!response.ok) {
      throw new Error('Failed to fetch cart');
    }
    return response.json();
  },

  // Add item to cart
  async addToCart(productId: string, quantity: number = 1): Promise<CartResponse> {
    const response = await fetch('/api/cart', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ productId, quantity }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to add item to cart');
    }

    const result = await response.json();
    return result.cart;
  },

  // Update cart item quantity
  async updateQuantity(productId: string, quantity: number): Promise<CartResponse> {
    const response = await fetch('/api/cart', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ productId, quantity }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to update cart');
    }

    const result = await response.json();
    return result.cart;
  },

  // Remove item from cart
  async removeFromCart(productId: string): Promise<CartResponse> {
    const response = await fetch(`/api/cart?productId=${productId}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to remove item from cart');
    }

    const result = await response.json();
    return result.cart;
  },
}; 