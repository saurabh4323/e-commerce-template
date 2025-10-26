import { NextResponse } from 'next/server';
import connectDB from '@/config/db';
import Order from '@/app/models/Order';

// GET all orders
export async function GET(request) {
  try {
    await connectDB();
    
    // Support query parameters for filtering
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    
    let query = {};
    if (status) {
      query.status = status;
    }
    
    const orders = await Order.find(query).sort({ createdAt: -1 });
    
    return NextResponse.json({ success: true, count: orders.length, data: orders }, { status: 200 });
  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json({ success: false, error: 'Server Error' }, { status: 500 });
  }
}

// POST create a new order
export async function POST(request) {
  try {
    const body = await request.json();
    
    await connectDB();
    
    // Calculate total price
    const subtotal = body.orderItems.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0
    );
    
    const shippingPrice = subtotal > 100 ? 0 : 10; // Free shipping over $100
    const totalPrice = subtotal + shippingPrice;
    
    // Add calculated fields
    body.subtotal = subtotal;
    body.shippingPrice = shippingPrice;
    body.totalPrice = totalPrice;
    
    const order = await Order.create(body);
    
    return NextResponse.json({ success: true, data: order }, { status: 201 });
  } catch (error) {
    console.error('Error creating order:', error);
    
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(val => val.message);
      return NextResponse.json({ success: false, error: messages }, { status: 400 });
    }
    
    return NextResponse.json({ success: false, error: 'Server Error' }, { status: 500 });
  }
}