import { NextRequest, NextResponse } from 'next/server';
import { getWishlistCollection, getProductsCollection } from '../../lib/db';
import { requireAuth } from '../../lib/middleware';

export async function GET(request: NextRequest) {
  try {
    // Require authentication
    const user = await requireAuth(request);
    if (user instanceof NextResponse) {
      return user; // Return error response if not authenticated
    }

    const wishlistCollection = await getWishlistCollection();
    const wishlistItems = await wishlistCollection.find({ userId: user.userId }).toArray();

    return NextResponse.json({
      items: wishlistItems,
      totalItems: wishlistItems.length
    });
  } catch (error) {
    console.error('Error fetching wishlist:', error);
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
    const { productId } = body;

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

    const wishlistCollection = await getWishlistCollection();

    // Check if item already exists in user's wishlist
    const existingItem = await wishlistCollection.findOne({ 
      productId, 
      userId: user.userId 
    });

    if (existingItem) {
      return NextResponse.json(
        { error: 'Item already in wishlist' },
        { status: 400 }
      );
    }

    // Add new item to user's wishlist
    await wishlistCollection.insertOne({
      id: `${user.userId}-wishlist-${productId}-${Date.now()}`,
      userId: user.userId,
      productId,
      name: product.name,
      price: product.price,
      imageUrl: product.imageUrl,
      createdAt: new Date()
    });

    // Get updated user's wishlist
    const wishlistItems = await wishlistCollection.find({ userId: user.userId }).toArray();

    return NextResponse.json({
      message: 'Item added to wishlist successfully',
      wishlist: {
        items: wishlistItems,
        totalItems: wishlistItems.length
      }
    });
  } catch (error) {
    console.error('Error adding item to wishlist:', error);
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

    const wishlistCollection = await getWishlistCollection();
    const result = await wishlistCollection.deleteOne({ 
      productId, 
      userId: user.userId 
    });

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { error: 'Item not found in wishlist' },
        { status: 404 }
      );
    }

    // Get updated user's wishlist
    const wishlistItems = await wishlistCollection.find({ userId: user.userId }).toArray();

    return NextResponse.json({
      message: 'Item removed from wishlist successfully',
      wishlist: {
        items: wishlistItems,
        totalItems: wishlistItems.length
      }
    });
  } catch (error) {
    console.error('Error removing item from wishlist:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
} 