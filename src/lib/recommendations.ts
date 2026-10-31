import { Destination, UserProfile } from '../types';

export const RECOMMENDATION_WEIGHTS = {
  interest: 0.30,
  category: 0.20,
  activity: 0.15,
  duration: 0.15,
  budget: 0.10,
  group: 0.05,
  location: 0.05
};

export const INTEREST_TO_CATEGORIES: Record<string, string[]> = {
  Nature: ['Nature', 'Eco Tourism', 'Forest', 'Dam & Lake', 'Hill & Plateau'],
  Waterfalls: ['Waterfalls'],
  Wildlife: ['Wildlife'],
  Adventure: ['Adventure'],
  Culture: ['Tribal & Cultural', 'Community Experience'],
  'Tribal Heritage': ['Tribal & Cultural', 'Rural Tourism'],
  History: ['Historical', 'Heritage'],
  'Religious Tourism': ['Religious'],
  Food: ['Food'],
  Photography: ['Eco Tourism', 'Waterfalls', 'Wildlife', 'Nature'],
  'Rural Experiences': ['Rural Tourism', 'Community Experience'],
  Handicrafts: ['Handicrafts']
};

export const INTEREST_TO_ACTIVITIES: Record<string, string[]> = {
  Nature: ['Nature walks', 'Scenic drives', 'Sunrise & sunset viewing', 'Lake & dam visits'],
  Waterfalls: ['Photography', 'Sightseeing', 'Picnics', 'Nature walks'],
  Wildlife: ['Wildlife safari', 'Wildlife watching', 'Birdwatching'],
  Adventure: ['Trekking', 'Hiking', 'Rock climbing', 'Paragliding', 'Camping', 'Boating'],
  Culture: ['Cultural performances', 'Art workshops', 'Village walks', 'Community experiences'],
  'Tribal Heritage': ['Village walks', 'Cultural performances', 'Local food', 'Community experiences'],
  History: ['Heritage walks', 'History exploration', 'Museum visits', 'Sightseeing'],
  'Religious Tourism': ['Pilgrimage', 'Temple visits'],
  Food: ['Local food'],
  Photography: ['Photography', 'Sightseeing', 'Sunrise & sunset viewing'],
  'Rural Experiences': ['Village walks', 'Local food', 'Community experiences', 'Forest stays'],
  Handicrafts: ['Art workshops', 'Craft shopping']
};

const DURATION_VALUES: Record<string, number> = {
  '1-2 hours': 0.25,
  '2-3 hours': 0.25,
  'Half day': 0.5,
  'Half day to full day': 0.75,
  'Full day': 1.0,
  '1 day': 1.0,
  '1-2 days': 1.5,
  '1-2 nights': 1.5,
  '2 nights': 2.0
};

const BUDGET_TIER_SCORES: Record<string, number> = {
  LOW: 1,
  MODERATE: 2,
  PREMIUM: 3,
  Low: 1,
  Moderate: 2,
  High: 3
};

export function parseDestinationDuration(raw: string | null | undefined): number {
  const str = String(raw || '').replace(/[–—]/g, '-').replace(/\(.*?\)/g, '').trim();
  if (DURATION_VALUES[str] !== undefined) return DURATION_VALUES[str];

  const nightDayMatch = str.match(/(\d+)\s*night\s*\/\s*(\d+)\s*days?/i);
  if (nightDayMatch) return Number(nightDayMatch[2]);

  const nightMatch = str.match(/(\d+)\s*(?:-\s*(\d+))?\s*night/i);
  if (nightMatch) return nightMatch[2] ? (Number(nightMatch[1]) + Number(nightMatch[2])) / 2 : Number(nightMatch[1]);

  const dayMatch = str.match(/(\d+)\s*(?:-\s*(\d+))?\s*day/i);
  if (dayMatch) return dayMatch[2] ? (Number(dayMatch[1]) + Number(dayMatch[2])) / 2 : Number(dayMatch[1]);

  if (/hour/i.test(str)) return 0.25;
  return 1.0;
}

export function parseUserDurationDays(raw: string | null | undefined): number {
  const match = String(raw || '').match(/(\d+)/);
  return match ? parseInt(match[1], 10) : 3;
}

export interface RecommendationResult {
  destination: Destination;
  score: number;
  reasons: string[];
}

/**
 * Exact preference matching function reverse-engineered from reference bundle (JT)
 */
