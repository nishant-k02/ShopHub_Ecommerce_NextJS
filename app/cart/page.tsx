'use client';

import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { TrashIcon, PlusIcon, MinusIcon } from '@heroicons/react/24/outline';
import { useCart } from '../context/CartContext';

export default function CartPage() {
  const router = useRouter();
  const { 
    cartItems, 
    removeFromCart, 
    updateQuantity, 
    getSubtotal,
    loading,
    error
  } = useCart();

  const handleProceedToCheckout = () => {
    router.push('/checkout');
  };

  const subtotal = getSubtotal();
  const shipping = 10;
  const total = subtotal + shipping;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading cart...</p>
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
            className="btn btn-primary"
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
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Shopping Cart</h1>

        {cartItems.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Your cart is empty</h3>
            <p className="text-gray-500 mb-6">Looks like you haven't added any items to your cart yet.</p>
            <button 
              onClick={() => router.push('/products')} 
              className="btn btn-primary"
            >
              Continue Shopping
            </button>
          </div>
        ) : (
          <div className="lg:grid lg:grid-cols-12 lg:gap-x-12 lg:items-start">
            {/* Cart Items */}
            <div className="lg:col-span-7">
              <div className="bg-white rounded-lg shadow-sm divide-y divide-gray-200">
                {cartItems.map((item) => (
                  <div key={item.id} className="p-6 flex">
                    <div className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-md">
                      <Image
                        src={item.imageUrl}
                        alt={item.name}
                        fill
                        className="object-cover"
                      />
                    </div>

                    <div className="ml-4 flex-1">
                      <div className="flex justify-between">
                        <div>
                          <h3 className="text-lg font-medium text-gray-900">
                            {item.name}
                          </h3>
                          <p className="mt-1 text-sm text-gray-500">
                            ${item.price.toFixed(2)}
                          </p>
                        </div>
                        <button
                          onClick={() => removeFromCart(item.productId)}
                          className="text-gray-400 hover:text-red-500"
                        >
                          <TrashIcon className="h-5 w-5" />
                        </button>
                      </div>

                      <div className="mt-4 flex items-center">
                        <button
                          onClick={() => updateQuantity(item.productId, -1)}
                          className="p-1 rounded-full hover:bg-gray-100"
                        >
                          <MinusIcon className="h-4 w-4" />
                        </button>
                        <span className="mx-4 text-gray-900">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.productId, 1)}
                          className="p-1 rounded-full hover:bg-gray-100"
                        >
                          <PlusIcon className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-5 mt-8 lg:mt-0">
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-lg font-medium text-gray-900 mb-4">Order Summary</h2>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="text-gray-900">${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Shipping</span>
                    <span className="text-gray-900">${shipping.toFixed(2)}</span>
                  </div>
                  <div className="border-t pt-4 flex justify-between">
                    <span className="text-lg font-medium text-gray-900">Total</span>
                    <span className="text-lg font-medium text-gray-900">${total.toFixed(2)}</span>
                  </div>
                </div>

                <button 
                  onClick={handleProceedToCheckout}
                  className="btn btn-primary w-full mt-6"
                >
                  Proceed to Checkout
                </button>

                <div className="mt-6 text-center">
                  <button
                    onClick={() => router.push('/products')}
                    className="text-sm text-accent hover:text-blue-600"
                  >
                    Continue Shopping
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}