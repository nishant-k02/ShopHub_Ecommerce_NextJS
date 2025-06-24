import clientPromise from './mongodb';

export interface Product {
  _id?: string;
  id: string;
  imageUrl: string;
  name: string;
  description: string;
  price: number;
  category?: string;
}

export interface CartItem {
  _id?: string;
  id: string;
  productId: string;
  quantity: number;
  name: string;
  price: number;
  imageUrl: string;
}

// Get database name from environment or use default
const getDatabaseName = () => {
  // Try to extract database name from connection string first
  const uri = process.env.MONGODB_URI;
  if (uri) {
    const match = uri.match(/\/\/([^\/]+)\/([^?]+)/);
    if (match && match[2]) {
      return match[2];
    }
  }
  
  // Fallback to environment variable or default
  return process.env.MONGODB_DB_NAME || 'ecommerce';
};

export async function getProductsCollection() {
  try {
    const client = await clientPromise;
    const db = client.db(getDatabaseName());
    return db.collection<Product>('products');
  } catch (error) {
    console.error('Error connecting to products collection:', error);
    throw error;
  }
}

export async function getCartCollection() {
  try {
    const client = await clientPromise;
    const db = client.db(getDatabaseName());
    return db.collection<CartItem>('cart');
  } catch (error) {
    console.error('Error connecting to cart collection:', error);
    throw error;
  }
} 