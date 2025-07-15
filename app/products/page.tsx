'use client';

import { useState, useEffect } from 'react';
import ProductCard from '../components/ProductCard';
import { Product } from '../lib/db';
import { MagnifyingGlassIcon, AdjustmentsHorizontalIcon } from '@heroicons/react/24/outline';
import Chatbot from '../components/Chatbot';

export default function ProductsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('featured');
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Handle URL search parameters
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const searchParam = urlParams.get('search');
    const categoryParam = urlParams.get('category');
    
    if (searchParam) {
      setSearchQuery(searchParam);
    }
    if (categoryParam) {
      // Map category names to select values
      const categoryMap: { [key: string]: string } = {
        'Electronics': 'electronics',
        'Fashion': 'fashion',
        'Home & Living': 'home'
      };
      setSelectedCategory(categoryMap[categoryParam] || categoryParam.toLowerCase());
    }
  }, []);

  useEffect(() => {
    async function fetchProducts() {
      setLoading(true);
      setError(null);
      try {
        const params = new URLSearchParams();
        if (searchQuery) params.append('search', searchQuery);
        if (selectedCategory !== 'all') params.append('category', selectedCategory);
        switch (sortBy) {
          case 'price-low':
            params.append('sort', 'price_asc');
            break;
          case 'price-high':
            params.append('sort', 'price_desc');
            break;
          case 'name':
            params.append('sort', 'name_asc');
            break;
          default:
            break;
        }
        const res = await fetch(`/api/products?${params.toString()}`);
        if (!res.ok) throw new Error('Failed to fetch products');
        const data = await res.json();
        setProducts(data.products || []);
      } catch (err: unknown) {
        const errorMessage = err instanceof Error ? err.message : 'Error loading products';
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, [searchQuery, selectedCategory, sortBy]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        {/* <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8"> */}
          {/* <h1 className="text-3xl font-bold text-gray-900">All Products</h1> */}
          {/* <p className="mt-2 text-gray-600">Browse our complete collection of products</p> */}
        {/* </div> */}
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters and Search */}
        <div className="mb-8 space-y-4 md:space-y-0 md:flex md:items-center md:justify-between">
          {/* Search Bar */}
          <div className="relative max-w-md w-full">
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-gray-900 placeholder-gray-500 bg-white shadow-sm"
            />
            <MagnifyingGlassIcon className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2 pointer-events-none" />
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-4">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-gray-900 bg-white shadow-sm max-w-[200px]"
            >
              <option value="all">All Categories</option>
              <option value="electronics">Electronics</option>
              <option value="fashion">Fashion</option>
              <option value="home">Home & Living</option>
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-gray-900 bg-white shadow-sm max-w-[200px]"
            >
              <option value="featured">Featured</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="name">Name: A to Z</option>
            </select>
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {loading ? (
            <div className="col-span-4 text-center">Loading...</div>
          ) : error ? (
            <div className="col-span-4 text-center text-red-500">{error}</div>
          ) : products.length === 0 ? (
            <div className="col-span-4 text-center">No products found</div>
          ) : (
            products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))
          )}
        </div>

        {/* Empty State */}
        {products.length === 0 && (
          <div className="text-center py-12">
            <AdjustmentsHorizontalIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No products found</h3>
            <p className="mt-1 text-sm text-gray-500">Try adjusting your search or filter to find what you&apos;re looking for.</p>
          </div>
        )}
      </div>
            <div className="fixed bottom-6 right-6 z-50">
              <Chatbot />
            </div>
    </div>
  );
}