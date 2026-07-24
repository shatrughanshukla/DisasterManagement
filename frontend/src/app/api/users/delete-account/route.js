import { NextResponse } from 'next/server';

export async function DELETE(request) {
  try {
    const authHeader = request.headers.get('authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }
    
    const token = authHeader.split(' ')[1];
    
    // Call the backend API to delete the account
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
    const response = await fetch(`${apiUrl}/api/users/delete-account`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      },
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
    console.error('Error deleting account:', error);
    return NextResponse.json(
      { error: 'Failed to delete account' },
      { status: 500 }
    );
  }
}