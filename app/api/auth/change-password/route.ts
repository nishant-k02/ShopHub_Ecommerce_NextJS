import { NextRequest, NextResponse } from 'next/server';
import { getUserFromRequest, verifyPassword, hashPassword } from '../../../lib/auth';
import { getUsersCollection } from '../../../lib/db';

export async function PUT(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request);
    
    if (!user) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    const { currentPassword, newPassword } = await request.json();

    // Validate input
    if (!currentPassword || !newPassword) {
      return NextResponse.json(
        { error: 'Current password and new password are required' },
        { status: 400 }
      );
    }

    // Validate new password length
    if (newPassword.length < 6) {
      return NextResponse.json(
        { error: 'New password must be at least 6 characters long' },
        { status: 400 }
      );
    }

    const collection = await getUsersCollection();

    // Get current user data
    const currentUser = await collection.findOne({ id: user.userId });
    if (!currentUser) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Verify current password
    const isCurrentPasswordValid = await verifyPassword(currentPassword, currentUser.password);
    if (!isCurrentPasswordValid) {
      return NextResponse.json(
        { error: 'Current password is incorrect' },
        { status: 400 }
      );
    }

    // Hash new password
    const hashedNewPassword = await hashPassword(newPassword);

    // Update password
    const result = await collection.updateOne(
      { id: user.userId },
      { 
        $set: { 
          password: hashedNewPassword,
          updatedAt: new Date()
        }
      }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { error: 'Failed to update password' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: 'Password updated successfully' },
      { status: 200 }
    );

  } catch (error) {
    console.error('Password change error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 