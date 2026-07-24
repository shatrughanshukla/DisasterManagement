import { NextResponse } from 'next/server';

export async function GET(request, { params }) {
  const { email } = params;
  
  try {
    // Call the backend API to check email availability
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/check-email/${email}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    const data = await response.json();
    
    // Return the response from the backend
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error checking email availability:', error);
    return NextResponse.json(
      { error: 'Failed to check email availability' },
      { status: 500 }
    );
  }
}