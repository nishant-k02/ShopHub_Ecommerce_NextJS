import { NextRequest, NextResponse } from 'next/server';

// In a real app, this would be stored in a database
// For now, we'll use a simple in-memory store
let cartItems: Array<{
  id: string;
  productId: string;
  quantity: number;
  name: string;
  price: number;
  imageUrl: string;
}> = [];

export async function GET() {
  try {
    return NextResponse.json({
      items: cartItems,
      totalItems: cartItems.reduce((sum, item) => sum + item.quantity, 0),
      subtotal: cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)
    });
  } catch (error) {
    console.error('Error fetching cart:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { productId, quantity = 1 } = body;

    if (!productId) {
      return NextResponse.json(
        { error: 'Product ID is required' },
        { status: 400 }
      );
    }

    // In a real app, you would fetch product details from your database
    // For now, we'll use the products from product-data
    const { products } = await import('../../product-data');
    const product = products.find(p => p.id === productId);

    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    // Check if item already exists in cart
    const existingItemIndex = cartItems.findIndex(item => item.productId === productId);

    if (existingItemIndex !== -1) {
      // Update quantity of existing item
      cartItems[existingItemIndex].quantity += quantity;
    } else {
      // Add new item to cart
      cartItems.push({
        id: `${productId}-${Date.now()}`, // Generate unique ID
        productId,
        quantity,
        name: product.name,
        price: product.price,
        imageUrl: product.imageUrl
      });
    }

    return NextResponse.json({
      message: 'Item added to cart successfully',
      cart: {
        items: cartItems,
        totalItems: cartItems.reduce((sum, item) => sum + item.quantity, 0),
        subtotal: cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)
      }
    });
  } catch (error) {
    console.error('Error adding item to cart:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { productId, quantity } = body;

    if (!productId || quantity === undefined) {
      return NextResponse.json(
        { error: 'Product ID and quantity are required' },
        { status: 400 }
      );
    }

    const itemIndex = cartItems.findIndex(item => item.productId === productId);

    if (itemIndex === -1) {
      return NextResponse.json(
        { error: 'Item not found in cart' },
        { status: 404 }
      );
    }

    if (quantity <= 0) {
      // Remove item if quantity is 0 or negative
      cartItems.splice(itemIndex, 1);
    } else {
      // Update quantity
      cartItems[itemIndex].quantity = quantity;
    }

    return NextResponse.json({
      message: 'Cart updated successfully',
      cart: {
        items: cartItems,
        totalItems: cartItems.reduce((sum, item) => sum + item.quantity, 0),
        subtotal: cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)
      }
    });
  } catch (error) {
    console.error('Error updating cart:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const productId = searchParams.get('productId');

    if (!productId) {
      return NextResponse.json(
        { error: 'Product ID is required' },
        { status: 400 }
      );
    }

    const itemIndex = cartItems.findIndex(item => item.productId === productId);

    if (itemIndex === -1) {
      return NextResponse.json(
        { error: 'Item not found in cart' },
        { status: 404 }
      );
    }

    cartItems.splice(itemIndex, 1);

    return NextResponse.json({
      message: 'Item removed from cart successfully',
      cart: {
        items: cartItems,
        totalItems: cartItems.reduce((sum, item) => sum + item.quantity, 0),
        subtotal: cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)
      }
    });
  } catch (error) {
    console.error('Error removing item from cart:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
} 