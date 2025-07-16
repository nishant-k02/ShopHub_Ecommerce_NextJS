import { DynamicTool } from 'langchain/tools';
import { getProductsCollection, getOrdersCollection, Product, Order } from '../db';

// Tool for product recommendations based on user queries with cart functionality
export const productRecommendationTool = new DynamicTool({
  name: 'product_recommendation',
  description: `Use this tool to find and recommend products based on user queries. 
  This tool can handle queries like:
  - "Show me wireless headphones under $100"
  - "I need a laptop for gaming"
  - "Find smartphones with good cameras"
  - "What electronics do you have?"
  - Product recommendations by category, price range, or features`,
  func: async (input: string): Promise<string> => {
    try {
      const collection = await getProductsCollection();
      
      // Check if user wants to see all products
      const searchTerms = input.toLowerCase();
      const showAllRequests = [
        'all products', 'show all', 'view all', 'list all', 'everything',
        'entire catalog', 'full catalog', 'complete list', 'browse all',
        'all items', 'all electronics', 'whole inventory'
      ];
      
      const isShowAllRequest = showAllRequests.some(phrase => searchTerms.includes(phrase));
      const productLimit = isShowAllRequest ? 60 : 6; // Show all 60 or limit to 6
      
      // Extract price filters
      const underMatch = input.match(/under\s*\$?(\d+)|below\s*\$?(\d+)|less\s*than\s*\$?(\d+)/i);
      const overMatch = input.match(/over\s*\$?(\d+)|above\s*\$?(\d+)|more\s*than\s*\$?(\d+)/i);
      const exactMatch = input.match(/around\s*\$?(\d+)|about\s*\$?(\d+)/i);
      
      const maxPrice = underMatch ? parseInt(underMatch[1] || underMatch[2] || underMatch[3]) : null;
      const minPrice = overMatch ? parseInt(overMatch[1] || overMatch[2] || overMatch[3]) : null;
      const targetPrice = exactMatch ? parseInt(exactMatch[1] || exactMatch[2]) : null;
      
      // Extract category or product type keywords (moved after show all check)
      const searchTermsLower = input.toLowerCase();
      
      let query: any = {};
      let sortOptions: any = { price: 1 }; // Default sort by price ascending
      
      // Add price filters
      if (targetPrice) {
        // For "around $X", search within ±20% range
        const range = targetPrice * 0.2;
        query.price = { $gte: targetPrice - range, $lte: targetPrice + range };
      } else {
        if (maxPrice) query.price = { ...query.price, $lte: maxPrice };
        if (minPrice) query.price = { ...query.price, $gte: minPrice };
      }
      
      // Enhanced category and keyword matching
      let products: Product[] = [];
      
      try {
        // Category-specific searches with better keyword matching
        if (searchTermsLower.includes('laptop') || searchTermsLower.includes('computer') || searchTermsLower.includes('notebook')) {
          query.$or = [
            { category: { $regex: /laptops?|computers?/i } },
            { name: { $regex: /laptop|computer|notebook|pc/i } },
            { description: { $regex: /laptop|computer|notebook|pc/i } }
          ];
          
          // Sort gaming laptops by price descending (more expensive = better for gaming)
          if (searchTermsLower.includes('gaming')) {
            sortOptions = { price: -1 };
          }
        } 
        else if (searchTermsLower.includes('phone') || searchTermsLower.includes('smartphone') || searchTermsLower.includes('mobile')) {
          query.$or = [
            { category: { $regex: /smartphones?|phones?|mobile/i } },
            { name: { $regex: /phone|smartphone|mobile/i } },
            { description: { $regex: /phone|smartphone|mobile/i } }
          ];
        }
        else if (searchTermsLower.includes('headphone') || searchTermsLower.includes('earphone') || searchTermsLower.includes('earbuds') || 
                 searchTermsLower.includes('audio') || searchTermsLower.includes('speaker') || searchTermsLower.includes('wireless')) {
          query.$or = [
            { category: { $regex: /audio|headphones?|speakers?/i } },
            { name: { $regex: /headphone|earphone|earbuds|audio|speaker|wireless/i } },
            { description: { $regex: /headphone|earphone|earbuds|audio|speaker|wireless/i } }
          ];
        }
        else if (searchTermsLower.includes('watch') || searchTermsLower.includes('smartwatch') || searchTermsLower.includes('fitness') || searchTermsLower.includes('wearable')) {
          query.$or = [
            { category: { $regex: /wearables?|watch/i } },
            { name: { $regex: /watch|smartwatch|fitness|wearable/i } },
            { description: { $regex: /watch|smartwatch|fitness|wearable|tracker/i } }
          ];
        }
        else if (searchTermsLower.includes('tablet') || searchTermsLower.includes('ipad')) {
          query.$or = [
            { category: { $regex: /tablets?/i } },
            { name: { $regex: /tablet|ipad/i } },
            { description: { $regex: /tablet|ipad/i } }
          ];
        }
        else if (searchTermsLower.includes('camera') || searchTermsLower.includes('photography')) {
          query.$or = [
            { category: { $regex: /cameras?/i } },
            { name: { $regex: /camera|photo/i } },
            { description: { $regex: /camera|photo/i } }
          ];
        }
        else if (searchTermsLower.includes('keyboard') || searchTermsLower.includes('mouse') || searchTermsLower.includes('accessory')) {
          query.$or = [
            { category: { $regex: /accessories?/i } },
            { name: { $regex: /keyboard|mouse|hub|accessory/i } },
            { description: { $regex: /keyboard|mouse|hub|accessory/i } }
          ];
        }
        else {
          // General search using text index first, then regex fallback
          try {
            // Try text search if available
            products = await collection
              .find({ 
                $text: { $search: input },
                ...query 
              })
              .sort(sortOptions)
              .limit(productLimit)
              .toArray();
          } catch (textSearchError) {
            // Fallback to regex search
            const keywords = input.replace(/under\s*\$?\d+|below\s*\$?\d+|less\s*than\s*\$?\d+|over\s*\$?\d+|above\s*\$?\d+|more\s*than\s*\$?\d+/gi, '')
                                 .split(' ')
                                 .filter(word => word.length > 2)
                                 .join('|');
            
            if (keywords) {
              query.$or = [
                { name: { $regex: keywords, $options: 'i' } },
                { description: { $regex: keywords, $options: 'i' } },
                { category: { $regex: keywords, $options: 'i' } }
              ];
            }
          }
        }
        
        // Execute query if not already done by text search
        if (products.length === 0) {
          products = await collection
            .find(query)
            .sort(sortOptions)
            .limit(productLimit)
            .toArray();
        }
          
      } catch (error) {
        console.error('Error in product search:', error);
        // Ultimate fallback - get some products
        products = await collection
          .find({})
          .sort({ price: 1 })
          .limit(isShowAllRequest ? 60 : 5)
          .toArray();
      }

      if (!products || products.length === 0) {
        return `I couldn't find any products matching your criteria. Here are some suggestions to try:

🔍 **Search Tips:**
- "wireless headphones under $100"
- "gaming laptop"
- "budget smartphone"
- "fitness smartwatch"
- "4K camera"

📱 **Available Categories:**
- Laptops & Computers (8 products)
- Smartphones (12 products)  
- Audio & Headphones (12 products)
- Smartwatches & Wearables (8 products)
- Tablets (6 products)
- Cameras & Photography (6 products)
- Computer Accessories (8 products)

**💡 We now have 60 products available!** Would you like me to show you our popular products or help you search for something specific?`;
      }

      // Return structured data with both text and products
      let contextualInfo = '';
      if (maxPrice) {
        contextualInfo = `Filtering products under $${maxPrice}`;
      }
      if (minPrice) {
        contextualInfo = `Filtering products over $${minPrice}`;
      }
      if (searchTermsLower.includes('gaming')) {
        contextualInfo += contextualInfo ? ' • Gaming products' : 'Gaming products';
      }
      if (searchTermsLower.includes('budget') || searchTermsLower.includes('cheap') || searchTermsLower.includes('affordable')) {
        contextualInfo += contextualInfo ? ' • Budget-friendly options' : 'Budget-friendly options';
      }

      const responseText = isShowAllRequest 
        ? `🛍️ **Complete Product Catalog** - Showing all ${products.length} products ${contextualInfo ? `(${contextualInfo})` : ''}:`
        : `Found ${products.length} product${products.length > 1 ? 's' : ''} ${contextualInfo ? `(${contextualInfo})` : ''}:`;

      // Return JSON string with both text and products
      return JSON.stringify({
        text: responseText,
        products: products.map(product => ({
          id: product.id,
          name: product.name,
          description: product.description,
          price: product.price,
          imageUrl: product.imageUrl,
          category: product.category
        }))
      });

    } catch (error) {
      console.error('Error in product recommendation tool:', error);
      return 'I encountered an error while searching for products. Please try again or contact support if the issue persists.';
    }
  },
});

