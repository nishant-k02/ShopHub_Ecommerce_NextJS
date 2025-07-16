import { Product } from './lib/db';

export const products: Product[] = [
  // Gaming Laptops (8 products)
  {
    id: 'laptop-001',
    name: 'Gaming Laptop Pro X1',
    description: 'High-performance gaming laptop with RTX 4060, Intel i7 processor, 16GB RAM, and 512GB SSD. Perfect for gaming and creative work.',
    price: 1299,
    category: 'laptops',
    imageUrl: 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=500&h=500&fit=crop'
  },
  {
    id: 'laptop-002',
    name: 'UltraBook Business Edition',
    description: 'Lightweight business laptop with 14-inch display, Intel i5 processor, 8GB RAM, and all-day battery life. Ideal for professionals.',
    price: 899,
    category: 'laptops',
    imageUrl: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=500&h=500&fit=crop'
  },
  {
    id: 'laptop-003',
    name: 'Student Budget Laptop',
    description: 'Affordable laptop for students with 15.6-inch screen, AMD Ryzen 3 processor, 4GB RAM, and 256GB SSD. Great for everyday tasks.',
    price: 449,
    category: 'laptops',
    imageUrl: 'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=500&h=500&fit=crop'
  },
  {
    id: 'laptop-004',
    name: 'Gaming Beast RTX 4070',
    description: 'Ultimate gaming machine with RTX 4070, Intel i9 processor, 32GB RAM, 1TB SSD. For serious gamers and content creators.',
    price: 2199,
    category: 'laptops',
    imageUrl: 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=500&h=500&fit=crop'
  },
  {
    id: 'laptop-005',
    name: 'Creator Workstation Pro',
    description: '4K display laptop with color accuracy, Intel i7, 16GB RAM, dedicated graphics. Perfect for designers and video editors.',
    price: 1599,
    category: 'laptops',
    imageUrl: 'https://images.unsplash.com/photo-1588702547923-7093a6c3ba33?w=500&h=500&fit=crop'
  },
  {
    id: 'laptop-006',
    name: 'Ultralight Travel Laptop',
    description: 'Ultra-portable 13-inch laptop weighing only 2.5lbs, Intel i5, 8GB RAM, 20-hour battery life.',
    price: 1099,
    category: 'laptops',
    imageUrl: 'https://images.unsplash.com/photo-1484788984921-03950022c9ef?w=500&h=500&fit=crop'
  },
  {
    id: 'laptop-007',
    name: 'Budget Gaming Laptop',
    description: 'Entry-level gaming laptop with GTX 1650, AMD Ryzen 5, 8GB RAM, 512GB SSD. Great starter gaming machine.',
    price: 799,
    category: 'laptops',
    imageUrl: 'https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=500&h=500&fit=crop'
  },
  {
    id: 'laptop-008',
    name: 'Convertible 2-in-1 Laptop',
    description: 'Versatile 2-in-1 laptop/tablet with touchscreen, stylus support, Intel i5, 12GB RAM. Perfect for creativity.',
    price: 999,
    category: 'laptops',
    imageUrl: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=500&h=500&fit=crop'
  },

  // Smartphones (12 products)
  {
    id: 'phone-001',
    name: 'ProMax Smartphone 5G',
    description: 'Latest flagship smartphone with 6.7-inch OLED display, triple camera system, 128GB storage, and 5G connectivity.',
    price: 999,
    category: 'smartphones',
    imageUrl: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500&h=500&fit=crop'
  },
  {
    id: 'phone-002',
    name: 'Mid-Range Camera Phone',
    description: 'Excellent camera phone with 48MP main sensor, 6.1-inch display, 64GB storage, and fast charging. Great value for money.',
    price: 399,
    category: 'smartphones',
    imageUrl: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=500&h=500&fit=crop'
  },
  {
    id: 'phone-003',
    name: 'Budget Android Phone',
    description: 'Affordable Android phone with 5.5-inch display, dual cameras, 32GB storage, and reliable performance for basic needs.',
    price: 199,
    category: 'smartphones',
    imageUrl: 'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=500&h=500&fit=crop'
  },
  {
    id: 'phone-004',
    name: 'Ultra Premium Smartphone',
    description: 'Top-tier smartphone with 6.8-inch 120Hz display, 256GB storage, wireless charging, premium build quality.',
    price: 1299,
    category: 'smartphones',
    imageUrl: 'https://images.unsplash.com/photo-1544117519-31a4b719223d?w=500&h=500&fit=crop'
  },
  {
    id: 'phone-005',
    name: 'Gaming Phone Pro',
    description: 'Gaming-focused smartphone with 90Hz display, gaming triggers, cooling system, 12GB RAM, 256GB storage.',
    price: 899,
    category: 'smartphones',
    imageUrl: 'https://images.unsplash.com/photo-1556656793-08538906a9f8?w=500&h=500&fit=crop'
  },
  {
    id: 'phone-006',
    name: 'Compact Flagship',
    description: 'Premium compact phone with 5.4-inch display, flagship processor, excellent cameras in a small form factor.',
    price: 699,
    category: 'smartphones',
    imageUrl: 'https://images.unsplash.com/photo-1567721913486-6585f069b332?w=500&h=500&fit=crop'
  },
  {
    id: 'phone-007',
    name: 'Photography Master Phone',
    description: 'Camera-centric phone with 108MP main sensor, periscope zoom, night mode, professional photo features.',
    price: 1099,
    category: 'smartphones',
    imageUrl: 'https://images.unsplash.com/photo-1574944985070-8f3ebc6b79d2?w=500&h=500&fit=crop'
  },
  {
    id: 'phone-008',
    name: 'Rugged Outdoor Phone',
    description: 'Military-grade rugged phone with IP68 rating, drop protection, long battery life, dual SIM support.',
    price: 449,
    category: 'smartphones',
    imageUrl: 'https://images.unsplash.com/photo-1580910051074-3eb694886505?w=500&h=500&fit=crop'
  },
  {
    id: 'phone-009',
    name: 'Senior Friendly Phone',
    description: 'Easy-to-use smartphone with large buttons, simple interface, emergency features, long battery life.',
    price: 299,
    category: 'smartphones',
    imageUrl: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=500&h=500&fit=crop'
  },
  {
    id: 'phone-010',
    name: 'Foldable Screen Phone',
    description: 'Innovative foldable smartphone with dual screens, premium build, multitasking capabilities.',
    price: 1799,
    category: 'smartphones',
    imageUrl: 'https://images.unsplash.com/photo-1585060544812-6b45742d762f?w=500&h=500&fit=crop'
  },
  {
    id: 'phone-011',
    name: 'Business Security Phone',
    description: 'Enterprise-grade smartphone with enhanced security features, encrypted storage, business apps.',
    price: 799,
    category: 'smartphones',
    imageUrl: 'https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=500&h=500&fit=crop'
  },
  {
    id: 'phone-012',
    name: 'Long Battery Life Phone',
    description: 'Marathon battery smartphone with 6000mAh battery, 3-day battery life, fast charging, efficient processor.',
    price: 349,
    category: 'smartphones',
    imageUrl: 'https://images.unsplash.com/photo-1605236453806-6ff36851218e?w=500&h=500&fit=crop'
  },

  // Audio Equipment (12 products)
  {
    id: 'audio-001',
    name: 'Wireless Noise-Canceling Headphones',
    description: 'Premium over-ear headphones with active noise cancellation, 30-hour battery, and superior sound quality.',
    price: 299,
    category: 'audio',
    imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&h=500&fit=crop'
  },
  {
    id: 'audio-002',
    name: 'True Wireless Earbuds',
    description: 'Compact wireless earbuds with charging case, touch controls, and 6-hour battery life. Perfect for workouts.',
    price: 89,
    category: 'audio',
    imageUrl: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=500&h=500&fit=crop'
  },
  {
    id: 'audio-003',
    name: 'Gaming Headset RGB',
    description: 'Gaming headset with RGB lighting, surround sound, noise-canceling microphone, and comfortable design.',
    price: 79,
    category: 'audio',
    imageUrl: 'https://images.unsplash.com/photo-1599669454699-248893623440?w=500&h=500&fit=crop'
  },
  {
    id: 'audio-004',
    name: 'Bluetooth Speaker Portable',
    description: 'Portable Bluetooth speaker with powerful bass, waterproof design, and 12-hour battery life.',
    price: 59,
    category: 'audio',
    imageUrl: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=500&h=500&fit=crop'
  },
  {
    id: 'audio-005',
    name: 'Studio Monitor Headphones',
    description: 'Professional studio headphones with flat frequency response, comfortable fit, detachable cable.',
    price: 199,
    category: 'audio',
    imageUrl: 'https://images.unsplash.com/photo-1558756520-22cfe5d382ca?w=500&h=500&fit=crop'
  },
  {
    id: 'audio-006',
    name: 'Smart Speaker with Assistant',
    description: 'AI-powered smart speaker with voice control, smart home integration, premium sound quality.',
    price: 129,
    category: 'audio',
    imageUrl: 'https://images.unsplash.com/photo-1543512214-318c7553f230?w=500&h=500&fit=crop'
  },
  {
    id: 'audio-007',
    name: 'Audiophile Wired Headphones',
    description: 'High-end wired headphones with planar drivers, premium materials, exceptional sound clarity.',
    price: 499,
    category: 'audio',
    imageUrl: 'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=500&h=500&fit=crop'
  },
  {
    id: 'audio-008',
    name: 'Sports Wireless Earbuds',
    description: 'Sweat-resistant earbuds with secure fit, quick charge, perfect for running and gym workouts.',
    price: 119,
    category: 'audio',
    imageUrl: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=500&h=500&fit=crop'
  },
  {
    id: 'audio-009',
    name: 'Party Speaker Large',
    description: 'Large party speaker with LED lights, karaoke features, powerful bass, and wireless connectivity.',
    price: 249,
    category: 'audio',
    imageUrl: 'https://images.unsplash.com/photo-1563330232-57114bb0823c?w=500&h=500&fit=crop'
  },
  {
    id: 'audio-010',
    name: 'Noise-Canceling Earbuds',
    description: 'Premium earbuds with active noise cancellation, transparency mode, wireless charging case.',
    price: 179,
    category: 'audio',
    imageUrl: 'https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb?w=500&h=500&fit=crop'
  },
  {
    id: 'audio-011',
    name: 'Budget Wired Headphones',
    description: 'Affordable wired headphones with good sound quality, comfortable padding, and inline microphone.',
    price: 29,
    category: 'audio',
    imageUrl: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=500&h=500&fit=crop'
  },
  {
    id: 'audio-012',
    name: 'Professional DJ Headphones',
    description: 'DJ headphones with swivel design, powerful drivers, detachable cable, perfect for professional use.',
    price: 149,
    category: 'audio',
    imageUrl: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=500&h=500&fit=crop'
  },

  // Smartwatches & Wearables (8 products)
  {
    id: 'watch-001',
    name: 'Fitness Smartwatch Pro',
    description: 'Advanced fitness tracker with heart rate monitoring, GPS, sleep tracking, and 7-day battery life.',
    price: 249,
    category: 'wearables',
    imageUrl: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&h=500&fit=crop'
  },
  {
    id: 'watch-002',
    name: 'Sport Fitness Band',
    description: 'Lightweight fitness band with step counter, sleep tracking, water resistance, and smartphone notifications.',
    price: 49,
    category: 'wearables',
    imageUrl: 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=500&h=500&fit=crop'
  },
  {
    id: 'watch-003',
    name: 'Premium Smartwatch',
    description: 'Luxury smartwatch with cellular connectivity, ECG monitoring, always-on display, premium materials.',
    price: 399,
    category: 'wearables',
    imageUrl: 'https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?w=500&h=500&fit=crop'
  },
  {
    id: 'watch-004',
    name: 'Kids Safety Smartwatch',
    description: 'Child-friendly smartwatch with GPS tracking, video calling, educational games, parental controls.',
    price: 129,
    category: 'wearables',
    imageUrl: 'https://images.unsplash.com/photo-1557438159-51eec7a6c9e8?w=500&h=500&fit=crop'
  },
  {
    id: 'watch-005',
    name: 'Outdoor Adventure Watch',
    description: 'Rugged smartwatch with military standard, altimeter, compass, weather alerts, extreme sports tracking.',
    price: 299,
    category: 'wearables',
    imageUrl: 'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=500&h=500&fit=crop'
  },
  {
    id: 'watch-006',
    name: 'Fashion Smartwatch',
    description: 'Stylish smartwatch with interchangeable bands, jewelry-like design, health tracking, long battery.',
    price: 199,
    category: 'wearables',
    imageUrl: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=500&h=500&fit=crop'
  },
  {
    id: 'watch-007',
    name: 'Budget Fitness Tracker',
    description: 'Basic fitness tracker with heart rate monitor, step counting, sleep analysis, 10-day battery.',
    price: 79,
    category: 'wearables',
    imageUrl: 'https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?w=500&h=500&fit=crop'
  },
  {
    id: 'watch-008',
    name: 'Health Monitoring Watch',
    description: 'Health-focused smartwatch with blood oxygen, stress monitoring, medication reminders, elderly-friendly.',
    price: 179,
    category: 'wearables',
    imageUrl: 'https://images.unsplash.com/photo-1609081219090-a6d81d3085bf?w=500&h=500&fit=crop'
  },

  // Tablets (6 products)
  {
    id: 'tablet-001',
    name: 'Pro Tablet 12.9-inch',
    description: 'Professional tablet with 12.9-inch display, powerful processor, Apple Pencil support, and all-day battery.',
    price: 799,
    category: 'tablets',
    imageUrl: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=500&h=500&fit=crop'
  },
  {
    id: 'tablet-002',
    name: 'Budget Android Tablet',
    description: 'Affordable 10-inch Android tablet for entertainment, reading, and basic productivity tasks.',
    price: 179,
    category: 'tablets',
    imageUrl: 'https://images.unsplash.com/photo-1585789575989-53fb8ce1c543?w=500&h=500&fit=crop'
  },
  {
    id: 'tablet-003',
    name: 'Drawing Tablet Pro',
    description: 'Artist tablet with pressure-sensitive stylus, color accuracy, large screen perfect for digital art.',
    price: 649,
    category: 'tablets',
    imageUrl: 'https://images.unsplash.com/photo-1594736797933-d0501ba2fe65?w=500&h=500&fit=crop'
  },
  {
    id: 'tablet-004',
    name: 'Kids Educational Tablet',
    description: 'Child-safe tablet with educational apps, parental controls, durable case, and long battery life.',
    price: 149,
    category: 'tablets',
    imageUrl: 'https://images.unsplash.com/photo-1609252825120-7b7cea099b6d?w=500&h=500&fit=crop'
  },
  {
    id: 'tablet-005',
    name: 'Gaming Tablet',
    description: 'High-performance gaming tablet with powerful processor, high refresh rate display, gaming accessories.',
    price: 499,
    category: 'tablets',
    imageUrl: 'https://images.unsplash.com/photo-1596727147705-61a532a659bd?w=500&h=500&fit=crop'
  },
  {
    id: 'tablet-006',
    name: 'E-Reader Tablet',
    description: 'E-ink display tablet perfect for reading, weeks of battery life, lightweight, eye-friendly screen.',
    price: 129,
    category: 'tablets',
    imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&h=500&fit=crop'
  },

  // Computer Accessories (8 products)
  {
    id: 'accessory-001',
    name: 'Mechanical Gaming Keyboard',
    description: 'RGB backlit mechanical keyboard with blue switches, programmable keys, and durable construction.',
    price: 129,
    category: 'accessories',
    imageUrl: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=500&h=500&fit=crop'
  },
  {
    id: 'accessory-002',
    name: 'Wireless Gaming Mouse',
    description: 'Precision wireless gaming mouse with customizable DPI, RGB lighting, and ergonomic design.',
    price: 79,
    category: 'accessories',
    imageUrl: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=500&h=500&fit=crop'
  },
  {
    id: 'accessory-003',
    name: 'USB-C Hub Multi-Port',
    description: 'Versatile USB-C hub with HDMI, USB 3.0 ports, SD card reader, and fast charging support.',
    price: 39,
    category: 'accessories',
    imageUrl: 'https://images.unsplash.com/photo-1625842268584-8f3296236761?w=500&h=500&fit=crop'
  },
  {
    id: 'accessory-004',
    name: 'Wireless Charging Pad',
    description: 'Fast wireless charging pad compatible with all Qi devices, sleek design, LED indicators.',
    price: 29,
    category: 'accessories',
    imageUrl: 'https://images.unsplash.com/photo-1570695262405-0ae3c50c67d9?w=500&h=500&fit=crop'
  },
  {
    id: 'accessory-005',
    name: 'Laptop Stand Adjustable',
    description: 'Ergonomic laptop stand with adjustable height and angle, aluminum construction, heat dissipation.',
    price: 49,
    category: 'accessories',
    imageUrl: 'https://images.unsplash.com/photo-1664735131735-98084e5da52c?w=500&h=500&fit=crop'
  },
  {
    id: 'accessory-006',
    name: 'External Hard Drive 2TB',
    description: 'Portable 2TB external hard drive with USB 3.0, compact design, data backup and storage.',
    price: 89,
    category: 'accessories',
    imageUrl: 'https://images.unsplash.com/photo-1588492069485-d4d4b2150d8b?w=500&h=500&fit=crop'
  },
  {
    id: 'accessory-007',
    name: 'Webcam 4K HD',
    description: '4K webcam with autofocus, noise reduction microphone, perfect for streaming and video calls.',
    price: 99,
    category: 'accessories',
    imageUrl: 'https://images.unsplash.com/photo-1588083949404-c4e18ddd4fb8?w=500&h=500&fit=crop'
  },
  {
    id: 'accessory-008',
    name: 'Monitor Stand Dual',
    description: 'Dual monitor stand with adjustable arms, cable management, supports up to 27-inch displays.',
    price: 119,
    category: 'accessories',
    imageUrl: 'https://images.unsplash.com/photo-1616422285623-13ff0162193c?w=500&h=500&fit=crop'
  },

  // Cameras (6 products)
  {
    id: 'camera-001',
    name: 'DSLR Camera Kit',
    description: 'Professional DSLR camera with 24MP sensor, 18-55mm lens, and advanced autofocus system.',
    price: 699,
    category: 'cameras',
    imageUrl: 'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=500&h=500&fit=crop'
  },
  {
    id: 'camera-002',
    name: 'Action Camera 4K',
    description: 'Compact 4K action camera with image stabilization, waterproof housing, and multiple mounting options.',
    price: 199,
    category: 'cameras',
    imageUrl: 'https://images.unsplash.com/photo-1530124566582-a618bc2615dc?w=500&h=500&fit=crop'
  },
  {
    id: 'camera-003',
    name: 'Mirrorless Camera Pro',
    description: 'Professional mirrorless camera with 32MP sensor, 4K video, compact design, interchangeable lenses.',
    price: 1299,
    category: 'cameras',
    imageUrl: 'https://images.unsplash.com/photo-1606983340126-99ab4feaa64a?w=500&h=500&fit=crop'
  },
  {
    id: 'camera-004',
    name: 'Instant Camera Retro',
    description: 'Retro instant camera with built-in flash, selfie mirror, fun filters, and instant photo printing.',
    price: 99,
    category: 'cameras',
    imageUrl: 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=500&h=500&fit=crop'
  },
  {
    id: 'camera-005',
    name: 'Security Camera System',
    description: 'Wireless security camera system with 4 cameras, night vision, mobile app, cloud storage.',
    price: 299,
    category: 'cameras',
    imageUrl: 'https://images.unsplash.com/photo-1558618047-fcd65c5cd89c?w=500&h=500&fit=crop'
  },
  {
    id: 'camera-006',
    name: 'Drone with 4K Camera',
    description: 'Foldable drone with 4K camera, GPS return home, intelligent flight modes, 30-minute flight time.',
    price: 799,
    category: 'cameras',
    imageUrl: 'https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=500&h=500&fit=crop'
  }
]; 