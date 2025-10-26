import { NextResponse } from 'next/server';
import connectDB from '@/config/db';
import User from '@/app/models/User';

export async function POST(request) {
  try {
    const { email, password } = await request.json();
    
    await connectDB();
    
    // Find user by email
    const user = await User.findOne({ email });
    
    if (!user) {
      return NextResponse.json({ 
        success: false, 
        error: 'Invalid credentials' 
      }, { status: 401 });
    }
    
    // Validate password
    const isValid = user.validatePassword(password);
    
    if (!isValid) {
      return NextResponse.json({ 
        success: false, 
        error: 'Invalid credentials' 
      }, { status: 401 });
    }
    
    // Create user session data (without sensitive info)
    const userData = {
      _id: user._id,
      name: user.name,
      email: user.email
    };
    
    return NextResponse.json({ 
      success: true, 
      message: 'Login successful',
      data: userData
    }, { status: 200 });
  } catch (error) {
    console.error('Error during login:', error);
    return NextResponse.json({ success: false, error: 'Server Error' }, { status: 500 });
  }
}