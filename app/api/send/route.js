// app/api/send-order/route.js
import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request) {
  try {
    const { formData, cartItems, total } = await request.json();

    // Create order details
    const orderDetails = cartItems.map(item => 
      `${item.name} - ${item.variant || 'N/A'} (Qty: ${item.quantity}) - ₹${(item.price * item.quantity).toFixed(2)}`
    ).join('\n');

    // Create email HTML
    const emailHTML = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background-color: #000; color: #fff; padding: 20px; text-align: center; }
          .section { margin: 20px 0; padding: 15px; background-color: #f9f9f9; border-radius: 5px; }
          .section h2 { margin-top: 0; color: #000; }
          .item { padding: 10px 0; border-bottom: 1px solid #ddd; }
          .total { font-size: 20px; font-weight: bold; color: #000; margin-top: 20px; }
          .footer { text-align: center; margin-top: 30px; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>New Order Received!</h1>
          </div>
          
          <div class="section">
            <h2>Customer Information</h2>
            <p><strong>Name:</strong> ${formData.fullName}</p>
            <p><strong>Email:</strong> ${formData.email}</p>
            <p><strong>Phone:</strong> ${formData.phone}</p>
          </div>
          
          <div class="section">
            <h2>Shipping Address</h2>
            <p>${formData.address}</p>
            <p>${formData.city}, ${formData.state} - ${formData.pincode}</p>
          </div>
          
          <div class="section">
            <h2>Order Details</h2>
            ${cartItems.map(item => `
              <div class="item">
                <p><strong>${item.name}</strong> ${item.variant ? `- ${item.variant}` : ''}</p>
                <p>Quantity: ${item.quantity} | Price: ₹${item.price.toFixed(2)} | Total: ₹${(item.price * item.quantity).toFixed(2)}</p>
              </div>
            `).join('')}
            <p class="total">Total Amount: ₹${total.toFixed(2)}</p>
          </div>
          
          <div class="section">
            <h2>Payment Method</h2>
            <p>${formData.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Online Payment'}</p>
          </div>
          
          <div class="footer">
            <p>This is an automated email. Order placed on ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}</p>
          </div>
        </div>
      </body>
      </html>
    `;

    // Create transporter using Gmail
    // For Gmail, you need to:
    // 1. Enable 2-factor authentication
    // 2. Generate an "App Password" from Google Account settings
    // 3. Use that app password here
 const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true, // SSL
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});


    // Email options
    const mailOptions = {
      from: `"Your Store" <${process.env.EMAIL_USER}>`,
      to: 'saurabhiitr01@gmail.com',
      subject: `New Order from ${formData.fullName}`,
      html: emailHTML,
      text: `
New Order Received!

Customer Information:
Name: ${formData.fullName}
Email: ${formData.email}
Phone: ${formData.phone}

Shipping Address:
${formData.address}
${formData.city}, ${formData.state} - ${formData.pincode}

Order Details:
${orderDetails}

Total Amount: ₹${total.toFixed(2)}

Payment Method: ${formData.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Online Payment'}
      `,
    };

    // Send email
    await transporter.sendMail(mailOptions);

    return NextResponse.json(
      { success: true, message: 'Order email sent successfully!' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error sending email:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to send order email', error: error.message },
      { status: 500 }
    );
  }
}