// Tool for adding products to cart
export const addToCartTool = new DynamicTool({
  name: 'add_to_cart',
  description: `Use this tool when users want to add products to their cart. 
  This tool can handle queries like:
  - "add laptop-001 to cart"
  - "add this product to cart"
  - "I want to buy this item"
  - "add to cart [product-id]"
  Note: Requires user authentication and valid product ID.`,
  func: async (input: string): Promise<string> => {
    try {
      // Extract product ID from input
      const productIdMatch = input.match(/(?:add\s+|buy\s+)([a-z0-9-]+)(?:\s+to\s+cart)?/i);
      const productId = productIdMatch ? productIdMatch[1] : null;
      
      if (!productId) {
        return `❌ **Product ID Required**

To add a product to your cart, please specify the product ID:

**Examples:**
• "add laptop-001 to cart"
• "add phone-002 to cart"
• "buy audio-003"

**💡 Tip:** Look for the product ID in the recommendations above, or ask me to show you products first!

What product would you like to add to your cart?`;
      }

      // Verify product exists
      const productsCollection = await getProductsCollection();
      const product = await productsCollection.findOne({ id: productId });
      
      if (!product) {
        return `❌ **Product Not Found**

The product ID "${productId}" doesn't exist in our catalog.

**Please check:**
• Make sure you copied the product ID correctly
• Ask me to show you products first: "show me laptops"
• Browse our categories to find the right product

Would you like me to help you find a specific product?`;
      }

      // Note: In a real implementation, you would check user authentication here
      // For now, we'll provide instructions for the user interface
      
      return `🛒 **Ready to Add to Cart!**

**Product:** ${getCategoryEmoji(product.category)} ${product.name}
**Price:** $${product.price.toLocaleString()}

**To complete this action:**

🔐 **If you're logged in:**
Your product will be added to cart automatically through the chat interface.

🚫 **If you're not logged in:**
You'll be redirected to the login page to sign in first, then your item will be added to cart.

**Alternative Actions:**
• 🛍️ Visit the product page directly
• 💝 Add to wishlist instead
• 📊 Compare with other products
• ❓ Ask me questions about this product

**Security Note:** Cart actions require authentication to ensure your items are saved securely to your account.

Would you like me to help you with anything else about this product?`;
      
    } catch (error) {
      console.error('Error in add to cart tool:', error);
      return `⚠️ **Cart Service Temporarily Unavailable**

I'm having trouble accessing the cart system right now. Please try:

1. 🔐 **Log in to your account** if you haven't already
2. 🛍️ **Visit the product page** directly to add to cart
3. 🔄 **Try again** in a few moments
4. 📞 **Contact support** if the issue persists

Sorry for the inconvenience!`;
    }
  },
});

