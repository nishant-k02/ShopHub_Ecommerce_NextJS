import { NextRequest, NextResponse } from 'next/server';
import { getCartCollection, getProductsCollection } from '../../lib/db';
import { requireAuth } from '../../lib/middleware';

export async function GET(request: NextRequest) {
  try {
    // Require authentication
    const user = await requireAuth(request);
    if (user instanceof NextResponse) {
      return user; // Return error response if not authenticated
    }

    const cartCollection = await getCartCollection();
    const cartItems = await cartCollection.find({ userId: user.userId }).toArray();

    const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
    const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    return NextResponse.json({
      items: cartItems,
      totalItems,
      subtotal
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
    // Require authentication
    const user = await requireAuth(request);
    if (user instanceof NextResponse) {
      return user; // Return error response if not authenticated
    }

    const body = await request.json();
    const { productId, quantity = 1 } = body;

    if (!productId) {
      return NextResponse.json(
        { error: 'Product ID is required' },
        { status: 400 }
      );
    }

    // Fetch product details from database
    const productsCollection = await getProductsCollection();
    const product = await productsCollection.findOne({ id: productId });

    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    const cartCollection = await getCartCollection();

    // Check if item already exists in user's cart
    const existingItem = await cartCollection.findOne({ 
      productId, 
      userId: user.userId 
    });

    if (existingItem) {
      // Update quantity of existing item
      await cartCollection.updateOne(
        { productId, userId: user.userId },
        { 
          $inc: { quantity },
          $set: { updatedAt: new Date() }
        }
      );
    } else {
      // Add new item to user's cart
      await cartCollection.insertOne({
        id: `${user.userId}-${productId}-${Date.now()}`, // Generate unique ID
        userId: user.userId,
        productId,
        quantity,
        name: product.name,
        price: product.price,
        imageUrl: product.imageUrl,
        createdAt: new Date(),
        updatedAt: new Date()
      });
    }

    // Get updated user's cart
    const cartItems = await cartCollection.find({ userId: user.userId }).toArray();
    const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
    const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    return NextResponse.json({
      message: 'Item added to cart successfully',
      cart: {
        items: cartItems,
        totalItems,
        subtotal
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
    // Require authentication
    const user = await requireAuth(request);
    if (user instanceof NextResponse) {
      return user; // Return error response if not authenticated
    }

    const body = await request.json();
    const { productId, quantity } = body;

    if (!productId || quantity === undefined) {
      return NextResponse.json(
        { error: 'Product ID and quantity are required' },
        { status: 400 }
      );
    }

    const cartCollection = await getCartCollection();

    if (quantity <= 0) {
      // Remove item if quantity is 0 or negative
      await cartCollection.deleteOne({ 
        productId, 
        userId: user.userId 
      });
    } else {
      // Update quantity
      await cartCollection.updateOne(
        { productId, userId: user.userId },
        { 
          $set: { 
            quantity,
            updatedAt: new Date()
          }
        }
      );
    }

    // Get updated user's cart
    const cartItems = await cartCollection.find({ userId: user.userId }).toArray();
    const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
    const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    return NextResponse.json({
      message: 'Cart updated successfully',
      cart: {
        items: cartItems,
        totalItems,
        subtotal
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
    // Require authentication
    const user = await requireAuth(request);
    if (user instanceof NextResponse) {
      return user; // Return error response if not authenticated
    }

    const { searchParams } = new URL(request.url);
    const productId = searchParams.get('productId');

    if (!productId) {
      return NextResponse.json(
        { error: 'Product ID is required' },
        { status: 400 }
      );
    }

    const cartCollection = await getCartCollection();
    const result = await cartCollection.deleteOne({ 
      productId, 
      userId: user.userId 
    });

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { error: 'Item not found in cart' },
        { status: 404 }
      );
    }

    // Get updated user's cart
    const cartItems = await cartCollection.find({ userId: user.userId }).toArray();
    const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
    const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    return NextResponse.json({
      message: 'Item removed from cart successfully',
      cart: {
        items: cartItems,
        totalItems,
        subtotal
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