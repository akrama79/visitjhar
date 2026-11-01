import React, { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Search, 
  MapPin, 
  ArrowRight, 
  Waves, 
  Mountain, 
  Trees, 
  Landmark, 
  Sparkles, 
  Compass, 
  Route, 
  Calendar,
  Layers,
  ChevronRight
} from 'lucide-react';
import { 
  INITIAL_DESTINATIONS, 
  INITIAL_CIRCUITS,
  INITIAL_CULTURE
} from '../data/mockData';
import { DestinationCard } from '../components/DestinationCard';
import { DestinationImage } from '../components/DestinationImage';

export const HomePage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/explore?search=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      navigate('/explore');
    }
  };

  // Curated 6 flagship destinations representing distinct districts and pillars
  const featuredDestinations = useMemo(() => {
    const flagshipSlugs = [
      'baidyanath-dham-deoghar',
      'hundru-falls',
      'betla-national-park',
      'netarhat-hill-station',
      'patratu-valley',
      'maluti-temples'
    ];

    const selected = flagshipSlugs
      .map(slug => INITIAL_DESTINATIONS.find(d => d.slug === slug))
      .filter((d): d is typeof INITIAL_DESTINATIONS[0] => Boolean(d));

    // Fallback if any slug isn't found
    if (selected.length < 6) {
      const rest = INITIAL_DESTINATIONS.filter(d => !selected.includes(d) && d.featured).slice(0, 6 - selected.length);
      return [...selected, ...rest];
    }
    return selected;
  }, []);

  // 6 Primary Tourism Categories matching official pillars
  const categoryTiles = [
    {
      title: 'Waterfalls & Nature',
      pillar: 'Nature and Waterfalls',
      count: '23 sites',
      icon: Waves,
      desc: 'Thunderous cascades like Hundru, Dassam, and 143m Lodh Falls.'
    },
    {
      title: 'Hills & Scenic Landscapes',
      pillar: 'Hill Stations and Plateaus',
      count: '9 sites',
      icon: Mountain,
      desc: 'Misty plateau ridges at Netarhat, Patratu ghats, and Parasnath peaks.'
    },
    {
      title: 'Wildlife & Forests',
      pillar: 'Wildlife, Forests and Protected Areas',
      count: '11 sites',
      icon: Trees,
      desc: 'Betla National Park, Dalma elephant corridor, and ancient Sal forests.'
    },
    {
      title: 'Spiritual & Heritage',
      pillar: 'Spiritual and Religious Destinations',
      count: '25 sites',
      icon: Landmark,
      desc: 'Sacred Baidyanath Jyotirlinga Dham, Rajrappa, and historic Maluti temples.'
    },
    {
      title: 'Tribal Culture & Traditions',
      pillar: 'Tribal Culture and Living Traditions',
      count: 'Heritage Arts',
      icon: Sparkles,
      desc: 'Sohrai-Khovar murals, UNESCO-recognized Chhau dances, and Dokra crafts.'
    },
    {
      title: 'Lakes & Outdoor Landscapes',
      pillar: 'Lakes, Dams and Scenic Landscapes',
      count: '19 sites',
      icon: Compass,
      desc: 'Tranquil reservoirs at Maithon, Tilaiya, Dimna Lake, and Massanjore.'
    }
  ];

  // 3 Curated Circuits from dataset
  const circuits = useMemo(() => INITIAL_CIRCUITS.slice(0, 3), []);

  // 3 Key Living Cultural Traditions from dataset
  const culturalHighlights = useMemo(() => INITIAL_CULTURE.slice(0, 3), []);

  const quickSearchTags = ['Waterfalls', 'Netarhat', 'Betla', 'Baidyanath Dham', 'Patratu', 'Parasnath'];

  return (
    <div className="space-y-16 sm:space-y-24 pb-16">
      {/* ========================================================= */}
      {/* SECTION 2: HERO & DESTINATION SEARCH                      */}
      {/* ========================================================= */}
      <section className="relative overflow-hidden bg-slate-900 text-white">
        {/* Background Image: Authentic Netarhat sunset landscape */}
        <div className="absolute inset-0">
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/4/41/Sunset_in_netarhatt%2C_jharkhand.jpg"
            alt="Scenic view over Netarhat plateau at dusk, Jharkhand"
            className="h-full w-full object-cover object-center brightness-75 scale-100"
            loading="eager"
          />
          {/* Subtle dual gradient ensuring text readability without obscuring scenery */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/60 to-slate-900/40" />
        </div>

        <div className="relative mx-auto max-w-5xl px-4 py-16 sm:py-24 sm:px-6 lg:px-8 text-center">
          {/* Eyebrow Label */}
          <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-amber-200 backdrop-blur-md">
            <Trees className="h-3.5 w-3.5 text-accent" />
            <span>Discover Jharkhand's Natural & Sacred Heritage</span>
          </div>

          {/* Main Headline */}
          <h1 className="mt-5 font-heading text-3xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl text-white">
            Explore the Untamed Soul of <span className="text-accent underline decoration-accent/40 decoration-4">Jharkhand</span>
          </h1>

          {/* Supporting Description */}
          <p className="mx-auto mt-4 max-w-2xl text-sm sm:text-base text-slate-200 leading-relaxed">
            From majestic waterfalls and virgin Sal forest canopies to sacred Jyotirlinga shrines and living tribal traditions—discover authentic travel across all 24 districts.
          </p>

          {/* Search Form */}
          <form onSubmit={handleSearch} className="mx-auto mt-8 max-w-2xl">
            <div className="relative flex items-center rounded-2xl bg-white p-2 shadow-2xl ring-1 ring-black/10">
              <Search className="ml-3 h-5 w-5 text-slate-400 shrink-0" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by destination name, district, or attraction (e.g., Hundru, Deoghar, Betla)..."
                className="w-full border-0 bg-transparent px-3 py-2.5 text-sm text-slate-900 placeholder-slate-500 focus:outline-none focus:ring-0"
              />
              <button
                type="submit"
                className="rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-primary-dark shadow-sm shrink-0"
              >
                Search
              </button>
            </div>
          </form>

          {/* Quick Search Suggestions */}
          <div className="mt-4 flex flex-wrap items-center justify-center gap-2 text-xs">
            <span className="text-slate-300 font-medium">Popular:</span>
            {quickSearchTags.map(tag => (
              <button
                key={tag}
                type="button"
                onClick={() => navigate(`/explore?search=${encodeURIComponent(tag)}`)}
                className="rounded-full bg-white/15 px-3 py-1 font-medium text-slate-100 hover:bg-white/25 transition backdrop-blur-sm"
              >
                {tag}
              </button>
            ))}
          </div>

          {/* Hero Action CTAs */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Link
              to="/explore"
              className="rounded-full bg-accent px-6 py-3 text-sm font-bold text-white shadow-lg hover:bg-accent-hover transition flex items-center gap-2"
            >
              <span>Explore Destinations</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              to="/plan-trip"
              className="rounded-full bg-white/20 border border-white/30 px-6 py-3 text-sm font-semibold text-white hover:bg-white/30 transition backdrop-blur-md"
            >
              Plan Your Trip
            </Link>
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* SECTION 3: FEATURED DESTINATIONS ("Discover Jharkhand")    */}
      {/* ========================================================= */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-primary mb-1">
              <Sparkles className="h-3.5 w-3.5 text-accent" />
              <span>Flagship Landmarks</span>
            </div>
            <h2 className="font-heading text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
              Discover Jharkhand
            </h2>
            <p className="mt-1 text-sm text-muted-foreground max-w-xl">
              Hand-picked destinations with verified locations, authentic photography, and comprehensive travel details.
            </p>
          </div>

          <Link
            to="/explore"
            className="inline-flex items-center gap-1 text-sm font-bold text-primary hover:text-primary-dark transition group shrink-0"
          >
            <span>Explore All 118 Destinations</span>
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {/* 6 Destination Cards Grid: 3 columns desktop, 2 tablet, 1 mobile */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {featuredDestinations.map(destination => (
            <DestinationCard
              key={destination.id}
              destination={destination}
            />
          ))}
        </div>
      </section>

      {/* ========================================================= */}
      {/* SECTION 4: EXPLORE BY CATEGORY                            */}
      {/* ========================================================= */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-primary mb-1">
            <Compass className="h-3.5 w-3.5 text-accent" />
            <span>Curated Themes</span>
          </div>
          <h2 className="font-heading text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
            Explore by Experience
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Browse authentic places categorized according to the official Jharkhand Tourism Policy pillars.
          </p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {categoryTiles.map(item => {
            const Icon = item.icon;
            return (
              <Link
                key={item.title}
                to={`/explore?pillar=${encodeURIComponent(item.pillar)}`}
                className="group relative flex flex-col justify-between rounded-2xl border border-border/80 bg-card p-6 transition-all duration-300 hover:border-primary/40 hover:shadow-md hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-white">
                      <Icon className="h-6 w-6" />
                    </div>
                    <span className="text-xs font-semibold text-muted-foreground group-hover:text-primary transition-colors">
                      {item.count}
                    </span>
                  </div>

                  <h3 className="font-heading text-lg font-bold text-foreground transition-colors group-hover:text-primary">
                    {item.title}
                  </h3>
                  <p className="mt-1.5 text-xs text-muted-foreground leading-relaxed">
                    {item.desc}
                  </p>
                </div>

                <div className="mt-5 flex items-center gap-1 text-xs font-semibold text-primary group-hover:text-accent transition-colors pt-3 border-t border-border/50">
                  <span>Explore category</span>
                  <ChevronRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* ========================================================= */}
      {/* SECTION 5: TOURISM CIRCUITS & CULTURAL EXPERIENCES        */}
      {/* ========================================================= */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-12 items-start">
          {/* Left Column: Curated Circuits (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-primary mb-1">
                <Route className="h-3.5 w-3.5 text-accent" />
                <span>Curated Journeys</span>
              </div>
              <h2 className="font-heading text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
                Featured Tourism Circuits
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                VisitJhar-curated multi-day itineraries connecting proximate natural and heritage attractions.
              </p>
            </div>

            <div className="space-y-4">
              {circuits.map(circuit => (
                <div
                  key={circuit.id}
                  className="rounded-2xl border border-border/80 bg-card p-5 transition-all duration-300 hover:border-primary/40 hover:shadow-sm"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <span className="inline-block rounded-full bg-secondary px-2.5 py-0.5 text-[11px] font-semibold text-primary mb-2">
                        {circuit.recommended_days} Days • {circuit.districts.join(' & ')}
                      </span>
                      <h3 className="font-heading text-base font-bold text-foreground">
                        {circuit.name}
                      </h3>
                    </div>
                  </div>

                  <p className="mt-2 text-xs text-muted-foreground leading-relaxed line-clamp-2">
                    {circuit.description}
                  </p>

                  <div className="mt-4 pt-3 border-t border-border/60 flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">
                      Best season: {circuit.best_season}
                    </span>
                    <Link
                      to="/itineraries"
                      className="font-semibold text-primary hover:text-accent transition flex items-center gap-1"
                    >
                      <span>View Circuit</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-1">
              <Link
                to="/itineraries"
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline"
              >
                <span>View all community itineraries & circuits →</span>
              </Link>
            </div>
          </div>

          {/* Right Column: Living Tribal Culture Spotlight (5 cols) */}
          <div className="lg:col-span-5 rounded-3xl border border-border/80 bg-card p-6 sm:p-8 space-y-6">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-accent mb-1">
                <Sparkles className="h-3.5 w-3.5" />
                <span>Living Heritage</span>
              </div>
              <h2 className="font-heading text-xl sm:text-2xl font-bold tracking-tight text-foreground">
                Tribal Culture & Arts
              </h2>
              <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
                Experience centuries of indigenous art, folklore, and craft traditions preserved across Jharkhand's tribal heartland.
              </p>
            </div>

            <div className="space-y-4">
              {culturalHighlights.map(item => (
                <div key={item.id} className="flex gap-4 items-start pb-4 border-b border-border/50 last:border-b-0 last:pb-0">
                  <div className="h-10 w-10 shrink-0 rounded-xl bg-amber-500/10 text-amber-700 flex items-center justify-center font-bold text-sm">
                    <Sparkles className="h-5 w-5 text-accent" />
                  </div>
                  <div>
                    <h4 className="font-heading text-sm font-bold text-foreground">
                      {item.title}
                    </h4>
                    <span className="text-[11px] font-medium text-primary block mt-0.5">
                      {item.category} • {item.district || 'Regional'}
                    </span>
                    <p className="mt-1 text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                      {item.cultural_significance || item.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-2 flex flex-col sm:flex-row gap-3">
              <Link
                to="/culture"
                className="flex-1 rounded-xl bg-secondary text-primary px-4 py-2.5 text-xs font-semibold text-center hover:bg-secondary/80 transition"
              >
                Explore Living Culture
              </Link>
              <Link
                to="/experiences"
                className="flex-1 rounded-xl border border-border px-4 py-2.5 text-xs font-semibold text-foreground text-center hover:bg-muted transition"
              >
                Meet Master Artisans
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* SECTION 6: TRIP-PLANNING CALL TO ACTION                   */}
      {/* ========================================================= */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl bg-slate-900 px-6 py-12 sm:px-12 sm:py-16 text-center text-white shadow-xl">
          {/* Subtle nature accent background */}
          <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#2d6a4f_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />

          <div className="relative mx-auto max-w-2xl space-y-4">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3.5 py-1 text-xs font-semibold text-amber-200">
              <Route className="h-3.5 w-3.5 text-accent" />
              <span>Smart Travel Planner</span>
            </div>

            <h2 className="font-heading text-2xl sm:text-4xl font-extrabold tracking-tight">
              Your Jharkhand Journey Starts Here
            </h2>

            <p className="text-sm text-slate-300 leading-relaxed">
              Discover remarkable places, explore local culture, and generate a day-wise itinerary that suits your schedule, budget, and travel preferences.
            </p>

            <div className="pt-4 flex flex-wrap items-center justify-center gap-3">
              <Link
                to="/plan-trip"
                className="rounded-full bg-accent px-6 py-3 text-sm font-bold text-white shadow-md hover:bg-accent-hover transition flex items-center gap-2"
              >
                <span>Plan Your Trip</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                to="/explore"
                className="rounded-full bg-white/10 border border-white/20 px-6 py-3 text-sm font-semibold text-white hover:bg-white/20 transition"
              >
                Explore Destinations
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
