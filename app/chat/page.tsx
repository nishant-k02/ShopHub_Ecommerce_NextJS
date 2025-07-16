'use client';

import React, { useState } from 'react';
import Chatbot from '../components/Chatbot';
import Link from 'next/link';
import { ArrowLeftIcon, ChatBubbleLeftRightIcon } from '@heroicons/react/24/outline';

export default function ChatPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Link
                href="/"
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <ArrowLeftIcon className="h-5 w-5" />
                <span>Back to Store</span>
              </Link>
              <div className="h-6 w-px bg-gray-300"></div>
              <div className="flex items-center space-x-2">
                <ChatBubbleLeftRightIcon className="h-6 w-6 text-blue-600" />
                <h1 className="text-xl font-semibold text-gray-900">Shopping Assistant</h1>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto p-4">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          {/* Chat Info Panel */}
          <div className="bg-blue-50 border-b border-blue-100 p-6">
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
                  <ChatBubbleLeftRightIcon className="h-6 w-6 text-white" />
                </div>
              </div>
              <div className="flex-1">
                <h2 className="text-lg font-semibold text-gray-900 mb-2">
                  AI Shopping Assistant
                </h2>
                <p className="text-gray-600 mb-4">
                  I'm here to help you find the perfect products and answer any questions about your orders. 
                  I can assist with product recommendations, order status, and general store information.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div className="bg-white rounded-lg p-3 border border-blue-200">
                    <h3 className="font-medium text-blue-900 mb-1">🛍️ Product Discovery</h3>
                    <p className="text-gray-600">Find products by category, price range, or specific features</p>
                  </div>
                  <div className="bg-white rounded-lg p-3 border border-blue-200">
                    <h3 className="font-medium text-blue-900 mb-1">📦 Order Support</h3>
                    <p className="text-gray-600">Check order status, tracking, and delivery information</p>
                  </div>
                  <div className="bg-white rounded-lg p-3 border border-blue-200">
                    <h3 className="font-medium text-blue-900 mb-1">💡 Smart Suggestions</h3>
                    <p className="text-gray-600">Get personalized recommendations based on your needs</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Full Page Chat Interface */}
          <div className="h-[600px] relative">
            <Chatbot 
              isOpen={true} 
              className="relative bottom-0 right-0 w-full h-full border-0 shadow-none rounded-none"
            />
          </div>
        </div>

        {/* Example Queries */}
        <div className="mt-6 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Example Queries</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium text-gray-900 mb-2">🛍️ Product Recommendations</h4>
              <ul className="space-y-1 text-sm text-gray-600">
                <li>• "Show me wireless headphones under $100"</li>
                <li>• "I need a gaming laptop with good graphics"</li>
                <li>• "Find smartphones with excellent cameras"</li>
                <li>• "What tablets do you recommend for work?"</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 mb-2">📦 Order & Support</h4>
              <ul className="space-y-1 text-sm text-gray-600">
                <li>• "What's the status of my order ORD-12345?"</li>
                <li>• "Show me my recent orders"</li>
                <li>• "When will my order arrive?"</li>
                <li>• "How can I track my shipment?"</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Help Section */}
        <div className="mt-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200 p-6">
          <div className="text-center">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Need More Help?</h3>
            <p className="text-gray-600 mb-4">
              If the AI assistant can't answer your question, our support team is here to help.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/contact"
                className="inline-flex items-center px-4 py-2 border border-blue-300 rounded-md shadow-sm text-sm font-medium text-blue-700 bg-white hover:bg-blue-50 transition-colors"
              >
                Contact Support
              </Link>
              <Link
                href="/help"
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 transition-colors"
              >
                Browse Help Center
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 