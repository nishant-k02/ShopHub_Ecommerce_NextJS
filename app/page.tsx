'use client';

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
        console.log('Fetching featured products...');
        const res = await fetch('/api/products?limit=8');
        console.log('Response status:', res.status);
        
        if (!res.ok) {
          const errorText = await res.text();
          console.error('API Error:', errorText);
          throw new Error(`Failed to fetch featured products: ${res.status} ${errorText}`);
        }
        
        const data = await res.json();
        console.log('Products data:', data);
        setFeaturedProducts(data.products || []);
      } catch (err: unknown) {
        const errorMessage = err instanceof Error ? err.message : 'Error loading featured products';
        console.error('Fetch error:', err);
        setError(errorMessage);
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
              className="px-8 py-4 bg-gradient-to-r from-white to-gray-100 text-primary font-bold rounded-xl hover:from-gray-50 hover:to-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl text-lg"
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
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
              <div 
                key={category} 
                className="relative h-64 rounded-2xl overflow-hidden group cursor-pointer shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                onClick={() => router.push(`/products?category=${encodeURIComponent(category)}`)}
              >
                <Image
                  src={`https://images.unsplash.com/photo-${category === 'Electronics' 
                    ? '1550009158-9ebf69173e03' 
                    : category === 'Fashion' 
                    ? '1445205170230-053b83016050' 
                    : '1556911220-bff31c812dba'}?w=800&q=80`}
                  alt={category}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/10 group-hover:from-black/70 group-hover:via-black/30 transition-all duration-300">
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6">
                    <h3 className="text-3xl font-bold text-white mb-2 drop-shadow-2xl text-shadow-lg">{category}</h3>
                    <p className="text-white text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100 drop-shadow-lg">
                      Explore our collection
                    </p>
                    <div className="mt-4 opacity-0 group-hover:opacity-100 transition-all duration-300 delay-200 transform translate-y-2 group-hover:translate-y-0">
                      <span className="inline-flex items-center px-4 py-2 bg-white/25 backdrop-blur-sm text-white text-sm font-medium rounded-lg border border-white/40 hover:bg-white/35 transition-colors shadow-lg">
                        Shop Now
                        <svg className="ml-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="bg-gradient-to-r from-primary to-accent py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Stay Updated</h2>
          <p className="text-white/90 mb-8 text-lg">Subscribe to our newsletter for the latest products and exclusive offers.</p>
          <div className="max-w-md mx-auto flex gap-4">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 rounded-xl border-0 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-primary text-gray-900 placeholder-gray-500"
            />
            <button className="px-6 py-3 bg-white text-primary font-medium rounded-xl hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-primary transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl">
              Subscribe
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}
