// app/api/admin/products/route.js
import { NextResponse } from 'next/server';
import connectDB from '@/config/db';
import Product from '@/app/models/Product';

// GET all products with optional category filter
export async function GET(request) {
  try {
    await connectDB();
    
    // Get category from query params if it exists
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    
    // Build query object
    const query = {};
    if (category) {
      query.category = category;
    }
    
    const products = await Product.find(query).sort({ createdAt: -1 });
    
    return NextResponse.json({ 
      success: true, 
      count: products.length, 
      data: products 
    }, { status: 200 });
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Server Error' 
    }, { status: 500 });
  }
}

// POST create a new product
export async function POST(request) {
  try {
    const body = await request.json();
    
    await connectDB();
    
    // Validate required fields
    if (!body.name || !body.price || !body.description || !body.category) {
      return NextResponse.json({ 
        success: false, 
        error: 'Please provide all required fields' 
      }, { status: 400 });
    }
    
    const product = await Product.create(body);
    
    return NextResponse.json({ 
      success: true, 
      data: product 
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating product:', error);
    
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(val => val.message);
      return NextResponse.json({ 
        success: false, 
        error: messages 
      }, { status: 400 });
    }
    
    return NextResponse.json({ 
      success: false, 
      error: 'Server Error' 
    }, { status: 500 });
  }
}