// Helper function to get category emoji
function getCategoryEmoji(category?: string): string {
  if (!category) return '🛍️';
  
  const cat = category.toLowerCase();
  if (cat.includes('laptop') || cat.includes('computer')) return '💻';
  if (cat.includes('phone') || cat.includes('smartphone')) return '📱';
  if (cat.includes('audio') || cat.includes('headphone')) return '🎧';
  if (cat.includes('watch') || cat.includes('wearable')) return '⌚';
  if (cat.includes('tablet')) return '📱';
  if (cat.includes('camera')) return '📷';
  if (cat.includes('accessory')) return '⌨️';
  return '🛍️';
}

// Helper function to format order status
function getStatusInfo(status: string): { emoji: string; description: string; color: string } {
  switch (status.toLowerCase()) {
    case 'pending':
      return {
        emoji: '🟡',
        description: 'Order received and payment is being processed',
        color: 'yellow'
      };
    case 'processing':
      return {
        emoji: '🔵',
        description: 'Order confirmed and being prepared for shipment',
        color: 'blue'
      };
    case 'shipped':
      return {
        emoji: '🚚',
        description: 'Order has been shipped and is on its way',
        color: 'orange'
      };
    case 'delivered':
      return {
        emoji: '✅',
        description: 'Order has been successfully delivered',
        color: 'green'
      };
    case 'cancelled':
      return {
        emoji: '❌',
        description: 'Order has been cancelled',
        color: 'red'
      };
    default:
      return {
        emoji: '📦',
        description: 'Order status unknown',
        color: 'gray'
      };
  }
}

