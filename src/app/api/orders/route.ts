import { NextRequest, NextResponse } from 'next/server';
import { mockDb } from '@/lib/mock-db';
import { Order } from '@/types';

export async function POST(request: NextRequest) {
  try {
    const orderData = await request.json();
    
    // Create the order
    const order = mockDb.createOrder({
      customerId: 'customer_' + Date.now(), // Mock customer ID
      items: orderData.items,
      seat: orderData.seat,
      contact: orderData.contact,
      deliveryPrefs: orderData.deliveryPrefs,
      tip: orderData.tip,
      subtotal: orderData.subtotal,
      tax: orderData.tax,
      serviceFee: orderData.serviceFee,
      total: orderData.total,
      etaMinutes: Math.floor(Math.random() * 10) + 8, // Random ETA between 8-18 minutes
      paymentMethod: orderData.paymentMethod,
    });

    // Add initial message
    mockDb.addMessage({
      orderId: order.id,
      sender: 'customer',
      text: 'Order placed successfully! We\'ll start preparing your food shortly.'
    });

    return NextResponse.json(order);
  } catch (error) {
    console.error('Error creating order:', error);
    return NextResponse.json(
      { error: 'Failed to create order' },
      { status: 500 }
    );
  }
}
