import React from 'react';
import { Compass, Trees, Shield, Sparkles } from 'lucide-react';

export const AboutPage: React.FC = () => {
  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8 space-y-10">
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-accent/15 px-3 py-1 text-xs font-bold text-accent">
          <Compass className="h-3.5 w-3.5" /> Project Initiative
        </span>
        <h1 className="font-heading text-3xl font-extrabold sm:text-4xl text-foreground">
          About VisitJhar
        </h1>
        <p className="text-sm text-muted-foreground leading-relaxed">
          An independent, open, and community-centered rebuild designed to unlock responsible tourism across Jharkhand.
        </p>
      </div>

      <div className="rounded-3xl border border-border bg-card p-6 sm:p-8 shadow-sm space-y-6 text-sm text-muted-foreground leading-relaxed">
        <h2 className="font-heading text-xl font-bold text-foreground">Our Vision</h2>
        <p>
          Jharkhand, the land of forests and ancient tribal heritage, possesses unparalleled natural beauty — from the thundering Subarnarekha waterfalls to the deep Sal canopies of the Chotanagpur plateau.
        </p>
        <p>
          VisitJhar was created to bridge travelers with genuine destinations, transparent recommendations, and sustainable tourism practices without relying on closed proprietary platforms.
        </p>

        <h2 className="font-heading text-xl font-bold text-foreground pt-4 border-t border-border">
          Core Pillars
        </h2>
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-border bg-secondary/30 p-4 space-y-2">
            <Trees className="h-5 w-5 text-emerald-700" />
            <h3 className="font-bold text-foreground text-xs">Authentic Data</h3>
            <p className="text-xs">
              Every coordinate, description, and safety tip is sourced from official records and field documentation.
            </p>
          </div>
          <div className="rounded-2xl border border-border bg-secondary/30 p-4 space-y-2">
            <Sparkles className="h-5 w-5 text-accent" />
            <h3 className="font-bold text-foreground text-xs">Transparent Scoring</h3>
            <p className="text-xs">
              No sponsored rankings. Recommendations clearly explain why a place matches your travel style.
            </p>
          </div>
          <div className="rounded-2xl border border-border bg-secondary/30 p-4 space-y-2">
            <Shield className="h-5 w-5 text-primary" />
            <h3 className="font-bold text-foreground text-xs">Responsible Travel</h3>
            <p className="text-xs">
              Promoting tribal homestays, local craftspeople, and ecological conservation first.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
