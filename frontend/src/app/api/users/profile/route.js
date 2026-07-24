import { NextResponse } from 'next/server';

export async function GET(request) {
  const authHeader = request.headers.get('authorization');
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }
  
  const token = authHeader.split(' ')[1];
  
  try {
    // Call the backend API to get user profile
    // Make sure we're using the correct API endpoint
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
    const response = await fetch(`${apiUrl}/api/users/profile`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      // Add cache: 'no-store' to prevent caching issues
      cache: 'no-store'
    });
    
    if (!response.ok) {
      const error = await response.json();
      console.error('Backend API error:', error);
      return NextResponse.json(error, { status: response.status });
    }
    
    const data = await response.json();
    
    // Return the response from the backend
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return NextResponse.json(
      { error: 'Failed to fetch user profile' },
      { status: 500 }
    );
  }
}