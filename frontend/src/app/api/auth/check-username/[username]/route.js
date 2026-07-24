import { NextResponse } from 'next/server';

export async function GET(request, { params }) {
  const { username } = params;
  
  try {
    // Call the backend API to check username availability
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/check-username/${username}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    const data = await response.json();
    
    // Return the response from the backend
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error checking username availability:', error);
    return NextResponse.json(
      { error: 'Failed to check username availability' },
      { status: 500 }
    );
  }
}