'use client';

import { useState, use } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { products } from '../../product-data';
import { 
  HeartIcon, 
  ShoppingCartIcon, 
  StarIcon, 
  TruckIcon, 
  ShieldCheckIcon, 
  ArrowPathIcon,
  CheckCircleIcon,
  InformationCircleIcon,
  MagnifyingGlassIcon
} from '@heroicons/react/24/outline';
import { HeartIcon as HeartIconSolid, StarIcon as StarIconSolid } from '@heroicons/react/24/solid';

// Mock product specifications - in a real app, this would come from your database
const getProductSpecs = (productId: string) => {
  const specs = {
    dimensions: '10 x 5 x 2 inches',
    weight: '1.5 lbs',
    material: 'Premium materials',
    color: 'Multiple colors available',
    warranty: '2 years',
    inStock: true,
    sku: `SKU-${productId}`,
    brand: 'Premium Brand',
    category: 'Electronics',
    features: [
      'High-quality construction',
      'Easy to use',
      'Durable design',
      'Modern aesthetics',
      'Energy efficient'
    ],
    specifications: {
      'Product Type': 'Premium Product',
      'Model Number': `MOD-${productId}`,
      'Manufacturer': 'Premium Brand',
      'Country of Origin': 'United States',
      'Assembly Required': 'No',
      'Battery Included': 'Yes',
      'Battery Type': 'Lithium-ion',
      'Warranty Period': '2 years',
      'Certification': 'CE, FCC, RoHS'
    }
  };
  return specs;
};

export default function ProductDetail({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const [selectedTab, setSelectedTab] = useState('description');
  const [quantity, setQuantity] = useState(1);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isImageZoomed, setIsImageZoomed] = useState(false);

  // Unwrap params using React.use()
  const { id } = use(params);
  const product = products.find(p => p.id === id);
  const specs = product ? getProductSpecs(product.id) : null;

  // Mock additional product images - in a real app, these would come from your database
  const productImages = [
    product?.imageUrl,
    'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80',
    'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80',
    'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=800&q=80'
  ].filter(Boolean) as string[];

  if (!product || !specs) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Product Not Found</h1>
          <button
            onClick={() => router.push('/products')}
            className="btn btn-primary"
          >
            Back to Products
          </button>
        </div>
      </div>
    );
  }

  const relatedProducts = products.filter(p => p.id !== product.id).slice(0, 4);

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
                      sizes="(max-width: 768px) 25vw, (max-width: 1200px) 12vw, 8vw"
                      className="object-cover hover:scale-105 transition-transform duration-200"
                    />
                  </div>
                ))}
              </div>

              {/* Product Status */}
              <div className="mt-6 flex items-center justify-between">
                <div className="flex items-center">
                  <CheckCircleIcon className={`h-5 w-5 ${specs.inStock ? 'text-green-500' : 'text-red-500'}`} />
                  <span className="ml-2 text-sm text-gray-600">
                    {specs.inStock ? 'In Stock' : 'Out of Stock'}
                  </span>
                </div>
                <span className="text-sm text-gray-500">SKU: {specs.sku}</span>
              </div>
            </div>
          </div>

          {/* Product Info */}
          <div className="mt-10 px-4 sm:mt-16 sm:px-0 lg:mt-0">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-3xl font-bold tracking-tight text-gray-900">{product.name}</h1>
                <p className="mt-2 text-sm text-gray-500">Brand: {specs.brand}</p>
                <div className="mt-3 flex items-center">
                  <div className="flex items-center">
                    {[0, 1, 2, 3, 4].map((rating) => (
                      <StarIconSolid
                        key={rating}
                        className="h-5 w-5 text-yellow-400"
                      />
                    ))}
                  </div>
                  <p className="ml-2 text-sm text-gray-500">(24 reviews)</p>
                </div>
              </div>
              <button
                onClick={() => setIsFavorite(!isFavorite)}
                className="p-2 rounded-full hover:bg-gray-100"
              >
                {isFavorite ? (
                  <HeartIconSolid className="h-6 w-6 text-red-500" />
                ) : (
                  <HeartIcon className="h-6 w-6 text-gray-400" />
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
                <div className="flex items-center border rounded-md">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3 py-2 text-gray-600 hover:bg-gray-100"
                  >
                    -
                  </button>
                  <span className="px-4 py-2 text-gray-900">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-3 py-2 text-gray-600 hover:bg-gray-100"
                  >
                    +
                  </button>
                </div>
                <button
                  onClick={() => router.push('/cart')}
                  className="flex-1 btn btn-primary flex items-center justify-center gap-2"
                >
                  <ShoppingCartIcon className="h-5 w-5" />
                  Add to Cart
                </button>
              </div>
            </div>

            {/* Product Features */}
            <div className="mt-8">
              <h3 className="text-sm font-medium text-gray-900">Key Features</h3>
              <ul className="mt-4 space-y-2">
                {specs.features.map((feature, index) => (
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
                    <span className="text-gray-900 font-medium">{value}</span>
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
                      This product exceeded my expectations. The quality is outstanding and it's exactly 
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
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