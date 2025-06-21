import { NextRequest, NextResponse } from 'next/server';
import { getCartCollection, getProductsCollection } from '../../lib/db';

export async function GET() {
  try {
    const cartCollection = await getCartCollection();
    const cartItems = await cartCollection.find({}).toArray();

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

    // Check if item already exists in cart
    const existingItem = await cartCollection.findOne({ productId });

    if (existingItem) {
      // Update quantity of existing item
      await cartCollection.updateOne(
        { productId },
        { $inc: { quantity } }
      );
    } else {
      // Add new item to cart
      await cartCollection.insertOne({
        id: `${productId}-${Date.now()}`, // Generate unique ID
        productId,
        quantity,
        name: product.name,
        price: product.price,
        imageUrl: product.imageUrl
      });
    }

    // Get updated cart
    const cartItems = await cartCollection.find({}).toArray();
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
      await cartCollection.deleteOne({ productId });
    } else {
      // Update quantity
      await cartCollection.updateOne(
        { productId },
        { $set: { quantity } }
      );
    }

    // Get updated cart
    const cartItems = await cartCollection.find({}).toArray();
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
    const { searchParams } = new URL(request.url);
    const productId = searchParams.get('productId');

    if (!productId) {
      return NextResponse.json(
        { error: 'Product ID is required' },
        { status: 400 }
      );
    }

    const cartCollection = await getCartCollection();
    const result = await cartCollection.deleteOne({ productId });

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { error: 'Item not found in cart' },
        { status: 404 }
      );
    }

    // Get updated cart
    const cartItems = await cartCollection.find({}).toArray();
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