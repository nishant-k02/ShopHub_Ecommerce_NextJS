'use client';

import { useAuth } from '../context/AuthContext';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { 
  UserIcon, 
  EnvelopeIcon, 
  CalendarIcon,
  ShoppingBagIcon,
  TruckIcon,
  MapPinIcon,
  CreditCardIcon,
  HeartIcon,
  CogIcon,
  ArrowRightOnRectangleIcon
} from '@heroicons/react/24/outline';

export default function AccountPage() {
  const { user, isLoading, logout } = useAuth();
  const { getTotalItems: getWishlistTotal } = useWishlist();
  const { getTotalItems: getCartTotal } = useCart();
  const router = useRouter();
  const [orderCount, setOrderCount] = useState(0);
  const [addressCount, setAddressCount] = useState(0);
  const [paymentMethodCount, setPaymentMethodCount] = useState(0);
  const [recentOrders, setRecentOrders] = useState([]);

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/auth/login');
    }
  }, [user, isLoading, router]);

  useEffect(() => {
    if (user) {
      fetchAccountData();
    }
  }, [user]);

  const fetchAccountData = async () => {
    try {
      // Fetch orders
      const ordersResponse = await fetch('/api/orders');
      if (ordersResponse.ok) {
        const ordersData = await ordersResponse.json();
        setOrderCount(ordersData.totalOrders);
        setRecentOrders(ordersData.orders.slice(0, 3)); // Get recent 3 orders
      }

      // Fetch addresses
      const addressesResponse = await fetch('/api/addresses');
      if (addressesResponse.ok) {
        const addressesData = await addressesResponse.json();
        setAddressCount(addressesData.totalAddresses);
      }

      // Fetch payment methods
      const paymentResponse = await fetch('/api/payment-methods');
      if (paymentResponse.ok) {
        const paymentData = await paymentResponse.json();
        setPaymentMethodCount(paymentData.totalMethods);
      }
    } catch (error) {
      console.error('Error fetching account data:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-primary mx-auto"></div>
          <p className="mt-4 text-gray-600 text-lg">Loading your account...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect to login
  }

  const handleLogout = async () => {
    await logout();
    router.push('/');
  };

  const quickActions = [
    {
      name: 'View Orders',
      description: 'Track your recent purchases',
      icon: ShoppingBagIcon,
      color: 'bg-blue-500',
      href: '/orders'
    },
    {
      name: 'Track Shipments',
      description: 'Monitor delivery status',
      icon: TruckIcon,
      color: 'bg-green-500',
      href: '/tracking'
    },
    {
      name: 'Manage Addresses',
      description: 'Update delivery locations',
      icon: MapPinIcon,
      color: 'bg-purple-500',
      href: '/addresses'
    },
    {
      name: 'Payment Methods',
      description: 'Manage cards and billing',
      icon: CreditCardIcon,
      color: 'bg-orange-500',
      href: '/payment'
    },
    {
      name: 'View Wishlist',
      description: 'Save items for later',
      icon: HeartIcon,
      color: 'bg-pink-500',
      href: '/wishlist'
    },
    {
      name: 'Account Settings',
      description: 'Update your preferences',
      icon: CogIcon,
      color: 'bg-gray-500',
      href: '/settings'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="h-16 w-16 bg-gradient-to-br from-primary to-accent rounded-2xl flex items-center justify-center shadow-lg">
                <UserIcon className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Welcome back, {user.name}!</h1>
                <p className="text-gray-600">Manage your account and track your orders</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors"
            >
              <ArrowRightOnRectangleIcon className="h-4 w-4" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Card */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
              <div className="text-center mb-6">
                <div className="h-24 w-24 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <UserIcon className="h-12 w-12 text-white" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900">{user.name}</h2>
                <p className="text-gray-600">{user.email}</p>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <EnvelopeIcon className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-700">Email</p>
                    <p className="text-sm text-gray-600">{user.email}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <CalendarIcon className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-700">Member Since</p>
                    <p className="text-sm text-gray-600">{new Date().toLocaleDateString()}</p>
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <button 
                  onClick={() => router.push('/account/edit')}
                  className="w-full px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-primary to-accent rounded-lg hover:from-primary/90 hover:to-accent/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all duration-200 transform hover:scale-[1.02] shadow-lg"
                >
                  Edit Profile
                </button>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Quick Actions</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {quickActions.map((action) => (
                  <button
                    key={action.name}
                    onClick={() => router.push(action.href)}
                    className="group relative bg-gray-50 hover:bg-gray-100 rounded-xl p-4 transition-all duration-200 cursor-pointer hover:shadow-md border border-gray-100 hover:border-gray-200 text-left w-full"
                  >
                    <div className="flex items-center space-x-4">
                      <div className={`${action.color} p-3 rounded-lg shadow-sm group-hover:shadow-md transition-shadow`}>
                        <action.icon className="h-6 w-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900 group-hover:text-primary transition-colors">
                          {action.name}
                        </h3>
                        <p className="text-sm text-gray-600">{action.description}</p>
                      </div>
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                        <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-8">
          <button 
            onClick={() => router.push('/orders')}
            className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-all duration-200 hover:border-blue-200 text-left w-full"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Orders</p>
                <p className="text-2xl font-bold text-gray-900">{orderCount}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <ShoppingBagIcon className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </button>
          
          <button 
            onClick={() => router.push('/wishlist')}
            className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-all duration-200 hover:border-pink-200 text-left w-full"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Wishlist Items</p>
                <p className="text-2xl font-bold text-gray-900">{getWishlistTotal()}</p>
              </div>
              <div className="p-3 bg-pink-100 rounded-lg">
                <HeartIcon className="h-6 w-6 text-pink-600" />
              </div>
            </div>
          </button>
          
          <button 
            onClick={() => router.push('/addresses')}
            className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-all duration-200 hover:border-purple-200 text-left w-full"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Saved Addresses</p>
                <p className="text-2xl font-bold text-gray-900">{addressCount}</p>
              </div>
              <div className="p-3 bg-purple-100 rounded-lg">
                <MapPinIcon className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </button>
          
          <button 
            onClick={() => router.push('/payment')}
            className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-all duration-200 hover:border-orange-200 text-left w-full"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Payment Methods</p>
                <p className="text-2xl font-bold text-gray-900">{paymentMethodCount}</p>
              </div>
              <div className="p-3 bg-orange-100 rounded-lg">
                <CreditCardIcon className="h-6 w-6 text-orange-600" />
              </div>
            </div>
          </button>
        </div>

        {/* Recent Activity */}
        <div className="mt-8">
          <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Recent Orders</h2>
              {recentOrders.length > 0 && (
                <button 
                  onClick={() => router.push('/orders')}
                  className="text-sm text-primary hover:text-blue-600 font-medium"
                >
                  View All Orders
                </button>
              )}
            </div>
            
            {recentOrders.length === 0 ? (
              <div className="text-center py-12">
                <div className="mx-auto h-16 w-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                  <ShoppingBagIcon className="h-8 w-8 text-gray-400" />
                </div>
                <p className="text-gray-500 mb-4">No orders yet</p>
                <p className="text-sm text-gray-400 mb-6">Start shopping to see your orders here</p>
                <button 
                  onClick={() => router.push('/products')}
                  className="px-6 py-2 text-sm font-medium text-white bg-gradient-to-r from-primary to-accent rounded-lg hover:from-primary/90 hover:to-accent/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all duration-200 transform hover:scale-[1.02] shadow-lg"
                >
                  Start Shopping
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {recentOrders.map((order: any) => (
                  <div key={order.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <ShoppingBagIcon className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">Order {order.orderNumber}</p>
                        <p className="text-sm text-gray-600">
                          {new Date(order.createdAt).toLocaleDateString()} • ${order.total.toFixed(2)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                        order.status === 'shipped' ? 'bg-purple-100 text-purple-800' :
                        order.status === 'processing' ? 'bg-blue-100 text-blue-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </span>
                      <button 
                        onClick={() => router.push('/orders')}
                        className="text-sm text-gray-400 hover:text-gray-600"
                      >
                        View
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 