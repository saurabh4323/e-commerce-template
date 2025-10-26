import { NextResponse } from 'next/server';
import connectDB from '@/config/db';
import Admin from '@/app/models/Admin';

export async function POST(request) {
  try {
    const { username, password } = await request.json();
    
    await connectDB();
    
    // Find admin by username
    const admin = await Admin.findOne({ username });
    
    if (!admin) {
      return NextResponse.json({ 
        success: false, 
        error: 'Invalid credentials' 
      }, { status: 401 });
    }
    
    // Validate password
    const isValid = admin.validatePassword(password);
    
    if (!isValid) {
      return NextResponse.json({ 
        success: false, 
        error: 'Invalid credentials' 
      }, { status: 401 });
    }
    
    // Create admin session data (without sensitive info)
    const adminData = {
      _id: admin._id,
      username: admin.username,
      email: admin.email,
      role: admin.role
    };
    
    return NextResponse.json({ 
      success: true, 
      message: 'Login successful',
      data: adminData
    }, { status: 200 });
  } catch (error) {
    console.error('Error during login:', error);
    return NextResponse.json({ success: false, error: 'Server Error' }, { status: 500 });
  }
}