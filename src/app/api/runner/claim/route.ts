import { NextRequest, NextResponse } from 'next/server';
import { mockDb } from '@/lib/mock-db';

export async function POST(request: NextRequest) {
  try {
    const { runnerId, orderId } = await request.json();
    
    if (!runnerId || !orderId) {
      return NextResponse.json(
        { error: 'Runner ID and Order ID are required' },
        { status: 400 }
      );
    }

    // Check if runner exists and is online
    const runner = mockDb.getRunner(runnerId);
    if (!runner || !runner.isOnline) {
      return NextResponse.json(
        { error: 'Runner not found or offline' },
        { status: 400 }
      );
    }

    // Try to claim the order
    const success = mockDb.claimOrder(orderId, runnerId);
    
    if (!success) {
      return NextResponse.json(
        { error: 'Order already claimed or not available' },
        { status: 409 }
      );
    }

    // Update order status to preparing if it's still received
    const order = mockDb.getOrder(orderId);
    if (order && order.status === 'received') {
      mockDb.updateOrder(orderId, { status: 'preparing' });
    }

    // Add message to notify customer
    mockDb.addMessage({
      orderId,
      sender: 'runner',
      text: `Hi! I'm ${runner.name} and I'll be delivering your order. I'll let you know when I'm on my way!`
    });

    return NextResponse.json({ success: true, orderId });
  } catch (error) {
    console.error('Error claiming order:', error);
    return NextResponse.json(
      { error: 'Failed to claim order' },
      { status: 500 }
    );
  }
}
