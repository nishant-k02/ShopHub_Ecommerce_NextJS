import { NextRequest, NextResponse } from 'next/server';
import { getUserFromRequest, createToken } from '../../../lib/auth';
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

    const { name, email } = await request.json();

    // Validate input
    if (!name || !email) {
      return NextResponse.json(
        { error: 'Name and email are required' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    const collection = await getUsersCollection();

    // Check if email is already taken by another user
    if (email !== user.email) {
      const existingUser = await collection.findOne({ 
        email, 
        id: { $ne: user.userId } 
      });
      
      if (existingUser) {
        return NextResponse.json(
          { error: 'Email is already taken' },
          { status: 409 }
        );
      }
    }

    // Update user profile
    const result = await collection.updateOne(
      { id: user.userId },
      { 
        $set: { 
          name,
          email,
          updatedAt: new Date()
        }
      }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Create new JWT token with updated user information
    const newToken = await createToken({
      userId: user.userId,
      email,
      name
    });

    // Create response with updated user data
    const response = NextResponse.json(
      { 
        message: 'Profile updated successfully',
        user: { id: user.userId, name, email }
      },
      { status: 200 }
    );

    // Set the new token as HTTP-only cookie
    response.cookies.set('auth-token', newToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return response;

  } catch (error) {
    console.error('Profile update error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 