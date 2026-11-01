import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, MapPin, Sparkles, ArrowRight } from 'lucide-react';
import { Destination } from '../types';
import { useFavorites } from '../context/FavoritesContext';
import { DestinationImage } from './DestinationImage';

interface DestinationCardProps {
  destination: Destination;
  matchScore?: number;
  matchReason?: string;
  className?: string;
}

export const DestinationCard: React.FC<DestinationCardProps> = ({
  destination,
  matchScore,
  matchReason,
  className = ''
}) => {
  const { isFavorite, toggleFavorite } = useFavorites();
  const favorited = isFavorite(destination.id);
  const destinationUrl = `/destination/${destination.slug || destination.id}`;

  return (
    <article className={`group relative flex flex-col overflow-hidden rounded-2xl border border-border/80 bg-card transition-all duration-300 hover:shadow-lg hover:border-primary/30 ${className}`}>
      {/* 1. Image Container with 16:10 aspect ratio */}
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-900">
        <DestinationImage
          src={destination.image}
          alt={destination.image_alt || destination.name}
          category={destination.category}
          pillar={destination.pillar}
          targetSize={500}
          className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
        />

        {/* Subtle gradient overlay for contrast */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent pointer-events-none" />

        {/* Top Floating Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
          <div className="flex items-center gap-1.5 flex-wrap pointer-events-auto">
            <span className="rounded-full bg-white/95 px-3 py-1 text-xs font-semibold text-primary shadow-sm backdrop-blur">
              {destination.category}
            </span>
            {(destination.verification_status === 'VERIFIED_AUTHENTIC' || destination.verification_status === 'VERIFIED') && (
              <span className="rounded-full bg-emerald-700/90 text-white px-2.5 py-0.5 text-[11px] font-semibold shadow-sm backdrop-blur">
                ✓ Verified
              </span>
            )}
            {destination.needs_photo && (
              <span className="rounded-full bg-black/60 text-amber-300 border border-amber-400/40 px-2 py-0.5 text-[10px] font-medium shadow-sm backdrop-blur" title="Community photo contribution welcomed">
                Photo Needed
              </span>
            )}
          </div>

          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              toggleFavorite(destination.id);
            }}
            className={`pointer-events-auto rounded-full p-2.5 transition shadow-md backdrop-blur focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
              favorited 
                ? 'bg-red-500 text-white' 
                : 'bg-white/90 text-slate-700 hover:bg-white hover:text-red-500'
            }`}
            title={favorited ? 'Remove from favorites' : 'Add to favorites'}
            aria-label={`Toggle favorite for ${destination.name}`}
          >
            <Heart className={`h-4 w-4 ${favorited ? 'fill-white' : ''}`} />
          </button>
        </div>

        {/* Bottom District Tag */}
        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white text-xs font-medium pointer-events-none">
          <span className="inline-flex items-center gap-1 rounded-full bg-black/40 px-2.5 py-1 backdrop-blur-sm text-slate-100">
            <MapPin className="h-3.5 w-3.5 text-accent" />
            {destination.district} District
          </span>

          {destination.hidden_gem && (
            <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/95 px-2.5 py-1 text-[11px] font-semibold text-white shadow">
              <Sparkles className="h-3 w-3" /> Hidden Gem
            </span>
          )}
        </div>
      </div>

      {/* 2. Card Body */}
      <div className="flex flex-1 flex-col p-5">
        {/* Match Score Indicator (if provided by recommendation engine) */}
        {typeof matchScore === 'number' && matchScore > 0 && (
          <div className="mb-2.5 flex items-center gap-2">
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-800 border border-emerald-200">
              <Sparkles className="h-3 w-3 text-emerald-600" />
              {matchScore}% Match
            </span>
            {matchReason && (
              <span className="text-xs text-muted-foreground truncate" title={matchReason}>
                {matchReason}
              </span>
            )}
          </div>
        )}

        {/* Title */}
        <h3 className="font-heading text-lg font-bold tracking-tight text-foreground transition-colors group-hover:text-primary">
          <Link 
            to={destinationUrl}
            className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded"
          >
            {destination.name}
          </Link>
        </h3>

        {/* Description: Readable text-sm, 2 lines max */}
        <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-muted-foreground flex-1">
          {destination.short_description || destination.description}
        </p>

        {/* 3. Action Footer */}
        <div className="mt-5 pt-3.5 border-t border-border/70 flex items-center justify-between text-xs">
          <span className="text-muted-foreground font-medium">
            {destination.recommended_duration || '2–3 hours'}
          </span>

          <Link
            to={destinationUrl}
            className="inline-flex items-center gap-1 text-sm font-semibold text-primary hover:text-primary-dark transition group/link focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded py-0.5"
          >
            <span>View Details</span>
            <ArrowRight className="h-4 w-4 transition-transform group-hover/link:translate-x-1" />
          </Link>
        </div>
      </div>
    </article>
  );
};
