import { NextRequest, NextResponse } from 'next/server';
import { mockDb } from '@/lib/mock-db';
import { calculateSectionDistance } from '@/lib/stadium-geo';

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
    if (!runner || !runner.isOnline) {
      return NextResponse.json([]);
    }

    // Get unclaimed orders
    const unclaimedOrders = mockDb.getUnclaimedOrders();
    
    // Filter orders within reasonable distance (if runner has current section)
    let nearbyOrders = unclaimedOrders;
    if (runner.currentSection) {
      nearbyOrders = unclaimedOrders.filter(order => {
        const distance = calculateSectionDistance(runner.currentSection!, order.seat.section);
        return distance <= 200; // Within 200 meters
      });
    }

    // Sort by age (oldest first) and distance
    nearbyOrders.sort((a, b) => {
      const ageA = Date.now() - a.createdAt;
      const ageB = Date.now() - b.createdAt;
      
      // Prioritize older orders
      if (Math.abs(ageA - ageB) > 300000) { // 5 minutes difference
        return ageA - ageB;
      }
      
      // If similar age, sort by distance
      if (runner.currentSection) {
        const distanceA = calculateSectionDistance(runner.currentSection, a.seat.section);
        const distanceB = calculateSectionDistance(runner.currentSection, b.seat.section);
        return distanceA - distanceB;
      }
      
      return 0;
    });

    return NextResponse.json(nearbyOrders.slice(0, 10)); // Limit to 10 orders
  } catch (error) {
    console.error('Error fetching nearby orders:', error);
    return NextResponse.json(
      { error: 'Failed to fetch nearby orders' },
      { status: 500 }
    );
  }
}
