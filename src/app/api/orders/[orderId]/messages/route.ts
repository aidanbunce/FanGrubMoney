import { NextRequest, NextResponse } from 'next/server';
import { mockDb } from '@/lib/mock-db';

export async function GET(
  request: NextRequest,
  { params }: { params: { orderId: string } }
) {
  try {
    const messages = mockDb.getMessages(params.orderId);
    return NextResponse.json(messages);
  } catch (error) {
    console.error('Error fetching messages:', error);
    return NextResponse.json(
      { error: 'Failed to fetch messages' },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { orderId: string } }
) {
  try {
    const { text, sender } = await request.json();
    
    if (!text || !sender) {
      return NextResponse.json(
        { error: 'Message text and sender are required' },
        { status: 400 }
      );
    }

    const message = mockDb.addMessage({
      orderId: params.orderId,
      sender: sender as 'runner' | 'customer',
      text: text.trim()
    });

    return NextResponse.json(message);
  } catch (error) {
    console.error('Error sending message:', error);
    return NextResponse.json(
      { error: 'Failed to send message' },
      { status: 500 }
    );
  }
}
