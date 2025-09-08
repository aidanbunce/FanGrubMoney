import { NextResponse } from 'next/server';
import { mockDb } from '@/lib/mock-db';

export async function GET() {
  try {
    const menuItems = mockDb.getMenuItems();
    return NextResponse.json(menuItems);
  } catch (error) {
    console.error('Error fetching menu:', error);
    return NextResponse.json(
      { error: 'Failed to fetch menu' },
      { status: 500 }
    );
  }
}
