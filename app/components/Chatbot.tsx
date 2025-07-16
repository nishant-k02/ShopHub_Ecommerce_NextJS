'use client';

import React, { useState, useRef, useEffect } from 'react';
import { PaperAirplaneIcon, ChatBubbleLeftRightIcon, XMarkIcon, ShoppingCartIcon, UserIcon } from '@heroicons/react/24/outline';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import { useRouter } from 'next/navigation';

interface ChatMessage {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  actionType?: 'product_recommendation' | 'add_to_cart' | 'order_status' | 'general';
  products?: Product[];
}

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  category: string;
}

interface ChatbotProps {
  isOpen?: boolean;
  onToggle?: () => void;
  className?: string;
}

const Chatbot: React.FC<ChatbotProps> = ({ isOpen = false, onToggle, className = '' }) => {
  const [messageIdCounter, setMessageIdCounter] = useState(0);
  
  // Generate unique message ID
  const generateMessageId = () => {
    const newId = `msg-${Date.now()}-${messageIdCounter}`;
    setMessageIdCounter(prev => prev + 1);
    return newId;
  };

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'initial-message-1',
      text: '👋 **Hello! Welcome to our Electronics Store!**\n\nI\'m your AI shopping assistant, ready to help you find the perfect tech products!\n\n🛍️ **What I Can Do:**\n• **Product Discovery** - Find products by needs, budget, and features\n• **Smart Recommendations** - Get personalized suggestions\n• **Cart Management** - Add/remove products (login required)\n• **Order Tracking** - Check your order status with order numbers\n\n📊 **Our Store:**\n• **60 Products** across 7 categories\n• **Latest Tech** - Laptops, smartphones, audio, wearables\n• **All Budgets** - From $29 to $2199\n• **Secure Shopping** - Protected cart and order management\n\n💬 **Quick Commands:**\n• "add laptop-001 to cart" - Add product to cart\n• "remove laptop-001" - Remove by product ID\n• "delete Budget Wired Headphones" - Remove by product name\n• "show all products" - View complete catalog (60 products)\n\nWhat can I help you find today?',
      sender: 'bot',
      timestamp: new Date(),
      actionType: 'general'
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { user } = useAuth();
  const { addToCart, removeFromCart, cartItems } = useCart();
  const { addToast } = useToast();
  const router = useRouter();

  // Handle adding product to cart via button
  const handleAddToCartButton = async (product: Product) => {
    if (!user) {
      addToast('Please log in to add items to your cart', 'info');
      router.push('/auth/login');
      return;
    }

    try {
      await addToCart(product);
      
      // Add success message to chat
      const successMessage: ChatMessage = {
        id: generateMessageId(),
        text: `✅ **Added to Cart Successfully!**\n\n🛍️ **${product.name}**\n💰 **Price:** $${product.price.toLocaleString()}\n\n🛒 Product added via quick action button!`,
        sender: 'bot',
        timestamp: new Date(),
        actionType: 'add_to_cart'
      };
      
      setMessages(prev => [...prev, successMessage]);
      addToast(`${product.name} added to cart!`, 'success');
    } catch (error) {
      console.error('Error adding to cart:', error);
      addToast('Failed to add item to cart. Please try again.', 'error');
    }
  };

  // Handle removing product from cart via button
  const handleRemoveFromCartButton = async (productId: string) => {
    try {
      await removeFromCart(productId);
      
      // Find the product name for the message
      const productName = cartItems.find((item: any) => item.id === productId)?.name || 'Product';
      
      // Add success message to chat
      const successMessage: ChatMessage = {
        id: generateMessageId(),
        text: `🗑️ **Removed from Cart**\n\n❌ **${productName}** has been removed from your cart.\n\n🛒 **Continue Shopping:**\n• Browse more products below\n• Ask for recommendations\n• [View Cart](/cart) to see remaining items`,
        sender: 'bot',
        timestamp: new Date(),
        actionType: 'add_to_cart'
      };
      
      setMessages(prev => [...prev, successMessage]);
      addToast('Item removed from cart', 'success');
    } catch (error) {
      console.error('Error removing from cart:', error);
      addToast('Failed to remove item from cart. Please try again.', 'error');
    }
  };

  // Check if product is in cart
  const isProductInCart = (productId: string) => {
    return cartItems.some((item: any) => item.id === productId);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  // Handle cart actions when user tries to add or remove products
  const handleCartAction = async (message: string): Promise<boolean> => {
    // Check for add commands
    const addProductIdMatch = message.match(/(?:add\s+|buy\s+)([a-z0-9-]+)(?:\s+to\s+cart)?/i);
    const addProductId = addProductIdMatch ? addProductIdMatch[1] : null;
    
    // Check for remove commands
    const removeProductIdMatch = message.match(/(?:remove\s+|delete\s+)([a-z0-9-]+)(?:\s+from\s+cart)?/i);
    const removeProductId = removeProductIdMatch ? removeProductIdMatch[1] : null;
    
    // Check for remove by name (more flexible)
    const removeProductNameMatch = message.match(/(?:remove\s+|delete\s+)(.+?)(?:\s+from\s+cart)?$/i);
    const removeProductName = removeProductNameMatch ? removeProductNameMatch[1].trim() : null;
    
    if (addProductId) {
      if (!user) {
        addToast('Please log in to add items to your cart', 'info');
        router.push('/auth/login');
        return true; // Handled, don't send to chatbot
      }

      try {
        // Fetch product details
        const response = await fetch(`/api/products/${addProductId}`);
        if (response.ok) {
          const product = await response.json();
          
          // Add to cart using the correct Product structure
          await addToCart({
            id: product.id,
            name: product.name,
            description: product.description,
            price: product.price,
            imageUrl: product.imageUrl,
            category: product.category
          });

          // Add success message to chat
          const successMessage: ChatMessage = {
            id: generateMessageId(),
            text: `✅ **Added to Cart Successfully!**\n\n🛍️ **${product.name}**\n💰 **Price:** $${product.price.toLocaleString()}\n\n🛒 **Next Steps:**\n• Continue shopping for more items\n• [View Cart](/cart) to review your items\n• [Checkout](/checkout) when ready to purchase\n\nAnything else I can help you find?`,
            sender: 'bot',
            timestamp: new Date(),
            actionType: 'add_to_cart'
          };
          
          setMessages(prev => [...prev, successMessage]);
          addToast(`${product.name} added to cart!`, 'success');
          return true; // Handled, don't send to chatbot
        }
      } catch (error) {
        console.error('Error adding to cart:', error);
        addToast('Failed to add item to cart. Please try again.', 'error');
      }
    }
    
    if (removeProductId || removeProductName) {
      if (!user) {
        addToast('Please log in to manage your cart', 'info');
        router.push('/auth/login');
        return true; // Handled, don't send to chatbot
      }

      try {
        let productToRemove: any = null;
        let productName = 'Product';
        
        // First try to find by exact product ID
        if (removeProductId) {
          productToRemove = cartItems.find((item: any) => item.id === removeProductId);
        }
        
        // If not found by ID, try to find by product name (case-insensitive partial match)
        if (!productToRemove && removeProductName) {
          productToRemove = cartItems.find((item: any) => 
            item.name.toLowerCase().includes(removeProductName.toLowerCase()) ||
            removeProductName.toLowerCase().includes(item.name.toLowerCase())
          );
        }
        
        if (!productToRemove) {
          // Product not found in cart
          const errorMessage: ChatMessage = {
            id: generateMessageId(),
            text: `❌ **Product Not Found**\n\n🔍 Couldn't find "${removeProductId || removeProductName}" in your cart.\n\n💡 **Tips:**\n• Check if the product is actually in your cart\n• Try using the exact product name\n• Use the Remove button on product cards for easier removal\n\n🛒 [View Cart](/cart) to see all items`,
            sender: 'bot',
            timestamp: new Date(),
            actionType: 'add_to_cart'
          };
          
          setMessages(prev => [...prev, errorMessage]);
          addToast('Product not found in cart', 'error');
          return true; // Still handled, don't send to chatbot
        }
        
        productName = productToRemove.name;
        
        // Remove from cart
        await removeFromCart(productToRemove.id);
        
        // Add success message to chat
        const successMessage: ChatMessage = {
          id: generateMessageId(),
          text: `🗑️ **Removed from Cart**\n\n❌ **${productName}** has been removed from your cart.\n\n🛒 **Continue Shopping:**\n• Browse more products below\n• Ask for recommendations\n• [View Cart](/cart) to see remaining items`,
          sender: 'bot',
          timestamp: new Date(),
          actionType: 'add_to_cart'
        };
        
        setMessages(prev => [...prev, successMessage]);
        addToast(`${productName} removed from cart!`, 'success');
        return true; // Handled, don't send to chatbot
      } catch (error) {
        console.error('Error removing from cart:', error);
        addToast('Failed to remove item from cart. Please try again.', 'error');
        return true; // Still handled, don't send to chatbot
      }
    }
    
    return false; // Not handled, send to chatbot
  };

  const sendMessage = async () => {
    if (!inputText.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: generateMessageId(),
      text: inputText.trim(),
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    const messageText = inputText.trim();
    setInputText('');
    setIsLoading(true);

    // Check if this is a cart action first
    const wasHandled = await handleCartAction(messageText);
    
    if (!wasHandled) {
      try {
        const response = await fetch('/api/chatbot', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            message: messageText,
          }),
        });

        const data = await response.json();

        if (data.success) {
          const botMessage: ChatMessage = {
            id: generateMessageId(),
            text: data.message,
            sender: 'bot',
            timestamp: new Date(),
            actionType: getActionType(data.message),
            products: data.products || undefined // Include products if available
          };
          setMessages(prev => [...prev, botMessage]);
        } else {
          throw new Error(data.error || 'Failed to get response');
        }
      } catch (error) {
        console.error('Error sending message:', error);
        const errorMessage: ChatMessage = {
          id: generateMessageId(),
          text: 'I apologize, but I\'m having trouble responding right now. Please try again or contact our support team.',
          sender: 'bot',
          timestamp: new Date(),
        };
        setMessages(prev => [...prev, errorMessage]);
      }
    }
    
    setIsLoading(false);
  };

  const getActionType = (message: string): 'product_recommendation' | 'add_to_cart' | 'order_status' | 'general' => {
    if (message.includes('Product Recommendations Found') || message.includes('Here are the products')) {
      return 'product_recommendation';
    }
    if (message.includes('Order Found') || message.includes('Order Status')) {
      return 'order_status';
    }
    if (message.includes('Added to Cart') || message.includes('Ready to Add')) {
      return 'add_to_cart';
    }
    return 'general';
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const formatTimestamp = (timestamp: Date) => {
    return timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const quickSuggestions = [
    { text: 'Show me all products', icon: '🛍️' },
    { text: 'Show me gaming laptops under $1500', icon: '💻' },
    { text: 'What wireless headphones do you recommend?', icon: '🎧' },
    { text: 'I need a budget smartphone', icon: '📱' },
    { text: 'Show me fitness smartwatches', icon: '⌚' },
  ];

  const handleSuggestionClick = (suggestion: string) => {
    setInputText(suggestion);
    inputRef.current?.focus();
  };

  if (!isOpen) {
    return (
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={onToggle}
          className="bg-gradient-to-br from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white p-4 rounded-full shadow-lg transition-all duration-200 hover:scale-105 group"
          aria-label="Open chat"
        >
          <ChatBubbleLeftRightIcon className="h-6 w-6 transition-transform group-hover:scale-110" />
        </button>
      </div>
    );
  }

  return (
    <div className={`fixed bottom-6 right-6 w-96 h-[600px] bg-white border border-gray-300 rounded-xl shadow-2xl flex flex-col z-50 ${className}`}>
      {/* Enhanced Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4 rounded-t-xl flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="relative">
            <ChatBubbleLeftRightIcon className="h-6 w-6" />
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
          </div>
          <div>
            <h3 className="font-semibold">AI Shopping Assistant</h3>
            <p className="text-xs text-blue-100">60 products • Always online</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          {user && (
            <div className="flex items-center space-x-1 text-xs bg-blue-500 bg-opacity-50 px-2 py-1 rounded-full">
              <UserIcon className="h-3 w-3" />
              <span className="max-w-20 truncate">{user.name}</span>
            </div>
          )}
          <button
            onClick={onToggle}
            className="text-white hover:text-gray-200 transition-colors p-1 hover:bg-blue-500 hover:bg-opacity-50 rounded"
            aria-label="Close chat"
          >
            <XMarkIcon className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Messages with enhanced styling */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-gray-50 to-white">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[85%] p-3 rounded-lg shadow-sm ${
                message.sender === 'user'
                  ? 'bg-gradient-to-br from-blue-600 to-blue-700 text-white rounded-br-none'
                  : `${getMessageBackground(message.actionType)} text-gray-900 rounded-bl-none border`
              }`}
            >
              {message.sender === 'bot' && (
                <div className="flex items-center space-x-2 mb-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <span className="text-xs font-medium text-gray-600">AI Assistant</span>
                  {message.actionType && (
                    <span className={`text-xs px-2 py-0.5 rounded-full ${getActionBadge(message.actionType)}`}>
                      {getActionLabel(message.actionType)}
                    </span>
                  )}
                </div>
              )}
              <div className="text-sm whitespace-pre-wrap leading-relaxed">{message.text}</div>
              
              {/* Render products with interactive buttons */}
              {message.products && message.products.length > 0 && (
                <div className="mt-3 space-y-3">
                  <div className="text-xs font-medium text-gray-600 border-t pt-2">
                    Found {message.products.length} product{message.products.length > 1 ? 's' : ''}:
                  </div>
                  {message.products.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      user={user}
                      onAddToCart={handleAddToCartButton}
                      onRemoveFromCart={handleRemoveFromCartButton}
                      isInCart={isProductInCart(product.id)}
                    />
                  ))}
                </div>
              )}
              
              <p
                className={`text-xs mt-2 ${
                  message.sender === 'user' ? 'text-blue-100' : 'text-gray-500'
                }`}
              >
                {formatTimestamp(message.timestamp)}
              </p>
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-white border text-gray-900 p-4 rounded-lg rounded-bl-none shadow-sm">
              <div className="flex items-center space-x-2 mb-2">
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                <span className="text-xs font-medium text-gray-600">AI Assistant is typing...</span>
              </div>
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Enhanced Quick Suggestions */}
      {messages.length === 1 && (
        <div className="px-4 pb-2 border-t border-gray-100 bg-gradient-to-r from-blue-50 to-indigo-50">
          <p className="text-xs text-gray-600 mb-3 mt-3 font-medium">✨ Try these popular searches:</p>
          <div className="grid grid-cols-1 gap-2">
            {quickSuggestions.map((suggestion, index) => (
              <button
                key={index}
                onClick={() => handleSuggestionClick(suggestion.text)}
                className="flex items-center text-left text-xs text-blue-700 hover:text-blue-900 hover:bg-white p-2 rounded-lg transition-all duration-200 border border-blue-200 hover:border-blue-300 hover:shadow-sm"
              >
                <span className="mr-2">{suggestion.icon}</span>
                <span>"{suggestion.text}"</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Enhanced Input with authentication status */}
      <div className="p-4 border-t border-gray-200 bg-white rounded-b-xl">
        {!user && (
          <div className="mb-3 p-2 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-center space-x-2 text-xs text-yellow-800">
              <UserIcon className="h-4 w-4" />
              <span>
                <strong>Not logged in</strong> - Cart actions will redirect to login
              </span>
            </div>
          </div>
        )}
        
        <div className="flex space-x-2">
          <input
            ref={inputRef}
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={user ? "Ask about products, add to cart, check orders..." : "Type your message..."}
            disabled={isLoading}
            className="flex-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary disabled:opacity-50 text-sm text-gray-900 bg-white placeholder-gray-500 transition-colors"
            maxLength={1000}
          />
          <button
            onClick={sendMessage}
            disabled={!inputText.trim() || isLoading}
            className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 disabled:from-gray-300 disabled:to-gray-400 text-white p-3 rounded-lg transition-all duration-200 hover:shadow-md disabled:shadow-none focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
            aria-label="Send message"
          >
            <PaperAirplaneIcon className="h-5 w-5" />
          </button>
        </div>
        
        <div className="flex justify-between items-center mt-2">
          <p className="text-xs text-gray-500">
            {inputText.length}/1000 characters
          </p>
          {user && (
            <div className="flex items-center space-x-1 text-xs text-green-600">
              <ShoppingCartIcon className="h-3 w-3" />
              <span>Cart ready</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Helper functions for message styling
function getMessageBackground(actionType?: string): string {
  switch (actionType) {
    case 'product_recommendation':
      return 'bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200';
    case 'add_to_cart':
      return 'bg-gradient-to-br from-green-50 to-green-100 border-green-200';
    case 'order_status':
      return 'bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200';
    default:
      return 'bg-gradient-to-br from-gray-50 to-gray-100 border-gray-200';
  }
}

function getActionBadge(actionType: string): string {
  switch (actionType) {
    case 'product_recommendation':
      return 'bg-blue-100 text-blue-700 border border-blue-200';
    case 'add_to_cart':
      return 'bg-green-100 text-green-700 border border-green-200';
    case 'order_status':
      return 'bg-orange-100 text-orange-700 border border-orange-200';
    default:
      return 'bg-gray-100 text-gray-700 border border-gray-200';
  }
}

function getActionLabel(actionType: string): string {
  switch (actionType) {
    case 'product_recommendation':
      return '🛍️ Products';
    case 'add_to_cart':
      return '🛒 Cart';
    case 'order_status':
      return '📦 Orders';
    default:
      return '💬 General';
  }
}

// ProductCard component for displaying products with interactive buttons
const ProductCard: React.FC<{ 
  product: Product; 
  user: any; 
  onAddToCart: (product: Product) => void; 
  onRemoveFromCart?: (productId: string) => void;
  isInCart?: boolean;
}> = ({ product, user, onAddToCart, onRemoveFromCart, isInCart = false }) => {
  const getCategoryEmoji = (category: string) => {
    const cat = category.toLowerCase();
    if (cat.includes('laptop') || cat.includes('computer')) return '💻';
    if (cat.includes('phone') || cat.includes('smartphone')) return '📱';
    if (cat.includes('audio') || cat.includes('headphone')) return '🎧';
    if (cat.includes('watch') || cat.includes('wearable')) return '⌚';
    if (cat.includes('tablet')) return '📱';
    if (cat.includes('camera')) return '📷';
    if (cat.includes('accessories')) return '🔌';
    return '🛍️';
  };

  const handleToggleCart = () => {
    if (isInCart && onRemoveFromCart) {
      onRemoveFromCart(product.id);
    } else {
      onAddToCart(product);
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-3 shadow-sm hover:shadow-md transition-all duration-200">
      <div className="flex items-start space-x-3">
        {/* Product Icon - Using emoji for reliability */}
        <div className="flex-shrink-0">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-lg flex items-center justify-center text-lg border border-blue-200">
            {getCategoryEmoji(product.category)}
          </div>
        </div>
        
        {/* Product Info */}
        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-gray-900 text-sm mb-1 line-clamp-1">
            {product.name}
          </h4>
          <p className="text-gray-600 text-xs mb-2 line-clamp-2 leading-relaxed">
            {product.description}
          </p>
          
          {/* Price and Category */}
          <div className="flex items-center justify-between mb-2">
            <div className="flex flex-col">
              <span className="text-base font-bold text-green-600">
                ${product.price.toLocaleString()}
              </span>
              <span className="text-xs text-gray-500 capitalize">
                {product.category}
              </span>
            </div>
          </div>
          
          {/* Action Buttons */}
          <div className="flex items-center justify-end">
            {user ? (
              <button
                onClick={handleToggleCart}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 min-w-[100px] justify-center ${
                  isInCart 
                    ? 'bg-red-500 hover:bg-red-600 text-white focus:ring-red-500' 
                    : 'bg-gradient-to-r from-primary to-accent text-white hover:from-primary/90 hover:to-accent/90 focus:ring-primary'
                }`}
              >
                {isInCart ? (
                  <>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                    </svg>
                    <span>Remove</span>
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5L12 15m0 0l7-3M12 15v6"/>
                    </svg>
                    <span>Add to Cart</span>
                  </>
                )}
              </button>
            ) : (
              <button 
                onClick={() => {}} 
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-gray-200 text-gray-500 cursor-not-allowed min-w-[100px] justify-center shadow-md"
                disabled
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
                </svg>
                <span>Login Required</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chatbot;
