'use client';

import { ShoppingCartIcon, UserIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { useState } from 'react';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="text-2xl font-bold text-primary">
              ShopHub
            </Link>
          </div>

          {/* Search Bar */}
          <div className="hidden md:flex items-center flex-1 max-w-lg mx-8">
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Search products..."
                className="input pl-10"
              />
              <MagnifyingGlassIcon className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
            </div>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-4">
            <Link href="/products" className="text-gray-700 hover:text-accent">
              Products
            </Link>
            <Link href="/categories" className="text-gray-700 hover:text-accent">
              Categories
            </Link>
            <Link href="/deals" className="text-gray-700 hover:text-accent">
              Deals
            </Link>
          </div>

          {/* Icons */}
          <div className="flex items-center space-x-4">
            <Link href="/cart" className="text-gray-700 hover:text-accent">
              <ShoppingCartIcon className="h-6 w-6" />
            </Link>
            <Link href="/account" className="text-gray-700 hover:text-accent">
              <UserIcon className="h-6 w-6" />
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-700 hover:text-accent"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {isMenuOpen ? (
                  <path d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link
              href="/products"
              className="block px-3 py-2 text-gray-700 hover:text-accent"
            >
              Products
            </Link>
            <Link
              href="/categories"
              className="block px-3 py-2 text-gray-700 hover:text-accent"
            >
              Categories
            </Link>
            <Link
              href="/deals"
              className="block px-3 py-2 text-gray-700 hover:text-accent"
            >
              Deals
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
} 