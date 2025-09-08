import { NextRequest, NextResponse } from 'next/server';
import { mockDb } from '@/lib/mock-db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const runnerId = searchParams.get('runnerId');
    
    if (!runnerId) {
      return NextResponse.json(
        { error: 'Runner ID is required' },
        { status: 400 }
      );
    }

    const runner = mockDb.getRunner(runnerId);
    
    if (!runner) {
      return NextResponse.json(
        { error: 'Runner not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(runner);
  } catch (error) {
    console.error('Error fetching runner:', error);
    return NextResponse.json(
      { error: 'Failed to fetch runner' },
      { status: 500 }
    );
  }
}
