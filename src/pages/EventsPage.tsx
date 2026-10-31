import React, { useState } from 'react';
import { Calendar, MapPin, Sparkles, Clock, Check } from 'lucide-react';
import { INITIAL_EVENTS } from '../data/mockData';

export const EventsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'upcoming' | 'all'>('upcoming');

  const todayStr = new Date().toISOString().slice(0, 10);

  const upcomingEvents = INITIAL_EVENTS.filter(e => e.date >= todayStr || true); // In demo, all are showcased
  const displayEvents = activeTab === 'upcoming' ? upcomingEvents : INITIAL_EVENTS;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-accent/15 px-3 py-1 text-xs font-bold text-accent">
          <Calendar className="h-3.5 w-3.5" /> Cultural Calendar
        </span>
        <h1 className="font-heading text-3xl font-extrabold sm:text-4xl text-foreground">
          Festivals & Cultural Events in Jharkhand
        </h1>
        <p className="text-sm text-muted-foreground leading-relaxed">
          From the spring sal blossom festival of Sarhul to Karma nature worship and the massive Shravani Mela pilgrimage.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex justify-center border-b border-border pb-4">
        <div className="inline-flex rounded-full bg-secondary p-1">
          <button
            onClick={() => setActiveTab('upcoming')}
            className={`rounded-full px-5 py-1.5 text-xs font-semibold transition ${
              activeTab === 'upcoming'
                ? 'bg-primary text-white shadow'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            All Festivals & Celebrations ({INITIAL_EVENTS.length})
          </button>
        </div>
      </div>

      {/* Events Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {displayEvents.map(evt => (
          <article
            key={evt.id}
            className="flex flex-col overflow-hidden rounded-2xl border border-border bg-card card-lift shadow-sm"
          >
            <div className="relative aspect-[16/10] w-full overflow-hidden bg-muted">
              <img
                src={evt.image || 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=500'}
                alt={evt.name}
                className="h-full w-full object-cover"
              />
              <div className="absolute top-3 left-3 flex items-center gap-2">
                <span className="rounded-full bg-white/95 px-2.5 py-1 text-[11px] font-bold text-primary shadow backdrop-blur flex items-center gap-1">
                  <Calendar className="h-3 w-3 text-accent" />
                  {new Date(evt.date).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}
                </span>
              </div>
            </div>

            <div className="flex flex-1 flex-col p-5 space-y-3">
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span className="inline-flex items-center gap-1 font-medium text-foreground">
                  <MapPin className="h-3.5 w-3.5 text-accent" /> {evt.district} District
                </span>
                <span className="rounded bg-secondary px-2 py-0.5 text-[10px] font-semibold text-primary">
                  {evt.category || 'Tribal Festival'}
                </span>
              </div>

              <h3 className="font-heading text-xl font-bold text-foreground">
                {evt.name}
              </h3>

              <p className="text-xs text-muted-foreground leading-relaxed line-clamp-3">
                {evt.description}
              </p>

              {evt.cultural_significance && (
                <div className="mt-auto border-t border-border pt-3">
                  <span className="text-[10px] uppercase font-bold text-accent tracking-wider block mb-1">
                    Significance & Tradition
                  </span>
                  <p className="text-xs text-slate-700 line-clamp-2">
                    {evt.cultural_significance}
                  </p>
                </div>
              )}
            </div>
          </article>
        ))}
      </div>
    </div>
  );
};
