import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Heart, 
  Calendar, 
  Route, 
  Sparkles, 
  User, 
  Settings, 
  Compass,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useFavorites } from '../context/FavoritesContext';
import { INITIAL_DESTINATIONS, INITIAL_EVENTS, INITIAL_ITINERARIES } from '../data/mockData';
import { DestinationCard } from '../components/DestinationCard';
import { getRecommendedDestinations } from '../lib/recommendations';

export const DashboardPage: React.FC = () => {
  const { user, isAdmin } = useAuth();
  const { favorites } = useFavorites();

  const savedItinerariesCount = (() => {
    const saved = localStorage.getItem('visitjhar_user_itineraries');
    const local = saved ? JSON.parse(saved) : [];
    return local.length + INITIAL_ITINERARIES.length;
  })();

  const recommendations = getRecommendedDestinations(INITIAL_DESTINATIONS, user, 3);
  const favoriteDestinations = INITIAL_DESTINATIONS.filter(d => favorites.includes(d.id)).slice(0, 3);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-10">
      {/* Welcome Banner */}
      <div className="rounded-3xl border border-border bg-card p-6 sm:p-8 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <img
            src={user?.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200'}
            alt={user?.full_name}
            className="h-16 w-16 rounded-full object-cover ring-2 ring-primary/20 shadow-sm"
          />
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-heading text-2xl font-bold text-foreground">
                Welcome back, {user?.full_name}!
              </h1>
              {isAdmin && (
                <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-0.5 text-[10px] font-bold text-primary">
                  <ShieldCheck className="h-3 w-3" /> Administrator
                </span>
              )}
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">
              Explorer based in <strong>{user?.home_location || 'Ranchi'}</strong> • Preferred style: {user?.travel_style || 'Balanced'}
            </p>
          </div>
        </div>

        <Link
          to="/profile"
          className="inline-flex items-center gap-1.5 rounded-full border border-border bg-secondary px-4 py-2 text-xs font-semibold text-foreground hover:bg-border transition"
        >
          <Settings className="h-3.5 w-3.5" /> Edit Travel Preferences
        </Link>
      </div>

      {/* Metrics Row */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Link
          to="/favorites"
          className="rounded-2xl border border-border bg-card p-5 card-lift shadow-sm flex items-center justify-between"
        >
          <div>
            <span className="text-xs text-muted-foreground block">Saved Destinations</span>
            <span className="font-heading text-3xl font-extrabold text-foreground mt-1 block">
              {favorites.length}
            </span>
          </div>
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-50 text-red-500">
            <Heart className="h-6 w-6" />
          </div>
        </Link>

        <Link
          to="/itineraries"
          className="rounded-2xl border border-border bg-card p-5 card-lift shadow-sm flex items-center justify-between"
        >
          <div>
            <span className="text-xs text-muted-foreground block">Trip Itineraries</span>
            <span className="font-heading text-3xl font-extrabold text-foreground mt-1 block">
              {savedItinerariesCount}
            </span>
          </div>
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 text-primary">
            <Route className="h-6 w-6" />
          </div>
        </Link>

        <Link
          to="/events"
          className="rounded-2xl border border-border bg-card p-5 card-lift shadow-sm flex items-center justify-between"
        >
          <div>
            <span className="text-xs text-muted-foreground block">Statewide Festivals</span>
            <span className="font-heading text-3xl font-extrabold text-foreground mt-1 block">
              {INITIAL_EVENTS.length}
            </span>
          </div>
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-50 text-accent">
            <Calendar className="h-6 w-6" />
          </div>
        </Link>
      </div>

      {/* Recommended for You Section */}
      <section className="space-y-4">
        <div className="flex items-center justify-between border-b border-border pb-3">
          <div>
            <h2 className="font-heading text-xl font-bold text-foreground">
              Personalized Recommendations
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Ranked with your weighted travel preferences.
            </p>
          </div>
          <Link to="/explore" className="text-xs font-semibold text-primary hover:text-accent">
            Explore more →
          </Link>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {recommendations.map(({ destination, score, reasons }) => (
            <DestinationCard
              key={destination.id}
              destination={destination}
              matchScore={score}
              matchReason={reasons[0]}
            />
          ))}
        </div>
      </section>

      {/* Bookmarks Preview */}
      {favoriteDestinations.length > 0 && (
        <section className="space-y-4">
          <div className="flex items-center justify-between border-b border-border pb-3">
            <h2 className="font-heading text-xl font-bold text-foreground">
              Your Bookmarks ({favorites.length})
            </h2>
            <Link to="/favorites" className="text-xs font-semibold text-primary hover:text-accent">
              View all →
            </Link>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {favoriteDestinations.map(dest => (
              <DestinationCard key={dest.id} destination={dest} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
};
