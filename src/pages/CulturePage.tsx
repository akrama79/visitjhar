import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, MapPin, Search } from 'lucide-react';
import { INITIAL_CULTURE } from '../data/mockData';

export const CulturePage: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = [
    'All',
    'Tribal Culture',
    'Traditional Arts',
    'Dance & Music',
    'Handicrafts',
    'Local Cuisine',
    'History & Heritage'
  ];

  const filteredItems = INITIAL_CULTURE.filter(item => {
    if (selectedCategory !== 'All' && item.category.toLowerCase() !== selectedCategory.toLowerCase()) {
      return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        item.title.toLowerCase().includes(q) ||
        (item.description && item.description.toLowerCase().includes(q)) ||
        (item.cultural_significance && item.cultural_significance.toLowerCase().includes(q))
      );
    }
    return true;
  });

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
      {/* Hero Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-accent/15 px-3 py-1 text-xs font-bold text-accent">
          <Sparkles className="h-3.5 w-3.5" /> Living Heritage
        </span>
        <h1 className="font-heading text-3xl font-extrabold sm:text-4xl text-foreground">
          Culture & Tribal Traditions of Jharkhand
        </h1>
        <p className="text-sm text-muted-foreground leading-relaxed">
          Explore the vibrant indigenous heritage of over 30 tribal communities — from sacred Sohrai wall art and Dokra brass crafts to ancient Chhau martial dance.
        </p>
      </div>

      {/* Filter Tabs & Search */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-border pb-4">
        {/* Category Pills */}
        <div className="flex flex-wrap gap-1.5">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`rounded-full px-3.5 py-1 text-xs font-semibold transition ${
                selectedCategory === cat
                  ? 'bg-primary text-white shadow-sm'
                  : 'bg-secondary text-foreground hover:bg-secondary/70'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-64">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search arts, dances, crafts..."
            className="w-full rounded-xl border border-border bg-card py-1.5 pl-9 pr-3 text-xs text-foreground outline-none focus:border-primary"
          />
        </div>
      </div>

      {/* Cultural Content Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filteredItems.map(item => (
          <article
            key={item.id}
            className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-card card-lift shadow-sm"
          >
            <div className="relative aspect-[16/10] w-full overflow-hidden bg-muted">
              <img
                src={item.image || 'https://images.unsplash.com/photo-1544816155-12df9643f363?w=500'}
                alt={item.title}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute top-3 left-3">
                <span className="rounded-full bg-white/90 px-2.5 py-1 text-[11px] font-bold text-primary shadow backdrop-blur">
                  {item.category}
                </span>
              </div>
            </div>

            <div className="flex flex-1 flex-col p-5 space-y-3">
              <h3 className="font-heading text-xl font-bold text-foreground">
                {item.title}
              </h3>

              {item.region && (
                <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                  <MapPin className="h-3.5 w-3.5 text-accent" /> {item.region}
                </span>
              )}

              <p className="text-xs text-muted-foreground leading-relaxed line-clamp-3">
                {item.description}
              </p>

              {item.cultural_significance && (
                <div className="mt-auto border-t border-border pt-3">
                  <span className="text-[10px] uppercase font-bold text-accent tracking-wider block mb-1">
                    Significance
                  </span>
                  <p className="text-xs text-slate-700 line-clamp-2">
                    {item.cultural_significance}
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
