'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { CheckCircleIcon } from '@heroicons/react/24/outline';

export default function CheckoutSuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const orderNumber = searchParams.get('orderNumber');
  const [countdown, setCountdown] = useState(10);

  useEffect(() => {
    // Redirect to orders page after 10 seconds
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          router.push('/orders');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [router]);

  const handleViewOrders = () => {
    router.push('/orders');
  };

  const handleContinueShopping = () => {
    router.push('/products');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="max-w-md mx-auto px-4">
        <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
          {/* Success Icon */}
          <div className="mx-auto h-16 w-16 bg-green-100 rounded-full flex items-center justify-center mb-6">
            <CheckCircleIcon className="h-10 w-10 text-green-600" />
          </div>

          {/* Success Message */}
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Order Placed Successfully!</h1>
          <p className="text-gray-600 mb-6">
            Thank you for your purchase. Your order has been confirmed and will be processed shortly.
          </p>

          {/* Order Number */}
          {orderNumber && (
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <p className="text-sm text-gray-600">Order Number:</p>
              <p className="text-lg font-semibold text-gray-900">{orderNumber}</p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="space-y-3">
            <button
              onClick={handleViewOrders}
              className="w-full px-6 py-3 bg-gradient-to-r from-primary to-accent text-white font-medium rounded-xl hover:from-primary/90 hover:to-accent/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl"
            >
              View My Orders
            </button>
            
            <button
              onClick={handleContinueShopping}
              className="w-full px-6 py-3 bg-white text-gray-700 font-medium rounded-xl border-2 border-gray-200 hover:border-gray-300 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all duration-200"
            >
              Continue Shopping
            </button>
          </div>

          {/* Auto-redirect Notice */}
          <p className="text-sm text-gray-500 mt-6">
            You will be redirected to your orders in {countdown} seconds
          </p>
        </div>
      </div>
    </div>
  );
} 