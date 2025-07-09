import { NextRequest, NextResponse } from 'next/server';
import { getOrdersCollection, Order, OrderItem } from '../../lib/db';
import { requireAuth } from '../../lib/middleware';

// GET /api/orders - Get user's orders
export async function GET(request: NextRequest) {
  try {
    const user = await requireAuth(request);
    if (user instanceof NextResponse) {
      return user; // Return error response if not authenticated
    }

    const ordersCollection = await getOrdersCollection();
    const orders = await ordersCollection
      .find({ userId: user.userId })
      .sort({ createdAt: -1 })
      .toArray();

    return NextResponse.json({
      orders,
      totalOrders: orders.length
    });
  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

// PUT /api/orders - Update order (for cancellation)
export async function PUT(request: NextRequest) {
  try {
    const user = await requireAuth(request);
    if (user instanceof NextResponse) {
      return user; // Return error response if not authenticated
    }

    const body = await request.json();
    const { orderId, status } = body;

    if (!orderId || !status) {
      return NextResponse.json(
        { error: 'Order ID and status are required' },
        { status: 400 }
      );
    }

    // Only allow cancellation of pending or processing orders
    if (status === 'cancelled') {
      const ordersCollection = await getOrdersCollection();
      
      // Check if order exists and belongs to user
      const existingOrder = await ordersCollection.findOne({
        id: orderId,
        userId: user.userId
      });

      if (!existingOrder) {
        return NextResponse.json(
          { error: 'Order not found' },
          { status: 404 }
        );
      }

      // Only allow cancellation if order is not shipped or delivered
      if (existingOrder.status === 'shipped' || existingOrder.status === 'delivered') {
        return NextResponse.json(
          { error: 'Cannot cancel order that has been shipped or delivered' },
          { status: 400 }
        );
      }

      // Update order status to cancelled
      await ordersCollection.updateOne(
        { id: orderId, userId: user.userId },
        { 
          $set: { 
            status: 'cancelled',
            updatedAt: new Date()
          }
        }
      );

      return NextResponse.json({
        message: 'Order cancelled successfully'
      });
    }

    return NextResponse.json(
      { error: 'Invalid status update' },
      { status: 400 }
    );

  } catch (error) {
    console.error('Error updating order:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

// POST /api/orders - Create new order
export async function POST(request: NextRequest) {
  try {
    const user = await requireAuth(request);
    if (user instanceof NextResponse) {
      return user; // Return error response if not authenticated
    }

    const body = await request.json();
    const {
      items,
      shippingAddress,
      paymentInfo,
      subtotal,
      shipping,
      tax,
      total
    } = body;

    // Validate required fields
    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { error: 'Order items are required' },
        { status: 400 }
      );
    }

    if (!shippingAddress || !paymentInfo) {
      return NextResponse.json(
        { error: 'Shipping address and payment info are required' },
        { status: 400 }
      );
    }

    const ordersCollection = await getOrdersCollection();
    
    // Generate unique order number
    const orderNumber = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 5).toUpperCase()}`;
    const orderId = `order-${user.userId}-${Date.now()}`;

    // Calculate estimated delivery (5-7 business days)
    const estimatedDelivery = new Date();
    estimatedDelivery.setDate(estimatedDelivery.getDate() + 7);

    const newOrder: Order = {
      id: orderId,
      userId: user.userId,
      orderNumber,
      status: 'pending',
      items: items.map((item: any): OrderItem => ({
        productId: item.productId,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        imageUrl: item.imageUrl
      })),
      shippingAddress: {
        firstName: shippingAddress.firstName,
        lastName: shippingAddress.lastName,
        address: shippingAddress.address,
        city: shippingAddress.city,
        state: shippingAddress.state,
        zipCode: shippingAddress.zipCode,
        country: shippingAddress.country || 'United States'
      },
      paymentInfo: {
        method: paymentInfo.method || 'Credit Card',
        cardLast4: paymentInfo.cardLast4,
        cardType: paymentInfo.cardType
      },
      subtotal,
      shipping,
      tax,
      total,
      createdAt: new Date(),
      updatedAt: new Date(),
      estimatedDelivery
    };

    await ordersCollection.insertOne(newOrder);

    return NextResponse.json({
      message: 'Order created successfully',
      order: newOrder
    }, { status: 201 });

  } catch (error) {
    console.error('Error creating order:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
} 