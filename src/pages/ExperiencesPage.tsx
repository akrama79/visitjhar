import React, { useState } from 'react';
import { Compass, MapPin, IndianRupee, Clock, Users, Sparkles, Phone } from 'lucide-react';
import { INITIAL_EXPERIENCES, INITIAL_ARTISANS } from '../data/mockData';

export const ExperiencesPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'experiences' | 'artisans'>('experiences');

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-accent/15 px-3 py-1 text-xs font-bold text-accent">
          <Compass className="h-3.5 w-3.5" /> Community-Rooted Tourism
        </span>
        <h1 className="font-heading text-3xl font-extrabold sm:text-4xl text-foreground">
          Local Experiences & Artisans
        </h1>
        <p className="text-sm text-muted-foreground leading-relaxed">
          Stay in authentic tribal homestays, join village craft workshops, hire local guides, and connect directly with master artisans.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex justify-center border-b border-border pb-4">
        <div className="inline-flex rounded-full bg-secondary p-1">
          <button
            onClick={() => setActiveTab('experiences')}
            className={`rounded-full px-5 py-1.5 text-xs font-semibold transition ${
              activeTab === 'experiences'
                ? 'bg-primary text-white shadow'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Local Experiences ({INITIAL_EXPERIENCES.length})
          </button>
          <button
            onClick={() => setActiveTab('artisans')}
            className={`rounded-full px-5 py-1.5 text-xs font-semibold transition ${
              activeTab === 'artisans'
                ? 'bg-primary text-white shadow'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Master Artisans Directory ({INITIAL_ARTISANS.length})
          </button>
        </div>
      </div>

      {/* 1. Experiences Tab */}
      {activeTab === 'experiences' && (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {INITIAL_EXPERIENCES.map(exp => (
            <article
              key={exp.id}
              className="flex flex-col overflow-hidden rounded-2xl border border-border bg-card card-lift shadow-sm"
            >
              <div className="relative aspect-[16/10] w-full overflow-hidden bg-muted">
                <img
                  src={exp.image || 'https://images.unsplash.com/photo-1544816155-12df9643f363?w=500'}
                  alt={exp.name}
                  className="h-full w-full object-cover"
                />
                <div className="absolute top-3 left-3">
                  <span className="rounded-full bg-white/95 px-2.5 py-1 text-[11px] font-bold text-primary shadow backdrop-blur">
                    {exp.type}
                  </span>
                </div>
              </div>

              <div className="flex flex-1 flex-col p-5 space-y-3">
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span className="inline-flex items-center gap-1 font-medium text-foreground">
                    <MapPin className="h-3.5 w-3.5 text-accent" /> {exp.district} District
                  </span>
                  {exp.duration && (
                    <span className="inline-flex items-center gap-1">
                      <Clock className="h-3 w-3" /> {exp.duration}
                    </span>
                  )}
                </div>

                <h3 className="font-heading text-lg font-bold text-foreground">
                  {exp.name}
                </h3>

                <p className="text-xs text-muted-foreground leading-relaxed line-clamp-3">
                  {exp.description}
                </p>

                <div className="mt-auto border-t border-border pt-3 flex items-center justify-between text-xs">
                  <span className="font-bold text-primary">
                    {exp.price_range || exp.estimated_cost || 'Contact for rates'}
                  </span>
                  {exp.contact && (
                    <span className="text-[11px] text-muted-foreground flex items-center gap-1">
                      <Phone className="h-3 w-3" /> {exp.contact}
                    </span>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>
      )}

      {/* 2. Artisans Tab */}
      {activeTab === 'artisans' && (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {INITIAL_ARTISANS.map(art => (
            <article
              key={art.id}
              className="flex flex-col overflow-hidden rounded-2xl border border-border bg-card card-lift shadow-sm"
            >
              <div className="relative aspect-[16/10] w-full overflow-hidden bg-muted">
                <img
                  src={art.image || 'https://images.unsplash.com/photo-1544816155-12df9643f363?w=500'}
                  alt={art.name}
                  className="h-full w-full object-cover"
                />
                <div className="absolute top-3 left-3">
                  <span className="rounded-full bg-accent/90 px-2.5 py-1 text-[11px] font-bold text-white shadow backdrop-blur">
                    {art.craft_type}
                  </span>
                </div>
              </div>

              <div className="flex flex-1 flex-col p-5 space-y-3">
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span className="inline-flex items-center gap-1 font-medium text-foreground">
                    <MapPin className="h-3.5 w-3.5 text-accent" /> {art.district} District
                  </span>
                  {art.location && <span className="text-xs">{art.location}</span>}
                </div>

                <h3 className="font-heading text-xl font-bold text-foreground">
                  {art.name}
                </h3>

                <p className="text-xs text-muted-foreground leading-relaxed line-clamp-3">
                  {art.description}
                </p>

                {art.cultural_significance && (
                  <div className="mt-auto border-t border-border pt-3">
                    <span className="text-[10px] uppercase font-bold text-accent tracking-wider block mb-1">
                      Craft Background
                    </span>
                    <p className="text-xs text-slate-700 line-clamp-2">
                      {art.cultural_significance}
                    </p>
                  </div>
                )}
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
};
