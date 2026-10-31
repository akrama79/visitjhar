import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Compass, Trash2 } from 'lucide-react';
import { useFavorites } from '../context/FavoritesContext';
import { INITIAL_DESTINATIONS } from '../data/mockData';
import { DestinationCard } from '../components/DestinationCard';

export const FavoritesPage: React.FC = () => {
  const { favorites } = useFavorites();

  const savedDestinations = INITIAL_DESTINATIONS.filter(d => favorites.includes(d.id));

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
      <div>
        <span className="text-xs font-bold uppercase tracking-wider text-accent">Personal Bookmarks</span>
        <h1 className="font-heading text-3xl font-extrabold sm:text-4xl text-foreground mt-1">
          Saved Destinations ({savedDestinations.length})
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Your bookmarked places across Jharkhand for quick planning and reference.
        </p>
      </div>

      {savedDestinations.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {savedDestinations.map(d => (
            <DestinationCard key={d.id} destination={d} />
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-border bg-card p-12 text-center max-w-md mx-auto space-y-4">
          <Heart className="mx-auto h-12 w-12 text-muted-foreground/40" />
          <h3 className="font-heading text-lg font-bold text-foreground">No saved destinations yet</h3>
          <p className="text-xs text-muted-foreground">
            Explore Jharkhand and tap the heart icon on any destination card to bookmark it here.
          </p>
          <Link
            to="/explore"
            className="inline-flex rounded-full bg-primary px-6 py-2 text-xs font-semibold text-white shadow-sm hover:bg-primary-light transition"
          >
            Explore Places
          </Link>
        </div>
      )}
    </div>
  );
};
