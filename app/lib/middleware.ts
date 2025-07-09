import { NextRequest, NextResponse } from 'next/server';
import { getUserFromRequest } from './auth';

export async function requireAuth(request: NextRequest) {
  const user = await getUserFromRequest(request);
  
  if (!user) {
    return NextResponse.json(
      { error: 'Authentication required. Please login to continue.' },
      { status: 401 }
    );
  }
  
  return user;
}

export function createAuthRequiredResponse() {
  return NextResponse.json(
    { error: 'Authentication required. Please login to continue.' },
    { status: 401 }
  );
} 