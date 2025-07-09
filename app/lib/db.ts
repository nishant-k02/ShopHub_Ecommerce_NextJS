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

export interface User {
  _id?: string;
  id: string;
  email: string;
  password: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CartItem {
  _id?: string;
  id: string;
  userId: string; // Add userId to associate cart items with users
  productId: string;
  quantity: number;
  name: string;
  price: number;
  imageUrl: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface WishlistItem {
  _id?: string;
  id: string;
  userId: string;
  productId: string;
  name: string;
  price: number;
  imageUrl: string;
  createdAt: Date;
}

export interface Address {
  _id?: string;
  id: string;
  userId: string;
  type: 'home' | 'work' | 'other';
  isDefault: boolean;
  firstName: string;
  lastName: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface PaymentMethod {
  _id?: string;
  id: string;
  userId: string;
  type: 'credit' | 'debit' | 'paypal';
  isDefault: boolean;
  cardName: string;
  cardNumber: string; // In production, this should be tokenized/encrypted
  expiryDate: string;
  cardType: string; // visa, mastercard, etc.
  createdAt: Date;
  updatedAt: Date;
}

export interface OrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  imageUrl: string;
}

export interface Order {
  _id?: string;
  id: string;
  userId: string;
  orderNumber: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  items: OrderItem[];
  shippingAddress: {
    firstName: string;
    lastName: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  paymentInfo: {
    method: string;
    cardLast4: string;
    cardType: string;
  };
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  createdAt: Date;
  updatedAt: Date;
  estimatedDelivery?: Date;
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

export async function getUsersCollection() {
  try {
    const client = await clientPromise;
    const db = client.db(getDatabaseName());
    return db.collection<User>('users');
  } catch (error) {
    console.error('Error connecting to users collection:', error);
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

export async function getWishlistCollection() {
  try {
    const client = await clientPromise;
    const db = client.db(getDatabaseName());
    return db.collection<WishlistItem>('wishlist');
  } catch (error) {
    console.error('Error connecting to wishlist collection:', error);
    throw error;
  }
} 

export async function getOrdersCollection() {
  try {
    const client = await clientPromise;
    const db = client.db(getDatabaseName());
    return db.collection<Order>('orders');
  } catch (error) {
    console.error('Error connecting to orders collection:', error);
    throw error;
  }
}

export async function getAddressesCollection() {
  try {
    const client = await clientPromise;
    const db = client.db(getDatabaseName());
    return db.collection<Address>('addresses');
  } catch (error) {
    console.error('Error connecting to addresses collection:', error);
    throw error;
  }
}

export async function getPaymentMethodsCollection() {
  try {
    const client = await clientPromise;
    const db = client.db(getDatabaseName());
    return db.collection<PaymentMethod>('paymentMethods');
  } catch (error) {
    console.error('Error connecting to payment methods collection:', error);
    throw error;
  }
} 