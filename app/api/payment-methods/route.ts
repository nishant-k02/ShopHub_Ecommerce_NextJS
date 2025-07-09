import { NextRequest, NextResponse } from 'next/server';
import { getPaymentMethodsCollection, PaymentMethod } from '../../lib/db';
import { requireAuth } from '../../lib/middleware';

// GET /api/payment-methods - Get user's payment methods
export async function GET(request: NextRequest) {
  try {
    const user = await requireAuth(request);
    if (user instanceof NextResponse) {
      return user; // Return error response if not authenticated
    }

    const paymentMethodsCollection = await getPaymentMethodsCollection();
    const paymentMethods = await paymentMethodsCollection
      .find({ userId: user.userId })
      .sort({ isDefault: -1, createdAt: -1 })
      .toArray();

    // Remove sensitive card number data before sending
    const safeMethods = paymentMethods.map(method => ({
      ...method,
      cardNumber: `****-****-****-${method.cardNumber.slice(-4)}`
    }));

    return NextResponse.json({
      paymentMethods: safeMethods,
      totalMethods: safeMethods.length
    });
  } catch (error) {
    console.error('Error fetching payment methods:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

// POST /api/payment-methods - Add new payment method
export async function POST(request: NextRequest) {
  try {
    const user = await requireAuth(request);
    if (user instanceof NextResponse) {
      return user; // Return error response if not authenticated
    }

    const body = await request.json();
    const {
      type,
      cardName,
      cardNumber,
      expiryDate,
      isDefault = false
    } = body;

    // Validate required fields
    if (!type || !cardName || !cardNumber || !expiryDate) {
      return NextResponse.json(
        { error: 'All payment method fields are required' },
        { status: 400 }
      );
    }

    // Validate card number (basic check)
    const cleanCardNumber = cardNumber.replace(/\s/g, '');
    if (cleanCardNumber.length < 13 || cleanCardNumber.length > 19) {
      return NextResponse.json(
        { error: 'Invalid card number' },
        { status: 400 }
      );
    }

    // Validate expiry date format (MM/YY)
    if (!/^\d{2}\/\d{2}$/.test(expiryDate)) {
      return NextResponse.json(
        { error: 'Invalid expiry date format. Use MM/YY' },
        { status: 400 }
      );
    }

    const paymentMethodsCollection = await getPaymentMethodsCollection();
    
    // If this is set as default, unset other defaults
    if (isDefault) {
      await paymentMethodsCollection.updateMany(
        { userId: user.userId },
        { $set: { isDefault: false } }
      );
    }

    // Determine card type
    const cardType = getCardType(cleanCardNumber);
    const paymentMethodId = `pm-${user.userId}-${Date.now()}`;

    const newPaymentMethod: PaymentMethod = {
      id: paymentMethodId,
      userId: user.userId,
      type,
      isDefault,
      cardName,
      cardNumber: cleanCardNumber, // In production, this should be tokenized/encrypted
      expiryDate,
      cardType,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    await paymentMethodsCollection.insertOne(newPaymentMethod);

    // Return safe version without full card number
    const safeMethod = {
      ...newPaymentMethod,
      cardNumber: `****-****-****-${cleanCardNumber.slice(-4)}`
    };

    return NextResponse.json({
      message: 'Payment method added successfully',
      paymentMethod: safeMethod
    }, { status: 201 });

  } catch (error) {
    console.error('Error adding payment method:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

// PUT /api/payment-methods - Update payment method
export async function PUT(request: NextRequest) {
  try {
    const user = await requireAuth(request);
    if (user instanceof NextResponse) {
      return user; // Return error response if not authenticated
    }

    const body = await request.json();
    const { id, cardName, expiryDate, isDefault } = body;

    if (!id) {
      return NextResponse.json(
        { error: 'Payment method ID is required' },
        { status: 400 }
      );
    }

    const paymentMethodsCollection = await getPaymentMethodsCollection();

    // Check if payment method exists and belongs to user
    const existingMethod = await paymentMethodsCollection.findOne({
      id,
      userId: user.userId
    });

    if (!existingMethod) {
      return NextResponse.json(
        { error: 'Payment method not found' },
        { status: 404 }
      );
    }

    // If this is set as default, unset other defaults
    if (isDefault) {
      await paymentMethodsCollection.updateMany(
        { userId: user.userId, id: { $ne: id } },
        { $set: { isDefault: false } }
      );
    }

    // Update the payment method
    const updateData: any = { updatedAt: new Date() };
    if (cardName !== undefined) updateData.cardName = cardName;
    if (expiryDate !== undefined) updateData.expiryDate = expiryDate;
    if (isDefault !== undefined) updateData.isDefault = isDefault;

    await paymentMethodsCollection.updateOne(
      { id, userId: user.userId },
      { $set: updateData }
    );

    return NextResponse.json({
      message: 'Payment method updated successfully'
    });

  } catch (error) {
    console.error('Error updating payment method:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

// DELETE /api/payment-methods - Delete payment method
export async function DELETE(request: NextRequest) {
  try {
    const user = await requireAuth(request);
    if (user instanceof NextResponse) {
      return user; // Return error response if not authenticated
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'Payment method ID is required' },
        { status: 400 }
      );
    }

    const paymentMethodsCollection = await getPaymentMethodsCollection();
    
    const result = await paymentMethodsCollection.deleteOne({
      id,
      userId: user.userId
    });

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { error: 'Payment method not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: 'Payment method deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting payment method:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

// Helper function to determine card type
function getCardType(cardNumber: string): string {
  if (cardNumber.startsWith('4')) return 'Visa';
  if (cardNumber.startsWith('5') || cardNumber.startsWith('2')) return 'Mastercard';
  if (cardNumber.startsWith('3')) return 'American Express';
  if (cardNumber.startsWith('6')) return 'Discover';
  return 'Unknown';
} 