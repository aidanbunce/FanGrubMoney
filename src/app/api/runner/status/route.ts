import { NextRequest, NextResponse } from 'next/server';
import { mockDb } from '@/lib/mock-db';

export async function PATCH(request: NextRequest) {
  try {
    const { runnerId, isOnline } = await request.json();
    
    if (!runnerId || typeof isOnline !== 'boolean') {
      return NextResponse.json(
        { error: 'Runner ID and online status are required' },
        { status: 400 }
      );
    }

    const runner = mockDb.updateRunner(runnerId, { isOnline });
    
    if (!runner) {
      return NextResponse.json(
        { error: 'Runner not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(runner);
  } catch (error) {
    console.error('Error updating runner status:', error);
    return NextResponse.json(
      { error: 'Failed to update status' },
      { status: 500 }
    );
  }
}
