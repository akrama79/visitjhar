import { Destination } from '../types';

/**
 * Haversine formula calculation for distance between two lat/lng points in km.
 * Directly extracted from reference function FO.
 */
export function calculateDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  return 12742 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

/**
 * Format distance cleanly:
 * < 1 km: 'xxx m'
 * < 10 km: 'x.x km'
 * >= 10 km: 'xx km'
 */
export function formatDistance(distanceKm: number | null | undefined): string {
  if (distanceKm == null || isNaN(distanceKm)) return '';
  if (distanceKm < 1) return `${Math.round(distanceKm * 1000)} m`;
  if (distanceKm < 10) return `${distanceKm.toFixed(1)} km`;
  return `${Math.round(distanceKm)} km`;
}

export interface NearbyDestination extends Destination {
  distance_km: number;
}

/**
 * Return top N geographically closest destinations using Haversine calculation.
 * Directly extracted from reference function LO.
 */
export function getNearbyDestinations(
  current: Destination,
  all: Destination[],
  limit = 5,
  maxDistanceKm: number | null = null
): NearbyDestination[] {
  if (!current || current.latitude == null || current.longitude == null) return [];

  return all
    .filter(d => d.id !== current.id && d.latitude != null && d.longitude != null)
    .map(d => ({
      ...d,
      distance_km: calculateDistanceKm(current.latitude, current.longitude, d.latitude, d.longitude)
    }))
    .filter(d => maxDistanceKm == null || d.distance_km <= maxDistanceKm)
    .sort((a, b) => a.distance_km - b.distance_km)
    .slice(0, limit);
}
