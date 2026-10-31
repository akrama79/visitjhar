import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Route, Calendar, Users, IndianRupee, MapPin, Sparkles, Plus, Clock } from 'lucide-react';
import { INITIAL_ITINERARIES } from '../data/mockData';
import { Itinerary } from '../types';

export const ItinerariesPage: React.FC = () => {
  const [itineraries] = useState<Itinerary[]>(() => {
    const saved = localStorage.getItem('visitjhar_user_itineraries');
    const local = saved ? JSON.parse(saved) : [];
    return [...local, ...INITIAL_ITINERARIES];
  });

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-border pb-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-accent">Trip Plans</span>
          <h1 className="font-heading text-3xl font-extrabold sm:text-4xl text-foreground mt-1">
            Day-Wise Itineraries ({itineraries.length})
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Saved trips and curated circuits across Jharkhand's plateaus and valleys.
          </p>
        </div>

        <Link
          to="/plan-trip"
          className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2 text-xs font-semibold text-white shadow hover:bg-primary-light transition"
        >
          <Plus className="h-4 w-4" /> Plan New Trip
        </Link>
      </div>

      {/* Grid of Itineraries */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {itineraries.map(itin => (
          <div
            key={itin.id}
            className="flex flex-col rounded-2xl border border-border bg-card p-6 card-lift shadow-sm space-y-4"
          >
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span className="rounded-full bg-accent/15 px-2.5 py-0.5 text-[10px] font-bold text-accent">
                {itin.num_days} {itin.num_days === 1 ? 'Day' : 'Days'} Tour
              </span>
              <span className="font-medium text-foreground">
                {itin.budget ? `Budget: ${itin.budget}` : '₹ Budget'}
              </span>
            </div>

            <h3 className="font-heading text-xl font-bold text-foreground">
              {itin.name}
            </h3>

            <div className="space-y-1.5 text-xs text-muted-foreground">
              <div className="flex items-center gap-1.5">
                <MapPin className="h-3.5 w-3.5 text-accent" />
                <span>Starts in: <strong>{itin.starting_location || 'Ranchi'}</strong></span>
              </div>
              <div className="flex items-center gap-1.5">
                <Users className="h-3.5 w-3.5 text-accent" />
                <span>Group: <strong>{itin.travel_group || 'Friends'}</strong> ({itin.num_travelers || 2} persons)</span>
              </div>
              {itin.start_date && (
                <div className="flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5 text-accent" />
                  <span>Start Date: {itin.start_date}</span>
                </div>
              )}
            </div>

            {itin.notes && (
              <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2 border-t border-border pt-3">
                {itin.notes}
              </p>
            )}

            {/* Days Preview */}
            {itin.days && itin.days.length > 0 && (
              <div className="rounded-xl bg-secondary/50 p-3 space-y-1.5 text-xs">
                <span className="font-bold text-foreground block text-[11px]">Daily Highlights:</span>
                {itin.days.map(d => (
                  <div key={d.day} className="text-[11px] text-muted-foreground truncate">
                    <strong>Day {d.day}:</strong> {Object.values(d.slots).map(s => s?.destination_name).filter(Boolean).join(' → ')}
                  </div>
                ))}
              </div>
            )}

            <div className="mt-auto pt-2">
              <Link
                to={`/plan-trip?startingLocation=${encodeURIComponent(itin.starting_location || 'Ranchi')}`}
                className="block w-full rounded-lg bg-secondary py-2 text-center text-xs font-semibold text-primary hover:bg-primary hover:text-white transition"
              >
                Customize Route in Planner →
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
