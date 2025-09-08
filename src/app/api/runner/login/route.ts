import { NextRequest, NextResponse } from 'next/server';
import { mockDb } from '@/lib/mock-db';

export async function POST(request: NextRequest) {
  try {
    const { runnerCode } = await request.json();
    
    if (!runnerCode) {
      return NextResponse.json(
        { error: 'Runner code is required' },
        { status: 400 }
      );
    }

    // Mock authentication - in real app, this would validate against backend
    // For demo purposes, accept any code and return a mock runner
    const mockRunnerId = 'runner1';
    const runner = mockDb.getRunner(mockRunnerId);
    
    if (!runner) {
      return NextResponse.json(
        { error: 'Invalid runner code' },
        { status: 401 }
      );
    }

    return NextResponse.json({ runnerId: mockRunnerId });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Failed to login' },
      { status: 500 }
    );
  }
}