export function calculateDestinationScore(
  destination: Destination,
  profile?: UserProfile | null
): { score: number; reasons: string[] } {
  const reasons: string[] = [];
  const interests = profile?.interests || [];
  const preferredCategories = profile?.preferred_categories || [];
  const preferredBudget = profile?.preferred_budget;
  const userDays = parseUserDurationDays(profile?.preferred_duration);
  const travelGroup = profile?.travel_group;
  const homeLocation = profile?.home_location;

  let sInterest = 0.5;
  if (interests.length > 0) {
    const destCats = [destination.category, destination.subcategory].filter(Boolean) as string[];
    const destActs = destination.activities || [];
    const matchedInterests = interests.filter(interest => {
      const cats = INTEREST_TO_CATEGORIES[interest] || [];
      const acts = INTEREST_TO_ACTIVITIES[interest] || [];
      return cats.some(c => destCats.includes(c)) || acts.some(a => destActs.includes(a));
    });
    sInterest = matchedInterests.length / interests.length;
    if (matchedInterests.length > 0) {
      reasons.push(`Matches your interest in ${matchedInterests.slice(0, 3).join(', ').toLowerCase()}`);
    }
  }

  let sCategory = 0.5;
  if (preferredCategories.length > 0) {
    sCategory = preferredCategories.includes(destination.category) ? 1.0 : 0.0;
    if (sCategory === 1.0) {
      reasons.push(`Fits your preferred ${destination.category.toLowerCase()} category`);
    }
  }

  let sActivity = 0.5;
  if (interests.length > 0) {
    const desiredActivities = new Set<string>();
    interests.forEach(interest => {
      (INTEREST_TO_ACTIVITIES[interest] || []).forEach(act => desiredActivities.add(act));
    });
    const destActs = destination.activities || [];
    const matchedActs = [...desiredActivities].filter(a => destActs.includes(a));
    sActivity = desiredActivities.size > 0 ? matchedActs.length / desiredActivities.size : 0;
    if (matchedActs.length > 0) {
      reasons.push(`Includes ${matchedActs.slice(0, 2).join(' & ').toLowerCase()} activities`);
    }
  }

  const destDurationVal = parseDestinationDuration(destination.recommended_duration || destination.suggested_duration);
  let sDuration = 1.0;
  if (destDurationVal <= userDays) {
    sDuration = 1.0;
    if (userDays <= 3) {
      reasons.push(`Suitable for a ${userDays}-day trip`);
    }
  } else {
    sDuration = Math.max(0, 1 - (destDurationVal - userDays) / destDurationVal);
  }

  let sBudget = 0.5;
  const destBudget = destination.budget_level || destination.estimated_budget;
  if (preferredBudget && destBudget) {
    const userB = BUDGET_TIER_SCORES[preferredBudget] || 2;
    const destB = BUDGET_TIER_SCORES[destBudget] || 2;
    sBudget = userB === destB ? 1.0 : Math.abs(userB - destB) === 1 ? 0.5 : 0.0;
    if (sBudget === 1.0) {
      reasons.push(`Fits your preferred Budget tier`);
    }
  }

  let sGroup = 0.7;
  if (travelGroup) {
    if (travelGroup === 'Family') {
      sGroup = destination.difficulty === 'Easy' ? 1.0 : 0.4;
    } else if (travelGroup === 'Friends') {
      sGroup = destination.category === 'Adventure' || destination.difficulty === 'Challenging' ? 1.0 : 0.7;
    } else if (travelGroup === 'Solo') {
      sGroup = 0.8;
    } else {
      sGroup = 0.85;
    }
    if (sGroup >= 0.8) {
      reasons.push(`Popular with ${travelGroup.toLowerCase()} travellers`);
    }
  }

  let sLocation = 0.3;
  if (homeLocation) {
    sLocation = homeLocation === destination.district ? 1.0 : 0.3;
    if (sLocation === 1.0) {
      reasons.push(`Located in your home district, ${destination.district}`);
    }
  }

  const W = RECOMMENDATION_WEIGHTS;
  const rawScore =
    sInterest * W.interest +
    sCategory * W.category +
    sActivity * W.activity +
    sDuration * W.duration +
    sBudget * W.budget +
    sGroup * W.group +
    sLocation * W.location;

  return {
    score: Math.round(100 * rawScore),
    reasons: reasons.slice(0, 4)
  };
}

/**
 * Returns sorted recommendations using exact formula or rating fallback (YT)
 */
export function getRecommendedDestinations(
  destinations: Destination[],
  profile?: UserProfile | null,
  limit = 6
): RecommendationResult[] {
  if (profile && ((profile.interests && profile.interests.length > 0) || (profile.preferred_categories && profile.preferred_categories.length > 0))) {
    return destinations
      .map(dest => {
        const { score, reasons } = calculateDestinationScore(dest, profile);
        return { destination: dest, score, reasons };
      })
      .sort((a, b) => b.score - a.score)
      .slice(0, limit);
  }

  // Fallback for unauthenticated or non-profile visitors: popular/top rated
  return [...destinations]
    .sort((a, b) => (b.views || 0) - (a.views || 0))
    .slice(0, limit)
    .map(dest => ({
      destination: dest,
      score: 85,
      reasons: ['Popular with visitors across Jharkhand — set your interests for personalized picks']
    }));
}
