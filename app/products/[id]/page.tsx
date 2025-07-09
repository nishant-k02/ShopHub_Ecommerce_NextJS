'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Product } from '../../lib/db';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { useAuth } from '../../context/AuthContext';
import { 
  HeartIcon, 
  ShoppingCartIcon, 
  TruckIcon, 
  ShieldCheckIcon, 
  ArrowPathIcon,
  CheckCircleIcon,
  InformationCircleIcon,
  MagnifyingGlassIcon
} from '@heroicons/react/24/outline';
import { HeartIcon as HeartIconSolid, StarIcon as StarIconSolid } from '@heroicons/react/24/solid';

export default function ProductDetail({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { user } = useAuth();
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const [selectedTab, setSelectedTab] = useState('description');
  const [quantity, setQuantity] = useState(1);
  const [isImageZoomed, setIsImageZoomed] = useState(false);
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [addingToCart, setAddingToCart] = useState(false);
  const [specs, setSpecs] = useState<{
    dimensions: string;
    weight: string;
    material: string;
    color: string;
    warranty: string;
    inStock: boolean;
    sku: string;
    brand: string;
    category: string;
    features: string[];
    specifications: Record<string, string>;
  } | null>(null);
  const [id, setId] = useState<string>('');

  useEffect(() => {
    (async () => {
      const resolved = await params;
      setId(resolved.id);
    })();
  }, [params]);

  useEffect(() => {
    if (!id) return;
    async function fetchProduct() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`/api/products/${id}`);
        if (!res.ok) throw new Error('Product not found');
        const data = await res.json();
        setProduct(data);
        // Optionally, fetch related products by category if available
        let relatedRes;
        if (data.category) {
          relatedRes = await fetch(`/api/products?category=${encodeURIComponent(data.category)}&limit=4`);
        } else {
          relatedRes = await fetch(`/api/products?limit=4`);
        }
        const relatedData = await relatedRes.json();
        setRelatedProducts((relatedData.products || []).filter((p: Product) => p.id !== data.id));
        // Optionally, set specs if you want to keep the mock for now
        setSpecs({
          dimensions: '10 x 5 x 2 inches',
          weight: '1.5 lbs',
          material: 'Premium materials',
          color: 'Multiple colors available',
          warranty: '2 years',
          inStock: true,
          sku: `SKU-${data.id}`,
          brand: 'Premium Brand',
          category: data.category || 'Electronics',
          features: [
            'High-quality construction',
            'Easy to use',
            'Durable design',
            'Modern aesthetics',
            'Energy efficient'
          ],
          specifications: {
            'Product Type': 'Premium Product',
            'Model Number': `MOD-${data.id}`,
            'Manufacturer': 'Premium Brand',
            'Country of Origin': 'United States',
            'Assembly Required': 'No',
            'Battery Included': 'Yes',
            'Battery Type': 'Lithium-ion',
            'Warranty Period': '2 years',
            'Certification': 'CE, FCC, RoHS'
          }
        });
      } catch (err: unknown) {
        let message = 'Error loading product';
        if (err && typeof err === 'object' && 'message' in err && typeof err.message === 'string') {
          message = err.message;
        } else if (typeof err === 'string') {
          message = err;
        }
        setError(message);
      } finally {
        setLoading(false);
      }
    }
    fetchProduct();
  }, [id]);

  const handleAddToCart = async () => {
    if (!user) {
      router.push('/auth/login');
      return;
    }

    if (!product) return;

    setAddingToCart(true);
    try {
      for (let i = 0; i < quantity; i++) {
        await addToCart(product);
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
    } finally {
      setAddingToCart(false);
    }
  };

  const handleWishlistToggle = async () => {
    if (!user) {
      router.push('/auth/login');
      return;
    }

    if (!product) return;

    try {
      if (isInWishlist(product.id)) {
        await removeFromWishlist(product.id);
      } else {
        await addToWishlist(product);
      }
    } catch (error) {
      console.error('Error toggling wishlist:', error);
    }
  };

  // Mock additional product images - in a real app, these would come from your database
  const productImages = product ? [
    product.imageUrl,
    'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80',
    'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80',
    'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=800&q=80'
  ].filter(Boolean) as string[] : [];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading product details...</p>
        </div>
      </div>
    );
  }

  if (error || !product || !specs) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">{error || 'Product Not Found'}</h1>
          <button
            onClick={() => router.push('/products')}
            className="px-6 py-3 bg-gradient-to-r from-primary to-accent text-white font-medium rounded-xl hover:from-primary/90 hover:to-accent/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl"
          >
            Back to Products
          </button>
        </div>
      </div>
    );
  }

  // Show login prompt if user is not authenticated
  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="mx-auto h-16 w-16 bg-gradient-to-br from-primary to-accent rounded-2xl flex items-center justify-center mb-6">
              <ShoppingCartIcon className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Login Required</h1>
            <p className="text-gray-600 mb-6">
              Please login to view product details and add items to your cart.
            </p>
            <div className="space-y-3">
              <button
                onClick={() => router.push('/auth/login')}
                className="w-full px-6 py-3 bg-gradient-to-r from-primary to-accent text-white font-medium rounded-xl hover:from-primary/90 hover:to-accent/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl"
              >
                Login
              </button>
              <button
                onClick={() => router.push('/auth/signup')}
                className="w-full px-6 py-3 bg-white text-gray-700 font-medium rounded-xl border-2 border-gray-200 hover:border-gray-300 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all duration-200"
              >
                Create Account
              </button>
              <button
                onClick={() => router.push('/products')}
                className="w-full text-sm text-gray-500 hover:text-gray-700 transition-colors"
              >
                Back to Products
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="flex mb-8" aria-label="Breadcrumb">
          <ol className="flex items-center space-x-2">
            <li>
              <button onClick={() => router.push('/')} className="text-gray-500 hover:text-gray-700">
                Home
              </button>
            </li>
            <li className="flex items-center">
              <span className="mx-2 text-gray-400">/</span>
              <button onClick={() => router.push('/products')} className="text-gray-500 hover:text-gray-700">
                Products
              </button>
            </li>
            <li className="flex items-center">
              <span className="mx-2 text-gray-400">/</span>
              <span className="text-gray-900">{product.name}</span>
            </li>
          </ol>
        </nav>

        <div className="lg:grid lg:grid-cols-2 lg:gap-x-8">
          {/* Product Images */}
          <div className="lg:max-w-lg lg:self-start">
            <div className="relative">
              {/* Main Image */}
              <div 
                className="relative aspect-square rounded-lg overflow-hidden bg-white shadow-sm cursor-zoom-in"
                onClick={() => setIsImageZoomed(!isImageZoomed)}
              >
                <Image
                  src={product.imageUrl}
                  alt={product.name}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className={`object-contain transition-transform duration-300 ${
                    isImageZoomed ? 'scale-150' : 'scale-100'
                  }`}
                  priority
                />
                <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-10 transition-opacity duration-300" />
                <div className="absolute bottom-4 right-4 bg-white rounded-full p-2 shadow-md">
                  <MagnifyingGlassIcon className="h-5 w-5 text-gray-600" />
                </div>
              </div>

              {/* Thumbnail Gallery */}
              <div className="mt-4 grid grid-cols-4 gap-4">
                {productImages.map((image, index) => (
                  <div
                    key={index}
                    className="relative aspect-square rounded-md overflow-hidden bg-white shadow-sm cursor-pointer hover:ring-2 hover:ring-accent transition-all duration-200"
                  >
                    <Image
                      src={image}
                      alt={`${product.name} - View ${index + 1}`}
                      fill
                      sizes="(max-width: 768px) 25vw, 12vw"
                      className="object-contain"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Product Info */}
          <div className="mt-10 px-4 sm:px-0 sm:mt-16 lg:mt-0">
            <div className="flex items-start justify-between">
              <h1 className="text-3xl font-bold tracking-tight text-gray-900">{product.name}</h1>
              <button
                onClick={handleWishlistToggle}
                className="ml-4 p-2 rounded-full hover:bg-gray-100 transition-colors duration-200"
              >
                {isInWishlist(product.id) ? (
                  <HeartIconSolid className="h-6 w-6 text-red-500" />
                ) : (
                  <HeartIcon className="h-6 w-6 text-gray-400 hover:text-red-500" />
                )}
              </button>
            </div>

            <div className="mt-6">
              <h2 className="sr-only">Product information</h2>
              <p className="text-3xl tracking-tight text-gray-900">${product.price.toFixed(2)}</p>
            </div>

            {/* Quick Info */}
            <div className="mt-6 grid grid-cols-2 gap-4">
              <div className="flex items-center">
                <TruckIcon className="h-5 w-5 text-gray-400" />
                <span className="ml-2 text-sm text-gray-500">Free shipping</span>
              </div>
              <div className="flex items-center">
                <ShieldCheckIcon className="h-5 w-5 text-gray-400" />
                <span className="ml-2 text-sm text-gray-500">{specs.warranty} warranty</span>
              </div>
              <div className="flex items-center">
                <ArrowPathIcon className="h-5 w-5 text-gray-400" />
                <span className="ml-2 text-sm text-gray-500">30-day returns</span>
              </div>
              <div className="flex items-center">
                <InformationCircleIcon className="h-5 w-5 text-gray-400" />
                <span className="ml-2 text-sm text-gray-500">Product support</span>
              </div>
            </div>

            <div className="mt-6">
              <div className="flex items-center space-x-4">
                <div className="flex items-center border-2 border-gray-200 rounded-xl overflow-hidden">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-4 py-3 text-gray-600 hover:bg-gray-50 transition-colors font-medium"
                  >
                    -
                  </button>
                  <span className="px-6 py-3 text-gray-900 font-medium border-x-2 border-gray-200 bg-gray-50">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-4 py-3 text-gray-600 hover:bg-gray-50 transition-colors font-medium"
                  >
                    +
                  </button>
                </div>
                <button
                  onClick={handleAddToCart}
                  disabled={addingToCart}
                  className="flex-1 flex items-center justify-center gap-3 px-6 py-3 bg-gradient-to-r from-primary to-accent text-white font-medium rounded-xl hover:from-primary/90 hover:to-accent/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {addingToCart ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      <span className="text-lg">Adding...</span>
                    </>
                  ) : (
                    <>
                      <ShoppingCartIcon className="h-6 w-6" />
                      <span className="text-lg">Add to Cart</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Product Features */}
            <div className="mt-8">
              <h3 className="text-sm font-medium text-gray-900">Key Features</h3>
              <ul className="mt-4 space-y-2">
                {specs.features.map((feature: string, index: number) => (
                  <li key={index} className="flex items-start">
                    <CheckCircleIcon className="h-5 w-5 text-green-500 mt-0.5" />
                    <span className="ml-2 text-sm text-gray-600">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mt-16">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              {['description', 'specifications', 'reviews'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setSelectedTab(tab)}
                  className={`${
                    selectedTab === tab
                      ? 'border-accent text-accent'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm capitalize`}
                >
                  {tab}
                </button>
              ))}
            </nav>
          </div>

          <div className="mt-8">
            {selectedTab === 'description' && (
              <div className="prose max-w-none">
                <p className="text-gray-600">{product.description}</p>
                <p className="mt-4 text-gray-600">
                  This premium product is designed with the highest quality materials and craftsmanship. 
                  It combines modern aesthetics with practical functionality, making it the perfect addition 
                  to your collection. The attention to detail and superior build quality ensure that this 
                  product will serve you well for years to come.
                </p>
              </div>
            )}

            {selectedTab === 'specifications' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {Object.entries(specs.specifications).map(([key, value]) => (
                  <div key={key} className="flex justify-between py-2 border-b">
                    <span className="text-gray-600">{key}</span>
                    <span className="text-gray-900 font-medium">{String(value)}</span>
                  </div>
                ))}
              </div>
            )}

            {selectedTab === 'reviews' && (
              <div className="space-y-8">
                {/* Mock reviews */}
                {[1, 2, 3].map((review) => (
                  <div key={review} className="border-b pb-8">
                    <div className="flex items-center mb-4">
                      <div className="flex items-center">
                        {[0, 1, 2, 3, 4].map((rating) => (
                          <StarIconSolid
                            key={rating}
                            className="h-5 w-5 text-yellow-400"
                          />
                        ))}
                      </div>
                      <span className="ml-2 text-sm text-gray-500">John Doe</span>
                      <span className="mx-2 text-gray-300">•</span>
                      <span className="text-sm text-gray-500">2 months ago</span>
                    </div>
                    <p className="text-gray-600">
                      This product exceeded my expectations. The quality is outstanding and it&apos;s exactly 
                      what I was looking for. Highly recommend!
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Related Products */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">You may also like</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {relatedProducts.map((relatedProduct) => (
              <div
                key={relatedProduct.id}
                onClick={() => router.push(`/products/${relatedProduct.id}`)}
                className="card group cursor-pointer"
              >
                <div className="relative aspect-square overflow-hidden">
                  <Image
                    src={relatedProduct.imageUrl}
                    alt={relatedProduct.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">{relatedProduct.name}</h3>
                  <p className="text-sm text-gray-600 mb-2 line-clamp-2">{relatedProduct.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-bold text-primary">${relatedProduct.price.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Image Zoom Modal */}
      {isImageZoomed && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4"
          onClick={() => setIsImageZoomed(false)}
        >
          <div className="relative w-full max-w-4xl aspect-square">
            <Image
              src={product.imageUrl}
              alt={product.name}
              fill
              sizes="100vw"
              className="object-contain"
              priority
            />
            <button
              className="absolute top-4 right-4 bg-white rounded-full p-2 shadow-md hover:bg-gray-100"
              onClick={() => setIsImageZoomed(false)}
            >
              <svg className="h-6 w-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}