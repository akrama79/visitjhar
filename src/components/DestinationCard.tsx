import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, MapPin, Star, Sparkles } from 'lucide-react';
import { Destination } from '../types';
import { useFavorites } from '../context/FavoritesContext';

interface DestinationCardProps {
  destination: Destination;
  matchScore?: number;
  matchReason?: string;
}

export const DestinationCard: React.FC<DestinationCardProps> = ({
  destination,
  matchScore,
  matchReason
}) => {
  const { isFavorite, toggleFavorite } = useFavorites();
  const favorited = isFavorite(destination.id);

  const fallbackImage = 'https://images.unsplash.com/photo-1511497584788-87676104235f?w=600&auto=format&fit=crop&q=80';

  return (
    <article className="group relative flex flex-col overflow-hidden rounded-2xl border border-border bg-card card-lift shadow-sm">
      {/* Image & Badges */}
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-muted">
        <img
          src={destination.image || fallbackImage}
          alt={destination.name}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
          onError={(e) => {
            (e.target as HTMLImageElement).src = fallbackImage;
          }}
        />

        {/* Gradient Scrim */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent"></div>

        {/* Top Floating Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="rounded-full bg-white/95 px-2.5 py-0.5 text-[11px] font-semibold text-primary shadow-sm backdrop-blur">
              {destination.category}
            </span>
            {destination.verification_status === 'VERIFIED' && (
              <span className="rounded-full bg-emerald-600/90 text-white px-2 py-0.5 text-[10px] font-bold shadow-sm backdrop-blur">
                ✓ Verified
              </span>
            )}
          </div>

          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              toggleFavorite(destination.id);
            }}
            className={`rounded-full p-2 transition shadow-md backdrop-blur focus-visible:ring-2 focus-visible:ring-primary ${
              favorited 
                ? 'bg-red-500 text-white' 
                : 'bg-white/90 text-slate-700 hover:bg-white hover:text-red-500'
            }`}
            title={favorited ? 'Remove from favorites' : 'Add to favorites'}
            aria-label="Toggle favorite"
          >
            <Heart className={`h-4 w-4 ${favorited ? 'fill-white' : ''}`} />
          </button>
        </div>

        {/* Bottom Image Overlay: District & Hidden Gem */}
        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white text-xs">
          <span className="inline-flex items-center gap-1 font-medium drop-shadow">
            <MapPin className="h-3.5 w-3.5 text-accent" />
            {destination.district} District
          </span>

          {destination.hidden_gem && (
            <span className="inline-flex items-center gap-1 rounded-full bg-accent/90 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white shadow">
              <Sparkles className="h-3 w-3" /> Hidden Gem
            </span>
          )}
        </div>
      </div>

      {/* Card Content */}
      <div className="flex flex-1 flex-col p-4 sm:p-5">
        {/* Match Score Pill (if present) */}
        {typeof matchScore === 'number' && matchScore > 0 && (
          <div className="mb-2 flex items-center gap-1.5">
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-semibold text-emerald-700 border border-emerald-200">
              <Sparkles className="h-3 w-3 text-emerald-600" />
              {matchScore}% Match
            </span>
            {matchReason && (
              <span className="text-[11px] text-muted-foreground truncate" title={matchReason}>
                {matchReason}
              </span>
            )}
          </div>
        )}

        <h3 className="font-heading text-lg font-bold tracking-tight text-foreground group-hover:text-primary transition-colors">
          <Link 
            to={`/destination/${destination.slug || destination.id}`}
            className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded"
          >
            {destination.name}
          </Link>
        </h3>

        <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-muted-foreground flex-1">
          {destination.short_description || destination.description}
        </p>

        {/* Footer info: Duration, Budget, View link */}
        <div className="mt-4 pt-3 border-t border-border flex items-center justify-between text-xs text-muted-foreground">
          <span>{destination.recommended_duration || '2–3 hours'}</span>
          <span className="font-medium text-foreground">{destination.estimated_budget || '₹ Budget'}</span>
          <Link
            to={`/destination/${destination.slug || destination.id}`}
            className="font-semibold text-primary hover:text-accent transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded"
          >
            Explore →
          </Link>
        </div>
      </div>
    </article>
  );
};
