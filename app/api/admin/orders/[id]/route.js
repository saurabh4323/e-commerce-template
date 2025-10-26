import { NextResponse } from 'next/server';
import connectDB from '@/config/db';
import Order from '@/app/models/Order';

// GET single order
export async function GET(request, { params }) {
  try {
    const { id } = params;
    
    await connectDB();
    
    const order = await Order.findById(id);
    
    if (!order) {
      return NextResponse.json({ success: false, error: 'Order not found' }, { status: 404 });
    }
    
    return NextResponse.json({ success: true, data: order }, { status: 200 });
  } catch (error) {
    console.error('Error fetching order:', error);
    return NextResponse.json({ success: false, error: 'Server Error' }, { status: 500 });
  }
}

// PUT update order status
export async function PUT(request, { params }) {
  try {
    const { id } = params;
    const body = await request.json();
    
    await connectDB();
    
    const order = await Order.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true
    });
    
    if (!order) {
      return NextResponse.json({ success: false, error: 'Order not found' }, { status: 404 });
    }
    
    return NextResponse.json({ success: true, data: order }, { status: 200 });
  } catch (error) {
    console.error('Error updating order:', error);
    
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(val => val.message);
      return NextResponse.json({ success: false, error: messages }, { status: 400 });
    }
    
    return NextResponse.json({ success: false, error: 'Server Error' }, { status: 500 });
  }
}

// DELETE order
export async function DELETE(request, { params }) {
  try {
    const { id } = params;
    
    await connectDB();
    
    const order = await Order.findByIdAndDelete(id);
    
    if (!order) {
      return NextResponse.json({ success: false, error: 'Order not found' }, { status: 404 });
    }
    
    return NextResponse.json({ success: true, data: {} }, { status: 200 });
  } catch (error) {
    console.error('Error deleting order:', error);
    return NextResponse.json({ success: false, error: 'Server Error' }, { status: 500 });
  }
}