import { NextRequest, NextResponse } from 'next/server';
import { getAddressesCollection, Address } from '../../lib/db';
import { requireAuth } from '../../lib/middleware';

// GET /api/addresses - Get user's addresses
export async function GET(request: NextRequest) {
  try {
    const user = await requireAuth(request);
    if (user instanceof NextResponse) {
      return user; // Return error response if not authenticated
    }

    const addressesCollection = await getAddressesCollection();
    const addresses = await addressesCollection
      .find({ userId: user.userId })
      .sort({ isDefault: -1, createdAt: -1 })
      .toArray();

    return NextResponse.json({
      addresses,
      totalAddresses: addresses.length
    });
  } catch (error) {
    console.error('Error fetching addresses:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

// POST /api/addresses - Add new address
export async function POST(request: NextRequest) {
  try {
    const user = await requireAuth(request);
    if (user instanceof NextResponse) {
      return user; // Return error response if not authenticated
    }

    const body = await request.json();
    const {
      type,
      firstName,
      lastName,
      address,
      city,
      state,
      zipCode,
      country = 'United States',
      isDefault = false
    } = body;

    // Validate required fields
    if (!type || !firstName || !lastName || !address || !city || !state || !zipCode) {
      return NextResponse.json(
        { error: 'All address fields are required' },
        { status: 400 }
      );
    }

    // Validate type
    if (!['home', 'work', 'other'].includes(type)) {
      return NextResponse.json(
        { error: 'Invalid address type. Must be home, work, or other' },
        { status: 400 }
      );
    }

    // Validate ZIP code (basic US format)
    if (!/^\d{5}(-\d{4})?$/.test(zipCode)) {
      return NextResponse.json(
        { error: 'Invalid ZIP code format' },
        { status: 400 }
      );
    }

    const addressesCollection = await getAddressesCollection();
    
    // If this is set as default, unset other defaults
    if (isDefault) {
      await addressesCollection.updateMany(
        { userId: user.userId },
        { $set: { isDefault: false } }
      );
    }

    const addressId = `addr-${user.userId}-${Date.now()}`;

    const newAddress: Address = {
      id: addressId,
      userId: user.userId,
      type: type as 'home' | 'work' | 'other',
      isDefault,
      firstName,
      lastName,
      address,
      city,
      state,
      zipCode,
      country,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    await addressesCollection.insertOne(newAddress);

    return NextResponse.json({
      message: 'Address added successfully',
      address: newAddress
    }, { status: 201 });

  } catch (error) {
    console.error('Error adding address:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

// PUT /api/addresses - Update address
export async function PUT(request: NextRequest) {
  try {
    const user = await requireAuth(request);
    if (user instanceof NextResponse) {
      return user; // Return error response if not authenticated
    }

    const body = await request.json();
    const { 
      id, 
      type, 
      firstName, 
      lastName, 
      address, 
      city, 
      state, 
      zipCode, 
      country, 
      isDefault 
    } = body;

    if (!id) {
      return NextResponse.json(
        { error: 'Address ID is required' },
        { status: 400 }
      );
    }

    const addressesCollection = await getAddressesCollection();

    // Check if address exists and belongs to user
    const existingAddress = await addressesCollection.findOne({
      id,
      userId: user.userId
    });

    if (!existingAddress) {
      return NextResponse.json(
        { error: 'Address not found' },
        { status: 404 }
      );
    }

    // If this is set as default, unset other defaults
    if (isDefault) {
      await addressesCollection.updateMany(
        { userId: user.userId, id: { $ne: id } },
        { $set: { isDefault: false } }
      );
    }

    // Update the address
    const updateData: any = { updatedAt: new Date() };
    if (type !== undefined) updateData.type = type;
    if (firstName !== undefined) updateData.firstName = firstName;
    if (lastName !== undefined) updateData.lastName = lastName;
    if (address !== undefined) updateData.address = address;
    if (city !== undefined) updateData.city = city;
    if (state !== undefined) updateData.state = state;
    if (zipCode !== undefined) updateData.zipCode = zipCode;
    if (country !== undefined) updateData.country = country;
    if (isDefault !== undefined) updateData.isDefault = isDefault;

    await addressesCollection.updateOne(
      { id, userId: user.userId },
      { $set: updateData }
    );

    return NextResponse.json({
      message: 'Address updated successfully'
    });

  } catch (error) {
    console.error('Error updating address:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

// DELETE /api/addresses - Delete address
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
        { error: 'Address ID is required' },
        { status: 400 }
      );
    }

    const addressesCollection = await getAddressesCollection();
    
    const result = await addressesCollection.deleteOne({
      id,
      userId: user.userId
    });

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { error: 'Address not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: 'Address deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting address:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
} 