import { SectionCoord, STADIUM_SECTIONS } from '@/types';

/**
 * Calculate distance between two stadium sections using polar coordinates
 * @param section1 First section
 * @param section2 Second section
 * @returns Distance in meters (approximate)
 */
export function calculateSectionDistance(section1: string, section2: string): number {
  const coord1 = STADIUM_SECTIONS.find(s => s.section === section1);
  const coord2 = STADIUM_SECTIONS.find(s => s.section === section2);
  
  if (!coord1 || !coord2) {
    return Infinity; // Unknown sections
  }
  
  // Convert to radians
  const angle1 = (coord1.angleDeg * Math.PI) / 180;
  const angle2 = (coord2.angleDeg * Math.PI) / 180;
  
  // Calculate distance using law of cosines for polar coordinates
  const deltaAngle = Math.abs(angle1 - angle2);
  const distance = Math.sqrt(
    coord1.radius * coord1.radius + 
    coord2.radius * coord2.radius - 
    2 * coord1.radius * coord2.radius * Math.cos(deltaAngle)
  );
  
  // Convert to approximate meters (assuming 1 unit = 1 meter)
  return Math.round(distance);
}

/**
 * Get all sections within a given radius of a target section
 * @param targetSection The section to measure from
 * @param radiusMeters Maximum distance in meters
 * @returns Array of sections within radius
 */
export function getSectionsWithinRadius(targetSection: string, radiusMeters: number): string[] {
  return STADIUM_SECTIONS
    .filter(section => {
      const distance = calculateSectionDistance(targetSection, section.section);
      return distance <= radiusMeters && section.section !== targetSection;
    })
    .map(section => section.section);
}

/**
 * Check if two sections are adjacent (within 2 sections of each other)
 * @param section1 First section
 * @param section2 Second section
 * @returns True if sections are adjacent
 */
export function areSectionsAdjacent(section1: string, section2: string): boolean {
  const coord1 = STADIUM_SECTIONS.find(s => s.section === section1);
  const coord2 = STADIUM_SECTIONS.find(s => s.section === section2);
  
  if (!coord1 || !coord2) {
    return false;
  }
  
  // Calculate angular difference
  let angleDiff = Math.abs(coord1.angleDeg - coord2.angleDeg);
  
  // Handle wraparound (e.g., section 120 to section 101)
  if (angleDiff > 180) {
    angleDiff = 360 - angleDiff;
  }
  
  // Adjacent if within 36 degrees (2 sections at 18 degrees each)
  return angleDiff <= 36;
}

/**
 * Get the optimal route between multiple sections
 * @param sections Array of sections to visit
 * @param startSection Starting section (optional)
 * @returns Ordered array of sections for optimal route
 */
export function getOptimalRoute(sections: string[], startSection?: string): string[] {
  if (sections.length <= 1) {
    return sections;
  }
  
  const remaining = [...sections];
  const route: string[] = [];
  
  // Start with the specified section or the first one
  let current = startSection || remaining.shift()!;
  route.push(current);
  
  // Greedy algorithm: always go to the nearest unvisited section
  while (remaining.length > 0) {
    let nearestIndex = 0;
    let nearestDistance = calculateSectionDistance(current, remaining[0]);
    
    for (let i = 1; i < remaining.length; i++) {
      const distance = calculateSectionDistance(current, remaining[i]);
      if (distance < nearestDistance) {
        nearestDistance = distance;
        nearestIndex = i;
      }
    }
    
    current = remaining.splice(nearestIndex, 1)[0];
    route.push(current);
  }
  
  return route;
}

/**
 * Estimate delivery time between sections
 * @param fromSection Starting section
 * @param toSection Destination section
 * @returns Estimated time in minutes
 */
export function estimateDeliveryTime(fromSection: string, toSection: string): number {
  const distance = calculateSectionDistance(fromSection, toSection);
  
  // Assume average walking speed of 1.4 m/s (5 km/h)
  // Add 2 minutes for finding seat and delivery
  const walkingTimeMinutes = (distance / 1.4) / 60;
  const deliveryTimeMinutes = 2;
  
  return Math.ceil(walkingTimeMinutes + deliveryTimeMinutes);
}

/**
 * Get section coordinates for mapping
 * @param section Section number
 * @returns Section coordinates or null if not found
 */
export function getSectionCoordinates(section: string): SectionCoord | null {
  return STADIUM_SECTIONS.find(s => s.section === section) || null;
}
