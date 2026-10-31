import React from 'react';
import { Trees, Heart, Users, Shield, Sparkles, Check, AlertCircle } from 'lucide-react';

export const ResponsibleTourismPage: React.FC = () => {
  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8 space-y-10">
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 px-3 py-1 text-xs font-bold">
          <Trees className="h-3.5 w-3.5" /> Ethical & Sustainable Travel
        </span>
        <h1 className="font-heading text-3xl font-extrabold sm:text-4xl text-foreground">
          Responsible Tourism Guidelines for Jharkhand
        </h1>
        <p className="text-sm text-muted-foreground leading-relaxed">
          Jharkhand's forests, waterfalls, sacred groves, and indigenous hamlets require sensitive, considerate, and sustainable exploration.
        </p>
      </div>

      {/* 4 Pillars */}
      <div className="grid gap-6 sm:grid-cols-2">
        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm space-y-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
            <Trees className="h-5 w-5" />
          </div>
          <h2 className="font-heading text-lg font-bold">1. Environmental Stewardship</h2>
          <ul className="text-xs text-muted-foreground space-y-2">
            <li className="flex items-start gap-2">
              <Check className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>Strict Leave No Trace policy — take all plastic and trash back to urban centers.</span>
            </li>
            <li className="flex items-start gap-2">
              <Check className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>Do not bathe with soap or chemicals in natural pools, streams, or waterfalls.</span>
            </li>
            <li className="flex items-start gap-2">
              <Check className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>Stick to designated trails in Betla National Park and Dalma Wildlife Sanctuary.</span>
            </li>
          </ul>
        </div>

        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm space-y-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-100 text-amber-700">
            <Heart className="h-5 w-5" />
          </div>
          <h2 className="font-heading text-lg font-bold">2. Cultural Sensitivity</h2>
          <ul className="text-xs text-muted-foreground space-y-2">
            <li className="flex items-start gap-2">
              <Check className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
              <span>Respect Sarna sthals (sacred groves) — remove footwear when indicated.</span>
            </li>
            <li className="flex items-start gap-2">
              <Check className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
              <span>Always ask permission before photographing indigenous villagers or artists.</span>
            </li>
            <li className="flex items-start gap-2">
              <Check className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
              <span>Dress modestly when attending Sarhul, Karma, or visiting sacred hill shrines.</span>
            </li>
          </ul>
        </div>

        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm space-y-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100 text-blue-700">
            <Users className="h-5 w-5" />
          </div>
          <h2 className="font-heading text-lg font-bold">3. Community Economic Support</h2>
          <ul className="text-xs text-muted-foreground space-y-2">
            <li className="flex items-start gap-2">
              <Check className="h-4 w-4 text-blue-600 shrink-0 mt-0.5" />
              <span>Buy authentic handicrafts directly from rural Dokra, Sohrai, and terracotta artisans.</span>
            </li>
            <li className="flex items-start gap-2">
              <Check className="h-4 w-4 text-blue-600 shrink-0 mt-0.5" />
              <span>Eat at local dhabas and community kitchens to support indigenous families.</span>
            </li>
            <li className="flex items-start gap-2">
              <Check className="h-4 w-4 text-blue-600 shrink-0 mt-0.5" />
              <span>Choose verified tribal homestays over commercial chains where available.</span>
            </li>
          </ul>
        </div>

        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm space-y-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-100 text-red-700">
            <Shield className="h-5 w-5" />
          </div>
          <h2 className="font-heading text-lg font-bold">4. Personal Safety Around Waterfalls</h2>
          <ul className="text-xs text-muted-foreground space-y-2">
            <li className="flex items-start gap-2">
              <Check className="h-4 w-4 text-red-600 shrink-0 mt-0.5" />
              <span>Never venture beyond safety railings at Dassam, Hundru, or Jonha falls.</span>
            </li>
            <li className="flex items-start gap-2">
              <Check className="h-4 w-4 text-red-600 shrink-0 mt-0.5" />
              <span>Rocks around waterfalls are dangerously slippery even in dry seasons.</span>
            </li>
            <li className="flex items-start gap-2">
              <Check className="h-4 w-4 text-red-600 shrink-0 mt-0.5" />
              <span>Avoid trekking after sunset in remote plateau forests.</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};
