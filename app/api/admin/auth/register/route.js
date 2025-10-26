import { NextResponse } from 'next/server';
import connectDB from '@/config/db';
import Admin from '@/app/models/Admin';

export async function POST(request) {
  try {
    const { username, password, email, role } = await request.json();
    
    await connectDB();
    
    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ 
      $or: [{ email }, { username }]
    });
    
    if (existingAdmin) {
      return NextResponse.json({ 
        success: false, 
        error: 'Admin with that email or username already exists' 
      }, { status: 400 });
    }
    
    // Create new admin
    const admin = new Admin({
      username,
      email,
      role: role || 'admin'
    });
    
    // Set password (this uses the method defined in the schema)
    admin.setPassword(password);
    
    await admin.save();
    
    // Don't return password or salt in response
    const adminResponse = {
      _id: admin._id,
      username: admin.username,
      email: admin.email,
      role: admin.role
    };
    
    return NextResponse.json({ success: true, data: adminResponse }, { status: 201 });
  } catch (error) {
    console.error('Error registering admin:', error);
    
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(val => val.message);
      return NextResponse.json({ success: false, error: messages }, { status: 400 });
    }
    
    return NextResponse.json({ success: false, error: 'Server Error' }, { status: 500 });
  }
}