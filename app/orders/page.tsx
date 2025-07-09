'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../context/AuthContext';
import { 
  ShoppingBagIcon, 
  TruckIcon, 
  CheckCircleIcon,
  ClockIcon,
  XCircleIcon
} from '@heroicons/react/24/outline';
import Image from 'next/image';

interface OrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  imageUrl: string;
}

interface Order {
  id: string;
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
  createdAt: string;
  estimatedDelivery?: string;
}

export default function OrdersPage() {
  const { user, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/auth/login');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (user) {
      fetchOrders();
    }
  }, [user]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('/api/orders');
      if (!response.ok) {
        throw new Error('Failed to fetch orders');
      }

      const data = await response.json();
      setOrders(data.orders);
    } catch (error) {
      console.error('Error fetching orders:', error);
      setError('Failed to load orders. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const cancelOrder = async (orderId: string) => {
    if (!confirm('Are you sure you want to cancel this order? This action cannot be undone.')) {
      return;
    }

    try {
      const response = await fetch('/api/orders', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          orderId,
          status: 'cancelled'
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to cancel order');
      }

      // Refresh orders after cancellation
      await fetchOrders();
    } catch (error) {
      console.error('Error cancelling order:', error);
      setError(error instanceof Error ? error.message : 'Failed to cancel order');
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <ClockIcon className="h-5 w-5 text-yellow-600" />;
      case 'processing':
        return <ShoppingBagIcon className="h-5 w-5 text-blue-600" />;
      case 'shipped':
        return <TruckIcon className="h-5 w-5 text-purple-600" />;
      case 'delivered':
        return <CheckCircleIcon className="h-5 w-5 text-green-600" />;
      case 'cancelled':
        return <XCircleIcon className="h-5 w-5 text-red-600" />;
      default:
        return <ClockIcon className="h-5 w-5 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'shipped':
        return 'bg-purple-100 text-purple-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
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
    return null; // Will redirect to login
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Orders</h1>
            <p className="text-gray-600 mt-2">Track your order history and delivery status</p>
          </div>
          <button
            onClick={() => router.push('/products')}
            className="px-6 py-3 bg-gradient-to-r from-primary to-accent text-white font-medium rounded-xl hover:from-primary/90 hover:to-accent/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl"
          >
            Continue Shopping
          </button>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading your orders...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="text-center py-12">
            <p className="text-red-600 mb-4">{error}</p>
            <button 
              onClick={fetchOrders}
              className="px-6 py-3 bg-gradient-to-r from-primary to-accent text-white font-medium rounded-xl hover:from-primary/90 hover:to-accent/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl"
            >
              Retry
            </button>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && orders.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <ShoppingBagIcon className="mx-auto h-12 w-12" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No orders yet</h3>
            <p className="text-gray-500 mb-6">You haven't placed any orders. Start shopping to see your orders here.</p>
            <button 
              onClick={() => router.push('/products')} 
              className="px-6 py-3 bg-gradient-to-r from-primary to-accent text-white font-medium rounded-xl hover:from-primary/90 hover:to-accent/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl"
            >
              Start Shopping
            </button>
          </div>
        )}

        {/* Orders List */}
        {!loading && !error && orders.length > 0 && (
          <div className="space-y-6">
            {orders.map((order) => (
              <div key={order.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                {/* Order Header */}
                <div className="bg-gray-50 px-6 py-4 border-b border-gray-100">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div>
                        <p className="text-sm text-gray-600">Order Number</p>
                        <p className="font-semibold text-gray-900">{order.orderNumber}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Order Date</p>
                        <p className="font-semibold text-gray-900">{formatDate(order.createdAt)}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Total</p>
                        <p className="font-semibold text-gray-900">${order.total.toFixed(2)}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(order.status)}
                        <span className={`px-3 py-1 text-sm font-medium rounded-full ${getStatusColor(order.status)}`}>
                          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        </span>
                      </div>
                      {(order.status === 'pending' || order.status === 'processing') && (
                        <button
                          onClick={() => cancelOrder(order.id)}
                          className="px-3 py-1 text-sm font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-red-500 transition-colors"
                        >
                          Cancel Order
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {/* Order Items */}
                <div className="p-6">
                  <div className="space-y-4">
                    {order.items.map((item, index) => (
                      <div key={index} className="flex items-center space-x-4">
                        <div className="flex-shrink-0">
                          <Image
                            src={item.imageUrl}
                            alt={item.name}
                            width={64}
                            height={64}
                            className="rounded-lg object-cover"
                          />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900">{item.name}</h4>
                          <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium text-gray-900">${(item.price * item.quantity).toFixed(2)}</p>
                          <p className="text-sm text-gray-600">${item.price.toFixed(2)} each</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Order Details */}
                  <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Shipping Address */}
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Shipping Address</h4>
                      <div className="text-sm text-gray-600">
                        <p>{order.shippingAddress.firstName} {order.shippingAddress.lastName}</p>
                        <p>{order.shippingAddress.address}</p>
                        <p>{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}</p>
                        <p>{order.shippingAddress.country}</p>
                      </div>
                    </div>

                    {/* Payment Info */}
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Payment Method</h4>
                      <div className="text-sm text-gray-600">
                        <p>{order.paymentInfo.cardType} ending in {order.paymentInfo.cardLast4}</p>
                        <p>{order.paymentInfo.method}</p>
                      </div>
                    </div>
                  </div>

                  {/* Order Summary */}
                  <div className="mt-6 border-t pt-4">
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Subtotal</span>
                        <span className="text-gray-900">${order.subtotal.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Shipping</span>
                        <span className="text-gray-900">${order.shipping.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Tax</span>
                        <span className="text-gray-900">${order.tax.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between font-medium text-base border-t pt-2">
                        <span className="text-gray-900">Total</span>
                        <span className="text-gray-900">${order.total.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Estimated Delivery */}
                  {order.estimatedDelivery && order.status !== 'delivered' && order.status !== 'cancelled' && (
                    <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                      <p className="text-sm text-blue-800">
                        <TruckIcon className="h-4 w-4 inline mr-2" />
                        Estimated delivery: {formatDate(order.estimatedDelivery)}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 