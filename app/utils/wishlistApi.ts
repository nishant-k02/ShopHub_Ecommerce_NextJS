export interface WishlistItem {
  id: string;
  userId: string;
  productId: string;
  name: string;
  price: number;
  imageUrl: string;
  createdAt: string;
}

export interface WishlistResponse {
  items: WishlistItem[];
  totalItems: number;
}

export const wishlistApi = {
  // Get wishlist items
  async getWishlist(): Promise<WishlistResponse> {
    const response = await fetch('/api/wishlist');
    if (!response.ok) {
      throw new Error('Failed to fetch wishlist');
    }
    return response.json();
  },

  // Add item to wishlist
  async addToWishlist(productId: string): Promise<WishlistResponse> {
    const response = await fetch('/api/wishlist', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ productId }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to add item to wishlist');
    }

    const result = await response.json();
    return result.wishlist;
  },

  // Remove item from wishlist
  async removeFromWishlist(productId: string): Promise<WishlistResponse> {
    const response = await fetch(`/api/wishlist?productId=${productId}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to remove item from wishlist');
    }

    const result = await response.json();
    return result.wishlist;
  },
}; 