import { NextResponse } from 'next/server';
import connectDB from '@/config/db';
import User from '@/app/models/User';

export async function POST(request) {
  try {
    const { name, email, password } = await request.json();
    
    await connectDB();
    
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    
    if (existingUser) {
      return NextResponse.json({ 
        success: false, 
        error: 'User with that email already exists' 
      }, { status: 400 });
    }
    
    // Create new user
    const user = new User({
      name,
      email
    });
    
    // Set password (this uses the method defined in the schema)
    user.setPassword(password);
    
    await user.save();
    
    // Don't return password or salt in response
    const userResponse = {
      _id: user._id,
      name: user.name,
      email: user.email
    };
    
    return NextResponse.json({ success: true, data: userResponse }, { status: 201 });
  } catch (error) {
    console.error('Error registering user:', error);
    
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(val => val.message);
      return NextResponse.json({ success: false, error: messages }, { status: 400 });
    }
    
    return NextResponse.json({ success: false, error: 'Server Error' }, { status: 500 });
  }
}