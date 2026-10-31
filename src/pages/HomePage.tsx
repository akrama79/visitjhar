import React, { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Search, 
  Compass, 
  MapPin, 
  Route, 
  Sparkles, 
  ArrowRight, 
  Check, 
  Calendar, 
  Heart,
  Trees,
  Shield,
  Users,
  Clock,
  Waves,
  Mountain,
  Landmark,
  Palmtree,
  Camera,
  Layers
} from 'lucide-react';
import { 
  INITIAL_DESTINATIONS, 
  INITIAL_DISTRICTS,
  INITIAL_EVENTS, 
  INITIAL_CULTURE,
  INITIAL_CIRCUITS,
  INITIAL_EXPERIENCES,
  INITIAL_ARTISANS
} from '../data/mockData';
import { DestinationCard } from '../components/DestinationCard';
import { useAuth } from '../context/AuthContext';
import { getRecommendedDestinations } from '../lib/recommendations';

export const HomePage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/explore?search=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      navigate('/explore');
    }
  };

  const quickTags = ['Waterfalls', 'Netarhat', 'Betla', 'Parasnath', 'Baidyanath Dham', 'Patratu', 'Tribal Crafts'];

  // Data slices
  const featuredDestinations = useMemo(() => INITIAL_DESTINATIONS.filter(d => d.featured).slice(0, 6), []);
  const hiddenGems = useMemo(() => INITIAL_DESTINATIONS.filter(d => d.hidden_gem).slice(0, 3), []);
  const recommendations = useMemo(() => getRecommendedDestinations(INITIAL_DESTINATIONS, user, 3), [user]);
  const waterfallsAndHills = useMemo(() => 
    INITIAL_DESTINATIONS.filter(d => d.pillar === 'Nature and Waterfalls' || d.pillar === 'Hill Stations and Plateaus').slice(0, 4),
    []
  );
  const wildlifeSanctuaries = useMemo(() => 
    INITIAL_DESTINATIONS.filter(d => d.pillar === 'Wildlife, Forests and Protected Areas').slice(0, 3),
    []
  );

  const upcomingEvents = useMemo(() => INITIAL_EVENTS.slice(0, 3), []);
  const culturalHighlights = useMemo(() => INITIAL_CULTURE.slice(0, 3), []);
  const featuredArtisans = useMemo(() => INITIAL_ARTISANS.slice(0, 4), []);

  // Compute destination counts per district
  const districtCounts = useMemo(() => {
    const map: Record<string, number> = {};
    INITIAL_DESTINATIONS.forEach(d => {
      map[d.district] = (map[d.district] || 0) + 1;
    });
    return map;
  }, []);

  const TOURISM_PILLARS_DATA = [
    { title: 'Nature & Waterfalls', pillar: 'Nature and Waterfalls', icon: Waves, desc: '98m Hundru, 143m Lodh, Dassam & Jonha cascades.' },
    { title: 'Hill Stations & Plateaus', pillar: 'Hill Stations and Plateaus', icon: Mountain, desc: 'Netarhat, Patratu Valley, Parasnath & Bagru heights.' },
    { title: 'Wildlife & Sanctuaries', pillar: 'Wildlife, Forests and Protected Areas', icon: Trees, desc: 'Palamau Tiger Reserve, Betla & Dalma elephant corridors.' },
    { title: 'Spiritual & Pilgrimage', pillar: 'Spiritual and Religious Destinations', icon: Landmark, desc: 'Baba Baidyanath Jyotirlinga, Parasnath & Rajrappa.' },
    { title: 'Heritage & Forts', pillar: 'Heritage, Architecture and Archaeology', icon: Layers, desc: 'Navratangarh, Maluti terracotta & 17th-century Palamu Forts.' },
    { title: 'Tribal Traditions', pillar: 'Tribal Culture and Living Traditions', icon: Users, desc: 'Authentic Sohrai, Khovar murals, Paitkar & Chhau masks.' }
  ];

  return (
    <div className="space-y-16 sm:space-y-24 pb-20">
      {/* 1. HERO SECTION */}
      <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden bg-slate-900 text-white">
        {/* Background Image with Fallback */}
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=1600&auto=format&fit=crop&q=80"
            alt="Jharkhand Landscape"
            className="h-full w-full object-cover object-center brightness-75 scale-105"
            loading="eager"
            onError={(e) => {
              (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1511497584788-87676104235f?w=1600&auto=format&fit=crop&q=80';
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-black/40 to-black/60"></div>
        </div>

        <div className="relative mx-auto max-w-5xl px-4 py-24 sm:px-6 lg:px-8 text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-accent-light backdrop-blur-md">
            <Trees className="h-3.5 w-3.5 text-accent" /> Discover the Hidden Beauty of Jharkhand
          </span>

          <h1 className="mt-6 font-heading text-4xl font-extrabold tracking-tight sm:text-6xl lg:text-7xl">
            Explore the Untamed Soul of <span className="text-accent underline decoration-accent/40 decoration-4">Jharkhand</span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-base sm:text-lg text-slate-200 leading-relaxed">
            Discover {INITIAL_DESTINATIONS.length} research-backed tourist destinations across all 24 districts—from thunderous waterfalls and virgin sal forests to ancient sacred temples and living tribal art traditions.
          </p>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="mx-auto mt-8 max-w-2xl">
            <div className="flex items-center rounded-full bg-white p-2 shadow-2xl ring-1 ring-black/10">
              <Search className="ml-4 h-5 w-5 text-muted-foreground" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by name, district, alias (e.g. Parasnath, Lodh, Betla, Patratu)..."
                className="w-full bg-transparent px-3 py-2 text-sm text-foreground outline-none placeholder:text-muted-foreground"
              />
              <button
                type="submit"
                className="rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-white shadow-md hover:bg-primary-light transition"
              >
                Search
              </button>
            </div>
          </form>

          {/* Quick Tags */}
          <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
            <span className="text-xs text-slate-300">Popular searches:</span>
            {quickTags.map((tag) => (
              <Link
                key={tag}
                to={`/explore?search=${encodeURIComponent(tag)}`}
                className="rounded-full border border-white/20 bg-white/10 px-3 py-0.5 text-xs font-medium text-white hover:bg-white/25 transition backdrop-blur-sm"
              >
                {tag}
              </Link>
            ))}
          </div>

          {/* Primary Action Buttons */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Link
              to="/explore"
              className="inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3 text-sm font-semibold text-white shadow-lg hover:bg-accent-light transition"
            >
              <Compass className="h-4 w-4" /> Explore All {INITIAL_DESTINATIONS.length} Destinations
            </Link>
            <Link
              to="/plan-trip"
              className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-primary shadow-lg hover:bg-slate-100 transition"
            >
              <Route className="h-4 w-4 text-primary" /> Plan My Trip
            </Link>
            <Link
              to="/map"
              className="inline-flex items-center gap-2 rounded-full border border-white/40 bg-black/30 px-6 py-3 text-sm font-semibold text-white backdrop-blur hover:bg-white/10 transition"
            >
              <MapPin className="h-4 w-4 text-accent" /> Interactive Map
            </Link>
          </div>
        </div>
      </section>

      {/* 2. PERSONALIZED RECOMMENDATIONS (WEIGHTED ENGINE) */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-border pb-4">
          <div>
            <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-accent">
              <Sparkles className="h-3.5 w-3.5" /> Intelligent Recommendations
            </span>
            <h2 className="mt-1 font-heading text-3xl font-bold tracking-tight text-foreground">
              {isAuthenticated ? `Recommended for ${user?.full_name}` : 'Recommended Destinations'}
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Ranked transparently by your travel style, preferred categories, duration, and budget tier.
            </p>
          </div>
          <Link
            to="/profile"
            className="inline-flex items-center gap-1 text-sm font-semibold text-primary hover:text-accent transition"
          >
            Adjust preferences →
          </Link>
        </div>

        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {recommendations.map(({ destination, score, reasons }) => (
            <div key={destination.id} className="flex flex-col">
              <DestinationCard
                destination={destination}
                matchScore={score}
                matchReason={reasons[0]}
              />
              {reasons.length > 0 && (
                <div className="mt-2 rounded-xl border border-border bg-secondary/50 p-3.5 text-xs">
                  <p className="font-semibold text-foreground flex items-center gap-1">
                    <Check className="h-3.5 w-3.5 text-accent" /> Why this place matches you:
                  </p>
                  <ul className="mt-1.5 space-y-1 text-muted-foreground pl-4 list-disc">
                    {reasons.map((r, i) => (
                      <li key={i}>{r}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* 3. POPULAR OR FEATURED DESTINATIONS */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between border-b border-border pb-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-primary">Curated Highlights</span>
            <h2 className="mt-1 font-heading text-3xl font-bold tracking-tight text-foreground">
              Featured Iconic Landmarks
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Handpicked must-visit natural wonders, spiritual sanctuaries, and historical monuments.
            </p>
          </div>
          <Link to="/explore" className="text-sm font-semibold text-primary hover:text-accent transition">
            View all {INITIAL_DESTINATIONS.length} →
          </Link>
        </div>

        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {featuredDestinations.map(dest => (
            <DestinationCard key={dest.id} destination={dest} />
          ))}
        </div>
      </section>

      {/* 4. DISCOVER DESTINATIONS BY DISTRICT (ALL 24 DISTRICTS) */}
      <section className="bg-secondary/40 py-16 border-y border-border">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="text-center max-w-2xl mx-auto">
            <span className="text-xs font-bold uppercase tracking-wider text-accent">Comprehensive Coverage</span>
            <h2 className="mt-1 font-heading text-3xl font-bold tracking-tight text-foreground">
              Discover Across All 24 Districts
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Every single district of Jharkhand has unique documented tourism landmarks. Click any district to explore its attractions.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 pt-2">
            {INITIAL_DISTRICTS.map(dist => {
              const count = districtCounts[dist.name] || 0;
              return (
                <Link
                  key={dist.id}
                  to={`/explore?district=${encodeURIComponent(dist.name)}`}
                  className="group flex flex-col justify-between rounded-xl border border-border bg-card p-3.5 transition-all hover:border-primary hover:shadow-sm"
                >
                  <div className="flex items-start justify-between">
                    <span className="font-heading text-sm font-bold text-foreground group-hover:text-primary transition-colors">
                      {dist.name}
                    </span>
                    <span className="rounded-full bg-secondary px-2 py-0.5 text-[10px] font-bold text-primary">
                      {count}
                    </span>
                  </div>
                  <span className="mt-2 text-[11px] text-muted-foreground">
                    {count === 1 ? '1 destination' : `${count} destinations`} →
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* 5. EXPLORE BY TOURISM THEME / PILLARS */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto">
          <span className="text-xs font-bold uppercase tracking-wider text-primary">State Tourism Policy 2021</span>
          <h2 className="mt-1 font-heading text-3xl font-bold tracking-tight text-foreground">
            Explore by Tourism Pillars
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Structured along the official strategic pillars established by the Department of Tourism.
          </p>
        </div>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {TOURISM_PILLARS_DATA.map(item => {
            const Icon = item.icon;
            return (
              <Link
                key={item.title}
                to={`/explore?pillar=${encodeURIComponent(item.pillar)}`}
                className="group flex flex-col justify-between rounded-2xl border border-border bg-card p-6 card-lift shadow-sm"
              >
                <div>
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="mt-4 font-heading text-lg font-bold text-foreground group-hover:text-primary transition-colors">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
                    {item.desc}
                  </p>
                </div>
                <div className="mt-4 flex items-center gap-1 text-xs font-semibold text-primary group-hover:text-accent transition">
                  <span>Explore theme</span>
                  <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* 6. CURATED TOURISM CIRCUITS */}
      <section className="bg-secondary/30 py-16 border-y border-border">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-border pb-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-accent">
                State Policy Priority Circuits
              </span>
              <h2 className="mt-1 font-heading text-3xl font-bold tracking-tight text-foreground">
                5 Official Tourism Circuits
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Thematic multi-district journeys formulated under the Jharkhand Tourism Policy 2021.
              </p>
            </div>
            <Link to="/itineraries" className="text-sm font-semibold text-primary hover:text-accent transition">
              Explore all circuits & itineraries →
            </Link>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {INITIAL_CIRCUITS.map(circ => (
              <div
                key={circ.id}
                className="flex flex-col justify-between rounded-2xl border border-border bg-card p-6 card-lift shadow-sm space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-[10px] font-bold text-primary">
                      {circ.pillar}
                    </span>
                    <span className="inline-flex items-center gap-1 text-muted-foreground font-medium">
                      <Clock className="h-3 w-3 text-accent" /> {circ.recommended_days} Days
                    </span>
                  </div>

                  <h3 className="font-heading text-xl font-bold text-foreground">
                    {circ.name}
                  </h3>

                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {circ.description}
                  </p>

                  <div className="space-y-1.5 text-xs text-slate-700">
                    <span className="font-bold text-[11px] text-foreground block">Key Highlights:</span>
                    <ul className="space-y-1 pl-4 list-disc text-muted-foreground text-[11px]">
                      {circ.highlights.slice(0, 3).map((hl, i) => (
                        <li key={i}>{hl}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="border-t border-border pt-4 flex items-center justify-between text-xs">
                  <span className="text-[10px] text-muted-foreground">
                    Districts: <strong>{circ.districts.join(', ')}</strong>
                  </span>
                  <Link
                    to={`/plan-trip?startingLocation=${encodeURIComponent(circ.districts[0])}`}
                    className="font-bold text-primary hover:text-accent transition inline-flex items-center gap-1"
                  >
                    Open in Planner →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. WATERFALLS & NATURAL ATTRACTIONS */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between border-b border-border pb-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-accent">Spectacular Cascades & Hills</span>
            <h2 className="mt-1 font-heading text-3xl font-bold tracking-tight text-foreground">
              Waterfalls & Plateau Heights
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Witness the thunder of Lodh, Hundru, Dassam, and the serene sunset vistas of Netarhat and Patratu.
            </p>
          </div>
          <Link to="/explore?pillar=Nature%20and%20Waterfalls" className="text-sm font-semibold text-primary hover:text-accent transition">
            View all waterfalls →
          </Link>
        </div>

        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {waterfallsAndHills.map(dest => (
            <DestinationCard key={dest.id} destination={dest} />
          ))}
        </div>
      </section>

      {/* 8. WILDLIFE & PROTECTED AREAS */}
      <section className="bg-secondary/20 py-16 border-y border-border">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-border pb-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-primary">Ecosystem Sanctuaries</span>
              <h2 className="mt-1 font-heading text-3xl font-bold tracking-tight text-foreground">
                Wildlife & Protected Reserves
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Home to Asian elephant corridors, Project Tiger reserves, and pristine sal canopies.
              </p>
            </div>
            <Link to="/explore?pillar=Wildlife%2C%20Forests%20and%20Protected%20Areas" className="text-sm font-semibold text-primary hover:text-accent transition">
              View wildlife reserves →
            </Link>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {wildlifeSanctuaries.map(dest => (
              <DestinationCard key={dest.id} destination={dest} />
            ))}
          </div>
        </div>
      </section>

      {/* 9. TRIBAL CULTURE & UPCOMING EVENTS */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-2">
          {/* Cultural Heritage */}
          <div>
            <div className="flex items-center justify-between border-b border-border pb-3">
              <h3 className="font-heading text-2xl font-bold text-foreground">
                Living Tribal Traditions
              </h3>
              <Link to="/culture" className="text-xs font-semibold text-primary hover:text-accent">
                View all culture →
              </Link>
            </div>
            <div className="mt-6 space-y-4">
              {culturalHighlights.map(item => (
                <div key={item.id} className="flex gap-4 rounded-xl border border-border bg-card p-4 card-lift">
                  <img
                    src={item.image || 'https://images.unsplash.com/photo-1544816155-12df9643f363?w=200'}
                    alt={item.title}
                    className="h-20 w-20 rounded-lg object-cover"
                  />
                  <div>
                    <span className="rounded bg-secondary px-2 py-0.5 text-[10px] font-semibold text-primary">
                      {item.category}
                    </span>
                    <h4 className="mt-1 font-heading text-base font-bold text-foreground">
                      {item.title}
                    </h4>
                    <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">
                      {item.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Upcoming Events */}
          <div>
            <div className="flex items-center justify-between border-b border-border pb-3">
              <h3 className="font-heading text-2xl font-bold text-foreground">
                Festivals & Cultural Calendar
              </h3>
              <Link to="/events" className="text-xs font-semibold text-primary hover:text-accent">
                Full Calendar →
              </Link>
            </div>
            <div className="mt-6 space-y-4">
              {upcomingEvents.map(evt => (
                <div key={evt.id} className="flex items-center justify-between rounded-xl border border-border bg-card p-4 card-lift">
                  <div>
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-accent">
                      <Calendar className="h-3 w-3" /> {new Date(evt.date).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                    <h4 className="font-heading text-base font-bold text-foreground mt-0.5">
                      {evt.name}
                    </h4>
                    <span className="text-xs text-muted-foreground">
                      {evt.location || evt.district}
                    </span>
                  </div>
                  <Link
                    to="/events"
                    className="rounded-full bg-secondary px-3 py-1 text-xs font-semibold text-primary hover:bg-primary hover:text-white transition"
                  >
                    Details
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 10. LOCAL EXPERIENCES & MASTER ARTISANS */}
      <section className="bg-secondary/40 py-16 border-y border-border">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-border pb-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-accent">Authentic Community Encounters</span>
              <h2 className="mt-1 font-heading text-3xl font-bold tracking-tight text-foreground">
                Master Artisans & Local Crafts
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Connect directly with traditional Paitkar scroll painters, Dokra metalcasters, and Sohrai mural masters.
              </p>
            </div>
            <Link to="/experiences" className="text-sm font-semibold text-primary hover:text-accent transition">
              View all 20 experiences →
            </Link>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {featuredArtisans.map(artisan => (
              <div key={artisan.id} className="rounded-2xl border border-border bg-card p-5 card-lift shadow-sm space-y-3">
                <div className="flex items-center gap-3">
                  <img
                    src={artisan.image || 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=200'}
                    alt={artisan.name}
                    className="h-12 w-12 rounded-full object-cover border border-border"
                  />
                  <div>
                    <h4 className="font-heading text-sm font-bold text-foreground">{artisan.name}</h4>
                    <span className="text-[11px] text-muted-foreground block">{artisan.craft_type}</span>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground line-clamp-2">
                  {artisan.description || artisan.bio}
                </p>
                <div className="pt-2 border-t border-border flex items-center justify-between text-[11px]">
                  <span className="text-primary font-semibold">{artisan.district}</span>
                  <Link to="/experiences" className="font-medium text-accent hover:underline">
                    View profile →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 11. SMART ITINERARY PLANNER CALL TO ACTION */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl bg-primary text-white p-8 sm:p-12 shadow-xl">
          <div className="relative z-10 max-w-2xl space-y-4">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-accent-light backdrop-blur-sm">
              <Route className="h-3.5 w-3.5" /> Geographic Proximity Routing
            </span>
            <h2 className="font-heading text-3xl font-extrabold tracking-tight sm:text-4xl">
              Ready to Design Your Custom Jharkhand Journey?
            </h2>
            <p className="text-sm text-slate-200 leading-relaxed">
              Use our intelligent trip planner to calculate day-wise morning, afternoon, and evening stops based on geographic proximity, travel style, and budget tiers.
            </p>
            <div className="pt-2 flex flex-wrap items-center gap-3">
              <Link
                to="/plan-trip"
                className="inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3 text-sm font-bold text-white shadow hover:bg-accent-light transition"
              >
                <Route className="h-4 w-4" /> Start Planning Now
              </Link>
              <Link
                to="/map"
                className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-6 py-3 text-sm font-semibold text-white hover:bg-white/20 transition backdrop-blur-sm"
              >
                <MapPin className="h-4 w-4" /> Open Full-Screen Map
              </Link>
            </div>
          </div>
          {/* Subtle decorative circles */}
          <div className="absolute -right-12 -bottom-12 h-64 w-64 rounded-full bg-white/5 pointer-events-none"></div>
          <div className="absolute right-32 -top-12 h-48 w-48 rounded-full bg-accent/10 pointer-events-none"></div>
        </div>
      </section>

      {/* 12. RESPONSIBLE TOURISM PRINCIPLES */}
      <section className="bg-primary-dark text-white py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto">
            <span className="text-xs font-bold uppercase tracking-wider text-accent-light">Sustainable Stewardship</span>
            <h2 className="mt-1 font-heading text-3xl font-bold tracking-tight">
              Responsible Tourism Principles
            </h2>
            <p className="mt-2 text-sm text-slate-300">
              Preserving Jharkhand's sacred Sarna groves, biodiversity, and indigenous customs for generations to come.
            </p>
          </div>

          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                icon: Trees,
                title: 'Leave No Trace',
                desc: 'Carry out all non-biodegradable waste. Avoid single-use plastics around waterfalls and forest tracks.'
              },
              {
                icon: Heart,
                title: 'Respect Living Culture',
                desc: 'Always ask permission before photographing tribal rituals, sacred Sarna groves, or village homes.'
              },
              {
                icon: Users,
                title: 'Support Local Artisans',
                desc: 'Buy directly from Dokra, Sohrai, and terracotta artisans to empower indigenous rural livelihoods.'
              },
              {
                icon: Shield,
                title: 'Travel Responsibly',
                desc: 'Follow safety barriers at high waterfalls and hire certified local guides in wildlife reserves.'
              }
            ].map((pillar, idx) => {
              const Icon = pillar.icon;
              return (
                <div key={idx} className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent text-white">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="mt-4 font-heading text-lg font-bold">{pillar.title}</h3>
                  <p className="mt-2 text-xs leading-relaxed text-slate-300">{pillar.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
};