// Helper function to format dates
function formatDate(date: Date): string {
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

// Tool for checking order status - Enhanced with real database queries
export const orderStatusTool = new DynamicTool({
  name: 'order_status',
  description: `Use this tool to check order status and order information. 
  This tool can handle queries like:
  - "What's the status of my order ORD-12345?"
  - "Check my recent orders"
  - "Where is my order?"
  - "When will my order arrive?"
  - "Show me my order history"
  - Can search by order number or provide general order guidance`,
  func: async (input: string): Promise<string> => {
    try {
      const ordersCollection = await getOrdersCollection();
      
      // Extract order number if mentioned
      const orderNumberMatch = input.match(/ORD-[\w\d-]+/i);
      const orderNumber = orderNumberMatch ? orderNumberMatch[0].toUpperCase() : null;
      
      // If specific order number is provided, try to find it
      if (orderNumber) {
        try {
          const order = await ordersCollection.findOne({ orderNumber: orderNumber });
          
          if (order) {
            const statusInfo = getStatusInfo(order.status);
            const orderDate = formatDate(new Date(order.createdAt));
            const estimatedDelivery = order.estimatedDelivery ? formatDate(new Date(order.estimatedDelivery)) : 'Not available';
            
            // Format order items
            const itemsList = order.items.map((item, index) => 
              `${index + 1}. ${item.name} (Qty: ${item.quantity}) - $${item.price.toLocaleString()}`
            ).join('\n   ');
            
            return `📦 **Order Found: ${orderNumber}**

${statusInfo.emoji} **Status:** ${order.status.charAt(0).toUpperCase() + order.status.slice(1)}
📝 **Description:** ${statusInfo.description}

📅 **Order Details:**
- **Order Date:** ${orderDate}
- **Estimated Delivery:** ${estimatedDelivery}
- **Total Amount:** $${order.total.toLocaleString()}

📦 **Items Ordered:**
   ${itemsList}

🚚 **Shipping Address:**
   ${order.shippingAddress.firstName} ${order.shippingAddress.lastName}
   ${order.shippingAddress.address}
   ${order.shippingAddress.city}, ${order.shippingAddress.state} ${order.shippingAddress.zipCode}

💳 **Payment Method:** ${order.paymentInfo.method} ending in ${order.paymentInfo.cardLast4}

${order.status === 'pending' || order.status === 'processing' ? 
  '\n⚠️ **Note:** Orders can be cancelled while in pending or processing status.' : ''}

${order.status === 'shipped' ? 
  '\n📋 **Tracking:** Contact our support team for detailed tracking information.' : ''}

Need help with anything else regarding this order?`;
          } else {
            return `❌ **Order ${orderNumber} Not Found**

The order number you provided doesn't exist in our system. Please:

1. 🔍 **Double-check the order number** - Make sure it's exactly as shown in your confirmation email
2. 🔐 **Log in to your account** - Visit your Orders page to see all your orders
3. 📧 **Check your email** - Look for the order confirmation with the correct number
4. 📞 **Contact support** - If you still can't find it, our team can help

**Order Number Format:** ORD-XXXXX-XXXXX

Would you like me to help you with anything else?`;
          }
        } catch (dbError) {
          console.error('Database error when fetching order:', dbError);
          return `⚠️ **Unable to Check Order ${orderNumber}**

I'm having trouble accessing the order database right now. Please:

1. 🔐 **Log in to your account** and check your Orders page
2. 📞 **Contact our support team** for immediate assistance
3. 📧 **Check your email** for order confirmation details

Sorry for the inconvenience. Please try again in a few moments.`;
        }
      }
      
      // Handle general order queries
      if (input.toLowerCase().includes('recent') || input.toLowerCase().includes('history') || input.toLowerCase().includes('my orders')) {
        return `📋 **Your Order History**

To view all your orders and their current status:

1. 🔐 **Log in to your account** if you haven't already
2. 📱 **Navigate to "My Orders"** section in your account
3. 📊 **View complete order history** with status updates

**In your Orders page, you can:**
- ✅ View real-time order status and tracking
- 📦 See detailed order information and items
- 🚚 Track delivery progress and get updates
- ❌ Cancel orders (if eligible)
- 📄 Download invoices and receipts
- 🔄 Reorder previous purchases

**💡 Quick Tip:** If you have a specific order number (ORD-XXXXX-XXXXX), just tell me and I can look it up for you!

Need help finding a specific order?`;
      }
      
      // General order status inquiry
      if (input.toLowerCase().includes('status') || input.toLowerCase().includes('where') || input.toLowerCase().includes('when')) {
        return `📦 **Order Status Information**

I can help you check your order status! Here's what I can do:

🔍 **For Specific Orders:**
- Provide your order number (format: ORD-XXXXX-XXXXX)
- I'll look it up and give you detailed status information

📋 **Order Status Meanings:**
- 🟡 **Pending:** Payment processing, order being reviewed
- 🔵 **Processing:** Order confirmed, preparing for shipment
- 🚚 **Shipped:** Package is on its way to you
- ✅ **Delivered:** Successfully delivered to your address
- ❌ **Cancelled:** Order has been cancelled

**🎯 How to Get Order Status:**
1. **Tell me your order number** - "Check order ORD-12345-67890"
2. **Visit your account** - Log in and go to "My Orders"
3. **Check your email** - Order confirmations have status updates

**📞 Need Help?**
- For urgent issues, contact our support team
- For tracking details, I can help if you provide the order number

What's your order number, or how else can I help you?`;
      }
      
      // General order-related query
      return `📦 **Order Support Assistant**

I'm here to help with all your order questions! Here's what I can assist with:

🔍 **Order Tracking:**
- Check status of specific orders (provide order number: ORD-XXXXX-XXXXX)
- Get delivery estimates and tracking information
- Explain order status meanings

📋 **Order Management:**
- View order history and details
- Help with order modifications (contact support for changes)
- Cancel orders (if eligible)
- Download invoices and receipts

📞 **Support Options:**
- **Immediate help:** Contact our support team
- **Self-service:** Log in to your account and visit "My Orders"
- **Order lookup:** Tell me your order number for instant status

**💡 Try asking:**
- "Check order ORD-12345-67890"
- "Show me my recent orders"
- "When will my order arrive?"
- "What does 'processing' status mean?"

How can I help you with your orders today?`;
      
    } catch (error) {
      console.error('Error in order status tool:', error);
      return `⚠️ **Order System Temporarily Unavailable**

I'm experiencing technical difficulties accessing the order system. Please:

1. 🔐 **Try logging into your account** directly
2. 📱 **Visit the "My Orders" page** for current status
3. 📞 **Contact our support team** for immediate assistance
4. 🔄 **Try again in a few minutes**

Sorry for the inconvenience. Our team is working to resolve this quickly.`;
    }
  },
});

// Tool for general assistance and routing
export const generalAssistanceTool = new DynamicTool({
  name: 'general_assistance',
  description: `Use this tool for general inquiries, greetings, and when users need help navigating the store or understanding services. 
  This handles queries like:
  - "Hello", "Hi", "How are you?"
  - "What can you help me with?"
  - "Tell me about your store"
  - "What services do you offer?"
  - General questions about the website functionality`,
  func: async (input: string): Promise<string> => {
    const lowerInput = input.toLowerCase();
    
    if (lowerInput.includes('hello') || lowerInput.includes('hi') || lowerInput.includes('hey')) {
      return `👋 **Hello! Welcome to our Electronics Store!**

I'm your AI shopping assistant, ready to help you find the perfect tech products!

🛍️ **What I Can Do:**
• **Product Discovery** - Find products by needs, budget, and features
• **Smart Recommendations** - Get personalized suggestions
• **Cart Management** - Add products to cart (login required)
• **Order Tracking** - Check your order status with order numbers

📊 **Our Store:**
• **60 Products** across 7 categories
• **Latest Tech** - Laptops, smartphones, audio, wearables
• **All Budgets** - From $29 to $2199
• **Secure Shopping** - Protected cart and order management

🔥 **Popular Right Now:**
• Gaming laptops (8 models available)
• Wireless audio gear (12 products)
• Latest smartphones (12 models)
• Fitness wearables (8 options)

**✨ Try asking:**
• "Show me gaming laptops under $1000"
• "What's the best wireless headphones?"
• "I need a budget smartphone"

What can I help you find today?`;
    }
    
    if (lowerInput.includes('what can you') || lowerInput.includes('help me') || lowerInput.includes('what do you do')) {
      return `🚀 **I'm Your Complete Shopping Assistant!**

Here's everything I can help you with:

🛍️ **Smart Product Discovery**
• Find products by category, price, or features
• Get personalized recommendations based on your needs
• Compare products and find the best deals
• Browse our 60-product catalog across 7 categories

🛒 **Shopping & Cart Management**
• Add products directly to cart through chat
• Secure authentication for cart protection
• Quick purchase guidance and product details
• Wishlist recommendations and comparisons

📦 **Order Support & Tracking**
• Real-time order status with order numbers
• Delivery tracking and timeline information
• Order history and detailed receipts
• Cancellation help for eligible orders

🏪 **Store Navigation & Support**
• Product specifications and comparisons
• Category browsing and recommendations
• Pricing information and deal alerts
• Technical support and product questions

**🎯 Interactive Features:**
• Type "add [product-id] to cart" for instant cart adds
• Use order numbers for instant tracking
• Ask for product comparisons and details
• Get category-specific recommendations

**💡 Try These Commands:**
• "Show me wireless headphones under $100"
• "Add laptop-001 to cart"
• "Check order ORD-12345-67890"
• "Compare phone-001 with phone-002"

What would you like to explore?`;
    }
    
    if (lowerInput.includes('store') || lowerInput.includes('about')) {
      return `🏪 **Welcome to Our Premium Electronics Store!**

**🎯 What Makes Us Special:**

📱 **Complete Tech Ecosystem (60 Products)**
• 💻 **Laptops & Computing** (8 models) - Gaming to business
• 📱 **Smartphones** (12 models) - Latest flagships to budget options  
• 🎧 **Audio & Entertainment** (12 products) - Headphones to speakers
• ⌚ **Wearable Technology** (8 devices) - Smartwatches to fitness bands
• 📱 **Tablets** (6 options) - Pro tablets to e-readers
• 📷 **Photography & Video** (6 cameras) - DSLR to action cameras
• ⌨️ **Computer Accessories** (8 items) - Keyboards to external drives

**💰 Price Range for Everyone:**
• Budget-friendly: $29 - $199
• Mid-range: $200 - $799  
• Premium: $800 - $1599
• Professional: $1600 - $2199

**✨ Premium Shopping Experience:**
• 🤖 **AI Shopping Assistant** - That's me! Instant help anytime
• 🛒 **Smart Cart Management** - Add products via chat
• 🔐 **Secure Authentication** - Protected shopping experience
• 📦 **Real-time Order Tracking** - Live updates on your orders
• 🚚 **Fast Shipping** - Quick delivery nationwide
• 💳 **Secure Payments** - Multiple payment options
• ↩️ **Easy Returns** - Hassle-free return policy

**🎯 How I Make Shopping Better:**
• Instant product recommendations based on your needs
• Smart price filtering and category matching
• Direct cart integration with authentication
• Real-time order tracking with detailed information
• 24/7 availability for questions and support

**🔥 Popular Categories Right Now:**
• Gaming laptops with RTX graphics
• Noise-canceling wireless headphones
• Long-battery-life smartphones
• Health-focused smartwatches

Ready to find your perfect tech product? What are you looking for today?`;
    }
    
    return `🤖 **Your Friendly Shopping Assistant!**

I'm here to make your tech shopping experience amazing! Here's what I can do:

🛍️ **Product Discovery**
• Find perfect products for your needs and budget
• Smart recommendations across 60 products
• Category browsing and price filtering

🛒 **Shopping Actions**  
• Add products to cart via chat (login required)
• Product comparisons and detailed specs
• Wishlist management and deal alerts

📦 **Order Support**
• Track orders with order numbers
• Delivery status and timeline updates
• Order history and receipt access

❓ **General Help**
• Store navigation and product info
• Technical questions and specifications
• Pricing information and availability

**🚀 Quick Examples:**
• "Show me [category/product type]"
• "Add [product-id] to cart"  
• "Check order [order-number]"
• "What's the best [product] for [use case]?"

**💡 New to our store?** Try: "Show me your most popular products" or "What's good for gaming?"

What would you like help with today?`;
  },
});

export const chatbotTools = [
  productRecommendationTool,
  addToCartTool,
  orderStatusTool,
  generalAssistanceTool,
];
