'use client';

import Navbar from './components/Navbar';
import ProductCard from './components/ProductCard';
import { useEffect, useState } from 'react';
import { Product } from './lib/db';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchFeaturedProducts() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch('/api/products?limit=8');
        if (!res.ok) throw new Error('Failed to fetch featured products');
        const data = await res.json();
        setFeaturedProducts(data.products || []);
      } catch (err: any) {
        setError(err.message || 'Error loading featured products');
      } finally {
        setLoading(false);
      }
    }
    fetchFeaturedProducts();
  }, []);

  return (
    <main className="min-h-screen bg-gray-50">
      {/* <Navbar /> */}
      
      {/* Hero Section */}
      <section className="relative h-[600px] bg-primary">
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da"
            alt="Hero background"
            fill
            className="object-cover opacity-50"
          />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center">
          <div className="text-white max-w-2xl">
            <h1 className="text-5xl font-bold mb-4">Discover Amazing Products</h1>
            <p className="text-xl mb-8">Shop the latest trends with unbeatable prices and quality service.</p>
            <button 
              onClick={() => router.push('/products')}
              className="btn btn-primary text-lg px-8 py-3"
            >
              Shop Now
            </button>
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Featured Products</h2>
          <p className="text-gray-600">Discover our handpicked selection of the best products</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {loading ? (
            <div className="col-span-4 text-center">Loading...</div>
          ) : error ? (
            <div className="col-span-4 text-center text-red-500">{error}</div>
          ) : featuredProducts.length === 0 ? (
            <div className="col-span-4 text-center">No featured products found.</div>
          ) : (
            featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))
          )}
        </div>
      </section>

      {/* Categories Section */}
      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Shop by Category</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {['Electronics', 'Fashion', 'Home & Living'].map((category) => (
              <div key={category} className="relative h-64 rounded-lg overflow-hidden group cursor-pointer">
                <Image
                  src={`https://images.unsplash.com/photo-${category === 'Electronics' 
                    ? '1550009158-9ebf69173e03' 
                    : category === 'Fashion' 
                    ? '1445205170230-053b83016050' 
                    : '1556911220-bff31c812dba'}`}
                  alt={category}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black bg-opacity-40 group-hover:bg-opacity-30 transition-opacity">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <h3 className="text-2xl font-bold text-white">{category}</h3>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="bg-accent py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Stay Updated</h2>
          <p className="text-white/80 mb-8">Subscribe to our newsletter for the latest products and exclusive offers.</p>
          <div className="max-w-md mx-auto flex gap-4">
            <input
              type="email"
              placeholder="Enter your email"
              className="input flex-1"
            />
            <button className="btn bg-white text-accent hover:bg-gray-100">
              Subscribe
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}
