import { Destination, ItineraryDay, ItinerarySlot } from '../types';
import { calculateDistanceKm } from './geo';

export interface PlanTripParams {
  startingLocation: string;
  numDays: number;
  startDate?: string;
  budget?: string;
  travelGroup?: string;
  numTravelers?: number;
  interests?: string[];
  activities?: string[];
}

export function generateSmartItinerary(
  allDestinations: Destination[],
  params: PlanTripParams
): ItineraryDay[] {
  const { startingLocation, numDays, interests = [] } = params;
  const days: ItineraryDay[] = [];
  const usedDestinationIds = new Set<string>();

  // Filter active destinations with coordinates
  const pool = allDestinations.filter(d => d.active && d.latitude != null && d.longitude != null);

  // Score candidate destinations based on starting district and interests
  const scoredPool = pool.map(dest => {
    let score = 50;
    if (dest.district.toLowerCase() === startingLocation.toLowerCase()) {
      score += 35; // Priority to starting district
    }
    if (interests.length > 0) {
      const match = interests.some(i => 
        dest.category.toLowerCase().includes(i.toLowerCase()) ||
        (dest.activities || []).some(a => a.toLowerCase().includes(i.toLowerCase()))
      );
      if (match) score += 20;
    }
    return { dest, score };
  }).sort((a, b) => b.score - a.score);

  const timeSlots: ('Morning' | 'Afternoon' | 'Evening')[] = ['Morning', 'Afternoon', 'Evening'];

  for (let dayNum = 1; dayNum <= Math.min(numDays, 7); dayNum++) {
    const daySlots: {
      Morning?: ItinerarySlot;
      Afternoon?: ItinerarySlot;
      Evening?: ItinerarySlot;
    } = {};

    let anchorDest: Destination | null = null;

    timeSlots.forEach((slot, idx) => {
      let candidate: Destination | null = null;

      if (!anchorDest) {
        // Pick top available candidate
        const available = scoredPool.find(item => !usedDestinationIds.has(item.dest.id));
        if (available) {
          candidate = available.dest;
          anchorDest = candidate;
        }
      } else {
        // Pick candidate closest to anchor destination for route efficiency
        const candidatesWithDistance = scoredPool
          .filter(item => !usedDestinationIds.has(item.dest.id))
          .map(item => ({
            dest: item.dest,
            dist: calculateDistanceKm(anchorDest!.latitude, anchorDest!.longitude, item.dest.latitude, item.dest.longitude)
          }))
          .sort((a, b) => a.dist - b.dist);

        if (candidatesWithDistance.length > 0) {
          candidate = candidatesWithDistance[0].dest;
          anchorDest = candidate; // chain anchor
        }
      }

      if (!candidate) {
        // Fallback to any destination even if reused
        candidate = pool[(dayNum * 3 + idx) % pool.length];
      }

      usedDestinationIds.add(candidate.id);

      daySlots[slot] = {
        destination_id: candidate.id,
        destination_name: candidate.name,
        time_slot: slot,
        sequence_number: idx + 1,
        district: candidate.district,
        category: candidate.category,
        image: candidate.image,
        activities: candidate.activities || candidate.main_attractions || ['Sightseeing', 'Photography'],
        visit_duration: candidate.recommended_duration || '2–3 hours',
        nearby_attractions: candidate.nearby_attractions || [],
        estimated_budget: candidate.estimated_budget || '₹ Budget',
        travel_notes: candidate.how_to_reach || `Located in ${candidate.district} district`,
        safety_notes: candidate.safety_information || 'Exercise caution and follow local guidance',
        matchScore: Math.min(98, 80 + Math.floor(Math.random() * 18))
      };
    });

    days.push({
      day: dayNum,
      slots: daySlots
    });
  }

  return days;
}
