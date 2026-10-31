export type BudgetTier = 'LOW' | 'MODERATE' | 'PREMIUM';
export type DifficultyTier = 'Easy' | 'Moderate' | 'Challenging';
export type DurationTier = 'SHORT' | 'HALF_DAY' | 'FULL_DAY' | 'MULTI_DAY';

export type TourismPillar =
  | 'Nature and Waterfalls'
  | 'Hill Stations and Plateaus'
  | 'Wildlife, Forests and Protected Areas'
  | 'Spiritual and Religious Destinations'
  | 'Heritage, Architecture and Archaeology'
  | 'Tribal Culture and Living Traditions'
  | 'Lakes, Dams and Scenic Landscapes'
  | 'Adventure and Outdoor Activities'
  | 'Rural and Community-Based Tourism'
  | 'Lesser-Known and Emerging Destinations';

export interface TourismCircuit {
  id: string;
  name: string;
  slug: string;
  pillar: TourismPillar;
  description: string;
  recommended_days: number;
  best_season: string;
  districts: string[];
  destination_ids: string[];
  highlights: string[];
  official_policy_reference: string;
}

export interface District {
  id: string;
  name: string;
  slug: string;
  latitude: number;
  longitude: number;
  description?: string | null;
  tourism_summary?: string | null;
  image?: string | null;
  active: boolean;
  created_date?: string;
  updated_date?: string;
  created_by_id?: string;
  is_sample?: boolean;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  icon?: string | null;
  image?: string | null;
  active: boolean;
  created_date?: string;
  updated_date?: string;
  created_by_id?: string;
  is_sample?: boolean;
}

export interface Destination {
  id: string;
  name: string;
  slug: string;
  district: string;
  category: string;
  pillar?: TourismPillar;
  alt_names?: string[];
  nearest_city?: string;
  source_title?: string;
  information_status?: string;
  subcategory?: string | null;
  latitude: number;
  longitude: number;
  short_description?: string | null;
  description?: string | null;
  best_time_to_visit?: string | null;
  recommended_duration?: string | null;
  suggested_duration?: string | null;
  duration_category?: DurationTier | null;
  estimated_budget?: string | null;
  budget_level?: BudgetTier | null;
  difficulty?: DifficultyTier | null;
  main_attractions?: string[];
  attractions?: string[];
  activities?: string[];
  cultural_significance?: string | null;
  historical_significance?: string | null;
  safety_information?: string | null;
  responsible_tourism?: string | null;
  how_to_reach?: string | null;
  nearby_attractions?: string[];
  local_experiences?: any[];
  image?: string | null;
  gallery?: string[];
  images?: string[];
  featured?: boolean;
  hidden_gem?: boolean;
  active: boolean;
  views?: number;
  rating_avg?: number | null;
  rating_count?: number;
  verification_status?: 'VERIFIED' | 'PARTIALLY_VERIFIED' | 'UNVERIFIED';
  last_verified?: string | null;
  source_urls?: string[];
  created_date?: string;
  updated_date?: string;
  created_by_id?: string;
  is_sample?: boolean;
  best_time?: string;
  primary_category?: string;
}

export interface CulturalContent {
  id: string;
  title: string;
  category: string;
  district?: string | null;
  region?: string | null;
  description?: string | null;
  cultural_significance?: string | null;
  image?: string | null;
  gallery?: string[];
  related_destinations?: string[];
  active: boolean;
  created_date?: string;
  updated_date?: string;
  created_by_id?: string;
  is_sample?: boolean;
}

export interface TourismEvent {
  id: string;
  name: string;
  description?: string | null;
  date: string;
  end_date?: string | null;
  location?: string | null;
  district: string;
  category?: string | null;
  cultural_significance?: string | null;
  image?: string | null;
  related_destinations?: string[];
  active: boolean;
  created_date?: string;
  updated_date?: string;
  created_by_id?: string;
  is_sample?: boolean;
  community?: string | null;
  event_type?: string | null;
  official_source?: string | null;
  recurrence_information?: string | null;
  recurring?: boolean;
  source_urls?: string[];
  start_date?: string;
  verification_status?: string;
  images?: string[];
}

export interface LocalExperience {
  id: string;
  name: string;
  type: string;
  district: string;
  location?: string | null;
  description?: string | null;
  provider_name?: string | null;
  contact?: string | null;
  image?: string | null;
  gallery?: string[];
  price_range?: string | null;
  estimated_cost?: string | null;
  duration?: string | null;
  rating?: number;
  active: boolean;
  created_date?: string;
  updated_date?: string;
  created_by_id?: string;
  is_sample?: boolean;
}

export interface Artisan {
  id: string;
  name: string;
  craft_type: string;
  district: string;
  location?: string | null;
  description?: string | null;
  cultural_significance?: string | null;
  image?: string | null;
  gallery?: string[];
  active: boolean;
  created_date?: string;
  updated_date?: string;
  created_by_id?: string;
  is_sample?: boolean;
}

export interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  avatar_url?: string;
  role: 'user' | 'admin';
  interests?: string[];
  preferred_categories?: string[];
  travel_style?: string;
  preferred_duration?: string;
  preferred_budget?: BudgetTier;
  travel_group?: string;
  home_location?: string;
  age?: number;
}

export interface Review {
  id: string;
  destination_id: string;
  user_id: string;
  user_name: string;
  destination_name: string;
  rating: number;
  review_text: string;
  image?: string | null;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  hidden?: boolean;
  admin_note?: string;
  created_date: string;
}

export interface ItinerarySlot {
  destination_id: string;
  destination_name: string;
  time_slot: 'Morning' | 'Afternoon' | 'Evening';
  sequence_number: number;
  district?: string;
  category?: string;
  image?: string | null;
  activities?: string[];
  visit_duration?: string;
  nearby_attractions?: string[];
  estimated_budget?: string;
  travel_notes?: string;
  safety_notes?: string;
  matchScore?: number;
}

export interface ItineraryDay {
  day: number;
  slots: {
    Morning?: ItinerarySlot;
    Afternoon?: ItinerarySlot;
    Evening?: ItinerarySlot;
  };
}

export interface Itinerary {
  id: string;
  user_id: string;
  name: string;
  num_days: number;
  start_date?: string | null;
  end_date?: string | null;
  budget?: string;
  travel_group?: string;
  num_travelers?: number;
  starting_location?: string;
  interests?: string[];
  activities?: string[];
  notes?: string;
  created_date?: string;
  days?: ItineraryDay[];
}
