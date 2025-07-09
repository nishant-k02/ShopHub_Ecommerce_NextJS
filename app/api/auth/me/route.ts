import { NextRequest, NextResponse } from 'next/server';
import { getUserFromRequest } from '../../../lib/auth';
import { getUsersCollection } from '../../../lib/db';

export async function GET(request: NextRequest) {
  try {
    const tokenUser = await getUserFromRequest(request);
    
    if (!tokenUser) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    // Fetch fresh user data from database
    const collection = await getUsersCollection();
    const dbUser = await collection.findOne({ id: tokenUser.userId });

    if (!dbUser) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { user: { id: dbUser.id, name: dbUser.name, email: dbUser.email } },
      { status: 200 }
    );
  } catch (error) {
    console.error('Get user error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 